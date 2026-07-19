import { Button, Card, Col, Descriptions, Row, Space, Statistic, Typography } from 'antd'
import { useAppStore } from '../store/useAppStore'

export default function StoreDemo() {
  const count = useAppStore((s) => s.count)
  const user = useAppStore((s) => s.user)
  const increment = useAppStore((s) => s.increment)
  const decrement = useAppStore((s) => s.decrement)
  const resetCount = useAppStore((s) => s.resetCount)
  const login = useAppStore((s) => s.login)
  const logout = useAppStore((s) => s.logout)

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        类 Vuex 状态管理（Zustand）
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        单一 store、通过 actions 修改状态；组件用选择器订阅，避免无关重渲染。复杂项目可拆多个
        slice 或配合 middleware（持久化、日志等）。
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="计数模块">
            <Statistic title="count" value={count} />
            <Space style={{ marginTop: 16 }} wrap>
              <Button type="primary" onClick={() => increment(1)}>
                +1
              </Button>
              <Button onClick={() => decrement(1)}>-1</Button>
              <Button danger onClick={resetCount}>
                重置
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="用户模块">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
              <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
            </Descriptions>
            <Space style={{ marginTop: 16 }} wrap>
              <Button type="primary" onClick={() => login('演示用户')}>
                登录
              </Button>
              <Button onClick={logout}>退出</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
