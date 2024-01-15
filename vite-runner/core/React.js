// 传统dom

// 创建dom容器
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)

// // 内容子节点
// const textNode = document.createTextNode('')
// textNode.nodeValue = 'Hello'

// dom.append(textNode)

// v2

// 动态创建textNode 结构
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

// 创建元素结构
// 剩余参数 改成数组形式
function createElement(type, props, ...children) {
  console.log(children)
  return {
    type,
    props: {
      ...props,
      // 处理字符串和对象的形式
      children: children.map(child => {
        // 是字符串 在这里处理，不是字符串 render函数处理
        return typeof child === "string" ? createTextNode(child) : child
      }),
    },
  }
}

// 渲染到页面 创建子节点
// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').append(dom)

// // 创建节点内容
// const textNode = document.createTextNode('')
// console.log(App);
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// 1.工作流函数 接收一个参数
// 需要返回下一个要执行的节点
function performWorkOfUnit(el) {
  // 处理元素 判断是不是有dom
  if (!el.dom) {
    // 没有dom
    // 创建一个,并且赋值给el
    const dom = (el.dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type))

    // 将dom 添加到父级的兄弟节点
    el.parent.dom.append(dom)

    // 循环处理所有的props 多个属性的情况 每个属性依此添加 如class 和 id
    Object.keys(el.props).forEach(key => {
      // 注意 children 不是元素属性 不在这里处理
      if (key !== "children") {
        dom[key] = el.props[key]
      }
    })
  }

  // 有dom 转为链表方式
  initChildren(el)

  //   有child, 先返回child
  if (el.child) {
    return el.child
  }

  //   其次返回自己的兄弟节点
  if (el.sibling) {
    return el.sibling
  }

  //   最后返回父级的兄弟节点
  return el.parent?.sibling
}

// 2.将树转为链表
function initChildren(el) {
  const children = el.props.children
  // 遍历所有的children
  // 记录上一个节点
  let prev = null
  children.forEach((child, index) => {
    //   处理新的结构 ，结构中需要包含 父级，兄弟和旁系结构
    const newEl = {
      type: child.type,
      props: child.props,
      parent: el,
      child: null,
      sibling: null,
      dom: null,
    }

    // 第一个节点的孩子,直接插入
    if (index === 0) {
      el.child = newEl
    } else {
      // 不是第一个节点，将上一个节点的兄弟指向当前节点
      prev.sibling = newEl
    }

    // 更新上一个节点
    prev = newEl
  })
}

let nextWorkflow = null
// 创建渲染函数
// 接受元素和容器
function render(el, root) {
  // 存储下一个要执行的节点
  nextWorkflow = {
    dom: root,
    props: {
      children: [el],
    },
  }

  //   // 处理children
  //   const children = el.props.children
  //   children.forEach(child => {
  //     // 递归 元素和容器
  //     render(child, dom)
  //   })

  //   root.append(dom)
}

// 3.任务执行, 参数是一个时间戳 由api返回
function workflow(time) {
  // 1. 执行工作 在空闲时间进行渲染
  let hasIdleTime = true
  //   有空闲时间 并且有待执行节点
  while (hasIdleTime && nextWorkflow) {
    performWorkOfUnit(nextWorkflow)
    // 当空闲时间大于1时，继续执行
    hasIdleTime = time.timeRemaining() >= 1
  }

  //   空闲时间结束，继续执行
//   performWorkOfUnit(workflow)
}

// fiber 函数 核心api 传入一个回调
requestIdleCallback(workflow)

const React = {
  createElement,
  render,
}
export default React
