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

import {
  assert,
  addStyle,
  allowNodeType,
  createCssClass,
  denyNodeType,
  getTooltip,
  randomStr,
  ATTRS_NAME,
  PLUGIN_NAME,
} from './utils'

/**
 * 用户配置
 * @param { string } className - 自定义样式
 * @param { Array<string> } includeTypes - 允许显示的 Leafer 节点类型
 * @param { (event: PointerEvent) => boolean } shouldBegin - 是否显示 tooltip
 * @param { (node: ILeaf) => string } getContent - 获取 tooltip 内容
 */
export type UserConfig = {
  className?: string,
  includeTypes?: Array<string>,
  excludeTypes?: Array<string>
  shouldBegin?: (event: PointerEvent) => boolean,
  getContent: (node: ILeaf) => string,
}

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
  private readonly _moveTooltip: (event: MouseEvent) => void

  public styleSheetElement: HTMLStyleElement

  constructor(app: Leafer, config: UserConfig) {
    this.app = app
    this.config = config
    this.domId = `lxt--${randomStr(8)}`
    this.bindEventIds = []
    this.initEvent()
    this.initCssClass()
    this.initCreateTooltip()

    // 使用箭头函数代替 .bind(this)
    this._moveTooltip = (event) => this.moveTooltip(event)
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
    const isAllowType = allowNodeType(this.config.includeTypes, node.tag)
    // 判断是否不允许显示的节点类型
    const isDenyType = denyNodeType(this.config.excludeTypes, node.tag)
    // 判断是否允许显示
    const isShouldBegin = this.config.shouldBegin ? this.config.shouldBegin(event) : true
    // 不允许显示
    if (!isAllowType || isDenyType || !isShouldBegin) {
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
    this.app.view.addEventListener('mousemove', this._moveTooltip)
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
      boxShadow: '0 0 4px #e2e2e2'
    })
  }

  /**
   * 初始化 tooltip 容器
   * @private
   */
  private initCreateTooltip(): HTMLElement {
    let container: HTMLElement | null = getTooltip(this.domId)
    const isExists = container !== null
    if (!isExists) {
      container = document.createElement('div')
    }
    container.setAttribute(ATTRS_NAME, this.domId)
    container.style.display = 'none'
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
      tooltipDOM.style.display = 'none'
    }
  }

  // 新加入的方法来计算Tooltip的位置
  private calculateTooltipPosition = (event: MouseEvent, tooltipElem: HTMLElement) => {
    // 获取视窗的尺寸以及滚动条的位置
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const pageXOffset = window.scrollX
    const pageYOffset = window.scrollY

    // 获取鼠标位置
    const mouseX = event.clientX + pageXOffset
    const mouseY = event.clientY + pageYOffset

    // 获取tooltip的尺寸
    const tooltipWidth = tooltipElem.offsetWidth
    const tooltipHeight = tooltipElem.offsetHeight

    const emptySpace = 6 // 留出 6px 的空间
    // 计算tooltip的理想位置
    let x = mouseX + emptySpace
    let y = mouseY + emptySpace

    // 检查tooltip是否超出了右边界
    if (x + tooltipWidth > windowWidth + pageXOffset) {
      x = mouseX - tooltipWidth - emptySpace // 调整到鼠标左侧
    }

    // 检查tooltip是否超出了下边界
    if (y + tooltipHeight > windowHeight + pageYOffset) {
      y = mouseY - tooltipHeight - emptySpace // 调整到鼠标上方
    }
    return { x, y }
  }

  private getTooltipContent() {
    const argumentType = typeof this.config.getContent
    assert(
      argumentType !== 'function',
      `getContent 为必传参数，且必须是一个函数，当前为：${argumentType} 类型`
    )
    const content = this.config.getContent(this.mouseoverNode)
    assert(!content, `getContent 返回值不能为空`)
    return content
  }

  /**
   * 创建提示元素
   * @returns
   * @private
   * @param event
   */
  private moveTooltip(event: MouseEvent) {
    if (!this.mouseoverNode) return

    // 如果Tooltip已存在，则更新内容和位置
    let tooltipContainer = getTooltip(this.domId)
    if (!tooltipContainer) {
      tooltipContainer = this.initCreateTooltip()
    }
    tooltipContainer.innerHTML = this.getTooltipContent()
    // 使用计算位置的函数来设置Tooltip位置
    const { x, y } = this.calculateTooltipPosition(event, tooltipContainer)
    addStyle(tooltipContainer, {
      display: 'block',
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`
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
    const fullSelector = `${selector}[${ATTRS_NAME}=${this.domId}]`
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
      this.app.view.removeEventListener('mousemove', this._moveTooltip)
    }
    // 移除 tooltip
    const tooltipDOM = getTooltip(this.domId)
    if (tooltipDOM && tooltipDOM.parentNode) {
      tooltipDOM.parentNode.removeChild(tooltipDOM)
    }
  }
}
