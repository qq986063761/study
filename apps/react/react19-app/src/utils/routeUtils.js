// 路由工具函数 - 用于大型项目的路由管理
import React from 'react'

/**
 * 根据路由配置生成面包屑导航
 * @param {Array} routes - 路由配置数组
 * @param {string} currentPath - 当前路径
 * @returns {Array} 面包屑数组
 */
export function generateBreadcrumbs(routes, currentPath) {
  const breadcrumbs = []
  
  function findRoute(routes, path, parentPath = '') {
    for (const route of routes) {
      const fullPath = parentPath + route.path
      
      if (fullPath === path) {
        breadcrumbs.push({
          path: fullPath,
          title: route.meta?.title || route.path,
          description: route.meta?.description
        })
        return true
      }
      
      if (route.children) {
        if (findRoute(route.children, path, fullPath)) {
          breadcrumbs.unshift({
            path: fullPath,
            title: route.meta?.title || route.path,
            description: route.meta?.description
          })
          return true
        }
      }
    }
    return false
  }
  
  findRoute(routes, currentPath)
  return breadcrumbs
}

/**
 * 根据权限过滤路由
 * @param {Array} routes - 路由配置数组
 * @param {Array} userPermissions - 用户权限数组
 * @returns {Array} 过滤后的路由数组
 */
export function filterRoutesByPermission(routes, userPermissions) {
  return routes.filter(route => {
    // 如果没有权限要求，则显示
    if (!route.meta?.permissions) {
      return true
    }
    
    // 检查用户是否有所需权限
    const hasPermission = route.meta.permissions.some(permission => 
      userPermissions.includes(permission)
    )
    
    // 如果有子路由，递归过滤
    if (route.children) {
      route.children = filterRoutesByPermission(route.children, userPermissions)
    }
    
    return hasPermission
  })
}

/**
 * 生成侧边栏菜单配置
 * @param {Array} routes - 路由配置数组
 * @param {Array} userPermissions - 用户权限数组
 * @returns {Array} 菜单配置数组
 */
export function generateMenuConfig(routes, userPermissions = []) {
  const filteredRoutes = filterRoutesByPermission(routes, userPermissions)
  
  return filteredRoutes
    .filter(route => route.meta?.showInMenu !== false) // 默认显示在菜单中
    .map(route => ({
      id: route.path,
      label: route.meta?.title || route.path,
      description: route.meta?.description || '',
      path: route.path,
      icon: route.meta?.icon,
      children: route.children ? generateMenuConfig(route.children, userPermissions) : undefined
    }))
}

/**
 * 路由懒加载工具
 * @param {Function} importFunc - 动态导入函数
 * @returns {React.Component} 懒加载组件
 */
export function lazyLoad(importFunc) {
  return React.lazy(importFunc)
}

/**
 * 路由守卫 - 检查用户是否已登录
 * @param {Object} user - 用户信息
 * @returns {boolean} 是否允许访问
 */
export function authGuard(user) {
  return !!user?.isAuthenticated
}

/**
 * 路由守卫 - 检查用户权限
 * @param {Array} requiredPermissions - 所需权限
 * @param {Array} userPermissions - 用户权限
 * @returns {boolean} 是否允许访问
 */
export function permissionGuard(requiredPermissions, userPermissions) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  )
}
