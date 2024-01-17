
import React from './core/React.js';

import ReactDOM from './core/ReactDom.js';

import App from './App.jsx';

// 暂时不支持function component
ReactDOM.createRoot(document.querySelector('#root')).render(<App></App>)