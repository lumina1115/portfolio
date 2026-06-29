# Project 1 Editorial Design System

本文档总结 `project-1` 专用详情页中可迁移的排版、组件结构和交互组织方法，用于后续项目详情页自动生成。色彩、材质语言、数据面板、代码窗口、网格纹理和光效仅作为项目一的案例记录，不应直接迁移到其他项目。主要依据：

- `src/components/projects/Project1Editorial.astro`
- `src/pages/projects/[slug].astro`
- `src/styles/global.css`

## 0. 设计基调

项目一不是普通 MDX 详情页，而是一个独立的 editorial case study 页面。视觉目标是：

- 用大面积浅米色、纸感留白和中文可读排版表达“自然、康复、手作温度”。
- 项目一使用蓝灰色、数据面板、网格纹理、代码窗口和微弱光效，是因为这些语言来自该作品本身的智能硬件、传感和医疗科技属性。后续项目必须从各自作品的产品色、材质、场景和核心概念中重新提取视觉语言。
- 页面结构应像杂志专题：章节明确、左侧章节轨道稳定、右侧内容以满宽矩形模块推进。
- 卡片不使用明显圆角外壳堆叠，整体更像排版版面；局部图像、面板、工具界面可使用 6px-12px 圆角。

## 1. 空间与网格 Layout & Grid

### 1.1 全局页面容器

项目一根节点使用 `.p1-root`，它负责建立页面级 token：

```css
--p1-bg: #e1cba6;
--p1-surface: #fbf7ed;
--p1-surface-2: #efe3c9;
--p1-measure: min(42rem, 100%);
--p1-container: 92rem;
--rail-to-card-gap: clamp(0.9rem, 1.35vw, 1.25rem);
--card-padding: clamp(1.2rem, 2vw, 1.8rem);
--row-gap-section: clamp(0.9rem, 1.35vw, 1.25rem);
--chapter-end-media-gap: 4.6875vh;
--p1-section-px: var(--rail-to-card-gap);
--p1-section-py: clamp(1rem, 2.2vh, 1.5rem);
```

规则：

- 页面横向外边距不使用传统居中 container。普通内容区使用 `padding-inline: var(--p1-section-px)`，但章节滑轨所在的 `.p1-chapter` 必须把左侧 padding 清零，让滑轨左边缘完全贴合屏幕边缘。
- 章节之间使用 `margin-bottom: clamp(3.75rem, 6.5vh, 5rem)`，移动端收紧为 `clamp(2.125rem, 5.5vh, 3rem)`。
- 页面底部保留 `padding-bottom: clamp(3rem, 8vh, 5rem)`，避免最后一屏贴底。
- 正文可读宽度统一控制在 `--p1-measure: min(42rem, 100%)`。

### 1.2 章节轨道

每个章节使用固定结构：

```html
<section class="p1-section p1-chapter p1-chapter--{name}" data-chapter-section>
  <div class="p1-editorial-track">
    <aside class="p1-sticky-rail">
      <a class="p1-sticky-tag" data-chapter-link>...</a>
    </aside>
    <div class="p1-section-main">...</div>
  </div>
</section>
```

桌面端规则：

- `.p1-editorial-track` 使用 `display: flex`，左侧章节轨道 + 右侧内容区。
- `.p1-sticky-rail` 宽度为 `clamp(9rem, 14.25vw, 15rem)`，背景固定为砖红色。
- `.p1-sticky-rail` 左边缘必须与视口左边缘完全贴合；不要在滑轨外侧保留页面 padding、margin、container gutter 或透明空隙。
- `.p1-sticky-tag` 使用 `position: sticky; top: 12vh`，随着章节激活改变透明度和颜色。
- 章节轨道中有 1px 纵向规则线，位置为 `left: clamp(1.45rem, 2.4vw, 2rem)`。
- `.p1-section-main` 是右侧内容主轴，使用 `display: grid`，`row-gap: var(--row-gap-section)`。

#### 章节滑轨统一规范

“滑轨”指每个章节左侧的 `.p1-sticky-rail` + `.p1-sticky-tag` 组合。后续项目必须保持滑轨系统一致，只有每个章节的内容长度可以不同。

必须保持一致的部分：

- DOM 结构一致：`section.p1-chapter` 内必须包含 `.p1-editorial-track`，其下固定为左侧 `.p1-sticky-rail` 和右侧 `.p1-section-main`。
- 章节锚点一致：每个章节根节点保留 `id`、`data-chapter-section`、`data-chapter`；滑轨链接保留 `href="#..."` 和 `data-chapter-link`。
- 左侧贴边一致：`.p1-chapter` 必须使用 `padding-left: 0`，滑轨外侧不得出现任何留白；右侧内容区与滑轨之间仍通过 `--rail-to-card-gap` 控制距离。
- 宽度一致：桌面端滑轨宽度固定使用 `clamp(9rem, 14.25vw, 15rem)`，不要按章节内容单独调宽。
- 横向间距一致：滑轨与内容区之间使用 `--rail-to-card-gap` / `--p1-editorial-gap`，所有章节共用同一 token。
- 粘性行为一致：桌面端 `.p1-sticky-tag` 使用 `position: sticky; top: 12vh`，激活时由脚本统一加 `.is-active`。
- 内部排版一致：滑轨内固定包含 `p1-sidebar-rule`、`p1-sidebar-index`、`p1-sidebar-title`、`p1-sidebar-subtitle`。
- 编号规则一致：`p1-sidebar-index` 使用两位数字或统一宽度数字，如 `01 / 02 / 03`，不要混用中文数字、短横线编号或图标编号。
- 标题规则一致：`p1-sidebar-title` 使用大写英文或项目统一的章节短语，并用多个 `span` 手动断行，形成窄栏杂志感。
- 状态动画一致：非激活状态低透明并轻微下移；激活状态 `opacity: 1; transform: translateY(0)`，横线从短线展开到完整宽度。
- 移动端一致：`max-width: 768px` 后滑轨变为章节顶部条，取消 sticky，所有章节使用同一高度、padding 和标题字号。

