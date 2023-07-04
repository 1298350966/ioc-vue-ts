import axios, { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { ResultEnum } from "@/enums/httpEnum"
import { ErrorPageNameMap } from "@/enums/pageEnum"
import { redirectErrorPage } from '@/utils'

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_DEV_PATH : import.meta.env.VITE_PRO_PATH,
  timeout: ResultEnum.TIMEOUT,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers["X-Requested-With"] = "XMLHttpRequest"
    return config
  },
  (error: AxiosRequestConfig) => {
    Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    let { status } = res;
    if (status === 200 || status === 201) {
      const { code, errorcode, redirect } = res.data as { code: number, errorcode: number | string, redirect: any }
      if (code === undefined || code === null) return Promise.resolve(res.data)
      if (code === ResultEnum.DATA_SUCCESS) return Promise.resolve(res.data)
      // 重定向
      if (ErrorPageNameMap.get(code)) redirectErrorPage(code)
      if (errorcode === "no login") {
        location.href = redirect;
      }
      return Promise.resolve(res.data)


    }
  },
  (err: AxiosError) => {
    const { status, data } = err.response as any
    if (status === 401 || status === 404) {
      if (data.errorcode === "no login") {
        location.href = data.redirect;
      }
    }
    Promise.reject(err)
  }
)

export enum ContentType {
  FORM_DATA = 'multipart/form-data',
  JSON = 'application/json',
  URL = 'application/x-www-form-urlencoded'
}

export async function Get<T>(url, param = ""): Promise<T> {
  return await axiosInstance.get(url, { params: param })
}

export async function Post<T>(url, param: any = undefined): Promise<T> {
  return await axiosInstance.post(url, param)
}

export async function PostFormData<T>(url, param: any = undefined): Promise<T> {
  return await axiosInstance.post(url, param, {
    headers: {
      'Content-Type': ContentType.FORM_DATA
    }
  })
}

export async function PostJson<T>(url, param: any = undefined): Promise<T> {
  return await axiosInstance.post(url, param, {
    headers: {
      'Content-Type': ContentType.FORM_DATA
    }
  })
}

export async function Delete<T>(url, param: any = undefined): Promise<T> {
  return await axiosInstance.delete(url,param)
}
export async function Patch <T>(url, param: any = undefined): Promise<T> {
  return await axiosInstance.patch(url,param)
}


export default axiosInstance
