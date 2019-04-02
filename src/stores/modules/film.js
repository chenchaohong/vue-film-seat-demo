export default {
    namespaced: true,
    state: {
        film: {
            filmCollectionId: '',
            filmName: '',
            disabled: false
        }
    },
    mutations: {
        setFilm (state, data = {}) {
            for (let k in data) {
                state.film[k] = data[k]
            }
            state.film.disabled = Boolean(data.disabled)
        }
    }
}
