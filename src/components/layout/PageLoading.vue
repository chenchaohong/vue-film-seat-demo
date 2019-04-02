<template>
    <section class="page-loading" v-show="loading">
        <div v-if="loading === true">
            <mt-spinner type="snake"></mt-spinner>
        </div>
        <div v-else-if="loading" class="page-error">
            <div class="err-img"></div>
            <p class="err-msg">服务器出错啦，休息一会吧。</p>
            <p class="err-detail">详细原因: {{loading}}</p>
        </div>
    </section>
</template>

<script>
export default {
    name: 'PageLoading',
    props: {
        loading: {
            type: [Boolean, String],
            default: true
        }
    }
}
</script>
