import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'

export default function mountNativeElement(virtualDOM, container, oldDOM) {
  let newElement = createDOMElement(virtualDOM)
  // 将转换之后的DOM对象放置在页面中
  if (oldDOM) {
    container.insertBefore(newElement, oldDOM)
  } else {
    container.appendChild(newElement)
  }
  if (oldDOM) unmountNode(oldDOM)
  container.appendChild(newElement)
  // 获取类组件实例对象
  let component = virtualDOM.component
  // 如果类组件实例对象存在 将DOM对象存储在类组件实例对象中
  if (component) component.setDOM(newElement)
}
