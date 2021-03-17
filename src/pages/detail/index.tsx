import { SearchStorages } from '@/network/modules/storage'
import { Input, Button } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import { BehaviorSubject, from, Observable, of, Subscriber } from 'rxjs'
import {
  debounceTime,
  delay,
  scan,
  switchMap,
  //concatAll, map, mergeAll, mergeMap, switchAll,
} from 'rxjs/operators'
import "./com"

const getData = (param: number) => {
  return of(`return: ${param}`).pipe(delay(Math.random() * 1000))
}

let sub$ = new Observable((subscribe) => {
  from(SearchStorages('广东')).subscribe((res) => {
    subscribe.next(res.data)
    subscribe.complete()
  })
})

// sub$.subscribe((res) => {
//   console.log(res, 'res')
// })

from([1, 2, 3, 4, 5]).pipe(switchMap((v) => getData(v)))

const source$ = new BehaviorSubject<number>(1)

const sourceResult = source$.pipe(
  debounceTime(200),
  scan((acc, value) => {
    const res = acc + 1
    console.log(res, value)
    return res
  })
)

function Detail() {
  // console.log('name, detail')
  const [myName, setMyName] = useState('')
  const [myClass, setMyClass] = useState('')
  // useEffect(() => {
  //   console.log('hello: ', myName)
  //   return () => {}
  // }, [myName])

  useEffect(() => {
    const subscription = sourceResult.subscribe((res) => {
      console.log(res, ' res')
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [sourceResult])

  const changeMyName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMyName(e.target.value)
  }

  const changeMyClass: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMyClass(e.target.value)
  }

  const clickHandle = (e) => {
    source$.next(e)
  }

  return (
    <div>
      <h2>detail page</h2>
      <div className='btn' id='id'>ID - BTUTTON</div>
      <Input
        value={myName}
        placeholder='你的姓名'
        onChange={changeMyName}
      ></Input>
      <Input
        value={myClass}
        placeholder='你的班级'
        onChange={changeMyClass}
      ></Input>
      <Button onClick={clickHandle}>点击这里，增加</Button>
    </div>
  )
}

export default memo(Detail)
