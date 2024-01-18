
import React from './core/React.js';



let count = 0;

// function component
function App() {
    // 声明函数

    function click(event){
        count++
        React.update()
        console.log(event);
    }
    return <div>hh <App2></App2>{count}<button onClick={click}>aaa</button> </div>
}

function App2() {
    return <div>App</div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App