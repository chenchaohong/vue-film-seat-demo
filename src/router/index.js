import Vue from 'vue'
import Router from 'vue-router'
import demo from './demo'
import store from '@/stores'

Vue.use(Router)

let routes = [
    { path: '/', alias: '/index', name: 'index', component: () => import('@/views/index.vue') },
    { path: '/cinema/list', name: 'cinemaList', component: () => import('@/views/cinema/cinemaList.vue') },
    { path: '/cinema/search', name: 'cinemaSearchPage', component: () => import('@/views/cinema/search.vue') },
    { path: '/cinema/info', name: 'cinemaInfo', component: () => import('@/views/cinema/cinemaInfo.vue') },
    { path: '/cinema/seat', name: 'cinemaSeat', component: () => import('@/views/cinema/cinemaSeat.vue') },
    { path: '/cinema/detail', name: 'cinemaDetail', component: () => import('@/views/cinema/cinemaDetail.vue') },
    { path: '*', name: '404Error', component: () => import('@/views/common/404.vue') }
]

routes = routes.concat(demo)

const router = new Router({
    mode: 'history',
    base: process.env.VUE_APP_PROJECT_FILM,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name != from.name) {
        store.commit('keepalive/setRoute', {
            to: to,
            from: from
        })
    }
    next()
})

router.afterEach(to => {
    console.info('keepalive: ' + store.state.keepalive.list)
})

export default router
