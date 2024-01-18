
import React from './core/React.js';



let count = 0;

let showBar = false

// function component
function App() {
    // 声明函数

    const bar = <div>bar</div>



    function handleShowBar() {
        showBar = !showBar;
        React.update()
    }

    return <div>
        counter
        {showBar && bar}
        <button onClick={handleShowBar}>aaa</button>

    </div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App