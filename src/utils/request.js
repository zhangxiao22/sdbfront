import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://10.5.7.78:8081', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // config.headers['X-Token'] = getToken()
    //   config.headers.tokenId = getToken()
    // }
    if (process.env.NODE_ENV === 'development') {
      // config.headers.userNo = '01' + '01957' // 线索统筹
      config.headers.userNo = '01' + '00752' // 用例管理
      // config.headers.userNo = '01' + '10440' // 领导审批
      // config.headers.userNo = '01' + '01479' // 业务管理
      // config.headers.userNo = '01' + '01819' // 支行业务管理
      // config.headers.userNo = '01' + '06476' // 支行用例管理
      // config.headers.userNo = '01' + '06145' // 支行审批岗
      // config.headers.userNo = '01' + '06474' // 支行普通员工
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message.closeAll()
      Message({
        // message: `${res.subMsg ? res.subMsg.params : res.msg}` || 'Error',
        message: `${res.msg}` || 'Error',
        type: 'error',
        duration: 10 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    Message.closeAll()
    if (error.response) {
      const { status, data } = error.response
      if (status === 401 || status === 403) {
        Message({
          message: data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        router.replace('/401')
        // location.reload()
      }
    } else {
      Message({
        message: '网络错误，请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
