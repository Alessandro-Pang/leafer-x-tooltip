<!--
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-04-24 20:24:46
 * @Description: Readme
 * @FilePath: /leafer-x-tooltip/README.md
-->
# leafer-x-tooltip

[![npm version](https://img.shields.io/npm/v/leafer-x-tooltip.svg)](https://www.npmjs.com/package/leafer-x-tooltip)
[![license](https://img.shields.io/npm/l/leafer-x-tooltip.svg)](https://github.com/Alessandro-Pang/leafer-x-tooltip/blob/main/LICENSE)

Tooltip 插件主要用于 Leafer 元素/节点上展示一些自定义信息。当鼠标悬浮或点击元素时，会显示一个弹框展示节点的详细信息。

> **注意**：该插件依赖 leafer v1.0.0.rc.17 **及以上**版本, 目前没有对 rc.17 以下版本做兼容测试处理  
> 如果你的项目使用的 leafer v1.0.0.rc.1 **以下**版本，请使用 [leafer-tooltip-plugin](https://arc.net/l/quote/fcppgncg) 插件

## 在线演示

[在线演示地址](https://alexpang.cn/leafer-x-tooltip/)

## 特性

- 🚀 轻量级：体积小，不影响应用性能
- 🎨 高度可定制：支持自定义样式、内容和触发方式
- 🔍 灵活筛选：可以指定哪些类型的元素显示提示框
- 🎯 多种触发方式：支持悬浮（hover）和点击（click）两种触发方式
- 📱 易于使用：简单的 API，快速集成到 Leafer 项目中

## 参与开发

**注意：** 请使用 `npm` 作为包管理器安装依赖，当使用 `pnpm` 安装依赖开发时正常，打包会报错。

```sh
npm run start # 开始运行项目

npm run build # 打包插件代码，同时会创建types

npm run test # 自动化测试
```

## 快速上手

### 安装

```shell
npm i leafer-x-tooltip --save
```

### 基本使用

```javascript
import { Leafer } from 'leafer-ui';
import { TooltipPlugin } from 'leafer-x-tooltip';

// 创建 Leafer 实例
const leafer = new Leafer({
  container: document.getElementById('container'),
  width: 800,
  height: 600
});

// 添加一些元素
const rect = leafer.add({
  type: 'Rect',
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  fill: '#42b883'
});

// 初始化 Tooltip 插件
const tooltip = new TooltipPlugin(leafer, {
  // 获取显示内容
  getContent: (node) => {
    return  `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
  }
});
```

### 效果演示

![效果演示](./readme/image-1.gif)

## 高级用法

### 仅显示指定类型的元素

传入 `includeTypes` 参数，限制允许显示提示框的类型：

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  includeTypes: ['Ellipse'],
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

#### 效果演示

![效果演示](./readme/image-2.gif)

### 排除指定类型的元素

传入 `excludeTypes` 参数，排除不需要显示提示框的类型：

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  excludeTypes: ['Ellipse'],
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

#### 效果演示

![效果演示](./readme/image-4.gif)

### 自定义容器样式

传入 `className` 参数，自定义容器类样式：

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  // 指定自定义类名
  className: 'my-custom-tooltip',
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

CSS 中添加自定义的类样式：

```css
.my-custom-tooltip{
  border: 1px solid rgba(0, 157, 255, .62);
  padding: 6px;
  background-color: rgb(131, 207, 255);
  color: #fff;
  font-size: 12px;
  font-weight: 400;
}
```

#### 效果演示

![自定义样式效果](./readme/image-3.png)

### 自定义显示条件

传入 `shouldBegin` 参数，允许自定义限制方法：

shouldBegin 为一个函数，传入当前的 event 对象, 你可以拿到整个事件和触发事件的node,要求返回一个 Boolean 控制是否显示

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  shouldBegin: (event) => {
    // 限制鼠标位置，只有当鼠标 Y 坐标大于 100 时才显示提示框
    return event.target.y > 100;
  },
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

#### 效果演示

![效果演示](./readme/image-5.gif)

### 设置触发方式

通过 `triggerType` 参数设置触发方式，支持 `hover`（默认）和 `click` 两种方式：

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  // 设置为点击触发
  triggerType: 'click',
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

### 设置偏移量

通过 `offset` 参数设置提示框相对于鼠标的偏移量：

```javascript
import { TooltipPlugin } from 'leafer-x-tooltip';

const plugin = new TooltipPlugin(leafer, {
  // 设置偏移量为 10px
  offset: 10,
  // 也可以分别设置 x 和 y 方向的偏移
  // offset: [10, 20] 或 offset: { x: 10, y: 20 }
  getContent(node) {
    return `
      <ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
    `;
  },
});
```

## API 参考

### 属性列表

| 属性           | 类型    | 说明                                             | 默认值 |
|--------------|-------|------------------------------------------------|------|
| className    | `string` | 自定义容器类样式，自定义样式会覆盖默认样式                          | -    |
| offset    | `number`、`[number, number]`、 `{x: number, y: number}` | 偏移量数值                          | 6    |
| includeTypes | `string[]`  | 允许展示提示框的类型列表，类型列表传入字符串                         | 所有类型 |
| excludeTypes | `string[]`  | 不允许展示提示框的类型列表，类型列表传入字符串                         | 无 |
| shouldBegin  | `function`  | 自定义显示控制函数，传入 MouseEvent, 要求返回一个 Boolean 控制是否显示 | 所有类型 |
| getContent   | `function`  | 显示的内容，传入 node 信息，要求返回一个 HTML 字符串               | -    |
| triggerType   | `string`  | 事件触发类型，支持 `hover` 和 `click`               | `hover`    |

### 方法列表

| 方法名                | 说明                                           | 参数类型                | 返回值类型  |
|--------------------|----------------------------------------------|---------------------|--------|
| getDomId           | 返回 tooltip 容器 DOM ID                         | -                   | String |
| createStyleRule    | 创建一个 css 类样式规则，自带作用域无污染                      | `string`            | -      |
| removeStyleRule    | 移除一个 css 类样式规则，移除通过 `createStyleRule` 创建的类样式 | `string`            | -      |
| findStyleRuleIndex | 查找一个创建的类样式规则，返回索引                            | `string`              | -      |
| addClass           | 往容器添加类样式                                     | `string\|string[]` | -      |
| removeClass        | 移除容器的类样式                                     | `string\|string[]` | -      |
| destroy            | 销毁插件                                         | -                   | -      |

## 常见问题

### 提示框不显示？

1. 检查 Leafer 版本是否为 v1.0.0.rc.17 及以上
2. 确认 `getContent` 函数返回了有效的 HTML 字符串
3. 如果设置了 `includeTypes`，确认目标元素类型在列表中
4. 如果设置了 `excludeTypes`，确认目标元素类型不在列表中
5. 如果设置了 `shouldBegin`，确认函数返回 `true`

### 如何在提示框中显示复杂内容？

`getContent` 函数可以返回任何有效的 HTML 字符串，包括表格、图表、图片等：

```javascript
getContent(node) {
  return `
    <div>
      <h3 style="margin: 0 0 8px 0">${node.tag}</h3>
      <table style="border-collapse: collapse; width: 100%">
        <tr>
          <td style="padding: 4px; border: 1px solid #ddd">位置</td>
          <td style="padding: 4px; border: 1px solid #ddd">(${node.x}, ${node.y})</td>
        </tr>
        <tr>
          <td style="padding: 4px; border: 1px solid #ddd">尺寸</td>
          <td style="padding: 4px; border: 1px solid #ddd">${node.width} x ${node.height}</td>
        </tr>
      </table>
    </div>
  `;
}
```

## 贡献

欢迎提交 Issue 或 Pull Request 来帮助改进这个插件！

## 许可证

[MIT](https://github.com/Alessandro-Pang/leafer-x-tooltip/blob/main/LICENSE)
