<template>
    <section class="page">
        <page-header :title="title" border></page-header>
        <page-loading :loading="loading"></page-loading>
        <section class="page-content film-seat">
            <mt-cell :title="this.film.filmName" :label="this.film.filmInfo"></mt-cell>
            <Seat :hallName="this.cinema.selectHall.hallName" :seat="this.seat" @submit="submit"></Seat>
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
            couponDetailsId: '', // 参加活动优惠券id
            seat: {}
        }
    },
    computed: {
        ...mapState({
            cinema: state => state.cinema,
            area: state => state.area.area
        })
    },
    created () {
        this.title = this.cinema.cinemaDetail.cinemaName
        this.getCinemaHallSeat()
        // if () { // vip活动传券码
        //     this.couponDetailsId = ''
        // }
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
            let seatNames = []
            let seatList = []
            e.forEach(item => {
                seatNames.push(item.seatName)
                seatList.push({
                    rowId: item.rowId,
                    columnId: item.columnId,
                    sectionId: item.sectionId,
                    seatNo: item.seatNo
                })
            })
            this.$http.post('/film/LockSeat/LockSeat.do', {
                cinemaName: this.cinema.cinemaDetail.cinemaName,
                showId: this.cinema.selectFilm.filmId,
                movieName: this.cinema.selectFilm.filmName,
                hallName: this.cinema.selectHall.hallName,
                hallId: this.cinema.selectHall.hallId,
                price: this.cinema.selectHall.filmCinemaPrice,
                seatNames: seatNames.join(','),
                version: this.cinema.selectHall.filmType,
                showTime: this.seat.openDate + ' ' + this.seat.openTime,
                couponDetailsId: this.couponDetailsId,
                seatList: seatList,
                areaId: this.area.areaId,
                areaName: this.area.areaName,
                suppliers: 'maoyan'
            }).then(res => {
                this.$router.push({ name: 'orderConfirm', query: { orderId: res.data.result.orderId } })
                this.$ls.setItem('orderId', res.data.result.orderId)
            }).catch(() => {
                this.loading = false
            })
        },
        unLockSeat (orderId) {
            this.$http.post('/film/LockSeat/unLockSeat.do', {
                orderId: orderId
            }).then(res => {
                this.$router.push({ name: 'orderConfirm', query: { orderId: res.data.result.orderId } })
            }).catch(() => {
                this.loading = false
            })
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let orderId = vm.$ls.getItem('orderId')
            if (orderId) {
                vm.unLockSeat(orderId)
            }
            next(true)
        })
    },
    beforeRouteLeave (to, from, next) {
        let orderId = this.$ls.getItem('orderId')
        if (orderId) {
            if (to.name == 'cinemaInfo') {
                next(false)
                this.$alert.confirm('确定不要刚才选择的座位了吗？', '').then(action => {
                    this.$ls.removeItem('orderId')
                    next(true)
                })
            } else {
                this.$ls.removeItem('orderId')
                next(true)
            }
        } else {
            next(true)
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
