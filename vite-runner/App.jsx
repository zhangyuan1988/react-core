
import React from './core/React.js';



let count = 0;

let showBar = false

// function component
function App() {
    // 声明函数

    const bar = <div>bar</div>
    // const Foo = () => {
    //     return <div>foo
    //         <div>child</div>
    //     </div>
    // }

    const foo = (
        <div>foo
            <div>child</div>
            <div>child</div>
            <div>child</div>
        </div>
    )

    function handleShowBar() {
        showBar = !showBar;
        React.update()
    }
    function click(event) {
        count++
        React.update()
        console.log(event);
    }
    return <div>

        <button onClick={handleShowBar}>aaa</button>
        <div>
            {showBar ? bar : foo}
        </div>
    </div>
}

function App2() {
    return <div>App</div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App