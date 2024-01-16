// 传统dom

// 创建dom容器
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#container').append(dom)

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

// 创建dom
function createDom(fiber) {
  return fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
}

// 将dom 和props传入
function updateProps(dom, fiber) {
  // 循环处理所有的props 多个属性的情况 每个属性依此添加 如class 和 id
  Object.keys(fiber.props).forEach(key => {
    // 注意 children 不是元素属性 不在这里处理
    if (key !== "children") {
      dom[key] = fiber.props[key]
    }
  })
}

// 1.工作流函数 接收一个参数
// 需要返回下一个要执行的节点 fiber->fiber
function performWorkOfUnit(fiber) {
  // 处理元素 判断是不是有dom
  if (!fiber.dom) {
    // 没有dom
    // 创建一个,并且赋值给fiber
    const dom = (fiber.dom = createDom(fiber))

    // 将dom 进行渲染 父级进行后面插入
    // 统一提交 这里就不需要了
    // fiber.parent.dom.append(dom)

    updateProps(dom, fiber)
  }

  // 有dom 转为链表方式
  initChildren(fiber)

  //   有child, 先返回child
  if (fiber.child) {
    return fiber.child
  }

  //   其次返回自己的兄弟节点
  if (fiber.sibling) {
    return fiber.sibling
  }

  //   最后返回父级的兄弟节点
  return fiber.parent?.sibling
}

// 2.将树转为链表 fiber -> fiber
function initChildren(fiber) {
  const children = fiber.props.children
  // 遍历所有的children
  // 记录上一个节点
  let prev = null
  children.forEach((child, index) => {
    //   处理新的结构 ，结构中需要包含 父级，兄弟和旁系结构
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    }

    // 第一个节点的孩子,直接插入
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 不是第一个节点，将上一个节点的兄弟指向当前节点
      prev.sibling = newFiber
    }

    // 更新上一个节点
    prev = newFiber
  })
}

// 声明根节点
let root = null
let nextWorkflow = null
// 创建渲染函数
// 接受元素和容器
function render(fiber, container) {
  // 存储下一个要执行的节点
  nextWorkflow = {
    dom: container,
    props: {
      children: [fiber],
    },
  }
  // console.log(nextWorkflow);
  // 根节点
  root = nextWorkflow
}

// 创建统一提交函数
function commitRoot(fiber) {
  commitWork(fiber)
  // 统一提交后，清空
  root = null
}

// 递归提交
function commitWork(fiber) {
  if (!fiber) return
  // 根节点的child为主节点的parent是 根节点 开始提交 父级节点
  fiber.parent.dom.append(fiber.dom)
  // 依次提交兄弟和孩子节点
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// 3.任务执行, 参数是一个时间戳 由api返回
function workflow(time) {
  // 1. 执行工作 在空闲时间进行渲染
  let hasIdleTime = true
  // console.log(time.timeRemaining())
  //   有空闲时间 并且有待执行节点
  while (hasIdleTime && nextWorkflow) {
    // 接收返回的下一个需要执行的节点
    nextWorkflow = performWorkOfUnit(nextWorkflow)
    // 当空闲时间大于1时，继续执行
    hasIdleTime = time.timeRemaining() >= 1
  }

  //   2.在这里统一提交
  // 下一个节点为空 并且有根节点，再统一提交
  if (!nextWorkflow&&root) {
    // 根节点的child为主节点
    console.log(root);
    commitRoot(root.child)
  }

  //  循环执行,一有空闲时间和有待执行节点，继续执行while中的代码
  requestIdleCallback(workflow)
}

// fiber 函数 核心api 传入一个回调
requestIdleCallback(workflow)

const React = {
  createElement,
  render,
}
export default React
