/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 11:35:30
 * @Description: Tooltip 提示插件
 * @FilePath: /leafer-x-tooltip/src/TooltipPlugin.ts
 */
import { Leafer, LeaferEvent, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf } from '@leafer-ui/interface'

import type { UserConfig } from './types'
import {
  addStyle,
  allowNodeType,
  assert,
  ATTRS_NAME, createCssClass,
  getTooltip, PLUGIN_NAME, randomStr
} from './utils'

export class TooltipPlugin {
  /**
   * @param { Leafer } app - leafer 实例
   * @private
   */
  private readonly app: Leafer
  /**
   * @param { string } domId - tooltip 容器 id
   * @private
   */
  private readonly domId: string
  /**
   * @param { UserConfig } config - 用户配置
   * @private
   */
  private readonly config: UserConfig
  /**
   * @param { ILeaf } mouseoverNode - 鼠标移动到的节点
   * @private
   */
  private mouseoverNode: ILeaf
  /**
   * @param { Array<string> } bindEventIds - 绑定的事件 id
   * @private
   */
  private readonly bindEventIds: Array<IEventListenerId>
  /**
   * 保留 createTooltip 引用，用于移除事件
   * @param { MouseEvent } event - DOM 事件
   * @private
   */
  private _createTooltip: (event: MouseEvent) => void

  private styleSheetElement: HTMLStyleElement

  constructor(app: Leafer, config: UserConfig) {
    this.app = app
    this.config = config
    this.domId = `lxt--${randomStr(8)}`
    this.bindEventIds = []
    this.initEvent()
    this.initCssClass()
    this.initTooltip()
  }

  /**
   * 初始化事件
   * @private
   */
  private initEvent() {
    // leafer 鼠标移动事件，用于捕获节点
    const pointEventId = this.app.on_(PointerEvent.MOVE, this.leaferPointMove, this)
    // 挂载画布事件
    const vieReadId = this.app.on_(LeaferEvent.VIEW_READY, this.viewReadyEvent, this)
    // 保存事件 id
    this.bindEventIds.push(pointEventId, vieReadId)
  }

  /**
   * leafer 鼠标移动事件
   * @param event
   * @private
   */
  private leaferPointMove(event: PointerEvent) {
    const node = event.target
    // 提前判断，避免后面额外计算
    if (!node || node.isLeafer) {
      this.hideTooltip()
      return
    }
    // 判断是否允许显示的节点类型
    const isAllowType = allowNodeType(this.config, node.tag)
    // 判断是否允许显示
    const isShouldBegin = this.config.shouldBegin ? this.config.shouldBegin(event) : true
    // 不允许显示
    if (!isAllowType || !isShouldBegin) {
      this.hideTooltip()
      return
    }
    this.mouseoverNode = node
  }

  /**
   * leafer view 加载完成事件
   * @private
   */
  private viewReadyEvent() {
    if (!(this.app.view instanceof HTMLElement)) return
    assert(!this.app.view?.addEventListener, 'leafer.view 加载失败！')
    this._createTooltip = this.createTooltip.bind(this)
    this.app.view.addEventListener('mousemove', this._createTooltip)
  }

  /**
   * 创建样式
   * @private
   */
  private initCssClass() {
    if (this.styleSheetElement) return
    // 如果之前被创建过，直接获取
    const styleSheetElement = document.querySelector(`.${PLUGIN_NAME}`)
    if (styleSheetElement) {
      this.styleSheetElement = styleSheetElement as HTMLStyleElement
      return
    }
    // 初始化创建一个样式
    this.styleSheetElement = createCssClass(`.${PLUGIN_NAME}`, {
      padding: '8px 10px',
      backgroundColor: '#fff',
      borderRadius: '2px',
      boxShadow: '0 0 4px #e2e2e2',
      transition: 'opacity 0.3s'
    })
  }