唯一允许变化的部分：

- 每个章节的实际高度和内容长度可以不同，由右侧 `.p1-section-main` 的内容自然撑开。
- 每个章节的标题文字、编号、中文副标题可以不同。
- 滑轨颜色可以随项目整体色彩系统替换，但同一项目内所有章节滑轨必须使用同一套颜色，不要每章换色。

禁止项：

- 不要为某一章节单独改变滑轨宽度、sticky top、内部网格、编号字号或移动端折叠方式。
- 不要给 `.p1-editorial-track`、`.p1-sticky-rail` 或其父级添加左侧 margin/padding，滑轨必须从屏幕最左侧开始。
- 不要把滑轨改成普通卡片、悬浮按钮组或顶部 tab；它是项目详情页的章节骨架。
- 不要让滑轨高度人为匹配章节内容。章节长短由内容决定，滑轨只负责在当前章节视口中提供稳定导航和章节身份。

移动端规则：

- `max-width: 768px` 后 `.p1-editorial-track` 改为纵向 `flex-direction: column`。
- `.p1-sticky-rail` 变为普通顶部章节条，不再 sticky。
- 移动端章节条高度紧凑，`.p1-sticky-tag` 使用 `padding: 0.85rem 1rem 0.9rem clamp(4.75rem, 15vw, 5.35rem)`。

### 1.3 内容网格

项目一核心内容网格是 `.p1-rect-grid`：

```css
.p1-rect-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--p1-grid-gap);
}
```

规则：

- 桌面端默认 12 栏网格。
- `max-width: 1100px` 后降为 6 栏。
- `max-width: 768px` 后降为 1 栏。
- 常规大模块使用 `grid-column: 1 / -1` 占满右侧内容区。
- 只在需要图文混排或仪表盘式结构时，在模块内部再建立子网格。

### 1.4 模块卡片

基础模块是 `.p1-rect-card`：

```css
.p1-rect-card {
  position: relative;
  width: 100%;
  padding: var(--p1-card-pad);
  border-radius: 0;
  border: 0;
  background: var(--p1-surface);
  box-shadow: none;
  overflow: hidden;
}
```

规则：

- 外层内容模块保持直角、无阴影、无卡片感，像印刷版面中的矩形版块。
- 内部图片、功能性子元素和项目定制面板允许使用圆角：通常 `6px`, `10px`, `12px`, `0.85rem`, `1.1rem`。是否使用数据面板或代码窗口取决于项目内容，不作为通用要求。
- 不要把大章节做成浮动卡片；大章节应是满宽矩形或全屏场景。
- `data-section-label` 可给模块生成左上角小标题，位置为 `top/left: var(--card-padding)`，字号 `0.68rem`，大写，字距 `0.12em`。

### 1.5 留白比例

常用比例：

- 页面边距与卡片间距同源：`rail-to-card-gap = row-gap-section = 0.9rem-1.25rem`。
- 卡片内边距约为模块间距的 1.3-1.5 倍：`card-padding = 1.2rem-1.8rem`。
- 大叙事章节内部留白使用视口高度：`chapter-end-media-gap = 4.6875vh`。
- 实验/技术大模块使用更大的上下内边距：`clamp(3.4rem, 5vw, 5rem)`。
- 图组间距通常为 `clamp(0.7rem, 1vw, 1rem)` 或 `clamp(1rem, 1.8vw, 1.6rem)`。
- 标题与正文之间多用 `0.45rem-1.35rem`，正文段落行高承担主要呼吸感。

## 2. 排版与字体 Typography

### 2.1 字体族

全局字体来源：

- 展示字体：`var(--font-display)`，在全局为 `Impact, Haettenschweiler, Arial Narrow Bold...`，主要用于章节侧栏英文标题。
- 中文正文/标题：`var(--font-cjk-sans)`，全局为 `Microsoft YaHei`, `PingFang SC`, `Hiragino Sans GB`, `SimHei`, `Noto Sans CJK SC`, sans-serif。
- 英文 UI/标签：`var(--font-sans)`，全局为 `Inter` + 中文 fallback；项目一 hero 额外加载 `Outfit`，但实际局部规则多继承 `var(--font-sans)`。
- 代码/数据：`SF Mono`, `Fira Code`, `Cascadia Code`, `Consolas`, monospace。

规则：

- 中文标题和正文优先使用 CJK sans，保证可读。
- 英文小标签、章节编号、状态文案使用 sans 或 monospace，强化系统感。
- 章节侧栏英文标题使用 display 字体，大写、窄体、强识别。
- 不使用负字距作为常规规则；项目一 hero 和大数字中有少量 `letter-spacing: -0.03em/-0.04em`，后续项目应谨慎使用，只用于超大标题或数字。

