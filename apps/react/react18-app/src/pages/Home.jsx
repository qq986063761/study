import './Home.css'
import { router, getRouter } from '../router'
import { Button } from 'antd'

function Home(params) {
  console.log('Home', params)

  const changeView = (event, path) => {
    router.push(path, { init: true })
  }

  return <div className="home-wrap">
    <h1>Home</h1>
    <nav>
      <Button 
        type="primary" 
        onClick={event => changeView(event, '/home/child1')}>
        HomeChild1
      </Button>
      <Button 
        type="danger"
        onClick={event => changeView(event, '/home/child2')}>
        HomeChild2
      </Button>
    </nav>
    <div className="home-children">
      {
        getRouter('Home')
      }
    </div>
  </div>
}

export default Home