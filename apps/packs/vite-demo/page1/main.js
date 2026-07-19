import './base.scss'
import javascriptLogo from '/page1/assets/javascript.svg'
// 别名
import { setupCounter } from 'p1/counter.js'

// 是否是开发环境
console.log('import.meta.env.DEV', import.meta.env.DEV)

// 全局变量使用
console.log('define __ROOT__', __ROOT__)
console.log('define __APP__', __APP__)

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/` + __ROOT__ + `/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