### 2.2 标题层级

项目一不是传统 H1-H6 文档流，而是组件化标题层级。后续项目必须按以下层级统一字号；除封面 H1、数据数字和代码文本外，内容区标题不得临时新增字号。

| 语义层级 | 推荐类名/场景 | 字号 | 字重 | 行高 | 对齐 |
|---|---|---:|---:|---:|---|
| H1 / 封面主标题 | `.p1-hero-title` | `clamp(3.6rem, 8vw, 6rem)` | 600 | 0.95 | 左对齐 |
| H2 / 内容大标题 | `.p1-lab-head h2`, `.p1-mapping-head h2` | `clamp(2rem, 4vw, 4rem)` | 800 | 1.06 | 左对齐 |
| H3 / 内容模块标题 | `.p1-lab-copy h3`, `.p1-body-title`, `.p1-card-title` | `clamp(1.75rem, 2vw, 2rem)` | 800 | 1.1 | 左对齐 |
| H4 / 内容卡片标题 | `.p1-feature-title`, `.p1-pain-title` | `clamp(1.2rem, 1.55vw, 1.62rem)` | 800 | 1.12 | 左对齐 |
| H5 / 紧凑卡片标题 | 小尺寸技术卡、缩略映射卡 | `clamp(0.98rem, 1.12vw, 1.16rem)` | 800 | 1.12 | 左对齐 |
| 数据标题 | `.p1-stat-num` | `clamp(2.35rem, 4.15vw, 3.35rem)` | 800 | 0.86 | 左对齐 |
| 侧栏章节标题 | `.p1-sidebar-title` | `clamp(0.86rem, 1.05vw, 1.18rem)` | 400 | 1.48 | 左对齐，逐行断开 |

规则：

- 项目一 H1 使用作品色衍生的文字渐变：`linear-gradient(135deg, #315f7d 28%, #a93207 72%)`。后续项目可保留“大标题使用项目主视觉色”的方法，但不可直接沿用该蓝灰/砖红配色。
- 项目一 H2/H3 常使用 `#315f7d`，字重 800，形成该作品的科技主线。后续项目应替换为各自作品的主强调色。
- 正文标题之间不靠装饰线区隔，而靠字号、字重、色彩和留白递进。
- 大标题允许 `text-wrap: balance`，避免中文标题在窄屏中产生极短孤行。
- 内容区标题只能使用 H2-H5 四个层级：大章节标题、模块标题、卡片标题、紧凑卡片标题。不要在单个模块里新增 `1.35rem`、`1.95rem` 等游离字号。
- 同一层级在所有章节中字号、字重、行高保持一致；章节长度和图片比例可以不同，但文字层级不能漂移。

第一章节第一板块的大标题统一归入 H3 / 内容模块标题。以下四个项目标题必须使用同一层级、同一字号、同一字重和同一行高：

| 项目 | 第一章节第一板块大标题 | 层级 | 字号规范 |
|---|---|---|---|
| 项目一 | 痉挛性脑性瘫痪发病率高，步态问题突出。 | H3 / 内容模块标题 | `clamp(1.75rem, 2vw, 2rem)` / `font-weight: 800` / `line-height: 1.1` |
| 项目二 | 截肢人群基数庞大，康复需求持续增长。 | H3 / 内容模块标题 | `clamp(1.75rem, 2vw, 2rem)` / `font-weight: 800` / `line-height: 1.1` |
| 项目三 | 观鸟热度快速增长，但国内缺少固定式智慧观察终端。 | H3 / 内容模块标题 | `clamp(1.75rem, 2vw, 2rem)` / `font-weight: 800` / `line-height: 1.1` |
| 项目四 | 披萨炉市场增长明确，但“家用 × 温润自然”象限仍然空白。 | H3 / 内容模块标题 | `clamp(1.75rem, 2vw, 2rem)` / `font-weight: 800` / `line-height: 1.1` |

### 2.3 正文

正文规则必须统一：

```css
font-size: 1rem;
line-height: var(--leading-loose); /* 通常 1.8 */
color: rgba(26, 26, 26, 0.62);
max-width: min(42rem, 100%);
```

正文层级只允许以下几类：

| 文本层级 | 场景 | 字号 | 行高 | 备注 |
|---|---|---:|---:|---|
| Lead / 导语 | `.p1-lead`, 章节开场说明 | `clamp(1.2rem, 2.2vw, 1.55rem)` | 1.7 | 只用于章节开场或关键观点 |
| Body / 标准正文 | `.p1-body-text`, `.p1-hero-desc`, 常规说明 | `1rem` | 1.8 | 默认正文标准 |
| Long Body / 长段落 | `.p1-context-body` | `1rem` | 2.05 | 只用于大段中文洞察或背景文本 |
| Dense Body / 紧凑正文 | 技术小卡、缩略说明 | `clamp(0.82rem, 0.9vw, 0.94rem)` | 1.58 | 只用于空间受限的卡片 |
| Summary / 总结正文 | `.p1-card-summary p` | `clamp(1.2rem, 2vw, 1.45rem)` | 1.95 | 只用于总结段 |

具体使用：

