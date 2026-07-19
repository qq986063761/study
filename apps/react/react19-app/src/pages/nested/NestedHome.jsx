import { Typography } from 'antd'

export default function NestedHome() {
  return (
    <Typography.Paragraph>
      当前为父级路径 <Typography.Text code>/nested</Typography.Text> 的默认子路由（index）。切换到 Tab
      「子路由 A / B」查看同级子页。
    </Typography.Paragraph>
  )
}
