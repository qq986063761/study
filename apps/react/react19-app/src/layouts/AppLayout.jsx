import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Layout, Menu, theme } from 'antd'
import {
  ApiOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAppStore } from '../store/useAppStore'

const { Header, Sider, Content } = Layout

const menuItems = [
  {
    key: '/react-api',
    icon: <ApiOutlined />,
    label: <Link to="/react-api">React API 演示</Link>,
  },
  {
    key: '/store',
    icon: <DatabaseOutlined />,
    label: <Link to="/store">状态管理 (类 Vuex)</Link>,
  },
  {
    key: 'nested-group',
    icon: <BranchesOutlined />,
    label: '父子路由',
    children: [
      { key: '/nested', label: <Link to="/nested">嵌套首页</Link> },
      { key: '/nested/a', label: <Link to="/nested/a">子路由 A</Link> },
      { key: '/nested/b', label: <Link to="/nested/b">子路由 B</Link> },
    ],
  },
]

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const storeCount = useAppStore((s) => s.count)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const selectedKeys = useMemo(() => {
    const p = location.pathname
    if (p.startsWith('/nested')) return [p === '/nested' ? '/nested' : p]
    return [p]
  }, [location.pathname])

  const [menuOpenKeys, setMenuOpenKeys] = useState(() =>
    typeof window !== 'undefined' && window.location.pathname.startsWith('/nested')
      ? ['nested-group']
      : [],
  )

  useEffect(() => {
    if (location.pathname.startsWith('/nested')) {
      setMenuOpenKeys((keys) => (keys.includes('nested-group') ? keys : [...keys, 'nested-group']))
    }
  }, [location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            borderRadius: borderRadiusLG,
            background: 'rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: collapsed ? 12 : 14,
            padding: '0 8px',
            textAlign: 'center',
          }}
        >
          {collapsed ? 'R19' : 'React 19 演示'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={menuOpenKeys}
          onOpenChange={setMenuOpenKeys}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Ant Design 布局</span>
          <span style={{ color: '#888', fontSize: 13 }}>当前路径：{location.pathname}</span>
          <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
            全局 store.count：{storeCount}
          </span>
        </Header>
        <Content style={{ margin: '16px 16px 24px', overflow: 'auto' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