- 封面摘要 `.p1-hero-desc`：`font-size: 1rem; line-height: 1.8`，每句用 `span` 分行，左对齐。
- 背景正文 `.p1-context-body`：`font-size: 1rem; line-height: 2.05`，桌面端可 `text-align: justify`，移动端改回左对齐。
- 大导语 `.p1-lead`：`clamp(1.2rem, 2.2vw, 1.55rem)`，行高 `1.7`。
- 技术说明 `.p1-feature-text`：常规使用 `1rem/1.8`；只有紧凑技术卡可使用 Dense Body，不得再小于 `0.82rem`。
- 总结段 `.p1-card-summary p`：`clamp(1.2rem, 2vw, 1.45rem)`，行高 `1.95`，居中。

移动端：

- 常规正文、导语、总结段在 `max-width: 768px` 收为 `0.98rem`。
- 紧凑卡片正文移动端不得低于 `0.82rem`，行高不得低于 `1.5`。
- 同一文本层级在所有章节中保持一致；不要因为某个章节内容更长就缩小正文字号，应通过换行、删减文案或调整模块布局解决。

### 2.4 引言、注释与图注

项目一没有标准 `<blockquote>` 样式，而是用组件化 quote 和 caption 表达引言：

- 封面口号 `.p1-hero-quote`：`clamp(1.18rem, 2vw, 1.55rem)`，字重 700，行高 1.45，使用项目主强调色。
- 引言列表 `.p1-quote-item p`：`1.15rem`，行高 1.8，颜色 `rgba(26, 26, 26, 0.72)`。
- 引言元信息 `.p1-quote-meta`：`0.78rem`，大写，字距 `0.08em`，可配一个项目强调色圆点。
- 通用图注/标签 `.p1-caption`：`0.875rem`，字距 `0.12em`，大写，颜色 `rgba(36, 78, 108, 0.62)`。
- 小标签 `.p1-lab-eyebrow`, `.p1-lab-copy span`, `.p1-sandbox-head p`：`0.72rem`，字重 700，字距 `0.14em`，大写。

后续规范：

- Blockquote 推荐沿用 quote-item 逻辑：上方可放 meta，小圆点或编号，正文用较大字号和宽松行高。
- 图注必须比正文小，采用 sans、大写/半大写、较大字距，颜色降低到 42%-62% 透明度。

### 2.5 项目一具体文字内容

以下文案是项目一 `Gradient` 的实际内容，只用于记录该项目的叙事与页面生成上下文。后续项目可以复用文案层级和组织方式，但不能复用这些具体文字。

#### 项目基础信息

| 字段 | 具体文字 |
|---|---|
| 项目名称 | Gradient |
| 完整标题 | Gradient - 脑瘫儿童智能踝足矫形器 |
| 项目副标题 | 工业设计 / 智能穿戴 / 医疗机能 |
| 项目类型标签 | 工业设计、智能穿戴、医疗设计、Arduino |
| 核心定位 | 面向痉挛型脑瘫儿童的智能踝足矫形器 |
| 封面口号 | 让康复，始于每一步 |

#### 封面文案

封面摘要分三行呈现：

```text
Gradient 是一款面向痉挛型脑瘫儿童的智能踝足矫形器
通过 AFO 三点力学结构矫正足内翻步态，内置柔性压力传感面料
实时监测足底数据，帮助医生与家长掌握康复进程
```

封面标签：

```text
AFO 三点力学矫形
柔性压力传感监测
模块化磁吸快穿脱
```

#### 章节滑轨文字

| 编号 | 英文标题 | 中文副标题 |
|---|---|---|
| 01 | INSIGHT & RESEARCH | 用户洞察与需求分析 |
| 02 | REFINEMENT & PROTOTYPING | 方案推演与工程验证 |
| 03 | FINAL DELIVERY | 最终设计与场景呈现 |

滑轨英文标题在页面中按窄栏断行，例如：

```text
INSIGHT
&
RESEARCH
```

#### Insight & Research 文案

背景标题：

```text
痉挛性脑性瘫痪发病率高，步态问题突出。
```

背景正文核心内容：

```text
痉挛性脑瘫是儿童高发的运动障碍疾病，足部肌张力紊乱常引发足内翻，
造成重心偏移、步态不稳与更高跌倒风险。与此同时，患儿往往难以准确
表达疼痛与不适，传统矫形器又普遍外观医疗化，容易带来病耻感与穿戴
抗拒。市场仍缺少兼顾步态数据采集、医患沟通与儿童审美的智能矫形设备。
```

数据文案：

| 数据 | 说明 |
|---|---|
| 2-3.4 例 | 每千名活产婴儿脑瘫发病率 |
| 75% | 其中痉挛型占比 |

痛点卡片：

| 编号 | 痛点标题 | 说明 |
|---|---|---|
| PROBLEM 01 | 足内翻 | 足部肌张力紊乱会持续拉拽步态，导致重心偏移、步态不稳与更高跌倒风险。 |
| PROBLEM 02 | 沟通障碍 | 患儿难以准确表达疼痛与不适，家长和康复师也难以及时判断真实身体状态。 |
| PROBLEM 03 | 病耻感 | 传统矫形器医疗器械感过强，容易让孩子在校园与社交场景中产生遮挡与抗拒心理。 |

