/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-26 21:23:38
 * @Description: unit test
 * @FilePath: /Leafer-x-tooltip/__tests__/index.test.ts
 */
import { describe, test,expect, beforeEach } from 'vitest'
import { TooltipPlugin } from '../src'
import { Leafer, Ellipse } from '@leafer-ui/core'

import { JSDOM } from 'jsdom';

// 模拟浏览器环境
// 因为 TooltipPlugin 依赖于 DOM，所以需要模拟浏览器环境
// 另外由于 TooltipPlugin 会复用同一个 styleSheetElement，所以需要在每个测试用例中重新创建 DOM 环境
function createDomEnvironment() {
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: "http://localhost", // 设置一个合法的URL
  });

  global.document = jsdom.window.document;
  global.localStorage = jsdom.window.localStorage;
  global.sessionStorage = jsdom.window.sessionStorage;
  global.HTMLStyleElement = jsdom.window.HTMLStyleElement;
  global.HTMLElement = jsdom.window.HTMLElement;
}

// 测试 canvas 事件有些麻烦，这里只测了部分 api
describe('tooltip-plugin', () => {
  let tooltipPlugin: TooltipPlugin;
  // 每个测试用例都需要重新创建 DOM 环境
  beforeEach(() => {
    createDomEnvironment()
    const app = new Leafer()
    const ellipse = new Ellipse()
    app.add(ellipse)
    tooltipPlugin = new TooltipPlugin(app, {
      getContent: (node) => {
        return `<ul style="list-style: none; margin: 0; padding: 0">
              <li>节点类型：${node.tag}</li>
              <li>宽度：${node.width}</li>
              <li>高度：${node.height}</li>
            </ul>
            `
      }
    })
  })

  test('getDomId', () => {
    expect(tooltipPlugin.getDomId()).not.toBe('')
    expect(document.querySelector(`[data-lxt-id=${tooltipPlugin.getDomId()}]`)).not.toBeNull()
  })

  test('styleElement', () => {
    expect(tooltipPlugin.styleSheetElement).toBeInstanceOf(HTMLStyleElement);
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(1)
  })

  test('createStyleRule', () => {
    expect(tooltipPlugin.styleSheetElement).toBeInstanceOf(HTMLStyleElement);
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(1)
    tooltipPlugin.createStyleRule('test--tooltip', 'color: red;')
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(2)
  })

  test('removeStyleRule', () => {
    expect(tooltipPlugin.styleSheetElement).toBeInstanceOf(HTMLStyleElement);
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(1)
    tooltipPlugin.createStyleRule('test--tooltip', 'color: red;')
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(2)
    tooltipPlugin.removeStyleRule('test--tooltip')
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(1)
  })

  test('findStyleRuleIndex', () => {
    expect(tooltipPlugin.styleSheetElement).toBeInstanceOf(HTMLStyleElement);
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(1)
    tooltipPlugin.createStyleRule('test--tooltip', 'color: red;')
    expect(tooltipPlugin.styleSheetElement.sheet.cssRules.length).toBe(2)
    expect(tooltipPlugin.findStyleRuleIndex('test--tooltip')).not.toBe(-1)
  })

  test('addClass', () => {
    const tooltipEle = document.querySelector(`[data-lxt-id=${tooltipPlugin.getDomId()}]`)
    expect(tooltipEle).not.toBeNull()
    tooltipPlugin.addClass('test--tooltip')
    expect(tooltipEle?.classList.contains('test--tooltip')).toBe(true)
  })

  test('removeClass', () => {
    const tooltipEle = document.querySelector(`[data-lxt-id=${tooltipPlugin.getDomId()}]`)
    expect(tooltipEle).not.toBeNull()
    tooltipPlugin.addClass('test--tooltip')
    expect(tooltipEle?.classList.contains('test--tooltip')).toBe(true)
    tooltipPlugin.removeClass('test--tooltip')
    expect(tooltipEle?.classList.contains('test--tooltip')).toBe(false)
  })

  test('destroy', () => {
    tooltipPlugin.destroy()
    expect(document.querySelector(`[data-ltx-id=${tooltipPlugin.getDomId()}]`)).toBe(null);
  })
})
