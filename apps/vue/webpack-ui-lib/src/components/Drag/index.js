import Component from "./Drag"

Component.install = function(Vue) {
  Vue.component(Component.name, Component)
}

export default Component