技术调研 / 设计回应卡片：

| 编号 | 标题 | 说明 |
|---|---|---|
| 01 / ALIGNMENT | 矫正 | AFO 三点力学矫形，通过足底、跟骨后、小腿前的受力关系，帮助改善足内翻步态。 |
| 02 / MONITOR | 监测 | 柔性传感面料 ThermoFit 嵌入鞋体结构，实时采集足底压力与步态变化，辅助康复判断。 |
| 03 / MODULAR | 模块化连接机制 | 通过清晰的模块连接与快拆逻辑，降低穿脱门槛，让结构固定、调节与日常使用更直观高效。 |

#### Refinement & Prototyping 文案

章节内部标题：

```text
概念转化与硬件就绪
```

章节说明：

```text
以草图、造型生成与硬件连接实拍，呈现方案从概念语言进入可验证系统的过程。
```

实验过程小标题：

```text
01 / SKETCH
草图

02 / AIGC FORM STUDY
外观造型探索

03 / CIRCUITRY
硬件调试：传感器布线与主控电路连接实拍
```

代码测试沙盒文字：

```text
Code Testing Sandbox
利用沙盒完成软硬件闭环验证
将足底压力传感输入、Arduino 阈值判断与可视化反馈放入同一测试界面中校准。
```

代码窗口标签：

```text
Arduino / FSR gait monitor
serial active
```

数据可视化标签：

```text
FSR gait pressure stream
Live
实时数值
采样率定位
峰值捕获
```

#### Final Delivery 文案

渲染区块标签：

```text
产品渲染
```

爆炸图标注：

| 标注标题 | 说明 |
|---|---|
| 硬质硅胶外壳 | 高强度树脂材料，提供踝关节稳固支撑。 |
| 紧固绑带 | 多点位快速调节设计，适应不同脚部维度需求。 |
| 模块化鞋底 | 流线型设计增强运动时尚感。 |
| 柔软内衬 | 内置传感面料 ThermoFit，实时监测步态与足底压力。 |

项目总结文案：

```text
从脑瘫儿童面临足内翻与病耻感双重困境出发，
Gradient 通过 AFO 三点力学矫形、智能传感监测、去医疗化美学回应，
最终将冰冷的医疗器械重构为孩子眼中“很酷的运动鞋”。
```

下一项目入口文字：

```text
NeuroLimb - 腿部截肢患者术后康复 VR 悬吊系统
```

## 3. 色彩系统 Color Palette

### 3.1 项目一色彩样本

| Token | 色值 | 用途 |
|---|---|---|
| `--p1-bg` | `#e1cba6` | 页面底色，暖纸色 |
| `--p1-surface` | `#fbf7ed` | 主内容模块底色，奶白纸面 |
| `--p1-surface-2` | `#efe3c9` | 图片占位、浅层次背景 |
| `--p1-text` | `#1a1a1a` | 主文本 |
| `--p1-text-dim` | `rgba(26, 26, 26, 0.62)` | 正文、副文本 |
| `--p1-accent` | `#315f7d` | 项目一作品主强调色，来自产品自身的蓝灰科技气质 |
| `--p1-accent-warm` | `#b87ab8` | 项目一辅助色，来自产品局部渐变与柔和医疗感 |
| rail red | `#a93207` | 项目一章节侧栏、渐变暖端 |
| rail cream | `#e1cba6` | 章节侧栏文字 |
| code bg | `#f7efdf` | 项目一代码区域暖底 |
| sandbox blue | `#0066ff` | 项目一实时数据、波形、活跃状态 |
| signal orange | `#f2a23a` | 项目一辅助波形 |

注意：

- 上表不是跨项目色板，只是项目一的实现记录。
- 后续项目不能默认使用 `#315f7d`、`#0066ff`、蓝灰科技色、代码配色或数据波形色。
- 可迁移的是“为每个项目建立局部 token”的方法，而不是具体色值。

### 3.2 跨项目色彩提取规则

- 每个项目应从作品本身提取颜色：产品 CMF、主渲染图、材料、使用场景、品牌命名和情绪关键词。
- 可保留“背景色 / 内容面 / 主文本 / 次文本 / 项目强调色 / 辅助强调色”的 token 结构，但具体色值必须项目化。
- 大面积背景应服务于项目气质：可以是暖纸色、冷白、深色、纯色或材料色，不默认沿用项目一米色体系。
- 章节侧栏可以继续作为强识别色块，但颜色应来自当前项目，不默认使用砖红。
- 渐变只用于高价值视觉点：H1、品牌名、核心产品状态或局部视觉暗示。渐变色必须来自当前作品，不能套用项目一的蓝灰到砖红。
- 数据面板、代码窗口、波形图、透明网格和微弱光效不是通用标配；只有当项目内容确实涉及传感、算法、硬件验证、软件界面或数据反馈时才使用。
- 如果项目偏手作、家具、器物、服务、空间或非技术叙事，应优先使用材质纹理、摄影留白、结构线、工艺细节或场景节奏，而不是强行加入科技面板。

### 3.3 氛围构建原则

项目一的“科技感与自然/手作温度并存”是该作品的专属氛围。跨项目可迁移的方法是“让视觉语言从作品矛盾中生成”，例如：

