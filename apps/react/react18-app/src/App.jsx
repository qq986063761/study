import './App.css'
import { router, getRouter } from './router/index'
import { Button } from 'antd'

function App(params) {
  console.log('App', params)

  const changeView = (event, path) => {
    router.push(path, { init: true })
  }

  return <>
    <nav>
      <Button 
        type="primary" 
        onClick={event => changeView(event, '/')}>
        Home
      </Button>
      <Button
        type="danger"
        onClick={event => changeView(event, '/about')}>
        About
      </Button>
      <Button
        danger
        onClick={event => changeView(event, '/other')}>
        Other
      </Button>
    </nav>
    <div className="app-children">
      { getRouter() }
    </div>
  </>
}

export default App
