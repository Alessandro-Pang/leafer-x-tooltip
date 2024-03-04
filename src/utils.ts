/*
 * @Author: zi.yang
 * @Date: 2024-02-26 20:37:52
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:08:34
 * @Description: utils
 * @FilePath: /leafer-x-tooltip/src/utils.ts
 */

export const PLUGIN_NAME = 'leafer-x-tooltip'
export const ATTRS_NAME = 'data-lxt-id'

/**
 * 异常抛出函数
 * @param condition
 * @param msg
 */
export function assert(condition: boolean, msg: string) {
  if (condition) {
    throw new Error(`[${PLUGIN_NAME}]: ${msg}`)
  }
}

/**
 * 使用 requestAnimationFrame 来防止多次重绘和回流
 *
 * @param {HTMLElement} element 要添加样式的DOM元素
 * @param {Object} cssStyles 包含键值对形式样式规则的对象
 */
export function addStyle(element: HTMLElement, cssStyles: Record<string, string>) {
  requestAnimationFrame(() => {
    Object.entries(cssStyles).forEach(([property, value]) => {
      // 确保属性名使用的是camelCase
      element.style[property as any] = value
    })
  })
}


/**
 * 随机字符串
 * @param length
 */
export function randomStr(length = 8) {
  return Math.random().toString(36).slice(2, length + 2)
}

/**
 * 允许显示的节点类型
 * @param includeTypes
 * @param type
 * @returns { Boolean }
 */
export function allowNodeType(includeTypes: Array<string>, type: string): boolean {
  if (!Array.isArray(includeTypes)) return true
  if (includeTypes.length === 0) return true
  return includeTypes.includes(type)
}

/**
 * 不允许显示的节点类型
 * @param excludeTypes
 * @param type
 * @returns { Boolean }
 */
export function denyNodeType(excludeTypes: Array<string>, type: string): boolean {
  if (!Array.isArray(excludeTypes)) return false
  if (excludeTypes.length === 0) return false
  return excludeTypes.includes(type)
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
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}


/**
 * 创建 css 类
 * @param selector - 选择器
 * @param useRules - 用户自定义样式
 * @param userStyleElement - 用户自定义 style 标签
 */
export function createCssClass(selector: string, useRules: string | Record<string, string>, userStyleElement?: HTMLStyleElement) {
  let styleElement = userStyleElement
  if (!styleElement && !(userStyleElement instanceof HTMLStyleElement)) {
    styleElement = document.createElement('style')
    // 给标签加一个标识，方便后续查找和删除
    styleElement.setAttribute(PLUGIN_NAME, '')
    document.head.appendChild(styleElement)
  }

  // 处理样式
  let rules = typeof useRules === 'string' ? useRules : ''
  if (typeof useRules === 'object') {
    Object.keys(useRules).forEach((prop: string) => {
      rules += `${camelCaseToDash(prop)}: ${useRules[prop]};`
    })
  }

  // 兼容性处理
  if (styleElement.sheet) {
    // 使用现代的方法插入规则
    styleElement.sheet.insertRule(`${selector} { ${rules} }`, 0)
  } else {
    // 回退方案，适用于旧浏览器
    styleElement.appendChild(document.createTextNode(rules))
  }

  return styleElement
}