- 如果作品包含“技术 + 温度”，可以用冷静结构线搭配柔和背景，但颜色必须取自作品。
- 如果作品包含“自然 + 工业”，可以用材料色、机械线框、剖面图和真实质感建立对比。
- 如果作品包含“情绪 + 系统”，可以用大留白、节奏化编号、流程图和场景图建立叙事。
- 图片默认降低饱和或灰度、hover/active 恢复彩色的交互方法可以复用，但恢复后的色彩应是当前项目主色或图片原色。
- 技术性视觉元素只能在内容需要时出现；不要为了统一风格而给所有项目添加代码、波形、网格或发光状态点。

## 4. 交互与动画 Interaction & Animation

### 4.1 通用缓动

项目一主要使用同一个缓动曲线：

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

规则：

- 小型 hover：`0.45s-0.55s`。
- 章节激活、卡片显现：`0.6s-0.8s`。
- 大型滚动揭示：可到 `4.8s`，但应与滚动进度绑定。
- 所有复杂动画应提供 `prefers-reduced-motion: reduce` 降级，至少取消 transition。

### 4.2 章节激活

脚本使用 `IntersectionObserver` 给章节添加 `.is-active`：

- 非激活侧栏：低透明、`translateY(10px)`。
- 激活侧栏：`opacity: 1; transform: translateY(0)`。
- 侧栏横线由 `scaleX(0.42)` 展开到 `scaleX(1)`。
- 过渡时间 `0.6s`。

### 4.3 链接与按钮

项目一按钮主要是缩略图按钮和下一项目链接：

- 缩略图按钮 `.p1-pain-thumb` 使用 `button`，内含图片 + 标签。
- 默认：低透明、灰度图片、浅边框。
- 激活：边框变为项目强调色 `rgba(var(--project-accent-rgb), 0.48)`，背景使用同色低透明度，图片恢复彩色并加轻微强调色阴影。项目一实现中对应 `rgba(var(--p1-accent-rgb), ...)`。
- 下一项目 `.p1-next-link` 是横向 flex，文字与箭头分布两端，顶部 1px 分隔线。
- 可交互元素应保持 `cursor: pointer`、`focus-visible` 状态与 hover 同步。

### 4.4 图片 hover

常见规则：

- 图片容器 hover 使用轻微位移或缩放，不超过 `scale(1.02-1.025)`。
- 大图 hover 阴影从 `rgba(accent, 0.10-0.14)` 增强到 `0.16-0.20`。
- AIGC tile 默认灰度、低饱和、低透明；hover 后恢复彩色、上移 `-4px`，加入项目强调色边框和内高光。
- 电路横向图 hover：图片 `scale(1.018)`，阴影增强。
- 产品细节图 hover：3D tilt + `scale(1.02)` + 一道浅白 shine 扫光。

### 4.5 关联 hover

痛点与技术卡片使用 `:has()` 建立关联：

- 当任一痛点或技术卡 hover，其他卡片变灰、透明度降到 `0.66-0.72`。
- 对应卡片恢复正常、`scale(1.025)`，媒体区阴影增强。
- 这个规则适合“问题-解决方案”映射模块，后续项目可以复用。

### 4.6 滚动与可见性动画

使用场景：

- 草图模块进入视口：`opacity 0 -> 1`，`translateY(15px) -> 0`，`0.8s`。
- 沙盒面板进入视口：`opacity 0 -> 1`，`translateY(18px) -> 0`，两个面板可错开 `0.12s`。
- 产品模块化大图：sticky pin + scroll progress 控制 `clip-path: circle(...)` 和 scale。
- 爆炸图视频：进入视口后播放，结束后显示标注层。
- 横向电路图：用滚动或 wheel 控制 track transform，图片宽度以 viewport 和 track 宽度计算。

### 4.7 动效克制原则

- 动效服务于信息关系：激活、聚焦、数据流、结构展开。
- 背景装饰不要持续强动画；项目一使用低透明网格和轻微脉冲状态点，但这些只适合技术验证类内容。
- 动效强度应匹配项目主题。医疗/康复主题避免过度跳跃，运动距离通常控制在 `4px-18px`；其他项目应根据自身情绪重新设定。

## 5. 核心组件结构 Component Structure

### 5.1 封面图 Hero

DOM 结构：

```html
<section class="p1-hero">
  <div class="p1-hero-shell">
    <div class="p1-hero-media" aria-hidden="true">
      <img class="p1-hero-img" />
    </div>
    <div class="p1-hero-copy">
      <p class="p1-caption p1-hero-caption">01 · Case Study</p>
      <div class="p1-copy-stack">
        <h1 class="p1-hero-title">...</h1>
      </div>
      <p class="p1-hero-desc"><span>...</span></p>
      <p class="p1-hero-quote">...</p>
      <div class="p1-hero-tags"><span>...</span></div>
    </div>
  </div>
</section>
```

结构规则：

- `.p1-hero-shell` 全屏高度 `100svh`，`position: relative`。
- 背景图绝对铺满，`object-fit: cover; object-position: 70% 76%`。
- 使用 `.p1-hero-media::after` 叠加浅色渐变遮罩，桌面为横向从左白到右透明，移动端为底部增强遮罩。
- 文案块 `.p1-hero-copy` 宽度 `min(100%, 39rem)`，桌面垂直居中，移动端贴近底部。
- H1 使用渐变文字，摘要分行，标签为圆角 pill。

