<!--
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:55:31
 * @Description: 
 * @FilePath: /leafer-x-tooltip/README.md
-->
# leafer-x-tooltip

Tooltip 插件主要用于 Leafer 元素/节点上 展示一些自定义信息。

使用 Tooltip 插件后，当鼠标悬浮在元素上时，会显示一个弹框展示节点的详细信息。

> 注意：该插件强依赖 v1.0.0.rc.1 以上版本  
> v1.0.0.rc.1 以下版本，请使用 [leafer-tooltip-plugin](https://arc.net/l/quote/fcppgncg) 插件

## 参与开发

```sh
npm run start # 开始运行项目

npm run build # 打包插件代码，同时会创建types

npm run test # 自动化测试
```

# 快速上手

## 安装

```shell
npm i leafer-x-plugin --save
```

## 使用方法

使用插件时，传入 `getContent` 参数，并返回需要展示的内容即可

```js
import { plugin } from 'leafer-x-tooltip';

usePlugin(plugin, {
  getContent(node) {
    const dom = `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
    return dom;
  },
});
```

### 效果演示

![效果演示](./readme/image-1.gif)

## 允许限制指定的元素类型

传入 `includeTypes` 参数，限制允许显示提示框的类型

```js
import { plugin } from 'leafer-x-tooltip';

usePlugin(plugin, {
  includeTypes: ['Ellipse'],
  getContent(node) {
    const dom = `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
    return dom;
  },
});
```

### 效果演示

![效果演示](./readme/image-2.gif)

## 允许自定义容器类样式

默认情况下，插件会对所有 leafer 实例生效。  
有时我们只需要指定的实例生效，这时我们可以自定义注册类型。

声明注册类型后，需要将 leafer 实例类型指定为该类型

```js
import { plugin } from 'leafer-x-tooltip';

usePlugin(plugin, {
  // 指定注册类型
  className: 'my-tooltip-plugin',
  getContent(node) {
    const dom = `<ul style="list-style: none; margin: 0; padding: 0">
      <li>节点类型：${node.tag}</li>
      <li>宽度：${node.width}</li>
      <li>高度：${node.height}</li>
    </ul>
    `;
    return dom;
  },
});
```

css 中添加自定义的类样式

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

### 效果演示

![image](./readme/image-3.png)

# 属性列表

| 属性           | 类型    | 说明           | 默认值｜ |
|--------------|-------|--------------|------|
| className    | `字符串` | 自定义容器类样式     | -    |
| includeTypes | `数组`  | 允许展示提示框的类型列表 | 所有类型 |
| getContent   | `函数`  | 显示的内容        | -    |
