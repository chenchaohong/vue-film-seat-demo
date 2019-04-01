import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'index', alias: '/index', component: Home },
    { path: '/cinema/list', name: 'cinemaList', component: () => import('@/views/cinema/cinemaList.vue') },
    { path: '/cinema/search', name: 'cinemaSearchPage', component: () => import('@/views/cinema/search.vue') },
    { path: '/cinema/info', name: 'cinemaInfo', component: () => import('@/views/cinema/cinemaInfo.vue') },
    { path: '/cinema/seat', name: 'cinemaSeat', component: () => import('@/views/cinema/cinemaSeat.vue') },
    { path: '/cinema/detail', name: 'cinemaDetail', component: () => import('@/views/cinema/cinemaDetail.vue') },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