### 5.2 杂志章节模块

DOM 结构：

```html
<section class="p1-section p1-chapter p1-chapter--insight is-active" data-chapter-section>
  <div class="p1-editorial-track">
    <aside class="p1-sticky-rail">
      <a class="p1-sticky-tag" data-chapter-link>
        <span class="p1-sidebar-rule"></span>
        <span class="p1-sidebar-copy">
          <span class="p1-sidebar-index">01</span>
          <span class="p1-sidebar-title"><span>INSIGHT</span></span>
          <span class="p1-sidebar-subtitle">...</span>
        </span>
      </a>
    </aside>
    <div class="p1-section-main">
      <section class="p1-chapter-block">...</section>
    </div>
  </div>
</section>
```

规则：

- 每个大章节必须有 `data-chapter-section`，供激活脚本识别。
- 侧栏链接必须有 `data-chapter-link`，允许点击跳转到章节锚点。
- 章节英文标题用多个 `span` 手动断行，形成窄栏排版。

### 5.3 图文混排 / 背景洞察模块

DOM 结构：

```html
<div class="p1-rect-grid p1-rect-grid--context">
  <article class="p1-rect-card p1-card-context-merged" data-section-label="设计背景">
    <div class="p1-context-copy-panel">
      <p class="p1-context-title">...</p>
    </div>
    <div class="p1-context-detail-panel">
      <p class="p1-context-body">...</p>
      <div class="p1-stat-rail">...</div>
    </div>
    <figure class="p1-context-media"><img /></figure>
  </article>
</div>
```

布局规则：

- `.p1-card-context-merged` 桌面使用两栏：`minmax(0, 1fr) minmax(18rem, 0.96fr)`。
- 标题在左上，正文和数据在左下，图片在右下。
- 图片使用 mask 和渐变边缘融入纸面，不做硬边框。
- 正文可使用 `text-align: justify`，移动端恢复左对齐。
- 数据区 `.p1-stat-rail` 使用两列，移动端变一列；数字大、行高紧、底部细线。

### 5.4 痛点与技术映射模块

DOM 结构：

```html
<section class="p1-insight-combo" data-insight-combo data-active-pain="1">
  <div class="p1-insight-combo-grid">
    <section class="p1-insight-combo-panel p1-pain">
      <div class="p1-pain-showcase">
        <div class="p1-pain-stage">
          <article class="p1-rect-card p1-pain-feature" data-pain-index="1">...</article>
        </div>
        <div class="p1-pain-thumbs">
          <button class="p1-pain-thumb" data-pain-thumb="1">...</button>
        </div>
      </div>
    </section>
    <section class="p1-insight-combo-panel p1-positioning">
      <div class="p1-rect-grid">
        <article class="p1-rect-card p1-card-feature" data-tech-index="1">...</article>
      </div>
    </section>
  </div>
</section>
```

规则：

- 外层两栏比例可用 `0.88fr / 1.12fr` 或 `1.08fr / 0.92fr`，根据图片和文本密度微调。
- 左侧痛点 stage 使用绝对定位轮播：非激活卡 `opacity: 0; pointer-events: none`，激活卡 `opacity: 1`。
- 缩略图按钮控制 `data-active-pain`。
- 右侧技术卡使用 `data-tech-index` 与痛点索引对应。
- 卡片内上方用 `::before` 生成 `PROBLEM 01`、`01 / ALIGNMENT` 等小标签。

### 5.5 技术细节 / 实验硬件区块

DOM 结构：

```html
<article class="p1-rect-card p1-card-exploration-hardware" data-section-label="Exploration & Hardware">
  <header class="p1-lab-head">...</header>
  <section class="p1-lab-block p1-lab-sketch" data-sketch-reveal>...</section>
  <section class="p1-lab-block p1-lab-aigc">...</section>
  <section class="p1-lab-block p1-lab-circuit" data-circuit-scroll>...</section>
</article>
```

视觉规则：

- 项目一背景是浅色纸面 + 蓝灰透明网格，`background-size: 4.5rem 4.5rem`。后续项目只有在内容需要表达工程、传感、结构推演或系统验证时才使用网格纹理，且网格色必须来自当前项目。
- 模块内大间距：`gap: clamp(2.5rem, 5vw, 5rem)`。
- 小标题使用 `0.72rem`、大写、`letter-spacing: 0.14em`。
- 项目一实验标题用作品主强调色，字重 800。后续项目保留“标题使用项目强调色”的方法，不沿用蓝灰色。

AIGC 图组：

- `.p1-aigc-board` 是 spotlight 舞台，最小高度 `min(66vh, 42rem)`。
- `.p1-aigc-tiles` 三列两行，tile 为正方形。
- tile 图片默认灰度低透明，hover 后恢复彩色。

电路横向滚动：

- `.p1-circuit-scroll-shell` 包裹 sticky viewport。
- `.p1-circuit-track` 使用 `display: flex; width: max-content; gap: 12px`。
- `.p1-circuit-photo` 宽度为 `min(68%, 44rem)`，高度为 `min(68vh, 38rem)`。
- 移动端图片 flex-basis 可放大到 `82%`，便于横向浏览。

### 5.6 代码测试沙盒

DOM 结构：

