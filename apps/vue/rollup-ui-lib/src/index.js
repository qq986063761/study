import './css/base.css'
import Button from './components/button/index.js'
import Table from './components/table/index.js'

const components = [
  Button,
  Table
]

export default {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

export {
  Button,
  Table
}