<template>
    <section class="page">
        <page-header :title="title" border></page-header>
        <section class="page-content cinema-detail">
            <mt-cell :title="this.cinema.cinemaDetail.cinemaName"></mt-cell>
            <mt-cell :title="this.cinema.cinemaDetail.cinemaAddr">
                <i slot="icon" class="icon-map-pin" />
            </mt-cell>
            <mt-cell :title="this.cinema.cinemaDetail.cinemaPhone">
                <i slot="icon" class="icon-phone" />
            </mt-cell>
            <div class="cinema-item">
                <p>介绍</p>
            </div>
            <div class="cinema-item cinema-discuss">
                <mt-cell title="影评">
                    <span class="icon-edit" @click="comment"><label> 写影评</label></span>
                </mt-cell>
            </div>
        </section>
    </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'cinemaDetail',
    data () {
        return {
            title: '',
            loading: true,
            content: '',
            stars: ''
        }
    },
    computed: {
        ...mapState({
            cinema: state => state.cinema
        })
    },
    created () {
    },
    mounted () {
    },
    methods: {
        getCinemaFilmShowList () {
            this.$http.post('/film/wocinema/getCinemaFilmShowList.do', {
                cinemaCollectionId: this.cinema.cinemaDetail.cinemaId
            }).then(res => {
                this.$store.commit('cinema/updateCinemaFilm', res.data.result)
                this.getCinemaShowList(res.data.result[0].filmId)
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
            }).catch(() => {
                this.loading = false
            })
        },
        comment () {
            this.$router.push({
                name: 'filmComment',
                params: {
                    name: this.cinema.cinemaDetail.cinemaName,
                    isDetail: 3
                }
            })
        }
    }
}
</script>
<style lang="less">
.cinema-detail {
    overflow: hidden;
    .cinema-item {
        margin-top: 10px;
        background: #fff;
        min-height: 100px;
        padding: 10px;
    }
    .cinema-discuss {
        min-height: 100%;
        .mint-cell-wrapper{
            background-image: none;
        }
        .icon-edit {
            color: rgba(255,97,71,1);
            label {
                color: #000;
            }
        }

    }
}
</style>
