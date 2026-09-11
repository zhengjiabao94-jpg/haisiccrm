import { json, readSession } from "./_shared/auth.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });
  const user = readSession(event, process.env.SESSION_SECRET);
  return user ? json(200, { user }) : json(401, { user: null });
}

