import { Alert, Typography } from 'antd'

export default function NestedChildB() {
  return (
    <>
      <Alert message="子路由 B" description="路径为 /nested/b。" type="success" showIcon />
      <Typography.Paragraph style={{ marginTop: 16 }}>
        父子路由常用于模块内 Tab、分步表单或带侧边子导航的页面。
      </Typography.Paragraph>
    </>
  )
}
