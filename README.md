# Haisic CRM · Netlify production package

此目录是原始 HTML 的生产优化副本，原文件未修改。

## 已完成

- 正式数据使用独立的 `haisic_prod_*` 存储命名空间，不读取旧演示数据。
- 默认数据模式改为真实模式；页面启动不再自动灌入 50 条客户/消息。
- 未连接 WhatsApp 时，发送和历史同步会明确提示，不伪造“已发送/已读/同步完成”。
- 刷新按钮悬停显示浅蓝色，退出按钮悬停显示浅红色，并增加键盘焦点样式。
- 手机尺寸下隐藏固定侧栏，内容区改为全宽，避免只剩半屏。
- 增加 Netlify 安全响应头、函数路由和服务端 WhatsApp 代理骨架。

## 部署前必须配置的 Netlify 环境变量

`ADMIN_USERNAME`、`ADMIN_PASSWORD_HASH`、`SESSION_SECRET`、`WHATSAPP_PHONE_NUMBER_ID`、`WHATSAPP_ACCESS_TOKEN`

密码哈希可在本目录执行：

```text
npm run hash-password -- 你的密码
```

当前函数已实现登录、会话、退出和 WhatsApp 连接/文本发送接口；客户、消息、团队成员的正式数据库读写仍应接入 Supabase 后再上线。

