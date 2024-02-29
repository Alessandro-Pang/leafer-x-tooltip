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
export const ATTRS_NAME = 'data-lxt-id';

/**
 * 异常抛出函数
 * @param condition
 * @param msg
 */
export function assert(condition: boolean, msg: string) {
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
 * 随机字符串
 * @param length
 */
export function randomStr(length = 8) {
  return Math.random().toString(36).slice(2, length + 2);
}

/**
 * 允许显示的节点类型
 * @param config
 * @param type
 * @returns { Boolean }
 */
export function allowNodeType(config: UserConfig, type: string): boolean {
  if (!Array.isArray(config?.includeTypes)) return true;
  if (config.includeTypes.length === 0) return true;
  return config.includeTypes.includes(type);
}

/**
 * 不允许显示的节点类型
 * @param config
 * @param type
 * @returns { Boolean }
 */
export function denyNodeType(config: UserConfig, type: string): boolean {
  if (!Array.isArray(config?.excludeTypes)) return false
  if (config.excludeTypes.length === 0) return false;
  return config.excludeTypes.includes(type);
}


/**
 * 获取 tooltip dom
 * @param dataId
 * @returns { HTMLElement | null  }
 */
export function getTooltip(dataId: string): HTMLElement | null {
  return document.querySelector(`[${ATTRS_NAME}=${dataId}]`)
}


export function camelCaseToDash(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}


/**
 * 创建 css 类
 * @param selector - 选择器
 * @param useRules - 用户自定义样式
 * @param userStyleElement - 用户自定义 style 标签
 */
export function createCssClass(selector: string, useRules: string | cssStyleType, userStyleElement?: HTMLStyleElement) {
  let styleElement = userStyleElement
  if (!styleElement && !(userStyleElement instanceof HTMLStyleElement)) {
    styleElement = document.createElement('style');
    // 给标签加一个标识，方便后续查找和删除
    styleElement.setAttribute(PLUGIN_NAME,'')
    document.head.appendChild(styleElement);
  }

  // 处理样式
  let rules = typeof useRules === 'string' ? useRules : '';
  if (typeof useRules === 'object') {
    Object.keys(useRules).forEach((prop: string) => {
      rules += `${camelCaseToDash(prop)}: ${useRules[prop]};`;
    });
  }

  // 兼容性处理
  if (styleElement.sheet) {
    // 使用现代的方法插入规则
    styleElement.sheet.insertRule(`${selector} { ${rules} }`, 0);
  } else {
    // 回退方案，适用于旧浏览器
    styleElement.appendChild(document.createTextNode(rules));
  }

  return styleElement;
}
