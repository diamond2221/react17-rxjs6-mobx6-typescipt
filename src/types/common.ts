export interface Response<T = any> {
    message: string,
    data: T,
    code: number
}

export interface SelectOption<T = string | number> {
    label: string
    value: T
}
