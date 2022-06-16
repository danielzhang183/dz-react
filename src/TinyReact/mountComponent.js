import isFunctionComponent from "./isFunctionComponent";

export default function mountComponent(virtualDOM, container) {
  if (isFunctionComponent(virtualDOM)) {
    console.log('函数组件')
  }
}