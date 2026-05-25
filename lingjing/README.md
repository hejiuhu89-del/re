# 灵境剧衍 · 沉浸式文旅剧本游

React + Vite 单页应用。可直接部署到 GitHub Pages 静态网址。

## 功能
中国版图选点（带浏览器定位）· 八处灵境各 5 个自适应角色 · 任务领取委托卷 · 答题/盖章 · 可上传照片并编辑旅行日记的分享海报 · AI 管家「衍灵」。手机端 / 电脑端均适配。

---

## 一键部署到 GitHub Pages

1. 新建一个 GitHub 仓库，把本项目所有文件 push 到 `main` 分支。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 等待 Actions 跑完（约 1 分钟），访问 `https://你的用户名.github.io/你的仓库名/` 即可。

> 之后每次 push 到 `main` 会自动重新构建发布。`vite.config.js` 用的是相对路径（`base: './'`），所以仓库叫什么名字都不用改配置。

### 本地预览
```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

---

## 纯静态站说明：哪些能跑，哪些要后端

**开箱即用（无需后端）**：版图选点、定位、角色选择、任务领取、答题、盖章、海报（上传照片 + 编辑日记 + 下载）。

**需要一个后端转发函数**：AI 管家「衍灵」。原因是浏览器直连大模型需要 API 密钥，而**密钥绝不能写进前端**。默认 `BUTLER_API` 为空时，管家进入“演示模式”返回友好提示，不会报错。

### 接通 AI 管家（可选）
部署一个 Serverless 函数中转，把密钥放在函数的环境变量里，然后把 `src/LingjingApp.jsx` 顶部的 `BUTLER_API` 改成函数 URL 即可。

前端会向 `BUTLER_API` POST：`{ system, messages }`；函数需返回 Anthropic 原生响应（含 `content`）或 `{ text }`。

**Cloudflare Workers 示例**（免费额度足够）：
```js
export default {
  async fetch(req, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const { system, messages } = await req.json();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,        // 在 Worker 的 Secrets 里设置
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages }),
    });
    const data = await r.json();
    return new Response(JSON.stringify(data), { headers: { ...cors, "Content-Type": "application/json" } });
  },
};
```

---

## 微信生态（可选）
`src/LingjingApp.jsx` 顶部 `wechat` 对象是占位 stub。上线到微信公众号 H5 时：分享卡片用 JS-SDK（`wx.config` + `updateAppMessageShareData`），定位用 `wx.getLocation`（gcj02 火星坐标），签名同样需后端用密钥生成。

## 目录
```
├─ index.html
├─ vite.config.js
├─ package.json
├─ .github/workflows/deploy.yml   # 自动部署
└─ src/
   ├─ main.jsx
   └─ LingjingApp.jsx             # 全部逻辑与样式
```
