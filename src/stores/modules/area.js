import axios from '@/libs/axios'
export default {
    namespaced: true,
    state: {
        area: {}
    },
    actions: {
        initArea: ({ commit }, data) => {
            commit('INIT_AREA', data)
        }
    },
    mutations: {
        INIT_AREA (state, data) {
            if (!state.area.areaName) {
                axios.post('film/city/location.do', data).then(res => {
                    state.area = res.data.result || {}
                })
            }
        },
        setArea (state, data) {
            state.area = data
        }
    }
}
