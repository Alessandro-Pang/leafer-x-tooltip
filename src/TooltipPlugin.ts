/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:20:54
 * @Description: Tooltip 提示插件
 * @FilePath: /leafer-x-tooltip/src/TooltipPlugin.ts
 */
import { Leafer, LeaferEvent, PointerEvent } from '@leafer-ui/core';
import type { ILeaf } from '@leafer-ui/interface';

import type { UserConfig } from './types';
import {
  addStyle,
  allowNodeType,
  assert,
  ATTRS_NAME,
  getTooltip,
} from './utils';

export class TooltipPlugin {
  private app: Leafer
  private domId: string
  private config: UserConfig
  private mouseoverNode: ILeaf

  constructor(app: Leafer, config: UserConfig) {
    this.app = app
    this.config = config
    this.init()
  }

  private init() {
    const randomStr = Math.random().toString(32).slice(2, 10)
    this.domId = `leafer-tooltip-plugin--${randomStr}`

    // leafer 鼠标移动事件，用于捕获节点
    this.app.on_(PointerEvent.MOVE, this.leaferPointMove, this)

    // 挂载画布事件
    this.app.on(LeaferEvent.VIEW_READY, () => {
      if (!(this.app.view instanceof HTMLElement)) return
      assert(!this.app.view?.addEventListener, 'leafer.view 加载失败！')
      this.app.view.addEventListener('mousemove', (event: MouseEvent) =>
        this.createTooltip(event)
      )
    })
  }

  private leaferPointMove(event: PointerEvent) {
    const node = event.target
    if (node.isLeafer || !allowNodeType(this.config, node.tag)) {
      this.mouseoverNode = null
      const tooltipDOM = getTooltip(this.domId)
      if (tooltipDOM) {
        tooltipDOM.style.display = 'none'
      }
      return
    }
    this.mouseoverNode = node
  }

  /**
   * 创建提示元素
   * @param { MouseEvent } event DOM 事件
   * @returns
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
    const isExists = container !== null
    if (!isExists) {
      container = document.createElement('div')
    }
    if (container === null) return

    container.setAttribute(ATTRS_NAME, this.domId)
    container.innerHTML = content
    // 允许用户自定义样式
    if (this.config.className) {
      container.className = this.config.className
    } else {
      addStyle(container, {
        padding: '8px 10px',
        backgroundColor: '#fff',
        borderRadius: '2px',
        boxShadow: '0 0 4px #e2e2e2',
      })
    }
    addStyle(container, {
      display: 'block',
      position: 'absolute',
      left: event.pageX + 4 + 'px',
      top: event.pageY + 4 + 'px',
    })

    if (!isExists) {
      document.body.appendChild(container)
    }
  }

  /**
   * 销毁 tooltip
   */
  public destroy(): void {
    const tooltip = getTooltip(this.domId)
    if (tooltip) {
      document.body.removeChild(tooltip)
    }
  }
}
