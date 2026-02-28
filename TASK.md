# GLM Image Generator - 功能升级需求

## 项目位置
/workspace/projects/glm-image-generator

## 当前状态
- 纯静态 HTML 站点（index.html）
- 前端直接调 fal.ai queue API 生成图片
- 已部署到 glm-image-generator.com via Vercel
- Git remote: https://github.com/rainbow686/glm-image-generator.git

## 需要实现的功能

### 1. 免费用户限制（localStorage，无需后端）
- 每天免费生成 **3次**，按自然日重置（存 localStorage）
- 超出后显示弹窗提示升级
- 显示剩余次数："今日剩余 X 次免费生成"

### 2. 水印功能
- 免费用户生成的图片：在右下角加水印 "glm-image-generator.com"
- 水印实现：用 Canvas 在前端叠加水印后展示（不修改原图URL）
- 付费用户：无水印（付费逻辑暂时 mock，用 localStorage isPro=true 模拟）

### 3. UI 升级
- 参考竞品风格，在生成区域上方显示："今日剩余 3 次免费 · 升级获取无限生成"
- 超出限制时显示 Modal 弹窗，内容：
  - 标题："已用完今日免费次数"
  - 说明：明天可继续免费使用，或升级 Pro 享无限生成
  - 按钮："明天再来"（关闭）和 "升级 Pro $9.9/月"（暂时 href="#pricing"）
- 在页面加一个 Pricing 区块（锚点 #pricing），展示：
  - Free：3次/天，带水印
  - Pro：$9.9/月，无限生成，无水印，优先队列

### 4. 图片下载优化
- 下载按钮：下载带水印版本（免费）或原图（付费）
- 下载时文件名：glm-image-{timestamp}.png

### 5. 代码要求
- 保持纯 HTML 单文件（index.html），不引入框架
- 保持现有的暗色主题风格（indigo/purple 渐变）
- 水印用 Canvas API 实现
- 所有状态存 localStorage

## FAL_KEY（已在代码里）
const FAL_KEY = '89197a8d-be7d-4c5b-934c-2f3d12c7b772:3f8d26a3ca1673a30d49d1e4be46caf3';

## 完成后
git add -A
git config user.email "rainbow686@gmail.com"
git config user.name "rainbow686"
git commit -m "feat: add free tier limits, watermark, pricing section"
git push origin master

完成后运行：openclaw system event --text "Done: GLM Image Generator 功能升级完成，已推送到 GitHub" --mode now
