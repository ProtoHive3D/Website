export async function onRequest() {
  const res = await fetch("https://protohive3d.com/pages/index.html");
  const html = await res.text();

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
    }
  });
}
