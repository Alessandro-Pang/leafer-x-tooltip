/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-02-27 00:52:04
 * @Description:
 * @FilePath: /leafer-x-tooltip/main.ts
 */
import { Leafer } from 'leafer-ui'

import { TooltipPlugin } from './src'
import { ILeaf } from '@leafer-ui/interface'
import { UserConfig } from './src/types'

// 添加样式
function addStyle(container: HTMLElement, styles: Record<string, string>) {
  Object.keys(styles).forEach((key: any) => {
    container.style[key] = styles[key]
  })
}

function initBody() {
  const styles = {
    margin: '0',
    padding: '0',
    height: '100vh',
    display: 'flex',
    flexWrap: 'wrap'
  }
  addStyle(document.body, styles)
  const header = document.createElement('header')
  header.innerText = 'Leafer Tooltip Plugin'
  addStyle(header, {
    width: '100%',
    height: '70px',
    lineHeight: '70px',
    textAlign: 'center',
    color: '#696969',
    fontSize: '26px',
    cursor: 'pointer'
  })
  header.onclick = () => {
    window.open('https://github.com/Alessandro-Pang/leafer-x-tooltip')
  }
  document.body.appendChild(header)
}

initBody()

// 创建容器
function createWrapper(title: string) {
  const wrapper = document.createElement('div')
  addStyle(wrapper, {
    border: '1px solid #e2e2e2',
    width: '50%',
    height: '50%',
    boxSizing: 'border-box'
  })
  const demoTitle = document.createElement('h3')
  demoTitle.innerText = title
  addStyle(demoTitle, {
    textAlign: 'center',
    height: '50px',
    margin: '0',
    color: '#969696',
    lineHeight: '50px',
    borderBottom: '1px solid #e2e2e2'
  })
  wrapper.appendChild(demoTitle)
  const chartBox = document.createElement('div')
  addStyle(chartBox, {
    width: '100%',
    height: 'calc(100% - 50px)'
  })
  wrapper.appendChild(chartBox)
  document.body.appendChild(wrapper)
  return chartBox
}

// 添加 Leafer 节点
function createPluginDemo(title: string, config: UserConfig) {
  const view = createWrapper(title)
  const leafer = new Leafer({ view })

  const rect = Leafer.one({
    tag: 'Rect',
    x: 100,
    y: 50,
    rotation: 0,
    width: 80,
    height: 80,
    opacity: 1,
    fill: 'rgba(50, 190, 7, 1)',
    stroke: 'rgba(155, 255, 243, 1)',
    strokeWidth: 11
  })
  const ellipse = Leafer.one({
    tag: 'Ellipse',
    x: 100,
    y: 200,
    rotation: 0,
    width: 80,
    height: 80,
    opacity: 1,
    fill: 'rgba(0, 174, 255, 1)',
    stroke: 'rgba(255, 21, 21, 1)',
    strokeWidth: 21,
    startAngle: 0,
    endAngle: 0,
    innerRadius: 0
  })
  const polygon = Leafer.one({
    tag: 'Polygon',
    x: 300,
    y: 50,
    rotation: 0,
    width: 80,
    height: 80,
    opacity: 1,
    fill: 'rgba(255, 144, 0, 1)',
    stroke: 'rgba(255, 0, 0, 1)',
    strokeWidth: 2,
    sides: 6
  })
  const star = Leafer.one({
    tag: 'Star',
    x: 300,
    y: 200,
    rotation: 0,
    width: 80,
    height: 80,
    opacity: 1,
    fill: 'rgba(0, 217, 255, 1)',
    stroke: 'rgba(255, 238, 0, 1)',
    strokeWidth: 2,
    innerRadius: 0.382
  })

  leafer.add(rect)
  leafer.add(ellipse)
  leafer.add(polygon)
  leafer.add(star)

  return new TooltipPlugin(leafer, config)
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 1 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('Tooltip 默认实例', {
  getContent: (node: ILeaf) => {
    return `<ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
      `
  }
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 1 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 2 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('Tooltip 仅允许圆形触发',{
  includeTypes: ['Ellipse'],
  getContent: (node: ILeaf) => {
    return `<ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
      `
  }
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 2 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 3 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义 Tooltip 容器样式',{
  className: 'custom-tooltip',
  getContent: (node: ILeaf) => {
    return `<ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
      `
  }
})
const customStyle = document.createElement('style')
customStyle.innerText = `
.custom-tooltip {
      border: 1px solid rgba(0, 157, 255, 0.62);
      padding: 6px;
      background-color: rgb(131, 207, 255);
      color: #fff;
      font-size: 12px;
      font-weight: 400;
    }
`
document.body.appendChild(customStyle)
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 3 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 4 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义显示控制方法: x > 100px',{
  shouldBegin: (event) => {
    return event.target.x > 100
  },
  getContent: (node: ILeaf) => {
    return `<ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
      `
  }
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 4 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`