  /**
   * 初始化 tooltip 容器
   * @private
   */
  private initTooltip(): HTMLElement {
    let container: HTMLElement | null = getTooltip(this.domId)
    const isExists = container !== null
    if (!isExists) {
      container = document.createElement('div')
    }
    container.setAttribute(ATTRS_NAME, this.domId)
    // 允许用户自定义样式
    if (this.config.className) {
      container.className = this.config.className
    } else if (!isExists) {
      container.className = PLUGIN_NAME
    }
    if (!isExists) {
      document.body.appendChild(container)
    }
    return container
  }

  /**
   * 隐藏 tooltip
   * @private
   */
  private hideTooltip() {
    this.mouseoverNode = null
    const tooltipDOM = getTooltip(this.domId)
    if (tooltipDOM) {
      tooltipDOM.style.opacity = '0'
    }
  }

  /**
   * 创建提示元素
   * @param { MouseEvent } event DOM 事件
   * @returns
   * @private
   */
  private createTooltip(event: MouseEvent) {
    if (!this.mouseoverNode) return
    const argumentType = typeof this.config.getContent
    assert(
      argumentType !== 'function',
      `getContent 为必传参数，且必须是一个函数，当前为：${argumentType} 类型`
    )

    const content = this.config.getContent(this.mouseoverNode)
    assert(!content, `getContent 返回值不能为空`)

    let container: HTMLElement | null = getTooltip(this.domId)
    // 容错机制，正常情况下不会出现
    if (!container) {
      container = this.initTooltip()
    }
    container.innerHTML = content
    addStyle(container, {
      display: 'block',
      position: 'absolute',
      opacity: '1',
      left: event.pageX + 4 + 'px',
      top: event.pageY + 4 + 'px'
    })
  }

  /**
   * 获取 tooltip 容器 id
   */
  public getDomId() {
    return this.domId
  }

  /**
   * 创建样式规则
   * @param selector
   * @param useRules
   */
  public createStyleRule(selector: string, useRules: string | Record<string, string>) {
    createCssClass(`${selector}[${ATTRS_NAME}=${this.domId}]`, useRules, this.styleSheetElement)
  }

  /**
   * 移除样式规则
   * @param selector
   */
  public removeStyleRule(selector: string) {
    const styleSheet = this.styleSheetElement.sheet
    if (!styleSheet) return
    const index = this.findStyleRuleIndex(selector)
    if (index === -1) return
    styleSheet.deleteRule(index)
  }

  /**
   * 查找样式规则索引
   * @param selector
   */
  public findStyleRuleIndex(selector: string): number {
    const styleSheet = this.styleSheetElement.sheet
    if (!styleSheet) return -1
    const rules = styleSheet.cssRules
    const fullSelector = `${selector}[${ATTRS_NAME}="${this.domId}"]`
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i] as CSSStyleRule
      if (rule.selectorText === fullSelector) return i
    }
    return -1
  }

  /**
   * 添加自定义样式
   * @param className
   */
  public addClass(className: string | string[]) {
    const container = getTooltip(this.domId)
    if (container) {
      if (Array.isArray(className)) {
        className.forEach((item) => container.classList.add(item))
      } else {
        container.classList.add(className)
      }
    }
  }

  /**
   * 移除自定义样式
   * @param className
   */
  public removeClass(className: string | string[]) {
    const container = getTooltip(this.domId)
    if (container) {
      if (Array.isArray(className)) {
        className.forEach((item) => container.classList.remove(item))
      } else {
        container.classList.remove(className)
      }
    }
  }

  /**
   * 销毁 tooltip
   */
  public destroy() {
    // 移除事件
    this.app.off_(this.bindEventIds)
    this.bindEventIds.length = 0
    if (this.app.view instanceof HTMLElement) {
      this.app.view.removeEventListener('mousemove', this._createTooltip)
    }
    // 移除 tooltip
    const tooltip = getTooltip(this.domId)
    if (tooltip) {
      document.body.removeChild(tooltip)
    }
  }
}
