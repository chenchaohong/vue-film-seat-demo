<template>
    <section class="page">
        <page-header :title="title" border @click.native="areaFlag = false, rangeFlag = false">
            <div slot="right" @click="toSearch"><i class="icon-search"></i></div>
        </page-header>
        <page-loading :loading="loading"></page-loading>
        <section class="page-content">
            <div class="page-herder-flex">
                <div class="f-item" @click="areaFlag = !areaFlag, rangeFlag = false">
                    <label>影院区域</label>
                    <i :class="[areaFlag? 'icon-arrow_drop_down': 'icon-arrow_drop_up']"></i>
                </div>
                <div class="f-item-hide f-item-down" v-if="areaFlag" @click="areaFlag = false, rangeFlag = false">
                    <div class="part">
                        <div class="area-items">
                            <a class="area-item" :class="{'area-item-active': item.areaId == search.areaId}"
                            v-for="(item, index) in areaList" :key="index"
                            @click="changeArea(item.areaId)">{{item.areaName}}</a>
                        </div>
                    </div>
                </div>
                <div class="f-item" @click="rangeFlag = !rangeFlag, areaFlag = false">
                    <label>{{rangeTitle}}</label>
                    <i :class="[rangeFlag? 'icon-arrow_drop_down': 'icon-arrow_drop_up']"></i>
                </div>
                <div class="f-item-down" v-if="rangeFlag" @click="areaFlag = false, rangeFlag = false">
                    <div class="part">
                        <ul>
                            <li :class="{'li-active': listType == '1'}" @click="changeListType('1')">离我最近</li>
                            <li :class="{'li-active': listType == '2'}" @click="changeListType('2')">价格最低</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="cinema-list">
                <item-cell  @click.native="selectCinema(item)" v-for="(item, index) in cinemaList" :key="index"
                    :title="item.cinemaName" :label="item.addr" :value="item.minPrice" :desc="item.distance"></item-cell>
            </div>
        </section>
    </section>
</template>

<script>
// import { mapState } from 'vuex'
export default {
    name: 'cinemaList',
    data () {
        return {
            search: {
                longitude: '', // 经度
                latitude: '', // 纬度
                cityId: '',
                filmId: '',
                areaId: ''
            },
            page: {
                pageSize: '',
                currentPage: ''
            },
            areaList: [],
            cinemaList: [],
            searchCinemaList: [],
            title: '',
            rangeTitle: '离我最近',
            listType: '1', // 1-离我最近影院列表 2-价格最低影院列表
            loading: true,
            areaFlag: false,
            rangeFlag: false,
            cinemaSearch: false,
            cinema: {}
        }
    },
    created () {
        this.$ls.setItem('cinemaStoreName', false)
        let _location = this.$ls.getItem('location')
        this.search.longitude = _location.longitude
        this.search.latitude = _location.latitude
        this.search.cityId = _location.cityId
        // film store
        let film = this.$store.state.film.film
        this.search.filmId = film.filmCollectionId
        this.title = film.filmName || '电影院'
    },
    mounted () {
        this.getArea()
        this.getCinemaList('1')
    },
    computed: {
        // ...mapState({
        //     cinemaDetail: state => state.cinema.cinemaDetail
        // })
    },
    methods: {
        toSearch () {
            this.$router.push('search')
        },
        getArea () {
            this.$http.post('/film/wocinema/getLocationArea.do', { // 城市包含区县列表
                cityId: this.search.cityId
            }).then(res => {
                this.areaList = res.data.result || []
                if (!res.data.result[0].areaId) {
                    res.data.result[0].areaId = ''
                }
            })
        },
        getCinemaList (listType) {
            // listType: 1-离我最近影院列表 2-价格最低影院列表
            let url = listType == '1' ? 'getCinemaByDistance' : 'getCinemaByPrice'
            this.rangeTitle = listType == '1' ? '离我最近' : '价格最低'
            this.$http.post('/film/wocinema/' + url + '.do', {
                ...this.search
            }).then(res => {
                this.cinemaList = res.data.result.result || []
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        changeArea (areaId) {
            this.search.areaId = areaId
            this.areaFlag = false
            this.getCinemaList('1')
        },
        changeListType (type) {
            this.listType = type
            this.rangeFlag = false
            this.getCinemaList(type)
        },
        selectCinema (e) {
            this.$http.post('/film/wocinema/getCinemaDetail.do', {
                suppliers: 'maoyan',
                searchName: e.cinemaId
            }).then(res => {
                res.data.result.cinemaId = e.cinemaId
                this.$store.commit('updateCinemaDetail', res.data.result)
                this.$router.push('info')
            }).catch(() => {
            })
        }
    }
}
</script>
<style lang="less">
    .page-herder-flex {
        position: fixed;
        top: 44px;
        left: 0;
        right: 0;
        height: 35px;
        line-height: 35px;
        text-align: center;
        background: #fff;
        border-bottom: 1px solid #E8E8E8;
        z-index: 1000;
        .f-item {
            display: inline-block;
            width: 45%;
        }
        .area-items {
            text-align: left;
            padding: 10px 0;
            display: flex;
            flex-wrap: wrap;
            .area-item {
                display: inline-block;
                width: 22%;
                height: 30px;
                line-height: 30px;
                border: 1px solid #E8E8E8;
                border-radius: 4px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 1%;
            }
            .area-item-active {
                border: 1px solid #F95309;
                color: #F95309;
                background: rgba(249, 83, 9, 0.1)
            }
        }
        .f-item-hide {
            // width: 100%;
            // height: 0;
            // transform: translate3d(0,-50%,0);
        }
        .f-item-down {
            position: fixed;
            width: 100%;
            height: 100%;
            border-top: 1px solid #E8E8E8;
            background: rgba(158, 158, 158, 0.17);
            // -webkit-transition: .2s ease-out;
            // transition: .2s ease-out;
            // transform: translate3d(0, 0, 0);
            .part {
                padding: 0 15px;
                background: #fff;
                animation: fade .3s ease-in;
            }
            @keyframes fade {
                0% {
                    transform: translate3d(0, -50%, 0);
                    opacity: 0;
                }
                50% {
                    transform: translate3d(0, -40%, 0);
                    opacity: 0;
                }
                100% {
                    transform: translate3d(0, 0, 0);
                    opacity: 1;
                }
            }
            ul {
                margin: 0;
                li {
                    display: flex;
                    margin-left: 15px;
                }
                .li-active {
                    position: relative;
                    font-family: 'icomoon' !important;
                    color: #F95309;
                }
                .li-active:before {
                    content: "\E915";
                    position: absolute;
                    left: -20px;
                }
            }
        }
    }
    .cinema-list {
        padding-top: 35px;
    }
</style>
