import { createSession, json, sessionCookie, verifyPassword } from "./_shared/auth.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!username || !passwordHash || !sessionSecret) return json(503, { error: "服务器尚未完成登录配置" });

  let input;
  try { input = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "请求格式错误" }); }
  const validUser = String(input.username || "") === username;
  const validPassword = verifyPassword(String(input.password || ""), passwordHash);
  if (!validUser || !validPassword) return json(401, { error: "账号或密码错误" });

  const user = { id: "admin", name: "超级管理员", username, role: "admin" };
  return json(200, { user }, { "set-cookie": sessionCookie(createSession(user, sessionSecret)) });
}