```html
<article class="p1-rect-card p1-card-validation-process p1-card-code-sandbox" data-code-sandbox>
  <section class="p1-sandbox-dashboard">
    <header class="p1-sandbox-head">...</header>
    <div class="p1-sandbox-grid">
      <div class="p1-sandbox-panel p1-code-editor">...</div>
      <aside class="p1-sandbox-panel p1-sensor-panel">...</aside>
    </div>
  </section>
</article>
```

规则：

- 沙盒高度桌面为 `min(100svh, 56rem)`，让代码和波形形成一屏体验。
- `.p1-sandbox-grid` 两栏：`minmax(0, 1.02fr) minmax(18rem, 0.98fr)`。
- 面板使用 12px 圆角、浅灰白半透明背景、细边框、轻微 backdrop blur。
- 代码字体使用 monospace，代码行通过 clip-path 做逐行打字动画。
- 项目一实时波形使用强蓝 `#0066ff` 和橙色辅助线，状态点可脉冲。这是传感器数据验证场景的专属表达；其他项目仅在确有实时数据、测试曲线或系统状态时使用类似组件，并重新定义颜色。

### 5.7 全屏大图 / 最终渲染区块

DOM 结构：

```html
<article class="p1-rect-card p1-card-render-gallery" data-section-label="产品渲染">
  <section class="p1-render-screen p1-render-screen--modular" data-modular-reveal>
    <div class="p1-modular-pin">
      <figure class="p1-render-item p1-render-item--full p1-render-item--modular">...</figure>
    </div>
  </section>
  <section class="p1-render-screen p1-render-screen--exploded">...</section>
  <section class="p1-render-screen p1-render-screen--details" data-render-reveal>...</section>
</article>
```

规则：

- `.p1-card-render-gallery` 自身无外层卡片感，背景 `#f1eee3`，padding 顶部很轻，底部用 `chapter-end-media-gap`。
- 模块化大图用 sticky pin，占据至少 `100vh + var(--render-stack-gap)`。
- 大产品图宽度为 `min(82vw, 78rem)` 或 `var(--render-visual-width)`，图片透明背景，不加圆角。
- 爆炸图区域高度 `min(88vh, 52rem)`，视频 `object-fit: contain; mix-blend-mode: multiply`。
- 细节图三列：`repeat(3, minmax(0, 1fr))`，gap `32px`，卡片比例 `4 / 3`，hover 支持 tilt 和 shine。

### 5.8 爆炸图标注

DOM 结构：

```html
<article class="p1-exploded-annotation" style="--anchor-x:...; --label-x:...">
  <svg class="p1-exploded-arrow">...</svg>
  <span class="p1-exploded-dot"></span>
  <span class="p1-exploded-card">
    <strong>...</strong>
    <span>...</span>
  </span>
</article>
```

规则：

- 坐标用百分比 CSS 变量表达，便于不同项目手动调标注点。
- dot 使用项目强调色圆点 + 外扩阴影。项目一为蓝灰色，其他项目应替换。
- 标注卡最大宽度 `min(18rem, 28vw)`，标题 `0.78rem-0.95rem`，说明 `0.72rem-0.86rem`。
- 标注进入时 `opacity 0 -> 1`，`translateY(0.5rem) -> 0`，可按索引延迟 `180ms`。

## 6. 响应式规则

断点：

- `1100px`：12 栏降 6 栏，复杂两栏开始简化。
- `768px`：主布局进入移动模式，章节侧栏改为顶部条，网格全部单列。
- `560px/520px`：痛点和技术卡片彻底单列，缩略图和小字进一步收紧。

移动端关键规则：

- 页面边距：`rail-to-card-gap: clamp(0.75rem, 3vw, 1rem)`。
- 卡片内边距：`card-padding: clamp(0.9rem, 4vw, 1.15rem)`。
- Hero 仍保持 `100svh`，文案置底，padding `1.5rem`。
- 图文混排一律单列；图片宽度用 `min(42rem, calc(100vw - gap * 2))` 居中。
- 技术、代码、渲染区块不强行保持桌面高度，允许 `height: auto`。
- 横向或 sticky 模块在移动端降低高度到 `62vh-86vh`。

## 7. 后续项目生成建议

生成新项目详情页时，建议保持以下骨架：

1. Hero：全屏封面图 + 渐变标题 + 3 个技术/主题标签。
2. Insight：左侧章节轨道 + 背景洞察图文混排 + 痛点/方案映射。
3. Development：实验、草图、AIGC、硬件或流程验证。呈现形式应由项目内容决定：可以是网格、数据面板，也可以是工艺过程、材料样本、用户流程或场景序列。
4. Final：全屏产品渲染、爆炸图、细节图组三段推进。
5. Summary：居中总结段 + 下一项目链接。

保持一致性的硬规则：

- 章节根结构、类名和 data attribute 尽量复用。
- 外层大模块直角无阴影，内部媒体/工具面板可 6px-12px 圆角。
- 不要简单替换 `--p1-accent` 就套用项目一视觉。每个项目应重新定义背景、内容面、强调色、辅助色和图像处理方式；只有布局结构和叙事节奏可优先复用。
- 正文行高必须宽松，中文正文不低于 `1.6`，叙事正文建议 `1.8-2.05`。
- 所有复杂 hover 必须有静态默认状态；动画只是增强，不是信息唯一来源。
