import Vue from 'vue'
import Vuex from 'vuex'
import keepalive from './modules/keepalive'
import payment from './modules/payment'
import area from './modules/area'
import film from './modules/film'
import cinema from './modules/cinema'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 定位信息
        location: {
            longitude: '',
            latitude: '',
            areaName: '',
            areaId: ''
        }
    },
    modules: {
        keepalive,
        payment,
        area,
        film,
        cinema
    }
})
