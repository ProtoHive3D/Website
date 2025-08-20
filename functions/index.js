export async function onRequest({ request }) {
  const html = await fetch(request);
  const response = new Response(await html.text(), html);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  return response;
}
