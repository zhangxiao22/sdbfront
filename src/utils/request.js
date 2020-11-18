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
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken()
      config.headers.tokenId = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        // message: `${res.msg}：${res.subMsg}` || 'Error',
        message: `${res.msg}` || 'Error',
        type: 'error',
        duration: 10 * 1000
      })
      if (res.code === 401) {
        // to re-login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })

        // Message({
        //   message: '登陆失效',
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        console.log('接口401?')
        store.dispatch('user/resetToken').then(() => {
          router.replace('/start')
          // location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: '网络错误，请稍后重试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
