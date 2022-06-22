import diff from "./diff"

export default function updateComponent(virtualDOM, oldComponent, oldDOM, container) {
  oldComponent.updateProps(virtualDOM.props)
  const nextVirtualDOM = oldComponent.render()
  nextVirtualDOM.component = oldComponent
  diff(nextVirtualDOM, container, oldDOM)
}
