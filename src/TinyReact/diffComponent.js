import mountElement from "./mountElement"
import unmountNode from "./unmountNode"

export default function diffComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // same component, update
    console.log('同一个组件')
  } else {
    mountElement(virtualDOM, container, oldDOM)
  }
}

// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}
