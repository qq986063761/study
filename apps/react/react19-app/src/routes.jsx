import { Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import ReactAPIDemo from './pages/ReactAPIDemo'
import StoreDemo from './pages/StoreDemo'
import NestedLayout from './pages/nested/NestedLayout'
import NestedHome from './pages/nested/NestedHome'
import NestedChildA from './pages/nested/NestedChildA'
import NestedChildB from './pages/nested/NestedChildB'

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/react-api" replace /> },
      {
        path: 'react-api',
        element: <ReactAPIDemo />,
      },
      {
        path: 'store',
        element: <StoreDemo />,
      },
      {
        path: 'nested',
        element: <NestedLayout />,
        children: [
          { index: true, element: <NestedHome /> },
          { path: 'a', element: <NestedChildA /> },
          { path: 'b', element: <NestedChildB /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/react-api" replace />,
  },
]

export default routes
