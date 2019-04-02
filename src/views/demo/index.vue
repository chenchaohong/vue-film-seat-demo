<template>
    <section class="page">
        <page-header title="demo" border></page-header>
        <section class="page-content">
            <mt-cell title="去首页" to="/index" is-link></mt-cell>
            <mt-cell title="标题文字" value="说明文字"></mt-cell>
            <mt-cell title="电影卡">
                <span>有效期至：2019-12-31 23:59</span>
                <img slot="icon" src="@/assets/img/card/vip.png" width="24" height="24">
            </mt-cell>
            <mt-cell title="toast提示" @click.native="toast()" is-link></mt-cell>
            <mt-cell title="alert提示" @click.native="alert()" is-link></mt-cell>
            <mt-cell title="设置Store" @click.native="setStore" is-link></mt-cell>
            <mt-cell title="获取Store" @click.native="getStore" is-link></mt-cell>
            <mt-cell title="清除Store" @click.native="cleartStore" is-link></mt-cell>
            <div class="page-button page-part">
                <mt-button>default</mt-button>
                <mt-button type="primary">primary</mt-button>
                <mt-button class="mint-button--green">green</mt-button>
                <mt-button class="mint-button--gray">gray</mt-button>
                <mt-button class="mint-button--linear">linear</mt-button>
            </div>
            <div class="page-button page-part">
                <mt-button size="large" class="mint-button--linear">linear</mt-button>
            </div>
            <div class="page-part demo-icon">
                图标：
                <span>
                    icon-check：<i class="icon-check"></i>
                </span><span>
                    icon-checkmark：<i class="icon-checkmark"></i>
                </span><span>
                    icon-chevron-with-circle-right：<i class="icon-chevron-with-circle-right"></i>
                </span><span>
                    icon-checkmark-outline：<i class="icon-checkmark-outline"></i>
                </span><span>
                    icon-cheveron-outline-right：<i class="icon-cheveron-outline-right"></i>
                </span><span>
                    icon-check-circle：<i class="icon-check-circle"></i>
                </span><span>
                    icon-arrow_drop_down：<i class="icon-arrow_drop_down"></i>
                </span><span>
                    icon-arrow_drop_up：<i class="icon-arrow_drop_up"></i>
                </span><span>
                    icon-chevron-up：<i class="icon-chevron-up"></i>
                </span><span>
                    icon-check-down：<i class="icon-chevron-down"></i>
                </span><span>
                    icon-chevron-left：<i class="icon-chevron-left"></i>
                </span><span>
                    icon-chevron-right：<i class="icon-chevron-right"></i>
                </span><span>
                    icon-clock：<i class="icon-clock"></i>
                </span><span>
                    icon-credit-card1：<i class="icon-credit-card1"></i>
                </span><span>
                    icon-edit：<i class="icon-edit"></i>
                </span><span>
                    icon-heart：<i class="icon-heart"></i>
                </span><span>
                    icon-phone：<i class="icon-phone"></i>
                </span><span>
                    icon-search：<i class="icon-search"></i>
                </span><span>
                    icon-thumbs-down：<i class="icon-thumbs-down"></i>
                </span><span>
                    icon-thumbs-up：<i class="icon-thumbs-up"></i>
                </span><span>
                    icon-credit-card：<i class="icon-credit-card"></i>
                </span><span>
                    icon-fire：<i class="icon-fire"></i>
                </span><span>
                    icon-circle-right：<i class="icon-circle-right"></i>
                </span><span>
                    icon-fire：<i class="icon-fire"></i>
                </span><span>
                    icon-phone：<i class="icon-phone"></i>
                </span><span>
                    icon-play-circle：<i class="icon-play-circle"></i>
                </span><span>
                    icon-location：<i class="icon-location"></i>
                </span><span>
                    icon-location2：<i class="icon-location2"></i>
                </span><span>
                    icon-map-pin：<i class="icon-map-pin"></i>
                </span><span>
                    icon-target：<i class="icon-target"></i>
                </span><span>
                    icon-trash-2：<i class="icon-trash-2"></i>
                </span><span>
                    icon-delete：<i class="icon-delete"></i>
                </span><span>
                    icon-music：<i class="icon-music"></i>
                </span><span>
                    icon-volume-medium：<i class="icon-volume-medium"></i>
                </span>
            </div>
        </section>
    </section>
</template>

<script>
export default {
    name: 'demo',
    data () {
        return {
            demoStore: {
                name: 'kanade',
                sex: '男',
                list: [
                    { color: 'red', age: '19' },
                    { color: 'green', age: '20' }
                ]
            }
        }
    },
    created () {
    },
    methods: {
        toast () {
            this.$toast({
                message: '操作成功'
            })
        },
        alert () {
            this.$alert({
                message: '操作成功'
            })
        },
        setStore () {
            this.$store.dispatch('updateDemo', this.demoStore)
        },
        getStore () {
            console.log(JSON.stringify(this.$store.state.demo))
        },
        cleartStore () {
            this.$store.dispatch('clearDemo')
        }
    }
}
</script>
<style lang="less">
.demo-icon {
    span {
        display: block;
    }
    i {
        color: red;
    }
}
</style>
