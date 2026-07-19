import { Alert, Typography } from 'antd'

export default function NestedChildA() {
  return (
    <>
      <Alert
        message="子路由 A"
        description="路径为 /nested/a，与 B 同级，共享同一父布局中的 Outlet 区域。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Typography.Paragraph>可在地址栏直接输入路径验证深链是否可用。</Typography.Paragraph>
    </>
  )
}
