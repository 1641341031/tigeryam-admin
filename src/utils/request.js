import axios from 'axios'
import { getToken } from './auth.js'

// 创建axios实例
const service = axios.create({
    baseURL: "http://192.168.1.105:8091", // api的base_url
    // baseURL: "/api",
    timeout: 15000 // 请求超时时间
  })

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

export default service