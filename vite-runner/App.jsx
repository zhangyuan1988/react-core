
import React from './core/React.js';



function Bar() {
    console.log('Bar');
    // 这里使用 返回的函数
    const [count, setCount] = React.useState(10)
    const [bar, setBar] = React.useState('bar')
    function handleBarClick() {
        setCount((c) => c + 1)
        setBar('babar' + 1)
    }

    // 副作用函数 首次执行
    React.useEffect(() => {
        console.log('init');
    }, [])

    // 副作用函数 有更新时执行
    React.useEffect(() => {
        console.log('update', count);
    }, [count])

    return (
        <div>
            <h1>Bar</h1>
            <div>{count}</div>
            <div>{bar}</div>
            <button onClick={handleBarClick}>click</button>
        </div>
    )

}

// function component
function App() {
    // 声明函数

    return <div>
        <Bar></Bar>
    </div>
}

// vite 自动编译以下
// const App = <div>11<App1 count="124"></App1> </div>
export default App