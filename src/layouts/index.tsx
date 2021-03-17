import Detail from '@/pages/detail'
import Home from '@/pages/home/index'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { renderRoutes, RouteConfig } from 'react-router-config'
import { Link, RouteComponentProps } from 'react-router-dom'
import { BehaviorSubject } from 'rxjs'
import { find } from 'rxjs/operators'
import siderLogoSm from '../assets/images/sider-logo-sm.png'
import siderLogo from '../assets/images/sider-logo.png'
import './index.less'

const { Header, Sider, Content } = Layout

const routes: RouteConfig[] = [
  {
    path: '/home',
    component: Home,
    meta: {
      icon: UserOutlined,
      title: 'Home',
    },
  },
  {
    path: '/detail',
    component: Detail,
    meta: {
      hidden: true,
      title: 'Detail',
      activeMenu: '/home',
    },
  },
  {
    path: '/work',
    component: Home,
    meta: {
      icon: UserOutlined,
      title: 'Work',
    },
  },
]

const findRoute = (pathname: string, routes: RouteConfig[]) => {
  let result = ''
  routes.forEach((v) => {
    if (v.path === pathname) {
      if (v.meta?.hidden && v.meta?.activeMenu) {
        return (result = v.meta.activeMenu)
      }
    }
  })
  return result || pathname
}

export function DefaultLayout(props: RouteComponentProps) {
  const [collapsed, setCollapsed] = useState(false)

  const [defaultSelectedKeys] = useState([
    findRoute(props.location.pathname, routes),
  ])
  const [selectedKeys, sefSelectKeys] = useState(defaultSelectedKeys)

  useEffect(() => {
    sefSelectKeys([findRoute(props.location.pathname, routes)])
  }, [props.location])

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <Layout
      className={classnames(
        'app-layout-wrapper',
        collapsed ? 'is-collapsed' : ''
      )}
    >
      <Sider
        className='site-layout-sider fixed'
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className='logo'>
          <img src={collapsed ? siderLogoSm : siderLogo} alt='Diamond 社交' />
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={defaultSelectedKeys}
          selectedKeys={selectedKeys}
        >
          {routes
            .filter((v) => !v?.meta?.hidden)
            .map((route) => {
              return (
                <Menu.Item
                  key={route.path as string}
                  icon={route.meta && route.meta.icon && <route.meta.icon />}
                >
                  <Link to={route.path as string}>{route.meta.title}</Link>
                </Menu.Item>
              )
            })}
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header
          className='site-layout-background fixed site-layout-header'
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              className='trigger'
              onClick={toggleCollapse}
            ></MenuUnfoldOutlined>
          ) : (
            <MenuFoldOutlined
              className='trigger'
              onClick={toggleCollapse}
            ></MenuFoldOutlined>
          )}
        </Header>
        <Content className='site-layout-background site-layout-content'>
          {renderRoutes(routes)}
        </Content>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout
