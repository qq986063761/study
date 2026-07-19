import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb, Tabs, Typography } from 'antd'

const tabItems = [
  { key: '/nested', label: '嵌套首页' },
  { key: '/nested/a', label: '子路由 A' },
  { key: '/nested/b', label: '子路由 B' },
]

export default function NestedLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        父子路由演示
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        外层由全局布局渲染，本区域使用子路由 <code>&lt;Outlet /&gt;</code> 切换内容；下方 Tab
        与左侧菜单均可跳转同一组路径。
      </Typography.Paragraph>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/nested">嵌套路由</Link> },
          {
            title:
              path === '/nested'
                ? '首页'
                : path.endsWith('/a')
                  ? '子路由 A'
                  : path.endsWith('/b')
                    ? '子路由 B'
                    : path,
          },
        ]}
      />
      <Tabs
        activeKey={path === '/nested' ? '/nested' : path}
        items={tabItems}
        onChange={(key) => navigate(key)}
        style={{ marginBottom: 16 }}
      />
      <Outlet />
    </div>
  )
}
