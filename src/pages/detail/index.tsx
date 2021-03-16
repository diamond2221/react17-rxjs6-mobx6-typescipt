import { SearchStorages } from '@/network/modules/storage'
import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { from, Observable, of } from 'rxjs'
import {
  concatAll,
  delay,
  map,
  mergeAll,
  mergeMap,
  switchAll,
  switchMap,
} from 'rxjs/operators'

const getData = (param: number) => {
  console.log(param)
  return of(`return: ${param}`).pipe(delay(Math.random() * 1000))
}

let sub$ = new Observable((subscribe) => {
  from(SearchStorages('广东')).subscribe((res) => {
    subscribe.next(res.data)
    subscribe.complete()
  })
})

// console.log('before:  res')
sub$.subscribe((res) => {
  console.log(res, 'res')
})
// console.log('after:  res')

from([1, 2, 3, 4, 5])
  .pipe(switchMap((v) => getData(v)))
  .subscribe((res) => {
    console.log(res)
  })

export function Detail() {
  // console.log('name, detail')
  const [myName, setMyName] = useState('')
  const [myClass, setMyClass] = useState('')
  useEffect(() => {
    console.log('hello: ', myName)
    return () => {}
  }, [myName])

  const changeMyName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMyName(e.target.value)
  }

  const changeMyClass: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMyClass(e.target.value)
  }

  return (
    <div>
      <h2>detail page</h2>
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
    </div>
  )
}

export default Detail
