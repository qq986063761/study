import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from './routes.jsx'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
