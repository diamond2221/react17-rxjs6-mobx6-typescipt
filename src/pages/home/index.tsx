import { GetStorage, SearchStorages } from '@/network/modules/storage'
import { FetchTodos, GetTodo } from '@/network/modules/todo'
import { Warehourse } from '@/types/warehourse'
import { Button, Input, Card, Row, Col, Table, Space } from 'antd'
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

const detailSubject$ = new Rx.BehaviorSubject(null as number | null)
let detailObservable = detailSubject$
  .pipe(
    operators.filter(id => typeof id === 'number'),
    operators.switchMap(id => Rx.from(GetStorage(id as number)))
  )

const Home = (props) => {
  const [userName, setUserName] = useState<string>(props.accountStore.userName)
  const [tableData, setTableData] = useState([] as Warehourse[])
  const [id, setId] = useState('')
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    const detailSubscription  = detailObservable.subscribe(res => {
      console.log(res, 'detail')
    })
    return () => detailSubscription.unsubscribe()
  }, [detailObservable])
  const lookDetail = (data: Warehourse) => {
    detailSubject$.next(data.id)
  }

  const columns = [
    {
      dataIndex: 'id',
      title: 'id',
    },
    {
      dataIndex: 'storageNum',
      title: 'storageNum',
    },
    {
      dataIndex: 'province',
      title: 'province',
    },
    {
      dataIndex: 'city',
      title: 'city',
    },
    {
      dataIndex: 'area',
      title: 'area',
    },
    {
      dataIndex: 'address',
      title: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        return (
          <Space size='middle'>
            <Button type='link' onClick={lookDetail.bind(null, record)}>
              查看详情
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    searchSubject.next(userName)
    let subscription = searchResultObservable.subscribe(
      (res) => {
        setTableData(res.data.rows)
        setTableLoading(false)
      },
      () => setTableLoading(false)
    )
    return () => {
      subscription.unsubscribe()
    }
  }, [userName])

  const changeUserName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setUserName(value)
    setTableLoading(true)
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
        <Col span={24}>
          <Card>
            <Row gutter={20}>
              <Col span={6}>
                <Input
                  type='text'
                  value={userName}
                  placeholder='输入用户名，自动修改'
                  onChange={changeUserName}
                />
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={6}>
                <Input
                  type='text'
                  value={id}
                  placeholder='输入你的Id'
                  onChange={changeId}
                />
              </Col>
            </Row>

            <h2>更新后的用户名：{userName}</h2>
            <ShowName userName={props.accountStore.userName}></ShowName>
            <Button onClick={changeStoreUserName}>修改用户名</Button>
            <Table
              loading={tableLoading}
              columns={columns}
              dataSource={tableData}
              rowKey='id'
            />
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
