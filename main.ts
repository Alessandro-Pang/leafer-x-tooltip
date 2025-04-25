/*
 * @Author: zi.yang
 * @Date: 2024-02-01 14:42:21
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-04-25 19:15:45
 * @Description:
 * @FilePath: /leafer-x-tooltip/main.ts
 */

import { App, Leafer } from 'leafer-ui'

import { ILeaf } from '@leafer-ui/interface'

import { TooltipPlugin } from './src'
import type { UserConfig } from './src/TooltipPlugin'

// 添加样式
function addStyle(container: HTMLElement, styles: Record<string, string>) {
  Object.keys(styles).forEach((key: any) => {
    container.style[key] = styles[key]
  })
}

// 初始化 body
function initBody() {
  const styles = {
    margin: '0',
    padding: '0',
    height: '100vh',
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: '#f8f9fa',
    overflow: 'auto',
    justifyContent: 'center'
  }
  addStyle(document.body, styles)
  
  // 创建顶部导航栏
  const header = document.createElement('header')
  header.innerText = 'Leafer Tooltip Plugin'
  addStyle(header, {
    width: '100%',
    height: '80px',
    lineHeight: '80px',
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '28px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '20px',
    position: 'sticky',
    top: '0',
    zIndex: '100'
  })
  header.onclick = () => {
    window.open('https://github.com/Alessandro-Pang/leafer-x-tooltip')
  }
  document.body.appendChild(header)
  
  // 添加页面说明
  const description = document.createElement('div')
  description.innerHTML = '<p>以下展示了Leafer Tooltip插件的不同配置效果，将鼠标悬停或点击图形查看提示效果</p>'
  addStyle(description, {
    width: '100%',
    padding: '0 20px 20px',
    textAlign: 'center',
    color: '#6c757d',
    boxSizing: 'border-box'
  })
  document.body.appendChild(description)
}

initBody()

// 添加全局样式
const globalStyle = document.createElement('style')
globalStyle.innerText = `
  .custom-tooltip {
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, rgba(0, 157, 255, 0.9), rgba(86, 192, 255, 0.9));
    color: white;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0, 157, 255, 0.3);
    backdrop-filter: blur(8px);
  }
  
  .leafer-x-tooltip ul, .custom-tooltip ul {
    margin: 0;
    padding: 0;
  }
  
  .leafer-x-tooltip li, .custom-tooltip li {
    margin-bottom: 5px;
  }

  .demo-wrapper:hover {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
  }
  
  /* 响应式布局 */
  @media screen and (max-width: 1200px) {
    .demo-wrapper {
      width: calc(50% - 20px) !important;
    }
  }
  
  @media screen and (max-width: 768px) {
    .demo-wrapper {
      width: calc(100% - 20px) !important;      
      min-height: 280px !important;
    }
  }
  
  @media screen and (max-width: 480px) {
    .demo-wrapper {
      margin: 10px 5px !important;
      width: calc(100% - 10px) !important;
    }
  }
`
document.body.appendChild(globalStyle)

// 创建容器
function createWrapper(title: string) {
  const wrapper = document.createElement('div')
  wrapper.className = 'demo-wrapper'
  addStyle(wrapper, {
    border: 'none',
    borderRadius: '12px',
    width: 'calc(33.33% - 20px)',
    minWidth: '320px',
    maxWidth: '500px',
    height: 'calc(50% - 20px)',
    minHeight: '300px',
    margin: '10px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    background: 'white',
    transition: 'transform 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column'
  })
  
  const demoTitle = document.createElement('h3')
  demoTitle.innerText = title
  addStyle(demoTitle, {
    textAlign: 'center',
    height: '60px',
    margin: '0',
    color: '#3a3a3a',
    fontWeight: '500',
    lineHeight: '60px',
    borderBottom: '1px solid #f0f0f0',
    background: '#fcfcfc'
  })
  wrapper.appendChild(demoTitle)
  
  const chartBox = document.createElement('div')
  addStyle(chartBox, {
    width: '100%',
    height: 'calc(100% - 60px)',
    boxSizing: 'border-box',
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  })
  wrapper.appendChild(chartBox)
  document.body.appendChild(wrapper)
  return chartBox
}

// 添加 Leafer 节点
function createPluginDemo(title: string, config: Omit<UserConfig, 'getContent'>) {
  const view = createWrapper(title)
  const app = new App({ view, tree: {type:'draw'} })

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
    strokeWidth: 11,
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

  app.tree.add(rect)
  app.tree.add(ellipse)
  app.tree.add(polygon)
  app.tree.add(star)

  return new TooltipPlugin(app, {
    getContent: (node: ILeaf) => {
      return `<ul style="list-style: none; margin: 0; padding: 0">
        <li>节点类型：${node.tag}</li>
        <li>宽度：${node.width}</li>
        <li>高度：${node.height}</li>
      </ul>
      `
    },
    ...config,
  })
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 1 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('Tooltip 默认实例',{})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 1 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 2 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('Tooltip 仅允许圆形触发',{
  includeTypes: ['Ellipse'],
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 2 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 2 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('Tooltip 仅不允许圆形触发',{
  excludeTypes: ['Ellipse'],
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 2 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 3 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义 Tooltip 容器样式',{
  className: 'custom-tooltip',
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 3 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 4 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义显示控制方法: x > 100px',{
  shouldBegin: (event) => {
    return event.target.x > 100
  },
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 4 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 5 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义显示控制方法: y > 100px',{
  shouldBegin: (event) => {
    return event.target.y > 100
  },
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 5 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 6 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('点击事件触发',{
  triggerType: 'click'
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 6 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 7 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义位置偏移',{
  offset: { x: 20,  y: -100 }
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 7 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo 8 Begin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
createPluginDemo('自定义动画效果',{
  className: 'animated-tooltip',
})
// 添加自定义动画效果样式
const animatedStyle = document.createElement('style')
animatedStyle.innerText = `
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animated-tooltip {
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, rgba(255, 107, 0, 0.9), rgba(255, 159, 0, 0.9));
    color: white;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(255, 107, 0, 0.3);
    backdrop-filter: blur(8px);
    animation: tooltipFadeIn 0.4s ease-out;
  }
  
  .animated-tooltip ul li {
    opacity: 0;
    animation: tooltipFadeIn 0.3s ease-out forwards;
  }
  
  .animated-tooltip ul li:nth-child(1) {
    animation-delay: 0.1s;
  }
  
  .animated-tooltip ul li:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .animated-tooltip ul li:nth-child(3) {
    animation-delay: 0.3s;
  }
`
document.body.appendChild(animatedStyle)
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Demo 8 End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
