# Jekyll Blog Starter (GitHub Pages)

这是一个**零配置**的 Jekyll 博客模板，适合把你的静态 HTML 仓库升级为**Markdown 自动生成**的读书博客。

## 如何使用
1. 把仓库设置为 GitHub Pages（建议使用 GitHub Actions 构建）。
2. 把本项目所有文件放在仓库根目录，提交到 `main` 分支。
3. 等待 1~3 分钟，Pages 会自动发布。

## 写新文章
在 `_posts/` 新增一个 Markdown 文件：
```
YYYY-MM-DD-你的标题.md
```

示例：
```
2025-11-20-flow.md
```

文件内容示例：
```markdown
---
layout: post
title: 《心流》读书笔记
date: 2025-11-20
categories: 读书
tags: [心流, 心理学]
---

这里写正文。可以插入图片：

![图注](/assets/flow/diagram.png)
```

## 可选：自定义
- 修改 `_config.yml` 的 `title`、`description`、`author`、`minima.social_links` 等。
- 如果你已经有自定义域名，设置 `url` 与 `baseurl`。

## 附：常见问题
- **文章没显示？** 确保文件名是 `YYYY-MM-DD-标题.md`，且 `date:` 是合法日期。
- **中文路径/图片不显示？** 尽量使用英文字母和数字的文件名，图片放到 `/assets`。