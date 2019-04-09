<template>
    <section class="page">
        <page-header :title="title" border></page-header>
        <page-loading :loading="loading"></page-loading>
        <section class="page-content film-info">
            <mt-cell :title="this.title" :label="this.cinema.cinemaDetail.cinemaAddr" to="/cinema/detail" is-link></mt-cell>
            <div class="film-slide" :style="filmSlideBackground">
                <swiper ref="swiper" :options="swiperOption">
                    <swiper-slide v-for="(item, index) in this.cinema.film" :key="index">
                        <img :src="item.filmPic" :alt="item.filmName">
                    </swiper-slide>
                </swiper>
            </div>
            <div class="slide-change" @click="toDetail(slideFilm)">
                <span>{{this.slideFilm.filmName}}</span>
                <label>{{this.slideFilm.rating}}分</label>
            </div>
            <mt-navbar v-model="tabSelected">
                <mt-tab-item :id="item" v-for="item in this.cinema.filmShow.showTimeList" :key="item">{{item}}</mt-tab-item>
            </mt-navbar>
            <div class="medium" @click="toVip">
                <i slot="icon" class="icon-volume-medium" />
                <span>开通会员，<label class="line-color">每张电影票省4元</label>，每月还可享9.9购票</span>
                <i slot="icon" class="icon-chevron-right" />
            </div>
            <mt-tab-container v-model="tabSelected">
                <mt-tab-container-item :id="index" v-for="(item, index) in this.cinema.filmShow.showMap" :key="index">
                    <a class="tab-film-cell" v-for="(film, fid) in item" :key="fid" @click="toSeat(film)">
                        <div class="film-cell">
                            <span class="top">{{film.showStartTime}}</span>
                            <span class="bottom">{{film.showEndTime}}</span>
                        </div>
                        <div class="film-cell film-cell2">
                            <span class="top">{{film.filmLanguage + film.filmType}}</span>
                            <span class="bottom">{{film.hallName}}</span>
                        </div>
                        <div class="film-cell film-cell3">
                            <span class="top">{{film.filmCinemaPrice}}<label>元</label></span>
                            <span class="bottom"><label>会员价</label>{{film.filmVipPrice}}元</span>
                        </div>
                        <div class="film-cell film-end">
                            <mt-button size="small">购买</mt-button>
                        </div>
                    </a>
                </mt-tab-container-item>
            </mt-tab-container>
        </section>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
    name: 'cinemaInfo',
    components: { swiper, swiperSlide },
    data () {
        return {
            title: '电影院',
            loading: true,
            isSlideToClicked: false, // 点击slide触发显示到居中时不触发click
            swiperOption: {
                slidesPerView: 4,
                spaceBetween: 40,
                centeredSlides: true,
                slideToClickedSlide: true,
                on: {
                    slideChange: () => {
                        this.isSlideToClicked = true
                        let index = this.$refs.swiper.swiper.activeIndex
                        this.tabSelected = this.cinema.filmShow.showTimeList[0] || ''
                        this.setFilm(this.cinema.film[index])
                        this.getCinemaShowList(this.slideFilm.filmId)
                    },
                    click: () => {
                        if (!this.isSlideToClicked) {
                            this.toDetail(this.slideFilm)
                        }
                        this.isSlideToClicked = false
                    }
                }
            },
            filmSlideBackground: {},
            slideFilm: {},
            tabSelected: ''
        }
    },
    computed: {
        ...mapState({
            cinema: state => state.cinema
        })
    },
    created () {
        this.title = this.cinema.cinemaDetail.cinemaName
        this.getCinemaFilmShowList()
    },
    mounted () {
    },
    methods: {
        selectSlide (id) { // 选中默认的影片id
            this.cinema.film.forEach((item, index) => {
                if (id == item.filmId) {
                    this.$refs.swiper.swiper.activeIndex = index
                }
            })
        },
        setFilm (e) {
            this.slideFilm = e || {}
            this.filmSlideBackground = {
                backgroundImage: 'url(' + e.filmPic + ')'
            }
            this.$store.commit('cinema/updateSelectFilm', this.slideFilm)
        },
        getCinemaFilmShowList () {
            this.$http.post('/film/wocinema/getCinemaFilmShowList.do', {
                cinemaCollectionId: this.cinema.cinemaDetail.cinemaId
            }).then(res => {
                this.$store.commit('cinema/updateCinemaFilm', res.data.result)
                this.getCinemaShowList(res.data.result[0].filmId)
                this.setFilm(res.data.result[0])
                // 选中默认的影片id
                let filmId = this.$route.query.filmId
                if (filmId) {
                    this.selectSlide(filmId)
                }
            }).catch(() => {
                this.loading = false
            })
        },
        getCinemaShowList (fid) {
            this.$http.post('/film/wocinema/getCinemaShowList.do', {
                filmId: fid,
                cinemaCollectionId: this.cinema.cinemaDetail.cinemaId
            }).then(res => {
                this.$store.commit('cinema/updateFilmShow', res.data.result)
                this.loading = false
                this.tabSelected = res.data.result.showTimeList[0]
            }).catch(() => {
                this.loading = false
            })
        },
        toVip () {
            this.$router.push('/vip')
        },
        toSeat (e) {
            // this.$route.query.couponId
            this.$store.commit('cinema/updateSelectHall', e)
            this.$router.push('seat')
        },
        // 去影片详情
        toDetail (item) {
            this.$router.push({
                path: '/film/detail',
                query: {
                    filmId: item.filmId,
                    filmName: item.filmName,
                    disabled: true
                }
            })
        },
        unLockSeat (orderId) {
            this.$http.post('/film/LockSeat/unLockSeat.do', {
                orderId: orderId
            }).then(res => {
            }).catch(() => {
            })
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let orderId = vm.$ls.getItem('orderId')
            if (orderId) {
                vm.unLockSeat(orderId)
                vm.$ls.removeItem('orderId')
            }
            next(true)
        })
    }
}
</script>
<style lang="less">
.film-info {
    background: #fff;
    .film-slide {
        margin-top: 5px;
        // height: 150px;
        padding-top: 30px;
        background: #888;
        background-size: 2000%;
        background-repeat: no-repeat;
        background-position-y: 40%;
        transition: all 0.5s ease 0s;
        -webkit-transition: all 0.5s ease 0s;
        img {
            height: 100px;
        }
        .swiper-container {
            overflow: visible;
        }
        .swiper-slide-active {
            margin-top: -6px;
            transform: scale(1.1);
            // transform: translate(0, 20px);
            // transition: transform .2s;
        }
    }
    .slide-change {
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #E8E8E8;
        span {
            font-size: 16px;
        }
        label {
            font-size: 12px;
            padding-left: 5px;
            color: rgba(249,83,9,1);
        }
    }
    .medium {
        padding: 0 10px;
        color: #9E9E9E;
        background: rgba(255, 224, 189, 0.23);
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        .icon-volume-medium {
            color: #FF9800;
            padding-right: 5px;
        }
        .icon-chevron-right {
            float: right;
            line-height: inherit;
        }
        .line-color {
            color: #FF9800;
        }
    }
    .mint-tab-container-item {
        border-bottom: 1px solid #E8E8E8;
    }
    .tab-film-cell {
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin: 0 10px;
        .film-cell {
            flex: 1;
            line-height: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .bottom {
                display: block;
                color: #888;
                font-size: 12px;
                margin-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .film-cell2 {
            flex: 2;
        }
        .film-cell3 {
            flex: 1.26;
            .top {
                color: #F44336;
                label {
                    font-size: 10px;
                }
            }
            .bottom {
                font-size: 12px;
                color: #FF9800;
                border: 1px solid #FF9800;
                padding: 2px 0;
                max-width: 86px;
                border-radius: 2px;
                label {
                    padding: 0 1px;
                    margin-right: 1px;
                    color: #fff;
                    background: #FF9800;
                }
            }
        }
        .film-end {
            text-align: right;
            button {
                height: 25px;
                width: 50px;
            }
        }
    }
    .tab-film-cell + .tab-film-cell {
        border-top: 1px solid #E8E8E8;
    }
}
</style>
