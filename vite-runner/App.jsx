
import React from './core/React.js';

let countFoo = 0;

function Foo() {
    console.log('Foo');
    // 这里使用 返回的函数 需要在顶部声明
    const update = React.update()
    function handleFooClick() {
        countFoo++
        // React.update()

        update()
    }
    return (
        <div>
            <h1>Foo</h1>
            {countFoo}
            <button onClick={handleFooClick}>click</button>
        </div>
    )

}



let countBar = 0;

function Bar() {
    console.log('Bar');
    // 这里使用 返回的函数
    const update = React.update()
    function handleBarClick() {
        countBar++
        update()
    }
    return (
        <div>
            <h1>Bar</h1>
            {countBar}
            <button onClick={handleBarClick}>click</button>
        </div>
    )

}

let countRoot = 0;

// function component
function App() {
    // 声明函数
    console.log("App");
    function handleCountRoot() {
        countRoot++
        React.update()
    }

    return <div>
        count: {countRoot}
        <button onClick={handleCountRoot}>aaa</button>
        <Foo></Foo>
        <Bar></Bar>
    </div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App