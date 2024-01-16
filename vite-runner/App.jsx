
import React from './core/React.js';




// function component
function App1({count}) {
    return <div>hh {count} <App2 count={+count}></App2><div>aaa</div> </div>
}

function App2({count}) {
    return <div>App2{count}</div>
}

// vite 自动编译以下
const App = <div>11<App1 count="124"></App1> </div>
export default App