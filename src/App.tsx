import React, { Component } from 'react'
import DefaultLayout from '@/layouts/index'
import './App.less'
import { RouteComponentProps, withRouter } from 'react-router'

export interface AppProps extends RouteComponentProps {}
export class App extends Component<Readonly<AppProps>> {
  render() {
    return (
      <div className='App'>
        <DefaultLayout {...this.props}></DefaultLayout>
      </div>
    )
  }
}

export default withRouter(App as any)
