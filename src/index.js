import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}><App /></BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();

let clickedElemPath = [];

document.addEventListener('focus', e => {
    if (e.target !== document && clickedElemPath.indexOf(e.target) === -1) e.target.classList.add('focused')
}, true)

document.addEventListener('blur', e => {
    if (e.target !== document) e.target.classList.remove('focused')
}, true)

document.addEventListener('mousedown', e => {
    clickedElemPath = e.path || [];
    if (e.target.classList.contains('focused')) e.target.classList.remove('focused')
})

// For labeled elements in case of click on label
document.addEventListener('click', e => {
    if (e.target.classList.contains('focused')) e.target.classList.remove('focused')
})

document.addEventListener('mouseup', () => {
    clickedElemPath = [];
})

window.addEventListener('resize', () => document.getElementById('root').style.height = window.innerHeight + 'px')
