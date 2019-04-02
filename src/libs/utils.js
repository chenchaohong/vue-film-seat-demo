import routes from '@/router/routes'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'
const EXPIRES = 1 // cookie保存天数

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: EXPIRES })
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}

/**
 * @param {*} obj
 * @param [*] list
 * @description 获取设置了meta值的路由
 */
export const getRoutesOfMeta = (obj = {}, list = routes) => {
    list.forEach(item => {
        if (item.meta) obj[item.name] = item.meta
        if (item.children && item.children.length > 0) getRoutesOfMeta(obj, item.children)
    })
    return obj
}

/**
 * @param [*] arr
 * @param [*] list
 * @description 获取未设置noCache=true的路由
 */
export const getRoutesOfCache = (arr = [], list = routes) => {
    list.forEach(item => {
        if (!(item.meta && item.meta.noCache) && item.name) arr.push(item.name)
        if (item.children && item.children.length > 0) getRoutesOfCache(arr, item.children)
    })
    return arr
}
