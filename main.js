

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
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }

}

// 创建元素结构
// 剩余参数 改成数组形式
function createElement(type, props, ...children) {
    console.log(children);
    return {
        type,
        props: {
            ...props,
            // 处理字符串和对象的形式
            children: children.map(child => {
                // 是字符串 在这里处理，不是字符串 render函数处理
                return typeof child === 'string' ? createTextNode(child) : child
            })
        }
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


// 创建渲染函数
// 接受元素和容器
function render(el, root) {
    // 判断是不是node
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

    // 循环处理所有的props 多个属性的情况 每个属性依此添加 如class 和 id
    Object.keys(el.props).forEach(key => {
        // 注意 children 不是元素属性 不在这里处理
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })


    // 处理children
    const children = el.props.children
    children.forEach((child) => {
        // 递归 元素和容器
        render(child, dom)
    })

    root.append(dom)
}


// 创建一个元素
// 优化
// const textEl = createTextNode('Hello,world')
// const App = createElement('div', { id: 'app', className: 'app' }, textEl)
// const App = createElement('div', { id: 'app', className: 'app' }, '1', '2')
// console.log(App);
// render(App, document.querySelector("#root"))



// 创建react对象

const ReactDOM = {
    createRoot(container) {
        return {
            render(App) {
                render(App, container)
            }
        }
    }
}

const App = createElement('div', { id: 'app', className: 'app' }, '1', '2')
ReactDOM.createRoot(document.querySelector('#root')).render(App)