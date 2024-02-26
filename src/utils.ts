/*
 * @Author: zi.yang
 * @Date: 2024-02-26 20:37:52
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:08:34
 * @Description: utils
 * @FilePath: /leafer-x-tooltip/src/utils.ts
 */

import { cssStyleType, UserConfig } from './types';

export const PLUGIN_NAME = 'leafer-x-tooltip';
export const ATTRS_NAME = 'data-leafer-tooltip-id';

/**
 * 异常抛出函数
 * @param condition
 * @param msg
 */
export function assert(condition: Boolean, msg: string) {
  if (condition) {
    throw new Error(`[${PLUGIN_NAME}]: ${msg}`);
  }
}

/**
 * html 添加样式
 * @param element
 * @param cssStyle
 */
export function addStyle(element: HTMLElement, cssStyle: cssStyleType) {
  Object.keys(cssStyle).forEach((prop: any) => {
    element.style[prop] = cssStyle[prop];
  });
}

/**
 * 允许显示的节点类型
 * @param config
 * @param type
 * @returns { Boolean }
 */
export function allowNodeType(config: UserConfig, type: string): Boolean {
  if (!Array.isArray(config?.includeTypes)) return true;
  if (config.includeTypes.length === 0) return true;
  return config.includeTypes.includes(type);
}

/**
 * 获取 tooltip dom
 * @param dataId 
 * @returns { HTMLElement | null  } 
 */
export function getTooltip(dataId: String): HTMLElement | null {
  return document.querySelector(`[${ATTRS_NAME}=${dataId}]`)
}