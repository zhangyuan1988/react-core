
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

        return () => {
            console.log('clean up 0');
        }
    }, [])

    // clean up 在调用useEffect 之前调用 ，当deps为空时不会调用返回的cleanup
    // 副作用函数 有更新时执行
    React.useEffect(() => {
        console.log('update', count);

        // 情况副作用
        return () => {
            console.log('clean up 1');
        }
    }, [count])
    
    React.useEffect(() => {
        console.log('update', count);

        // 情况副作用
        return () => {
            console.log('clean up 2');
        }
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