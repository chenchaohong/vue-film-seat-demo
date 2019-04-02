<template lang="html">
<header class="mint-header header" :style="styles" :class="{'header-bottom-border': border}">
    <div class="mint-header-button is-left">
        <a href="javascript:void(0);" @click="back">
            <mt-button icon="back"></mt-button>
        </a>
        <slot name="left"></slot>
    </div>
    <h1 class="mint-header-title">{{title}}</h1>
    <div class="mint-header-button is-right">
        <slot name="right"></slot>
    </div>
</header>
</template>

<script>
export default {
    name: 'PageHeader',
    props: {
        title: String,
        border: Boolean,
        onBack: Function,
        styles: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    methods: {
        back () {
            if (this.onBack) {
                this.onBack()
            } else {
                history.back()
            }
        }
    }
}
</script>
