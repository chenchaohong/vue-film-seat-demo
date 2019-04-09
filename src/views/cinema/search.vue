<template>
    <section class="page">
        <cinema-search :defStoreName="defStoreName" @cancel="back" @change="getSearchCinema">
            <div slot="list">
                <item-cell  v-for="(item, index) in searchCinemaList" :key="index" @click.native="selectCinema(item)"
                    :title="item.cinemaName" :label="item.addr" :value="item.minPrice" :desc="item.distance"></item-cell>
            </div>
        </cinema-search>
    </section>
</template>

<script>
import CinemaSearch from '@/components/search'
export default {
    name: 'cinemaSearchPage',
    components: { 'cinema-search': CinemaSearch },
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
            searchCinemaList: [],
            cinemaSearch: false,
            cinema: {},
            defStoreName: false
        }
    },
    created () {
        let _location = this.$ls.getItem('location')
        this.search.longitude = _location.longitude
        this.search.latitude = _location.latitude
        this.search.cityId = _location.cityId
        this.defStoreName = this.$ls.getItem('cinemaStoreName') || false
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        back () {
            this.$router.go(-1)
        },
        getSearchCinema (name) {
            if (!name) {
                this.searchCinemaList = []
                return
            }
            this.$http.post('/film/home/searchAll.do', {
                ...this.search,
                searchName: name
            }).then(res => {
                this.searchCinemaList = res.data.result.cinema.result || []
            }).catch(() => {
            })
        },
        selectCinema (e) {
            this.$http.post('/film/wocinema/getCinemaDetail.do', {
                suppliers: 'maoyan',
                cinemaId: e.cinemaId
            }).then(res => {
                res.data.result.cinemaId = e.cinemaId
                this.$store.commit('cinema/updateCinemaDetail', res.data.result)
                this.$ls.setItem('cinemaStoreName', true)
                this.$router.push('info')
            }).catch(() => {
            })
        }
    }
}
</script>
<style lang="less">
</style>
