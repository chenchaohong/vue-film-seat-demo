<template>
    <div class="comment-level">
        <div
            class="comment-star-bg"
            :style="{
                width: backgroundSize + 'rem ',
                backgroundSize: backgroundSize + 'rem '+ 'auto',
                height: backgroundSize/5+ 'rem'
            }"
        >
            <div
                class="comment-star"
                :style="{
                    width:width,
                    backgroundSize: backgroundSize + 'rem '+ 'auto',
                    height: backgroundSize/5+ 'rem'
                }"
            ></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        propWidth: Number,
        backgroundSize: Number
    },
    name: "Rater",
    data: function () {
        return {
            width: 100
        }
    },
    watch: {
        propWidth: {
            immediate: true,
            handler: function () {
                this.width = this.propWidth * 10 + "%"
            }
        }
    }
}
</script>

<style lang="less">
.comment-level {
    display: -webkit-box;
    -webkit-box-align: center;
    .comment-star-score {
        margin-left: 0.06rem;
    }
    .distance {
        -webkit-box-flex: 1;
        text-align: right;
    }
    .comment-star-bg {
        width: 3rem;
        height: 0.7rem;
        background: url(../assets/img/common/star-gray.png);
        background-size: 3rem auto;
        background-repeat: no-repeat;
        overflow: hidden;
        .comment-star {
            height: 0.7rem;
            width: 100%;
            background: url(../assets/img/common/star.png);
            background-size: 3rem auto;
            background-repeat: no-repeat;
        }
    }
}
</style>
