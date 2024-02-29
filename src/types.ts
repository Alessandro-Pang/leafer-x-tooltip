/*
 * @Author: zi.yang
 * @Date: 2024-02-26 23:39:59
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:50:41
 * @Description: types
 * @FilePath: /leafer-x-tooltip/src/types.ts
 */
import { ILeaf } from '@leafer-ui/interface'
import { PointerEvent } from '@leafer-ui/core'

export declare type Noop = () => void;

/**
 * 用户配置
 * @param { string } className - 自定义样式
 * @param { Array<string> } includeTypes - 允许显示的 Leafer 节点类型
 * @param { (event: PointerEvent) => boolean } shouldBegin - 是否显示 tooltip
 * @param { (node: ILeaf) => string } getContent - 获取 tooltip 内容
 */
 export declare type UserConfig = {
  className?: string,
  includeTypes?: Array<string>,
  excludeTypes?: Array<string>
  shouldBegin?: (event: PointerEvent) => boolean,
  getContent: (node: ILeaf) => string,
}

export declare type cssStyleType = {
  [key: string]: string
}
