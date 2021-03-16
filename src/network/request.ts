import { Response } from '@/types/common'
import { debounce, encrypt } from '@/utils/index'
import axios, {
    AxiosInstance,
    AxiosPromise,
    AxiosRequestConfig,
    AxiosResponse,
    Canceler,
} from 'axios'
import { Observable } from 'rxjs'

export const getCommonParams = (tenantid?: string) => {
    return {
        timestamp: Date.now(),
        version: 'v1.0.0',
    }
}

declare type Methods =
    | 'GET'
    | 'OPTIONS'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
export declare interface Datas {
    method?: Methods
    [key: string]: any
}

export const baseURL = process.env.REACT_APP_BASE_API

class HttpRequest {
    public queue: Array<{
        config: AxiosRequestConfig
        cancel: Canceler
        token: string
    }> // 请求的url集合
    public constructor() {
        this.queue = []
    }

    destroy(
        config: AxiosRequestConfig | string,
        cancel?: Canceler,
        destroy = false
    ) {
        const token = ''
        if (destroy && typeof config !== 'string') {
            // const { url, method, params, data } = config
            // token = encrypt({ url, method, params, data })
            // const sameRequestUrl = this.queue.filter(v => v.config.url === url)
            // const sameRequest = sameRequestUrl.every(v => v.token === token)
            // const infoMessage = `${url} 接口重复： ${new Date().toLocaleString()}`
            // if (sameRequest && sameRequestUrl.length) {
            //   cancel && cancel(infoMessage)
            // } else {
            //   this.queue = this.queue.filter(v => {
            //     const boolean = v.config.url !== url
            //     if (destroy && !boolean) {
            //       if (v.token === token) {
            //         v.cancel(infoMessage)
            //       } else {
            //         v.cancel(infoMessage)
            //       }
            //     }
            //     return boolean
            //   })
            //   if (cancel) {
            //     this.queue.push({
            //       config, token, cancel
            //     })
            //   }
            // }
        }
        if (!destroy) {
            const url = typeof config === 'string' ? config : config.url
            this.queue = this.queue.filter((v) => v.config.url !== url)
        }

        if (!this.queue.length) {
            setTimeout(() => {
                // hide loading
            }, 1000)
        }
        return token
    }

    interceptors<T>(instance: AxiosInstance, url?: string) {
        // 请求拦截
        instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // show loading
                    // Message.loading()
                }
                config.cancelToken = new axios.CancelToken((cancel) => {
                    if (url) {
                        this.destroy(config, cancel, true)
                    }
                })
                return config
            },
            (error: any) => {
                console.error(error)
            }
        )

        // 响应拦截
        instance.interceptors.response.use(
            (res: AxiosResponse<Response<T>>): any => {
                if (url) {
                    this.destroy(res.config)
                }
                return res
            },
            (error: any) => {
                if (url) {
                    this.destroy(url)
                }
                // Message.error(error.message)
                return Promise.reject(error)
            }
        )
    }

    request<T = any>(options: AxiosRequestConfig) {
        const instance = axios.create({})
        this.interceptors<T>(instance, options.url)
        return this.resolveResponse(instance(options) as AxiosPromise<Response<T>>)
    }

    resolveResponse<T>(request: AxiosPromise<Response<T>>) {
        return new Observable<Response<T>>(subscriber => {
            request.then(response => {
                const { data } = response
                if (data && (data.code === 1 || data.code === 200)) {
                    // 请求成功
                    subscriber.next(data)
                } else {
                    subscriber.error(requestFail(response).data)
                }
                subscriber.complete();
            }).catch(err => {
                deError(err.message)
                subscriber.error(err)
                subscriber.complete();
            })
        })
        // const response = await request
        // const { data } = response
        // if (data && (data.code === 1 || data.code === 200)) {
        //     // 请求成功
        //     return response.data
        // }
        // return Promise.reject(requestFail(response).data) // 失败回调
    }
}

// 请求失败
const requestFail = (res: AxiosResponse<Response>): AxiosResponse<Response> => {
    const errStr = '网络繁忙！'
    // token失效重新登陆
    deError(res.data.message || errStr)
    if (res.data.code === 2002) {
        // 用户不存在 登录
        return res
    } else if (res.data.code === 1000001 || res.data.code === 401) {
        // tologin
        return res
    } else if (res.data.code === 17 || res.data.code === 10) {
        return res
    } else if (res.data && res.data.code) {
        return res
    }
    console.error({
        code: res.data.code,
        message: res.data.message || errStr,
    })
    return res
}
const deError = debounce((message: string) => {
    // Message.error({
    //     content: message,
    //     duration: 5,
    // })
})

// 合并axios参数
const conbineOptions = (_opts: RequestOptions): AxiosRequestConfig => {
    const opts = _opts
    const sendFile = opts.headers && opts.headers.dataType === 'file'
    const isForm = opts.isForm
    const options: AxiosRequestConfig = {
        method: opts.method || 'GET',
        url: opts.url,
        headers: {
            'Content-Type': isForm
                ? 'application/x-www-form-urlencoded;charset=UTF-8'
                : 'application/json;charset=UTF-8',
            ...opts.headers,
        },
        params: { ..._opts.params },
        baseURL,
        data: opts.data,
        ...opts.axiosOptions,
    }

    // options.headers['client-token'] = UserModule.token
    // options.headers['client-uuid'] = UserModule.uuid
    if (_opts.code) {
        options.headers.permission = _opts.code
    }

    if (!opts.white) {
        options.params = {
            ...options.params,
            ...getCommonParams(),
        }
    }

    if (
        !Array.isArray(options.data) &&
        options.data &&
        !Object.keys(options.data).length &&
        !sendFile
    ) {
        delete options.data
    }

    const sign = { ...options.params, body: options.data }
    if (sendFile) {
        delete sign.body
    }
    // if (!opts.white) {
    options.params.sign = encrypt(sign)
    // }
    return options
}

const HTTP = new HttpRequest()

interface RequestOptions extends AxiosRequestConfig {
    isForm?: boolean
    white?: boolean
    code?: string
    axiosOptions?: AxiosRequestConfig
}

/**
 * 抛出整个项目的api方法
 */
const Api = (() => {
    const fun = <T = any>(opts: RequestOptions) => {
        if (typeof opts === 'string' && ([] as string[]).indexOf(opts) === -1) {
            // xxx
        }
        const newOpts = conbineOptions(opts)
        return HTTP.request<T>(newOpts)
    }
    return fun
})()

export default Api
export const request = Api
