
import React from './core/React.js';




// function component
function App() {
    // 声明函数
    function click(event){
        console.log(event);
    }
    return <div>hh <App2 count="1"></App2><button onClick={click}>aaa</button> </div>
}

function App2({count}) {
    return <div>App2{count}</div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App