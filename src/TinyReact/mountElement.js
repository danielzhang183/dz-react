import isFunction from './isFunction'
import mountComponent from './mountComponent'
import mountNativeElement from './mountNativeElement' 

export default function mountElement(virtualDOM, container) {
  if (isFunction(virtualDOM)) {
    // Component
    mountComponent(virtualDOM, container)
  } else {
    // render NativeElement
    mountNativeElement(virtualDOM, container)
  }
  // render Component VS NativeElement
}