<template lang="html">
    <section class="page">
        <page-header title="出错了" border></page-header>
        <section class="page-content" style="background:#fff;">
            <div class="page-error" style="margin-top:30%;">
                <div class="err-img"></div>
                <p class="err-msg">哎呀！您要的页面被拐跑了...</p>
            </div>
            <div class="btn-box">
                <div class="btn-lg" @click="goHome">返回首页</div>
            </div>
        </section>
    </section>
</template>

<script>
export default {
    methods: {
        goHome () {
            this.$router.replace({ name: 'index' })
        }
    }
}
</script>
