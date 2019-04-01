<template>
    <section class="page">
        <page-header :title="title" border></page-header>
        <page-loading :loading="loading"></page-loading>
        <section class="page-content film-seat">
            <mt-cell :title="this.film.filmName" :label="this.film.filmInfo"></mt-cell>
            <Seat cinemaName="10FL高亮中国巨幕厅 银幕" :seat="this.seat" @submit="submit"></Seat>
        </section>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import Seat from '@/components/cinema/Seat'

export default {
    name: 'cinemaSeat',
    components: { Seat },
    data () {
        return {
            title: '选座',
            loading: true,
            film: {
                filmName: '',
                filmInfo: ''
            },
            seat: {}
        }
    },
    computed: {
        ...mapState({
            cinema: state => state.cinema
        })
    },
    created () {
        this.title = this.cinema.cinemaDetail.cinemaName
        this.getCinemaHallSeat()
    },
    mounted () {
    },
    methods: {
        getCinemaHallSeat () {
            this.$http.post('/film/wocinema/getCinemaHallSeat.do', {
                hallId: this.cinema.cinemaDetail.cinemaId,
                showId: this.cinema.selectFilm.filmId,
                suppliers: 'maoyan'
            }).then(res => {
                let film = res.data.result
                this.film.filmName = film.filmName
                this.film.filmInfo = film.openDate + ' ' + film.openTime + ' ' + film.versionType
                this.seat = film
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        submit (e) {
            console.log(e)
        }
    }
}
</script>
<style lang="less">
.film-seat {
    background: #fff;
    overflow: hidden;
}
</style>
