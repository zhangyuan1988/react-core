
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
  return {
    type,
    props: {
      ...props,
      // 处理字符串和对象的形式
      children: children.map(child => {

        // 检查节点

        // 是字符串 在这里处理，不是字符串 render函数处理
        // 还要处理数字的情况
        return typeof child === "string" || typeof child === "number" ? createTextNode(child) : child
      })
    },
  }
}

// 创建dom
function createDom(fiber) {
  return fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
}

// 将dom 和props传入
// 处理更新，删除和新增
function updateProps(dom, nextProps, prevProps) {
  // 循环处理所有的props 多个属性的情况 每个属性依此添加 如class 和 id

  // 1.旧的有 新的没有 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== "children") {
      // 检测新的属性 是否在 旧的属性中
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })

  // 2.新的有 旧的没有 新增

  // 3.新的有 旧的也有 更新
  // 事件处理，需要处理props 因为都是通过属性传递的
  Object.keys(nextProps).forEach(key => {
    // 注意 children 不是元素属性 不在这里处理
    // 判断是不是on开头
    if (key !== "children") {
      // 判断新旧的属性值是否相同 不相同的情况下才需要更新
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          // 将dom进行监听
          const eventType = key.slice(2).toLowerCase()
          // 移除事件，将上一个props传出去
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

// 函数式的处理
function updateFunction(fiber) {

  // 这里初始化hooks
  stateHooks = [];
  stateHookIndex = 0;
  // 保存一下wipFiber
  // 这是当前的开始节点
  wipFiber = fiber
  // 将函数形式的组件，执行展开 返回的结构就是dom结构，作为dom的children
  const children = [fiber.type(fiber.props)]

  // 并且重新init
  reconcileChildren(fiber, children)

}

// 普通的处理
function updateHost(fiber) {
  // 处理元素 判断是不是有dom
  if (!fiber.dom) {
    // 没有dom
    // 创建一个,并且赋值给fiber
    const dom = (fiber.dom = createDom(fiber))

    // 将dom 进行渲染 父级进行后面插入
    // 统一提交 这里就不需要了
    // fiber.parent.dom.append(dom)

    updateProps(dom, fiber.props, {})
  }
  // 有dom 转为链表方式
  reconcileChildren(fiber, fiber.props.children)
}

// 1.工作流函数 接收一个参数
// 需要返回下一个要执行的节点 fiber->fiber
function performWorkOfUnit(fiber) {
  // 处理函数形式
  const isFunction = typeof fiber.type === "function"
  if (isFunction) {
    updateFunction(fiber)
  } else {
    updateHost(fiber)
  }

  //   有child, 先返回child
  if (fiber.child) {
    return fiber.child
  }

  //   其次返回自己的兄弟节点
  // if (fiber.sibling) {
  //   return fiber.sibling
  // }

  // 处理多级嵌套的情况
  let nextFiber = fiber
  while (nextFiber) {
    // 如果下一个兄弟节点存在，返回下一个兄弟节点
    if (nextFiber.sibling) return nextFiber.sibling
    // 如果下一个兄弟节点不存在，返回父级节点，继续向上查找 循环处理
    nextFiber = nextFiber.parent
  }

  // //   最后返回父级的兄弟节点
  // return fiber.parent?.sibling
}

// 2.将树转为链表 fiber -> fiber
function reconcileChildren(fiber, children) {
  // 这里直接将children传过来 统一各个函数，然后遍历
  // const children = fiber.props.children
  // 遍历所有的children

  // 原来的树
  let oldFiber = fiber.alternate?.child

  // 记录上一个节点
  let prev = null
  children.forEach((child, index) => {
    //   处理新的结构 ，结构中需要包含 父级，兄弟和旁系结构

    // 判断类型是否相同
    const isSameType = oldFiber && oldFiber.type === child.type

    let newFiber

    // 判断节点更新 节点相同
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber.dom,
        // 打上不同标签 并且把原来的fiber挂上
        alternate: oldFiber,
        effectTag: "update",
      }
    } else {
      // 如果child没有的情况下 不进行赋值操作
      // 类型不一样的情况
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          child: null,
          sibling: null,
          dom: null,
          effectTag: "placement",
        }
      }

      // 类型不一样时，就需要删除旧的
      if (oldFiber) {
        // 收集需要删除的项目
        deletions.push(oldFiber)
      }
    }

    // 如果有，需要将原来的元素对应
    // TODO: 这里不理解
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    // 第一个节点的孩子,直接插入
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 不是第一个节点，将上一个节点的兄弟指向当前节点
      prev.sibling = newFiber
    }

    // 将false放在中间时，上面的没有child，所以兄弟节点button没有被赋值
    // 这里进行赋值 忽略没有newFiber的项目
    if (newFiber) {
      // 更新上一个节点 时 更新false前面的那个 
      prev = newFiber
    }
  })

  // 删除之后 字节点被指向了兄弟节点，这里需要检测兄弟节点是否存在
  // if(oldFiber){
  //   deletions.push(oldFiber)
  // }
  // 多个字节点的情况 遍历
  while (oldFiber) {
    deletions.push(oldFiber)
    // 重新赋值 直到最后
    oldFiber = oldFiber.sibling
  }
}

