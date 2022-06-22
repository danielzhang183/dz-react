import createDOMElement from './createDOMElement'
import diffComponent from './diffComponent'
import isFunction from './isFunction'
import mountElement from './mountElement'
import unmountNode from './unmountNode'
import updateNodeElement from './updateNodeElement'
import updateTextNode from './updateTextNode'

export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM?._virtualDOM
  const oldComponent = oldVirtualDOM?.component

  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (
    // 如果要比对的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件 因为组件要单独处理
    !isFunction(virtualDOM)
  ) {
    // 使用新的 virtualDOM 对象生成真实 DOM 对象
    const newElement = createDOMElement(virtualDOM)
    // 使用新的 DOM 对象替换旧的 DOM 对象
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (isFunction(virtualDOM)) { // 组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container)
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    if (virtualDOM.type === 'text') {
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }
    // 1. 将拥有key属性的子元素放置在一个单独的对象中
    const keyedElements = Array.from(oldDOM.childNodes).reduce((keyedElements, domElement) => {
      if (domElement.nodeType === 1) {
        const key = domElement.getAttribute('key')
        key && (keyedElements[key] = domElement)
      }
      return keyedElements
    }, {})
    const hasNoKey = Object.keys(keyedElements).length === 0
    if (hasNoKey) {
      // 对比子节点
      virtualDOM.children.forEach((child, i) => diff(child, oldDOM, oldDOM.childNodes[i]))
    } else {
      // 2. 循环virtualDOM的子元素 获取子元素的key属性
      virtualDOM.children.forEach((child, i) => {
        const key = child.props.key
        if (key) {
          const domElement = keyedElements[key]
          if (!domElement) return
          // 3. 看看当前位置的元素是不是我们期望的元素
          if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
            oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
          }
        } else { // 新增元素
          mountElement(child, oldDOM, oldDOM.childNodes[i])
        }
      })
    }
    // 删除节点
    let oldChildNodes = oldDOM.childNodes
    if (oldChildNodes.length > virtualDOM.children.length) {
      for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length - 1; i--) {
        unmountNode(oldChildNodes[i])
      }
    }
  }
}
