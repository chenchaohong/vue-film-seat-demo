import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.baseURL = process.env.VUE_APP_BASEURL

axios.interceptors.request.use(config => {
    config.headers = {}
    return config
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 电影票异常
    if (response.data.rc && response.data.rc !== 0) {
        return Promise.reject(new Error(response.data.desc))
    }
    return response
}, error => {
    return Promise.reject(new Error('服务器繁忙'))
})

export default axios
