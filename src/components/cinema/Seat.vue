<template>
    <div class="seat-part">
        <div class="seat-top">
            <span class="example"><label class="seat">可选</label></span>
            <span class="example"><label class="seat seat-Lovers">情侣座</label></span>
            <span class="example"><label class="seat seat-bought">已选</label></span>
        </div>
        <div class="seat-content" ref="seatContent">
            <div class="trapezoid">{{hallName}}</div>
            <div class="seat-table" ref="seatTable" :style="tableStyle" @scroll=handleScroll>
                <div class="left-example" :style="leftExampleHeight">
                    <span class="example" v-for="i in seat.sortNum" :key="i">{{i}}</span>
                </div>
                <a class="s-column" v-for="i in seat.sortNum" :key="i">
                    <a class="seat s-row" :class="{'seat-couple': s.couple, 'seat-empty': s.empty, 'seat-bought':  !s.couple && !s.canSell, 'seat-select': !s.couple && selectSeatNums.indexOf(s.seatNo) > -1,
                        'seat-couple-left': s.coupleIndex % 2 === 0, 'seat-couple-right': s.coupleIndex % 2 === 1,
                        'seat-couple-select': s.couple && selectSeatNums.indexOf(s.seatNo) > -1, 'seat-couple-bought': s.couple && !s.canSell}"
                        v-for="(s, r) in seat.seatDetailList[i]" :key="r" @click="checkSeat(s, $event)">
                    </a>
                </a>
                <div class="cinema-center" :style="cinemaCenterStyle">
                    <span>银幕中央</span>
                    <hr :style="rowHeightStyle">
                </div>
                <div class="best-view" :style="bestStyle"></div>
            </div>
        </div>
        <div class="seat-bottom" :class="{'seat-bottom-max': this.selectSeat.length > 4}">
            <div class="seat-select-part">
                <div class="part" v-for="(s, i) in this.selectSeat" :key="i" @click="cancelSeat(s)">
                    <span>{{s.seatName}}</span>
                    <span class="money">{{ticketMoney}}元</span>
                </div>
            </div>
            <div class="btn">
                <button class="mint-button--pink" :class="{'unbutton': this.selectSeat < 1}" @click="submit">
                    <label>{{!totalMoney ? '请先选座' : totalMoney + ' 确认选座'}}</label>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'seat',
    props: {
        hallName: String,
        seat: {
            sortNum: [],
            seatDetailList: []
        },
        maxTicket: { // 一次做多选的票数
            type: String,
            default: '4'
        },
        isVip: Boolean // 是否vip
    },
    data () {
        return {
            selectSeatNums: [], // 已选中座位 用来控制显示颜色
            selectSeat: [], // 已选中座位对象 用于抛出
            tableStyle: {}, // 计算整个画布高度
            leftExampleHeight: {}, // 计算左边定位高度
            cinemaCenterStyle: {}, // 屏幕中间位置
            rowHeightStyle: {}, // 座位总高度
            bestStyle: {}, // 计算最佳影区位置
            ticketMoney: '',
            totalMoney: '',
            coupleList: [] // 存储情侣座信息
        }
    },
    created () {
        sessionStorage.removeItem('cinemaScroll')
    },
    mounted () {
    },
    activated () {
        let scroll = JSON.parse(sessionStorage.getItem('cinemaScroll') || '{}')
        this.$refs.seatTable.scrollBy(scroll.left, scroll.top)
    },
    methods: {
        checkSeat (s, e) {
            if (s.canSell) {
                let i = this.selectSeatNums.indexOf(s.seatNo)
                if (i > -1) { // 已选中再次点击取消选中
                    this.cancelSeat(s)
                } else {
                    if (this.selectSeatNums.length >= this.maxTicket) {
                        this.$toast('一次最多购买4张票')
                        return
                    }
                    if (s.couple) { // 情侣座特殊处理
                        if (this.selectSeatNums.length >= this.maxTicket - 1) {
                            this.$toast('一次最多购买4张票，情侣座为2张票')
                            return
                        }
                        this.setCoupleSeat(s, 'add')
                    } else {
                        this.selectSeat.push(s)
                        this.selectSeatNums.push(s.seatNo)
                    }
                }
                this.moneyCount()
            }
        },
        cancelSeat (s) { // 点击选中的票取消改选中
            if (s.couple) {
                this.setCoupleSeat(s, 'del')
            } else {
                let i = this.selectSeatNums.indexOf(s.seatNo)
                this.selectSeat.splice(i, 1)
                this.selectSeatNums.splice(i, 1)
            }
        },
        transColumn (r, c) { // 列数转换补0
            c = c > 9 ? c : '0' + c
            return r + '排' + c + '座'
        },
        moneyCount () { // 计算金额
            this.totalMoney = this.selectSeatNums.length > 0 ? this.selectSeatNums.length * this.ticketMoney + ' 元' : ''
        },
        bestSeatCount () { // 最佳影区和屏幕中央计算
            let bestView = this.seat.bestViewArea
            let seatTableTop = 45 // 座位画布距顶端偏移量
            let seatSize = 25 // 一个座位占的大小  目前一座位加间隔 25
            let width = ((bestView.bestMaxColumn - bestView.bestMinColumn) + 1) * seatSize
            let height = ((bestView.bestMaxRow - bestView.bestMinRow) + 1) * seatSize
            let top = bestView.bestMinRow * seatSize + seatTableTop - 3
            let left = bestView.bestMinColumn * seatSize - 3
            let seatNum = this.seat.seatDetailList[1].length // 单行座位最长个数
            let column = seatNum * seatSize // 座位行总宽度
            let row = this.seat.sortNum.length * seatSize // 座位列总高度
            // 总长度/2 + 座位画布偏左移量25 - 银幕中央宽度60/2 - 一个座位的偏移量5
            let columnCenter = column / 2 + seatSize - 60 / 2 - 5 // 中间位置
            this.tableStyle = { // 画布高度
                height: this.$refs.seatContent.clientHeight - 170 + 'px'
            }
            this.bestStyle = {
                width: width + 'px',
                height: height + 'px',
                top: top + 'px',
                left: left + 'px'
            }
            this.cinemaCenterStyle = {
                left: columnCenter + 'px',
                top: '40px'
            }
            this.rowHeightStyle = {
                height: row + 15 + 'px'
            }
            this.$nextTick(() => {
                let tabCenter = this.$refs.seatTable.clientWidth / 2 // 屏幕中间位置
                let scrollLeft = columnCenter - tabCenter + 30 // 银幕中间位置-银幕中央宽度/2+偏移量
                this.$refs.seatTable.scrollBy(scrollLeft, 0)
            })
        },
        handleScroll (e) {
            this.leftExampleHeight = {
                left: e.target.scrollLeft + 5 + 'px'
            }
        },
        coupleSeat (item) { // 遍历情侣座位置
            for (const key in item) {
                item[key].forEach((seat, i) => {
                    seat.seatName = this.transColumn(seat.rowId, seat.columnId)
                    if (seat.couple) {
                        seat.coupleIndex = this.coupleList.length
                        this.coupleList.push(seat)
                    }
                })
            }
        },
        setCoupleSeat (item, type) { // 点击情侣座时获取相关联座位并选中
            let coupleIndex = item.coupleIndex
            let leftIndex = 0
            let rightIndex = 0
            let removeSortIndex = 0
            if (coupleIndex % 2 === 0) {
                leftIndex = coupleIndex
                rightIndex = coupleIndex + 1
                removeSortIndex = 0
            } else {
                leftIndex = coupleIndex - 1
                rightIndex = coupleIndex
                removeSortIndex = 1
            }
            if (type == 'add') {
                this.selectSeat.push(this.coupleList[leftIndex], this.coupleList[rightIndex])
                this.selectSeatNums.push(this.coupleList[leftIndex].seatNo, this.coupleList[rightIndex].seatNo)
            } else {
                let i = this.selectSeatNums.indexOf(item.seatNo)
                i = i - removeSortIndex
                this.selectSeat.splice(i, 2)
                this.selectSeatNums.splice(i, 2)
            }
        },
        submit () {
            if (this.selectSeat.length > 0) {
                let cinemaScroll = {
                    left: this.$refs.seatTable.scrollLeft,
                    top: this.$refs.seatTable.scrollTop
                }
                sessionStorage.setItem('cinemaScroll', JSON.stringify(cinemaScroll))
                this.$emit('submit', this.selectSeat)
            }
        }
    },
    watch: {
        seat: {
            handler (n, o) {
                if (this.isVip) { // 根据是否vip获取每张票默认金额
                    this.ticketMoney = n.vipPrice
                } else {
                    this.ticketMoney = n.price
                }
                // 最佳观影区
                if (n.bestViewArea) {
                    this.bestSeatCount()
                }
                // 情侣座处理
                this.coupleSeat(n.seatDetailList)
            },
            deep: true
        }
    }
}
</script>
<style lang="less">
.seat-part {
    height: 100%;
    width: 100%;
    background: #fff;
    .seat-top {
        margin: 0 10px;
        border-top: 1px solid #E8E8E8;
        text-align: center;
        .example {
            display: inline-block;
            height: 35px;
            line-height: 35px;
            width: 70px;
        }
    }
    .seat-content {
        background: #eee;
        height: 100%;
        .trapezoid {
            position: fixed;
            transform: translateX(50%);
            z-index: 4;
            width: 50%;
            text-align: center;
            height: 25px;
            line-height: 24px;
            font-size: 12px;
        }
        .trapezoid::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            background: #cecdcd;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            transform: perspective(10px) rotateX(-1deg);
        }
        .seat-table {
            overflow: scroll;
            padding: 45px 0 45px 25px;
            padding-top: 70px;
            text-align: center;
            position: relative;
            .s-column {
                display: flex;
                position: relative;
                z-index: 2;
            }
            .cinema-center {
                position: absolute;
                color: #cecdcd;
                border: 1px solid #cecdcd;
                width: 60px;
                height: 18px;
                border-radius: 5px;
                font-size: 12px;
                hr {
                    position: absolute;
                    z-index: 1;
                    border: 0;
                    border-left: 1px dashed;
                    width: 60px;
                    transform: translateX(50%);
                    pointer-events: none;
                }
            }
            .left-example {
                position: absolute;
                z-index: 3;
                background: rgba(158, 158, 158, 0.5);
                width: 16px;
                border-radius: 10px;
                left: 5px;
                pointer-events: none;
                margin-top: -8px;
                padding: 5px 0;
                .example {
                    display: block;
                    font-size: 12px;
                    line-height: 25px;
                }
            }
            .best-view {
                position: absolute;
                border: 1px dashed pink;
                pointer-events: none;
            }
        }
    }
    .seat {
        position: relative;
        padding: 0 0 25px 25px;
        height: 20px;
        line-height: 20px;
    }
    .seat::before {
        content: '';
        background-image:url('../../assets/img/seat/unselected.png');
        background-size: 100%;
        position: absolute;
        height: 20px;
        width: 20px;
        left: 0;
        top: 0;
    }
    .seat-select {
        position: relative;
    }
    .seat-select::before {
        content: '';
        background-image:url('../../assets/img/seat/selected.png');
    }
    .seat-select::after {
        content: '\E915';
        position: absolute;
        width: 20px;
        left: 0;
        top: 0;
        color: #fff;
        font-family: 'icomoon' !important;
    }
    .seat-bought::before {
        content: '';
        background-image:url('../../assets/img/seat/bought.png');
    }
    .seat-Lovers::before {
        content: '';
        background-image:url('../../assets/img/seat/lovers.png');
    }
    .seat-couple {
        padding: 0 0 0 23px;
    }
    .seat-couple::before {
        content: '';
        background-image:url('../../assets/img/seat/couple.png');
        background-size: auto 100%;
        background-repeat: no-repeat;
        width: 23px;
        height: 18px;
        top: 1px;
    }
    .seat-couple-left::before {
        content: '';
        background-position: left;
    }
    .seat-couple-right {
        padding-right: 4px;
    }
    .seat-couple-right::before {
        content: '';
        background-position: right;
    }
    .seat-couple-select::before {
        content: '';
        background-image:url('../../assets/img/seat/couple_2.png') !important;
    }
    .seat-couple-bought::before {
        content: '';
        background-image:url('../../assets/img/seat/couple_3.png') !important;
    }
    .seat-empty::before {
        background-image: none;
    }
    .seat-bottom {
        position: fixed;
        background: #fff;
        bottom: 0;
        width: 100%;
        height: 120px;
        padding: 10px;
        z-index: 4;
        .seat-select-part {
            display: flex;
            flex-wrap: wrap;
            min-height: 60px;
            padding-bottom: 15px;
            margin: -10px 0 0 -10px;
            .part {
                position: relative;
                display: inline-block;
                font-size: 12px;
                height: 35px;
                width: 22%;
                border: 1px solid #E8E8E8;
                border-radius: 4px;
                margin: 10px 0 0 10px;
                span {
                    display: block;
                    padding: 2px;
                    height: 14px;
                    text-align: center;
                }
                .money {
                    color: #F95309;
                }
            }
            .part::before {
                content: 'x';
                position:absolute;
                color: #9E9E9E;
                right: 4px;
                top: 0;
                height: 14px;
                transform: translateY(50%);
            }
            .part::after {
                content: '';
                position: absolute;
                background: #fff;
                width: 14px;
                height: 7px;
                border: 1px solid #E8E8E8;
                border-bottom: 0;
                border-radius: 7px 7px 0 0;
                top: 12px;
                left: -5px;
                transform: rotate(90deg)
            }
        }
    }
    .seat-bottom-max {
        height: 165px;
    }
    .mint-button--pink {
        -webkit-appearance: none;
        appearance: none;
        border: 0;
        box-sizing: border-box;
        display: block;
        font-size: 18px;
        height: 41px;
        outline: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        border-radius: 45px;
        width: 100%;
        color: #fff;
        background: linear-gradient(to right, #fb8c9f, #fd5875);
    }
    .unbutton {
        opacity: 0.5;
    }
}
</style>
