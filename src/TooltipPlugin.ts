/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-04-25 18:17:35
 * @Description: Tooltip 提示插件
 * @FilePath: /leafer-x-tooltip/src/TooltipPlugin.ts
 */
import { App, Leafer, LeaferEvent, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf } from '@leafer-ui/interface'

import {
  addStyle,
  allowNodeType,
  assert,
  ATTRS_NAME,
  createCssClass,
  denyNodeType,
  getTooltip,
  PLUGIN_NAME,
  randomStr,
} from './utils'

/**
 * Offset 偏移类型, px 单位
 * @description 偏移量可以是数字，也可以是对象或数组，默认偏移 6px
 * @example
 * offset: {
 *   x: 10,
 *   y: 20
 * }
 * 或者
 * offset: [10, 20]
 * 或者
 * offset: 10
 */
export type IOffset = number | { x: number,  y: number,} | [number, number]

/**
 * 用户配置
 * @param { string } className - 自定义样式
 * @param { Array<string> } includeTypes - 允许显示的 Leafer 节点类型
 * @param { Array<string> } excludeTypes - 不允许显示的 Leafer 节点类型
 * @param { 'hover' | 'click' } triggerType - 触发方式，hover: 悬浮触发，click: 点击触发
 * @param { (event: PointerEvent) => boolean } shouldBegin - 是否显示 tooltip
 * @param { (node: ILeaf) => string } getContent - 获取 tooltip 内容
 */
export type UserConfig = {
  className?: string,
  includeTypes?: Array<string>,
  excludeTypes?: Array<string>,
  triggerType?: 'hover' | 'click',
  offset?: IOffset,
  shouldBegin?: (event: PointerEvent) => boolean,
  getContent: (node: ILeaf) => string,
}

export class TooltipPlugin {
  /**
   * @param { Leafer } app - leafer 实例
   * @private
   */
  private readonly app: Leafer | App
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
   * @param { ILeaf } activeNode - 当前激活的节点（鼠标悬浮或点击的节点）
   * @private
   */
  private activeNode: ILeaf
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

  /**
   * 保留 hideTooltip 引用，用于移除事件
   * @private
   */
  private readonly _hideTooltip: () => void

  public styleSheetElement: HTMLStyleElement

  constructor(app: Leafer | App, config: UserConfig) {
    this.app = app
    this.config = config
    // 设置默认触发方式为悬浮
    if (!this.config.triggerType) {
      this.config.triggerType = 'hover'
    }
    this.domId = `lxt--${randomStr(8)}`
    this.bindEventIds = []
    this.initEvent()
    this.initCssClass()
    this.initCreateTooltip()

    // 使用箭头函数代替 .bind(this)
    this._moveTooltip = (event) => this.moveTooltip(event)
    this._hideTooltip = () => this.hideTooltip()
  }

  /**
   * 初始化事件
   * @private
   */
  private initEvent() {
    const eventIds = []
    
    // 挂载鼠标事件，用于悬浮、点击触发tooltip
    let event = PointerEvent.MOVE
    let eventFunc = this.leaferPointMove

    if(this.config.triggerType === 'click'){
      event = PointerEvent.CLICK
      eventFunc = this.leaferPointClick
    }
    
    const eventId = this.app.on_(event,eventFunc, this)
    eventIds.push(eventId)
    
    // 挂载画布事件
    const viewReadyId = this.app.on_(LeaferEvent.VIEW_READY, this.viewReadyEvent, this)
    eventIds.push(viewReadyId)

    // 保存事件 id
    this.bindEventIds.push(...eventIds)
  }

  /**
   * 判断是否应该显示提示框
   *
   * @param node 节点对象
   * @param event 鼠标事件
   * @returns 是否应该显示提示框
   */
  private shouldShowTooltip(node: ILeaf, event: PointerEvent): boolean {
    // 提前判断，避免后面额外计算
    if (!node || node.isLeafer || node.isApp) {
      this.hideTooltip()
      return false
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
      return false
    }
    return true
  }
  
