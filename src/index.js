// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
import Module from '../modules/artifacts/fib.js';

const Instance = Module();

Instance.then(() => {
  console.log(Instance._fib(20));
});

// ReactDOM.render(<App />, document.getElementById('root'));
