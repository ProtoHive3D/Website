export function serverLog(message, data = {}, level = 'info') {
  const timestamp = new Date().toISOString();
  const context = {
    timestamp,
    level,
    message,
    ...data
  };

  // Console output (can be replaced with file/db/external service)
  const output = `[${level.toUpperCase()}] ${timestamp} — ${message}`;
  console.log(output, data);

  // Optional: persist to external service or DB
  // persistLog(context); // e.g. Firestore, Supabase, Logtail, etc.
}