  /**
   * leafer 鼠标移动事件
   * @param event
   * @private
   */
  private leaferPointMove(event: PointerEvent) {
    const node = event.target
    if(this.activeNode === node) return
    if(!this.shouldShowTooltip(node, event)) return
    this.activeNode = node
  }

  /**
   * leafer 鼠标点击事件
   * @param event
   * @private
   */
  private leaferPointClick(event: PointerEvent) {
    const node = event.target
    if(!this.shouldShowTooltip(node, event)) return
    
    // 如果点击的是当前激活的节点且已经通过点击触发了tooltip，则隐藏tooltip
    if (this.activeNode === node) {
      this.hideTooltip()
      return
    }
    
    // 设置当前激活的节点和点击状态
    this.activeNode = node
    
    // 手动触发一次moveTooltip，以便立即显示tooltip
    if (this.app.view instanceof HTMLElement) {
      this.moveTooltip(event)
    }
  }
  
  /**
   * leafer view 加载完成事件
   * @private
   */
  private viewReadyEvent(): void {
    if (!(this.app.view instanceof HTMLElement)) return
    assert(
      this.app.view?.addEventListener === undefined, 
      'leafer.view 加载失败！'
    )

    
    // 只有在hover模式下才添加mousemove事件监听器
    // 在click模式下，不需要监听mousemove事件，避免Tooltip随鼠标移动而更新位置
    if (this.config.triggerType === 'hover') {
      this.app.view.addEventListener('mousemove', this._moveTooltip)
      this.app.view.addEventListener('mouseleave', this._hideTooltip)
    }
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
      border: 'none',
      borderRadius: '6px',
      padding: '10px 14px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: '#333',
      fontSize: '13px',
      fontWeight: '400',
      boxShadow: '0 3px 14px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(8px)',
      transition: 'opacity,top, left 0.2s ease-in-out',
    })
  }

  /**
   * 初始化 tooltip 容器
   * @returns {HTMLElement} tooltip容器元素
   * @private
   */
  private initCreateTooltip(): HTMLElement {
    // 检查是否已存在
    let container: HTMLElement | null = getTooltip(this.domId)
    const isExists = container !== null
    
    // 不存在则创建新容器
    if (!isExists) {
      container = document.createElement('div')
    }
    
    // 设置属性
    container.setAttribute(ATTRS_NAME, this.domId)
    container.style.display = 'none'
    
    // 设置样式类
    if (this.config.className) {
      container.className = this.config.className
    } else if (!isExists) {
      container.className = PLUGIN_NAME
    }
    
    // 添加到DOM
    if (!isExists) {
      document.body.appendChild(container)
    }
    
    return container
  }

  /**
   * 隐藏 tooltip
   * @private
   */
  private hideTooltip(): void {
    // 清除激活节点
    this.activeNode = null
    
    // 隐藏tooltip元素
    const tooltipDOM = getTooltip(this.domId)
    if (tooltipDOM) {
      tooltipDOM.style.display = 'none'
    }
  }

  /**
   * 计算Tooltip的位置
   * @param {PointerEvent | MouseEvent} event - 事件对象
   * @param {HTMLElement} tooltipElem - tooltip元素
   * @returns {{x: number, y: number}} 计算后的位置
   * @private
   */
  private calculateTooltipPosition(event: PointerEvent | MouseEvent, tooltipElem: HTMLElement): { x: number, y: number } {
    // 获取视窗的尺寸以及滚动条的位置
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const pageXOffset = window.scrollX
    const pageYOffset = window.scrollY

    // 统一获取鼠标位置
    let mouseX = 0, mouseY = 0
    
    if (event instanceof PointerEvent) {
      mouseX = event.origin.x + pageXOffset
      mouseY = event.origin.y + pageYOffset
    } else if (event instanceof MouseEvent) {
      mouseX = event.clientX + pageXOffset
      mouseY = event.clientY + pageYOffset
    } else {
      // 兜底处理
      mouseX = (event as any).x + pageXOffset
      mouseY = (event as any).y + pageYOffset
    }

    // 获取tooltip的尺寸
    const tooltipWidth = tooltipElem.offsetWidth
    const tooltipHeight = tooltipElem.offsetHeight

    const offset = this.getOffset()

    // 计算tooltip的理想位置
    let x = mouseX + offset.x
    let y = mouseY + offset.y

    // 检查tooltip是否超出了右边界
    if (x + tooltipWidth > windowWidth + pageXOffset) {
      x = mouseX - tooltipWidth - offset.x // 调整到鼠标左侧
    }

    // 检查tooltip是否超出了下边界
    if (y + tooltipHeight > windowHeight + pageYOffset) {
      y = mouseY - tooltipHeight - offset.y // 调整到鼠标上方
    }
    
    return { x, y }
  }

  /**
   * 获取tooltip内容
   * @returns {string} tooltip内容
   * @private
   */
  private getTooltipContent(): string {
    const argumentType = typeof this.config.getContent
    assert(
      argumentType !== 'function',
      `getContent 为必传参数，且必须是一个函数，当前为：${argumentType} 类型`
    )
    const content = this.config.getContent(this.activeNode)
    assert(
      content === undefined || content === null || content === '',
      `getContent 返回值不能为空`
    )
    return content
  }

  /**
   * 移动并显示tooltip
   * @param {MouseEvent | PointerEvent} event - 事件对象
   * @returns {void}
   * @private
   */
  private moveTooltip(event: MouseEvent | PointerEvent): void {
    if(this.activeNode === null) return

    // 获取或创建tooltip容器
    let tooltipContainer = getTooltip(this.domId)
    if (!tooltipContainer) {
      tooltipContainer = this.initCreateTooltip()
    }
    
    // 更新内容
    tooltipContainer.innerHTML = this.getTooltipContent()
    
    // 计算并设置位置
    const { x, y } = this.calculateTooltipPosition(event, tooltipContainer)
    
    // 应用样式
    addStyle(tooltipContainer, {
      display: 'block',
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  /**
   * 获取 tooltip 容器 id
   */
  public getDomId() {
    return this.domId
  }

  
  /**
   * 获取偏移量
   *
   * @returns 返回包含x和y偏移量的对象
   */
  public getOffset(): {x: number, y: number} {
    const offset = this.config.offset;
    if(typeof offset === 'number') return {x: offset, y: offset }
    if(Array.isArray(offset)) {
      const [x, y] = offset
      return {x, y}
    }
    if(typeof offset === 'object') return offset
    return {x: 6, y: 6 };
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
      this.app.view.removeEventListener('mouseleave', this._hideTooltip)
    }
    // 重置状态
    this.activeNode = null
    // 移除 tooltip
    const tooltipDOM = getTooltip(this.domId)
    if (tooltipDOM && tooltipDOM.parentNode) {
      tooltipDOM.parentNode.removeChild(tooltipDOM)
    }
  }
  
  /**
   * 设置触发方式
   * @param {'hover' | 'click'} triggerType - 触发方式
   * @returns {void}
   */
  public setTriggerType(triggerType: 'hover' | 'click'): void {
    // 如果触发方式没有变化，则不做处理
    if (this.config.triggerType === triggerType) return
    
    // 记录之前的触发方式
    const prevTriggerType = this.config.triggerType
    
    // 移除之前的事件
    this.app.off_(this.bindEventIds)
    this.bindEventIds.length = 0
    
    // 更新触发方式
    this.config.triggerType = triggerType
    
    // 重新初始化事件
    this.initEvent()
    
    // 处理mousemove事件监听器
    if (this.app.view instanceof HTMLElement) {
      if (triggerType === 'click' && prevTriggerType === 'hover') {
        // 从hover模式切换到click模式，移除mousemove事件监听器
        this.app.view.removeEventListener('mousemove', this._moveTooltip)
        this.app.view.removeEventListener('mouseleave', this._hideTooltip)
      } else if (triggerType === 'hover' && prevTriggerType === 'click') {
        // 从click模式切换到hover模式，添加mousemove事件监听器
        this.app.view.addEventListener('mousemove', this._moveTooltip)
        this.app.view.addEventListener('mouseleave', this._hideTooltip)
      }
    }
    
    // 隐藏tooltip
    this.hideTooltip()
  }
}
