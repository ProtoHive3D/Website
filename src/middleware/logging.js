// /src/middleware/logging.js
export function withLogging(handler) {
  return async function wrapped(req) {
    const method = req.method;
    const url = req.url;
    const time = new Date().toISOString();
    console.log(`[${time}] ${method} ${url}`);
    return handler(req);
  };
}