// 声明根节点
let wipRoot = null
// 声明当前的节点
let currentRoot = null
let nextWorkflow = null
let wipFiber = null
let deletions = []
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
  wipRoot = nextWorkflow
}


// 更新节点

// 查找开始和结束点
// 1.开始是当前节点
// 结束是当处理到兄弟节点时
function update() {
  // 存储下一个当前的树
  // wipFiber是全局变量，当再次创建FunctionComponent函数时，会被赋值，这里用闭包保存一下 否则会被下一个覆盖
  // 放在函数中执行
  let currentFiber = wipFiber
  return () => {

    wipRoot = {
      // currentFiber就是当前的树，直接展开
      ...currentFiber,
      // 指针 重新指向
      alternate: currentFiber
    }
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   // 保存原来的树
    //   alternate: currentRoot,
    // }
    // 根节点
    nextWorkflow = wipRoot
  }
}


// 处理多个hook的情况使用数组保存
let stateHooks;
let stateHookIndex;
// 更新
function useState(initial) {
  // 存储下一个当前的树
  // wipFiber是全局变量，当再次创建FunctionComponent函数时，会被赋值，这里用闭包保存一下 否则会被下一个覆盖
  // 放在函数中执行
  let currentFiber = wipFiber
  // 先获取老的节点 取之前的节点 通过指针
  console.log(currentFiber.alternate?.stateHooks);
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex] || null;
  console.log(oldHook);
  // 存储当前的state 之前的值
  // 先取老的值 
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });

  // 执行完毕 置空
  stateHook.queue = []

  // 取完之后index++
  stateHookIndex++
  stateHooks.push(stateHook)

  // 将当前的fiber节点中存进hook
  currentFiber.stateHooks = stateHooks

  // 调用state进行更新 更新方法用以前的
  function setState(action) {
    // 调用action（是传递了的函数）并将之前的值传到action回调函数中；
    stateHook.queue.push(action);// 等于执行后的值 

    wipRoot = {
      // currentFiber就是当前的树，直接展开
      ...currentFiber,
      // 指针 重新指向
      alternate: currentFiber
    }
    // 根节点
    nextWorkflow = wipRoot
  }


  return [stateHook.state, setState]
}

// 创建统一提交函数
function commitRoot() {
  // 统一移除删除项目
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)

  // 统一提交的时候记录一下当前的树
  currentRoot = wipRoot
  // 统一提交后，清空
  wipRoot = null
  // 删除完成之后清空数组
  deletions = []
}

// 移除节点
function commitDeletion(fiber) {
  // 有dom时 时普通节点，没有就是fun
  if (fiber.dom) {
    // 查找节点 有可能上级没有节点，就循环往上走 直到找到
    let fiberParent = fiber.parent

    // 当前节点（函数情况下有可能没有dom）没有dom时，向上寻找
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    // 循环处理
    // function component 的dom存在于child中
    commitDeletion(fiber.child)
  }
}

// 递归提交
function commitWork(fiber) {
  // 没有元素终止
  if (!fiber) return
  let fiberParent = fiber.parent

  // 当前节点（函数情况下有可能没有dom）没有dom时，向上寻找
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  // 根据不同标签进行不同操作
  if (fiber.effectTag === "update") {
    // 更新只做props的更新  把参数传进去
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    // 直到查找到有dom的父级节点，在进行渲染
    // 这里是新建
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }

  // 根节点的child为主节点的parent是 根节点 开始提交 父级节点
  // fiber.parent.dom.append(fiber.dom)
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

    // wipRoot是当前操作的节点
    if (wipRoot?.sibling?.type === nextWorkflow?.type) {
      // 当前和下一个相同 需要置空跳出循环
      // 查看当前节点
      // console.log(wipRoot, nextWorkflow);
      nextWorkflow = undefined
    }

    // 当空闲时间大于1时，继续执行
    hasIdleTime = time.timeRemaining() >= 1
  }

  //   2.在这里统一提交
  // 下一个节点为空 并且有根节点，再统一提交
  if (!nextWorkflow && wipRoot) {
    // 根节点的child为主节点
    commitRoot()
  }

  //  循环执行,一有空闲时间和有待执行节点，继续执行while中的代码
  requestIdleCallback(workflow)
}

// fiber 函数 核心api 传入一个回调
requestIdleCallback(workflow)

const React = {
  createElement,
  render,
  useState,
  update,
}
export default React