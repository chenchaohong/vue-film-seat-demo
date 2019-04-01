<template>
    <div class="item-content">
        <a class="item-cell">
            <div class="item-cell-wrapper">
                <div class="item-cell-left">
                    <span class="item-cell-text">{{title}}</span>
                    <span class="item-cell-label">{{label}}</span>
                </div>
                <div class="item-cell-right">
                    <span class="item-cell-text"><label class="money">{{value}}元</label> 起</span>
                    <span class="item-cell-label">{{desc}}</span>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
export default {
    name: 'item-cell',
    props: {
        title: String,
        label: String,
        value: String,
        desc: String
    },
    data () {
        return {
        }
    },
    created () {
    }
}
</script>
<style lang="less">
.item-content {
    background: #fff;
    .item-cell {
        background: #fff;
        box-sizing: border-box;
        color: inherit;
        min-height: 65px;
        display: block;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        margin-left: 15px;
    }
    .item-cell-wrapper {
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 120% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        background-origin: content-box;
        -webkit-align-items: center;
        align-items: center;
        box-sizing: border-box;
        display: -webkit-flex;
        display: flex;
        font-size: 14px;
        line-height: 1;
        min-height: inherit;
        overflow: hidden;
        padding-right:15px;
        width: 100%;
    }
    .item-cell-left {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .item-cell-right {
        text-align: right;
        color: #888;
        .money {
            color: #F95309;
        }
    }
    .item-cell-text {
        vertical-align: middle;
    }
    .item-cell-label {
        color: #888;
        display: block;
        font-size: 12px;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.item-content + .item-content {
    .item-cell {
        border-top: 1px solid #E8E8E8;
    }
}

</style>
