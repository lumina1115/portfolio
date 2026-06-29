# AGENTS.md

本文件用于说明这个作品集项目的结构、维护约定和后续改动重点。协作者或 AI agent 在修改项目时，请先阅读本文件。

## 项目概况

这是一个基于 Astro 的个人作品集项目，主要展示工业设计、交互系统和产品设计案例。

技术栈：

- Astro 6
- Astro Content Collections
- MDX
- TypeScript
- 自定义 Astro 组件和全局 CSS

常用命令：

```bash
npm run dev
npm run build
npm run preview
```

部署配置位于 `astro.config.mjs`，当前站点使用：

- `site: https://lumina1115.github.io`
- `base: /portfolio`

因此引用 `public` 下资源时，需要注意线上路径会带 `/portfolio` 前缀。

## 关键目录

```text
src/
  content.config.ts
  content/projects/
  components/
    projects/
    layout/
    intro/
  layouts/
  pages/
  styles/
public/
  project-1/
workers/
  image-cdn/
```

重点说明：

- `src/content/projects/` 存放项目内容，目前是 5 个 `.mdx` 文件。
- `src/content.config.ts` 定义项目内容字段，修改 frontmatter 字段时必须同步更新 schema。
- `src/pages/projects/index.astro` 是项目列表页。
- `src/pages/projects/[slug].astro` 是项目详情路由。
- `src/components/projects/Project1Editorial.astro` 是项目一的定制详情页组件，目前包含大量硬编码内容、样式和交互。
- `public/project-1/` 存放项目一详情页使用的本地静态资源。

## 内容文件

当前项目内容文件：

```text
src/content/projects/project-1.mdx
src/content/projects/project-2.mdx
src/content/projects/project-3.mdx
src/content/projects/project-4.mdx
src/content/projects/project-5.mdx
```

每个项目的 frontmatter 需要符合 `src/content.config.ts` 中的 schema：

```yaml
title:
subtitle:
publishDate:
coverUrl:
tags:
summary:
specs:
theme:
```

`theme` 当前可选值：

- `dark-tech`
- `warm-craft`
- `minimalist`

## 项目一的特殊性

项目一 `project-1` 当前不是普通 MDX 渲染。

在 `src/pages/projects/[slug].astro` 中：

- `project-1` 会走 `Project1Editorial.astro`
- 其他项目会直接渲染 MDX 正文

这意味着：

- 修改 `project-1.mdx` 不一定会改变项目一详情页中的所有内容。
- 项目一详情页中的很多文字、图片、卡片、交互都硬编码在 `Project1Editorial.astro`。
- 后续如果要把项目一风格迁移到项目二、三、四，建议先把项目一组件抽象为可复用模板，而不是复制整个大组件。

## MDX 整理方向

后续整理项目内容时，建议统一成以下叙事结构：

1. 项目概述
2. 设计调研 / 背景洞察
3. 用户痛点 / 机会点
4. 设计定位
5. 方案推演 / 技术验证
6. 产品结构 / 交互逻辑
7. CMF / 视觉语言
8. 使用流程 / 场景呈现
9. 项目总结

删改原则：

- 保留能转化为页面模块的内容，例如数据、痛点表、流程、结构细节、CMF、使用场景。
- 删除空泛重复的描述。
- 对市场数据、医学数据和文献引用保留来源线索，必要时标注待核验。
- 不要把项目一组件里的硬编码内容继续扩散到其他项目。

## 设计和样式约定

全局样式在 `src/styles/global.css`。

当前视觉方向：

- 首页和列表页使用强烈编辑感、超大标题、复古高对比色。
- 项目详情页使用较克制的浅色背景和中文可读排版。
- 项目一详情页是独立的 editorial case study 风格，包含章节侧栏、卡片网格、横向图组、局部交互和响应式布局。

修改样式时注意：

- 不要随意改变全局 CSS 变量，避免影响首页、列表页和详情页。
- 项目详情页相关样式优先放在对应页面或组件内。
- 移动端必须检查，尤其是项目详情页的大图、表格、双栏布局和长标题。

## 图片和资源

当前图片资源有两类：

- 远程 CDN：例如 `https://portfolio-image-cdn.zongxz66.workers.dev/...`
- 本地静态资源：例如 `/portfolio/project-1/...`

注意：

- Astro 配置了 `base: /portfolio`，线上路径需要考虑 base。
- 组件中如果直接写 `/portfolio/...`，本地和线上都要确认能访问。
- 新增项目图片时，优先按项目编号建立文件夹，例如 `public/project-2/`。

## 构建检查

完成代码或内容修改后，至少运行：

```bash
npm run build
```

如果涉及详情页布局、图片、交互或响应式样式，还需要本地预览确认。

## 后续推荐任务

优先级建议：

1. 整理 `project-2.mdx`、`project-3.mdx`、`project-4.mdx` 的内容结构。
2. 给 `project-5.mdx` 增加草稿/隐藏机制，或补齐正文。
3. 把 `Project1Editorial.astro` 中可复用的章节、卡片、画廊和总结模块抽象出来。
4. 让项目二到项目四逐步使用统一详情页模板。
5. 减少项目一详情页中的硬编码文字，让 MDX 或结构化数据成为内容来源。
