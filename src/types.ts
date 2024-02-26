/*
 * @Author: zi.yang
 * @Date: 2024-02-26 23:39:59
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:50:41
 * @Description: types
 * @FilePath: /leafer-x-tooltip/src/types.ts
 */
import { ILeaf } from '@leafer-ui/interface';

export declare type Noop = () => void;

/**
 * @type { String } className：自定义容器类样式
 * @type { string } includeTypes： 允许显示的 Leafer 元素类型
 * @type { Function: IUI } getContent： Tooltip 显示的内容
 */
 export declare type UserConfig = {
  className?: string,
  includeTypes?: Array<string>,
  getContent: (node: ILeaf) => string,
}

export declare type cssStyleType = {
  [key: string]: string
}
