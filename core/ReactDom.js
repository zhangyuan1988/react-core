
import React from './React.js'

// 创建react对象
const ReactDOM = {
    createRoot(container) {
        return {
            render(App) {
                React.render(App, container)
            }
        }
    }
}

export default ReactDOM