# Reading Notes (多文件版)

一个可离线使用的多本读书笔记网页（纯静态：HTML + CSS + JS）。支持：
- 多本书、搜索、标签筛选
- 笔记可编辑（自动保存到浏览器本地）
- 导入 / 导出 JSON
- 打印 / 导出 PDF
- 亮/暗主题切换（持久化）

## 目录结构
```
/index.html
/assets/style.css
/assets/app.js
```

## 部署到 GitHub Pages
1. 新建仓库（或使用现有仓库）。
2. 把上述三个文件上传到仓库根目录（或 `/docs` 目录）。
3. 打开仓库 **Settings → Pages**：
   - Source 选择 `Deploy from a branch`；
   - Branch 选 `main` 分支，目录选根目录（或 `/docs`）。
4. 保存后等待几分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 如果使用 `/docs` 目录，请把三文件放在 `/docs`，并在 Pages 设置里把目录切换为 `/docs`。

## 备份与迁移
- 右上按钮 **“导出JSON”** 会下载 `reading-notes.json`。把它保存起来即可备份。
- 在新设备/新浏览器上，打开页面后点击 **“导入JSON”** 即可恢复。

## 自定义
- 调整样式：编辑 `assets/style.css`。
- 修改逻辑/增加字段：编辑 `assets/app.js`。
