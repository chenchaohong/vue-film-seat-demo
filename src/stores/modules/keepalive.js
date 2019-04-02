export default {
    namespaced: true,
    state: {
        list: ['index'],
        // ture前进 false返回
        forward: true
    },
    mutations: {
        setRoute (state, data) {
            if (data.to.name == 'index') {
                state.list = ['index']
                state.forward = false
                return
            }
            // 不存在路由
            if (data.to.name && state.list.indexOf(data.to.name) < 0) {
                state.list.push(data.to.name)
                state.forward = true
            } else {
                var toIndex = state.list.indexOf(data.to.name)
                var fromIndex = state.list.indexOf(data.from.name)
                // 回退
                if (fromIndex - toIndex == 1) {
                    state.list.splice(fromIndex, 1)
                    state.forward = false
                } else {
                    state.forward = true
                }
            }
        },
        clearAll (state) {
            state.list = ['index']
        },
        clearLast (state) {
            state.list.pop()
        }
    }
}
