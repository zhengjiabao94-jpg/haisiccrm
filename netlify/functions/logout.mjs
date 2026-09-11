import { expiredSessionCookie, json } from "./_shared/auth.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  return json(200, { ok: true }, { "set-cookie": expiredSessionCookie() });
}

