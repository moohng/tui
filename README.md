# tui

<p>
  <img alt="build" src="https://github.com/moohng/tui/workflows/build/badge.svg">
  <img alt="npm" src="https://github.com/moohng/tui/workflows/npm/badge.svg">
</p>

tui 是移动端轻量级 ui 库，满足日常开发所需，主要包括了一套 css 布局和一些常用组件，不依赖于任何开发框架。

- 一套实用的 css 基本布局样式库；
- Dialog 弹窗组件；
- Toast 轻提示组件；
- Loading 加载中组件；
- Swiper 组件；
- Preview 图片预览组件；
- 更多功能敬请期待...
  
### Script 导入

```html
<!-- 样式导入 -->
<link type="stylesheet" href="//cdn.jsdelivr.net/npm/@moohng/tui/dist/tui.min.css" />
<!-- 基本布局样式 -->
<link type="stylesheet" href="//cdn.jsdelivr.net/npm/@moohng/tui/dist/base.min.css" />
<!-- js 文件导入 -->
<script src="//cdn.jsdelivr.net/npm/@moohng/tui/dist/tui.min.js"></script>
```

### ES Module 导入

```js
import { Dialog, Toast, Preview, Swiper } from '@moohng/tui';

// 引入组件样式文件
import '@moohng/tui/lib/style/index.css';
// 引入基本布局样式文件
import '@moohng/tui/lib/style/base.css';
// 或单独引入
import '@moohng/tui/lib/Dialog/style/index.css';
```
