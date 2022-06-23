export default function unmountNode(node) {
  const virtualDOM = node._virtualDOM
  if (virtualDOM.type === 'text') {
    node.remove()
    return
  }
  // 元素节点
  const component = virtualDOM.component
  if (component) {
    component.componentWillUnmount()
  }
  if (virtualDOM.props?.ref) {
    virtualDOM.props.ref(null)
  }
  Object.keys(virtualDOM.props).forEach((propName) => {
    if (/^on/.test(propName)) {
      const eventName = propName.toLocaleLowerCase().slice(0, 2)
      const eventHandler = virtualDOM.props[propName]
      node.removeEventListener(eventName, eventHandler)
    }
  })

  // 递归删除子节点
  if (node.childNodes.length) {
    Array.from(node.childNodes).forEach(childNode => unmountNode(childNode))
  }
  // 删除节点
  node.remove()
}
