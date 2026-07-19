import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  createContext,
} from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd'

const ThemeCtx = createContext(null)

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const value = useMemo(
    () => ({
      dark,
      toggle: () => setDark((d) => !d),
    }),
    [dark],
  )
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

function useTheme() {
  const v = useContext(ThemeCtx)
  if (!v) throw new Error('ThemeProvider missing')
  return v
}

function useCounter(initial = 0) {
  const [n, setN] = useState(initial)
  const inc = useCallback(() => setN((x) => x + 1), [])
  const dec = useCallback(() => setN((x) => x - 1), [])
  const reset = useCallback(() => setN(initial), [initial])
  return { n, inc, dec, reset }
}

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'inc':
      return { value: state.value + 1 }
    case 'dec':
      return { value: state.value - 1 }
    case 'reset':
      return { value: 0 }
    default:
      return state
  }
}

function TabStateAndEffects() {
  const [text, setText] = useState('')
  const doubled = useMemo(() => text.length * 2, [text])
  useEffect(() => {
    document.title = `Demo | ${text.length} 字符`
  }, [text])

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card size="small" title="useState + useMemo + useEffect">
        <Input
          placeholder="输入文字"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ maxWidth: 360 }}
        />
        <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
          字符数：{text.length}；useMemo 双倍：{doubled}；标题会随长度同步（useEffect）。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}

function TabCallbackRefReducer() {
  const { n, inc, dec, reset } = useCounter(0)
  const [reducerState, dispatch] = useReducer(counterReducer, { value: 0 })
  const ref = useRef(null)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card size="small" title="useCallback + 自定义 Hook（useCounter）">
          <Statistic title="count" value={n} />
          <Space style={{ marginTop: 12 }}>
            <Button onClick={inc}>+1</Button>
            <Button onClick={dec}>-1</Button>
            <Button onClick={reset}>重置</Button>
          </Space>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card size="small" title="useReducer">
          <Statistic title="reducer.value" value={reducerState.value} />
          <Space style={{ marginTop: 12 }}>
            <Button onClick={() => dispatch({ type: 'inc' })}>+1</Button>
            <Button onClick={() => dispatch({ type: 'dec' })}>-1</Button>
            <Button onClick={() => dispatch({ type: 'reset' })}>重置</Button>
          </Space>
        </Card>
      </Col>
      <Col span={24}>
        <Card size="small" title="useRef（聚焦输入框）">
          <Space wrap>
            <Input ref={ref} placeholder="点按钮聚焦" style={{ width: 220 }} />
            <Button type="primary" onClick={() => ref.current?.focus()}>
              focus()
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

function TabContext() {
  return (
    <ThemeProvider>
      <ThemeCard />
    </ThemeProvider>
  )
}

function ThemeCard() {
  const { dark, toggle } = useTheme()
  return (
    <Card
      size="small"
      title="createContext + useContext"
      style={{
        background: dark ? '#141414' : undefined,
        color: dark ? 'rgba(255,255,255,0.85)' : undefined,
      }}
    >
      <Space>
        <Tag color={dark ? 'blue' : 'default'}>{dark ? '深色' : '浅色'}</Tag>
        <Button onClick={toggle}>切换</Button>
      </Space>
    </Card>
  )
}

const tabItems = [
  {
    key: '1',
    label: '状态与副作用',
    children: <TabStateAndEffects />,
  },
  {
    key: '2',
    label: 'Callback / Ref / Reducer',
    children: <TabCallbackRefReducer />,
  },
  {
    key: '3',
    label: 'Context',
    children: <TabContext />,
  },
]

export default function ReactAPIDemo() {
  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        React API 演示
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        覆盖常用 Hooks 与 Context；与「状态管理」页的 Zustand store 对照学习。
      </Typography.Paragraph>
      <Divider style={{ margin: '12px 0' }} />
      <Tabs items={tabItems} />
    </div>
  )
}
