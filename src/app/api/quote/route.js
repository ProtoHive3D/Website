// [1] Imports & API config
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { Readable } from 'stream';
import unzipper from 'unzipper';
import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';
import { deserialize } from '@jscad/stl-deserializer';
import { geometries } from '@jscad/modeling';
import OBJFile from 'obj-file-parser';
import { devLog } from '@/utils/logger';
import { serverLog } from '@/utils/serverLog';
import { saveQuote } from '@/utils/db';

export const config = {
  api: { bodyParser: false },
};

// [2] Utility functions
function toNodeRequest(request) {
  const readable = Readable.fromWeb(request.body);
  readable.headers = Object.fromEntries(request.headers.entries());
  readable.method = request.method;
  readable.url = request.url;
  return readable;
}

function generateJobId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(3).toString('hex');
  return `quote_${timestamp}_${random}`;
}

function parseTransform(str) {
  if (!str) return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  return str.split(' ').map(Number);
}

function applyTransform([x, y, z], m) {
  return [
    x * m[0] + y * m[1] + z * m[2],
    x * m[3] + y * m[4] + z * m[5],
    x * m[6] + y * m[7] + z * m[8]
  ];
}

// [3] STL parser
function getSTLDimensionsAndVolume(filePath) {
  const raw = fs.readFileSync(filePath);
  const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
  const geometry = deserialize({ input: buffer });

  if (!geometry || !Array.isArray(geometry) || geometry.length === 0) {
    throw Object.assign(new Error('no triangle data'), { errorCode: 'STL_EMPTY' });
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let volume = 0;

  for (const mesh of geometry) {
    const bounds = geometries.geom3.measureBoundingBox(mesh);
    const [min, max] = bounds;
    const [x0, y0, z0] = min;
    const [x1, y1, z1] = max;

    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    minZ = Math.min(minZ, z0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
    maxZ = Math.max(maxZ, z1);

    volume += geometries.geom3.measureVolume(mesh);
  }

  return {
    dimensions: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    volume
  };
}

// [4] OBJ parser
function getOBJDimensionsAndVolume(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const obj = new OBJFile(content).parse();
  const vertices = obj.models.flatMap(model => model.vertices);

  if (!vertices || vertices.length === 0) {
    throw Object.assign(new Error('no vertex geometry'), { errorCode: 'OBJ_EMPTY' });
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const { x, y, z } of vertices) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const volume = (maxX - minX) * (maxY - minY) * (maxZ - minZ) * 0.5;

  return {
    dimensions: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
    volume
  };
}

// [5] 3MF parser
async function get3MFDimensions(filePath) {
  const zip = fs.createReadStream(filePath).pipe(unzipper.Parse({ forceStream: true }));
  const parser = new XMLParser();
  const meshes = [];

  for await (const entry of zip) {
    if (entry.path === '3D/3dmodel.model') {
      const xml = await entry.buffer();
      const json = parser.parse(xml.toString());

      const objects = json.model?.resources?.object;
      const objectArray = Array.isArray(objects) ? objects : [objects];
      const objectMap = new Map();

      for (const obj of objectArray) {
        const id = obj['@_id'];
        const vertices = obj?.mesh?.vertices?.vertex;
        if (vertices && Array.isArray(vertices)) {
          objectMap.set(id, vertices);
        }
      }

      for (const [id, vertices] of objectMap.entries()) {
        for (const v of vertices) {
          const x = parseFloat(v['@_x']);
          const y = parseFloat(v['@_y']);
          const z = parseFloat(v['@_z']);
          meshes.push([x, y, z]);
        }
      }

      const components = objectArray.flatMap(obj => obj?.components?.component || []);
      const componentArray = Array.isArray(components) ? components : [components];

      for (const comp of componentArray) {
        const refId = comp['@_objectid'];
        const transform = comp['@_transform'];
        const matrix = parseTransform(transform);
        const vertices = objectMap.get(refId);
        if (!vertices) continue;

        for (const v of vertices) {
          const x = parseFloat(v['@_x']);
          const y = parseFloat(v['@_y']);
          const z = parseFloat(v['@_z']);
          const [tx, ty, tz] = applyTransform([x, y, z], matrix);
          meshes.push([tx, ty, tz]);
        }
      }

      if (meshes.length === 0) {
        throw Object.assign(new Error('no vertex geometry'), { errorCode: '3MF_EMPTY' });
      }

      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

      for (const [x, y, z] of meshes) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
      }

      return {
        x: maxX - minX,
        y: maxY - minY,
        z: maxZ - minZ
      };
    }

    entry.autodrain();
  }

  throw Object.assign(new Error('3MF model file not found'), { errorCode: '3MF_MISSING' });
}

// [6] POST handler
export async function POST(req) {
  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });

  try {
    const nodeReq = toNodeRequest(req);
    const [fields, files] = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Form parsing timeout')), 10000);
      form.parse(nodeReq, (err, fields, files) => {
        clearTimeout(timeout);
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const honeypotValue = Array.isArray(fields.honeypot) ? fields.honeypot[0] : fields.honeypot;
    if (honeypotValue && honeypotValue.trim() !== '') {
      serverLog('Spam detected via honeypot', { route: '/api/quote', honeypotValue }, 'warn');
      return NextResponse.json({ success: false, errorCode: 'SPAM_DETECTED' }, { status: 400 });
    }

    const { name, email, quantity, material, color, cost, sku } = fields;
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!name || !email || !quantity || !uploadedFile) {
      serverLog('Quote submission failed: Missing required fields', {
        route: '/api/quote',
        name,
        email,
        quantity,
        filePresent: !!uploadedFile
      }, 'warn');
      return NextResponse.json({ success: false, errorCode: 'MISSING_FIELDS' }, { status: 400 });
    }

    const fallbackName = uploadedFile.originalFilename || uploadedFile.filepath || '';
    const trimmedName = fallbackName.trim().replace(/\s+/g, '_');
    const ext = trimmedName.split('.').pop().toLowerCase();
    const allowedExtensions = ['stl', 'obj', '3mf'];

    if (!allowedExtensions.includes(ext)) {
      serverLog('Unsupported file format', {
        route: '/api/quote',
        filename: trimmedName,
        extension: ext
      }, 'warn');
      return NextResponse.json({ success: false, errorCode: 'UNSUPPORTED_FORMAT' }, { status: 415 });
    }

    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${trimmedName}`;
    const tempPath = `/tmp/${safeFilename}`;
    fs.renameSync(uploadedFile.filepath, tempPath);

    let dimensions = null;
    let volume = null;

    try {
      if (ext === 'stl') {
        const result = getSTLDimensionsAndVolume(tempPath);
        dimensions = result.dimensions;
        volume = result.volume;
      } else if (ext === 'obj') {
        const result = getOBJDimensionsAndVolume(tempPath);
        dimensions = result.dimensions;
        volume = result.volume;
      } else if (ext === '3mf') {
        dimensions = await get3MFDimensions(tempPath);
      }

      if (dimensions.x > 235 || dimensions.y > 225 || dimensions.z > 255) {
        fs.unlinkSync(tempPath);
        serverLog('Model exceeds printer dimensions', {
          route: '/api/quote',
          dimensions
        }, 'warn');
        return NextResponse.json({
          success: false,
          errorCode: 'MODEL_TOO_LARGE',
          details: 'Model exceeds printer dimensions. Max: 235×225×255 mm.'
        }, { status: 400 });
      }
    } catch (err) {
      fs.unlinkSync(tempPath);
      serverLog(`${ext.toUpperCase()} parsing error`, {
        route: '/api/quote',
        filename: safeFilename,
        errorCode: err.errorCode || 'PARSE_FAILED',
        error: err.message
      }, 'error');
      return NextResponse.json({
        success: false,
        errorCode: err.errorCode || 'PARSE_FAILED',
        details: err.message || `Unable to parse ${ext.toUpperCase()} file. Please upload a valid model.`
      }, { status: 400 });
    }

    const jobId = generateJobId();
    devLog(`Quote submitted: ${jobId} (${safeFilename})`);
    serverLog('Quote submitted', {
      route: '/api/quote',
      jobId,
      filename: safeFilename,
      dimensions,
      volume
    }, 'info');

    const grams = volume ? (volume / 1000) * 1.24 : null;

    try {
      await saveQuote({
        jobId,
        material: material?.toString() || 'Unknown',
        color: color?.toString() || 'Unknown',
        grams: grams || 0,
        cost: parseFloat(cost) || 0,
        sku: sku?.toString() || ''
      });
      devLog(`Quote saved to DB: ${jobId}`);
      serverLog('Quote saved to DB', {
        route: '/api/quote',
        jobId,
        material,
        color,
        grams,
        cost,
        sku
      }, 'info');
    } catch (dbError) {
      devLog(`DB save failed for ${jobId}:`, dbError.message || dbError);
      serverLog('Quote DB save failed', {
        route: '/api/quote',
        jobId,
        error: dbError.message
      }, 'error');
    }

    fs.unlinkSync(tempPath);

    return NextResponse.json({
      success: true,
      jobId,
      grams: grams ? grams.toFixed(1) : null,
      dimensions: dimensions || null
    });
  } catch (error) {
    serverLog('Quote API error', {
      route: '/api/quote',
      error: error.message
    }, 'error');
    return NextResponse.json({
      success: false,
      errorCode: 'SERVER_ERROR',
      details: 'Unexpected error occurred. Please try again later.'
    }, { status: 500 });
  }
}
