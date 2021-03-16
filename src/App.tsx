import React from 'react'
import { renderRoutes, RouteConfig } from 'react-router-config'
import './App.css'
import Detail from './pages/detail'
import Home from './pages/home/index'

const routes: RouteConfig[] = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/detail',
    component: Detail
  }
]

function App(props: any) {
  // const route = renderRoutes(routes)
  return <div className='App'>{renderRoutes(routes)}</div>
}

export default App
