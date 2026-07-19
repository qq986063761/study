export default defineNuxtRouteMiddleware((to, from) => {
  console.log('defineNuxtRouteMiddleware', to, from)
  // isAuthenticated() 是一个验证用户是否已经认证的示例方法
  return navigateTo('/frame')
})