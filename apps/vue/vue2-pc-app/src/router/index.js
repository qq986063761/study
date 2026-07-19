import Vue from 'vue'
import VueRouter from 'vue-router'
import comment from '@/views/compDemo/comment'
import ssBar from '@/views/compDemo/ssBar'
import scaleTool from '@/views/compDemo/scaleTool/scaleTool'
import pretext from '@/views/compDemo/pretext'
import boneyard from '@/views/compDemo/boneyard'
import drClick from '@/views/directiveDemo/drClick'
import drag from '@/views/directiveDemo/drag'
import scrollActiveItem from '@/views/directiveDemo/scrollActiveItem'
import input from '@/views/directiveDemo/input'
import kbSelect from '@/views/directiveDemo/kbSelect'
import carousel from '@/views/demo/carousel'
import agGrid from '@/views/demo/agGrid'
import template from '@/views/api/template'
import component from '@/views/api/component'
import mixin from '@/views/api/mixin'
import animate from '@/views/api/animate'
import render from '@/views/api/render'
import routerStore from '@/views/api/routerStore'
import routerStoreChild from '@/views/api/routerStoreChild'
import routerStoreChild2 from '@/views/api/routerStoreChild2'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    redirect: '/apiTemplate'
  },
  // api
  {
    path: '/apiTemplate',
    name: 'apiTemplate',
    component: template
  },
  {
    path: '/apiComponent',
    name: 'apiComponent',
    component: component
  },
  {
    path: '/apiMixin',
    name: 'apiMixin',
    component: mixin
  },
  {
    path: '/apiAnimate',
    name: 'apiAnimate',
    component: animate
  },
  {
    path: '/apiRender',
    name: 'apiRender',
    component: render
  },
  {
    path: '/apiRouterStore',
    component: routerStore,
    children: [
      {
        path: 'child',
        name: 'apiRouterStoreChild',
        component: routerStoreChild
      },
      {
        // path 中可配置参数变量
        path: 'child2/:id',
        name: 'apiRouterStoreChild2',
        component: routerStoreChild2
      },
    ]
  },
  // 组件
  {
    path: '/comment',
    name: 'comment',
    component: comment
  },
  { 
    path: '/ssBar', 
    name: 'ssBar',
    component: ssBar
  },
  { 
    path: '/scaleTool', 
    name: 'scaleTool',
    component: scaleTool
  },
  {
    path: '/pretext',
    name: 'pretext',
    component: pretext
  },
  {
    path: '/boneyard',
    name: 'boneyard',
    component: boneyard
  },
  // 指令
  { 
    path: '/drClick', 
    name: 'drClick',
    component: drClick
  },
  { 
    path: '/drag', 
    name: 'drag',
    component: drag
  },
  { 
    path: '/scrollActiveItem', 
    name: 'scrollActiveItem',
    component: scrollActiveItem
  },
  { 
    path: '/inputDirective', 
    name: 'inputDirective',
    component: input
  },
  {
    path: '/kbSelect', 
    name: 'kbSelect',
    component: kbSelect
  },
  {
    path: '/carousel',
    name: 'carousel',
    component: carousel
  },
  {
    path: '/agGrid',
    name: 'agGrid',
    component: agGrid
  },
  // { 
  //   path: '*', 
  //   redirect: '/error'
  // }
]

const router = new VueRouter({
  routes
})

export default router
