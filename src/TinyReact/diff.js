import createDOMElement from './createDOMElement'
import mountElement from './mountElement'
import unmountNode from './unmountNode'
import updateNodeElement from './updateNodeElement'
import updateTextNode from './updateTextNode'

export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM

  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (virtualDOM.type === oldVirtualDOM.type && typeof virtualDOM.type !== 'function') {
    const newElement = createDOMElement(virtualDOM)
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    if (virtualDOM.type === 'text') {
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }
    // 对比子节点
    virtualDOM.children.forEach((child, i) => diff(child, oldDOM, oldDOM.childNodes[i]))
    // 删除节点
    let oldChildNodes = oldDOM.childNodes
    if (oldChildNodes.length > virtualDOM.children.length) {
      for (let i = oldChildNodes.length -1; i > virtualDOM.children.length - 1; i--) {
        unmountNode(oldChildNodes[i])
      }
    }
  }
}
