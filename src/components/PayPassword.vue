<template lang="html">
<section v-show="value">
    <div class="shade">
        <div class="pay-box">
            <div class="title">
                请输入支付密码
                <span class="close" @click="close()">&times;</span>
            </div>
            <div class="content">
                <div class="pwd-input">
                    <span class="pwd" :class="{'show': length>0}"></span>
                    <span class="pwd" :class="{'show': length>1}"></span>
                    <span class="pwd" :class="{'show': length>2}"></span>
                    <span class="pwd" :class="{'show': length>3}"></span>
                    <span class="pwd" :class="{'show': length>4}"></span>
                    <span class="pwd" :class="{'show': length>5}"></span>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script>
export default {
    name: 'pay-password',
    props: {
        length: {
            type: Number,
            default: 0
        },
        value: Boolean
    },
    methods: {
        close () {
            this.$emit('input', false)
        }
    }
}
</script>

<style lang="less" scoped>
.shade {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0, 0.6);
    z-index: 1001;
}
.pay-box {
    position: absolute;
    top: 30%;
    width: 75%;
    left: 12.5%;
    background: #fff;
    border-radius: 10px;
    z-index: 1002;
    .title {
        padding: 20px 0;
        border-bottom: 1px solid rgba(230, 230, 230, 0.5);
        text-align: center;
        position: relative;
        color: #272727;
        .close {
            position: absolute;
            top: 13px;
            right: 15px;
            padding: 0 10px;
            font-size: 24px;
            color: #d0d0d0;
        }
    }
    .content {
        padding: 20px 15px 30px 15px;
        .pwd-input {
            width: 100%;
            height: 36px;
            border: 1px solid #B5B5B5;
            border-radius: 6px;
            display: flex;
            align-items: center;
        }
        .pwd {
            flex: 1;
            position: relative;
            height: 10px;
            border-right: 1px solid #979797;
            &:last-child {
                border: none;
            }
            &.show::before {
                content: "";
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 8px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #666;
            }
        }
    }
}
</style>
