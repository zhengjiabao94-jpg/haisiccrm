import { json, readSession } from "./_shared/auth.mjs";

export async function handler(event) {
  const user = readSession(event, process.env.SESSION_SECRET);
  if (!user) return json(401, { error: "请先登录" });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) return json(503, { error: "WhatsApp 服务尚未配置" });

  let input;
  try { input = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "请求格式错误" }); }
  if (input.action === "status") {
    const response = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}?fields=display_phone_number,verified_name`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return response.ok ? json(200, { connected: true, account: data }) : json(response.status, { error: data.error?.message || "连接失败" });
  }
  if (input.action === "send") {
    const to = String(input.to || "").replace(/[^0-9]/g, "");
    const message = String(input.message || "").trim();
    if (!to || !message || message.length > 4096) return json(400, { error: "收件号码或消息内容无效" });
    const response = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`, {
      method: "POST",
      headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, type: "text", text: { preview_url: false, body: message } }),
    });
    const data = await response.json();
    return response.ok ? json(200, { ok: true, messageId: data.messages?.[0]?.id || null }) : json(response.status, { error: data.error?.message || "发送失败" });
  }
  return json(400, { error: "不支持的操作" });
}

