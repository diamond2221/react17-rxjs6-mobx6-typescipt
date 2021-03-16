import { SearchStorages } from '@/network/modules/storage'
import { FetchTodos, GetTodo } from '@/network/modules/todo'
import { Button, Input, Card, Row, Col } from 'antd'
import { inject, observer } from 'mobx-react'
import React, { memo, useState, useEffect } from 'react'
import * as Rx from 'rxjs'
import * as operators from 'rxjs/operators'

const ShowName = memo(
  function (props: { userName: string }) {
    return <h2>当前用户名： {props.userName}</h2>
  },
  (prevProps, nextProps) => {
    return prevProps.userName === nextProps.userName
  }
)

const searchSubject = new Rx.BehaviorSubject('')
let searchResultObservable = searchSubject.pipe(
  operators.filter((v) => v.length >= 1),
  operators.debounceTime(300),
  operators.distinctUntilChanged(),
  operators.switchMap((address) => Rx.from(SearchStorages(address)))
)

const Home = (props) => {
  const [userName, setUserName] = useState<string>(props.accountStore.userName)
  const [id, setId] = useState('')
  useEffect(() => {
    searchSubject.next(userName)
    let subscription = searchResultObservable.subscribe((res) => {
      console.log(res.data)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [userName])

  const changeUserName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setUserName(value)
  }
  const changeId: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setId(value)
  }
  const changeStoreUserName = () => {
    Rx.from(FetchTodos())
      .pipe(
        operators.switchMap((res) => {
          return res.data
        }),
        operators.pluck('id'),
        operators.switchMap((id) => {
          return GetTodo(id)
        })
      )
      .subscribe(
        (res) => {
          console.log('subscribe, success', res)
        },
        (err) => {
          console.log(err, 'subscribe, error')
        }
      )
    props.accountStore.SET_USERNAME(userName)
  }

  return (
    <div>
      <Row gutter={20}>
        <Col span={6} offset='6'>
          <Card>
            <Input
              type='text'
              value={userName}
              placeholder='输入用户名，自动修改'
              onChange={changeUserName}
            />
            <Input
              type='text'
              value={id}
              placeholder='输入你的Id'
              onChange={changeId}
            />

            <h2>更新后的用户名：{userName}</h2>
            <ShowName userName={props.accountStore.userName}></ShowName>
            <Button onClick={changeStoreUserName}>修改用户名</Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(
  inject('accountStore')(observer(Home)),
  (prevprops, nextprops) => {
    return false
  }
)
