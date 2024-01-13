
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

export default ReactDOM