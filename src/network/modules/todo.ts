import { request } from '../request'
interface Todo {
    id: number;
    addUser: number;
    name: string;
    desc: string;
    addTime: string;
    expirTime: string;
    upTime: string;
    status: number;
}

export function FetchTodos() {
    return request<{ id: number }[]>({
        url: '/TODO/user',
    })
}

export function GetTodo(id: number) {
    return request<Todo>({
        url: `/TODO/user/${id}`
    })
}
