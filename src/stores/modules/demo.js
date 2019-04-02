const state = {
    data: {}
}

// getters
const getters = {
}

// actions
const actions = {
    updateDemo: ({ commit }, data) => {
        commit('UPDATE_DEMO', data)
    },
    clearDemo: ({ commit }, data) => {
        commit('CLEAR_DEMO', data)
    }
}

// mutations
const mutations = {
    UPDATE_DEMO (state, data) {
        state.data = data
    },
    CLEAR_DEMO (state, data) {
        state.data = data
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
