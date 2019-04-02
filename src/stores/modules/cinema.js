const state = {
    film: [], // 影院在映列表
    filmShow: {
        showTimeList: [], // 影片播放日期
        showMap: {} // 影片播放场次
    },
    cinemaDetail: {}, // 影院详情
    selectFilm: {}, // 选中的电影信息
    selectHall: {} // 选中的影厅信息
}

// mutations
const mutations = {
    updateCinemaFilm (state, data) {
        state.film = data
    },
    updateFilmShow (state, data) {
        state.filmShow = data
    },
    updateCinemaDetail (state, data) {
        state.cinemaDetail = data
    },
    updateSelectFilm (state, data) {
        state.selectFilm = data
    },
    updateSelectHall (state, data) {
        state.selectHall = data
    },
    cleaCinema (state, data) {
        state.film = []
        state.filmShow.showTimeList = []
        state.filmShow.showMap = {}
        state.cinemaDetail = {}
        state.selectFilm = {}
        state.selectHall = {}
    }
}

export default {
    // namespaced: true,
    state,
    mutations
}
