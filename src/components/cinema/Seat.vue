<template>
    <div class="seat-part">
        <div class="seat-top">
            <span class="example"><label class="seat">可选</label></span>
            <span class="example" v-if="coupleList.length > 0"><label class="seat seat-Lovers">情侣座</label></span>
            <span class="example"><label class="seat seat-bought">已选</label></span>
        </div>
        <div class="trapezoid">
            <span>{{hallName}}</span>
        </div>
        <div class="seat-content" ref="seatContent" :style="seatContentStyle">
            <div class="seat-table" ref="seatTable" :style="tableStyle" @scroll=handleScroll @touchstart="touchstart" @touchend="touchend">
                <div class="left-example" :style="leftExampleStyle">
                    <span class="example" v-for="(i, index) in seat.seatDetailList" :key="index">{{i[0].rowId}}</span>
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
import { numberFormat } from '@/libs/tools'
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
            unselectedSeat: {}, // 可以选择的座位
            coupleList: [], // 存储情侣座信息
            selectSeatNums: [], // 已选中座位 用来控制显示颜色
            selectSeat: [], // 已选中座位对象 用于抛出
            checkSelectSeatGrou: {}, // 根据行列区分组选中座位
            seatContentStyle: {},
            tableStyle: {}, // 计算整个画布高度
            leftExampleStyle: {}, // 计算左边定位高度
            cinemaCenterStyle: {}, // 屏幕中间位置
            rowHeightStyle: {}, // 座位总高度
            showMaxSeatRow: 0, // 显示最多那排座位数
            bestStyle: {}, // 计算最佳影区位置
            ticketMoney: '',
            totalMoney: '',
            mousedownState: false, // 鼠标默认抬起
            iX: 0, // 鼠标坐标 与 拖拽按钮 间距 x
            iY: 0 // 鼠标坐标 与 拖拽按钮 间距 y
        }
    },
    created () {
        sessionStorage.removeItem('cinemaScroll')
    },
    mounted () {
    },
    activated () {
        let scroll = JSON.parse(sessionStorage.getItem('cinemaScroll') || '{}')
        this.$refs.seatTable.scrollTop = scroll.top
        this.$refs.seatTable.scrollLeft = scroll.left
    },
    methods: {
        bestSeatCount () { // 最佳影区和屏幕中央计算
            let scale = 1
            let bestView = this.seat.bestViewArea
            let seatTableTop = 45 // 座位画布距顶端偏移量
            let seatSize = 25 * scale // 一个座位占的大小  目前一座位加间隔 25
            let width = ((bestView.bestMaxColumn - bestView.bestMinColumn) + 1) * seatSize
            let height = ((bestView.bestMaxRow - bestView.bestMinRow) + 1) * seatSize
            let top = bestView.bestMinRow * seatSize + seatTableTop - 3
            let left = bestView.bestMinColumn * seatSize - 3
            let seatNum = this.seat.seatDetailList[1].length // 单行座位最长个数
            let column = seatNum * seatSize // 座位行总宽度
            let rowNum = this.seat.sortNum.length // 总排数
            let row = rowNum * seatSize // 座位列总高度
            // 总长度/2 + 座位画布偏左移量25 - 银幕中央宽度60/2 - 一个座位的偏移量5
            let columnCenter = column / 2 + seatSize - 60 / 2 - 5 // 中间位置
            let showMaxSeatRowWidth = this.showMaxSeatRow * seatSize
            let tableLeft = 0
            this.$nextTick(() => {
                if (document.body.clientWidth - showMaxSeatRowWidth > seatSize * 2) {
                    tableLeft = document.body.clientWidth - showMaxSeatRowWidth
                    this.seatContentStyle = {
                        overflow: 'auto'
                    }
                }
                // 最佳位置 目前设置排列均需大于5才有最佳
                if (this.showMaxSeatRow > 5 && rowNum > 5) {
                    this.bestStyle = {
                        width: `${width}px`,
                        height: `${height}px`,
                        top: `${top}px`,
                        left: `${left}px`
                    }
                }
                this.tableStyle = { // 画布
                    height: `${this.$refs.seatContent.clientHeight - 170}px`,
                    left: `${tableLeft / 3}px`
                }
                this.cinemaCenterStyle = {
                    left: `${columnCenter}px`,
                    top: '40px'
                }
                this.rowHeightStyle = {
                    height: `${row + 15}px`
                }
                let tabCenter = this.$refs.seatTable.clientWidth / 2 // 屏幕中间位置
                let scrollLeft = columnCenter - tabCenter + 30 // 银幕中间位置-银幕中央宽度/2+偏移量
                this.$refs.seatTable.scrollLeft = scrollLeft
            })
        },
        handleScroll (e) {
            if (this.mousedownState) {
                setTimeout(() => {
                    this.handleScroll(e)
                }, 0)
                return
            }
            this.leftExampleStyle = {
                left: `${e.target.scrollLeft + 5}px`,
                transition: 'all .5s'
            }
            this.tableStyle = {
                height: `${this.$refs.seatContent.clientHeight - 170}px`,
                left: 0
            }
        },
        coupleSeat (item) { // 遍历座位
            let showMaxSeatRows = []
            for (const key in item) {
                let r = 0
                item[key].forEach((seat, i) => {
                    // 座位中文名
                    seat.seatName = this.transColumn(seat.rowId, seat.columnId)
                    // 情侣座
                    if (seat.couple) {
                        seat.coupleIndex = this.coupleList.length
                        this.coupleList.push(seat)
                    }
                    if (!seat.empty) {
                        if (seat.canSell) {
                            if (!this.unselectedSeat[seat.rowId]) this.unselectedSeat[seat.rowId] = []
                            this.unselectedSeat[seat.rowId].push(String(Number(seat.columnId)))
                        }
                        ++r
                    }
                })
                // 每排显示能看见的座位数
                showMaxSeatRows.push(r)
            }
            // 显示最多那排座位数
            this.showMaxSeatRow = Math.max(...showMaxSeatRows)
            // 最佳观影区
            this.bestSeatCount()
        },
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
            c = c > 9 ? c : '0' + Number(c)
            return r + '排' + c + '座'
        },
        moneyCount () { // 计算金额
            this.totalMoney = this.selectSeatNums.length > 0 ? numberFormat(this.selectSeatNums.length * this.ticketMoney, 2) + ' 元' : ''
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
        // 将连续座位分组
        grouSingSeat (column, unseat) {
            let grou = {}
            column.forEach(c => {
                let seats = unseat[c]
                if (seats.length > 1) {
                    var index = 0
                    grou[c] = []
                    grou[c][index] = [seats[0]]
                    for (var i = 1; i < seats.length + 1; i++) {
                        if (seats[i]) {
                            if (Math.abs(seats[i] - (seats[i - 1])) != 1) {
                                grou[c][++index] = [seats[i]]
                            } else {
                                grou[c][index].push(seats[i])
                            }
                        }
                    }
                }
            })
            return grou
        },
        checkSingSeat (news, olds) {
            let flag = 0
            for (const key in news) {
                let temp = news[key]
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].length < 2) {
                        let defcz = false
                        olds[key].filter((o, index) => {
                            // 原数据已是留单个座位
                            if (o.indexOf(temp[i][0]) > -1 && o.length == 1) {
                                defcz = true
                            }
                        })
                        if (!defcz) {
                            if (i != 0 && i !== temp.length - 1) {
                                ++flag
                            } else {
                                let s1 = String(Number(temp[i][0]) + 1)
                                let s2 = String(Number(temp[i][0]) - 1)
                                // 首或尾留单
                                let checkSelectSeatGrou = this.checkSelectSeatGrou[key].sort()
                                if (checkSelectSeatGrou.indexOf(s1) > -1 || checkSelectSeatGrou.indexOf(s2) > -1) {
                                    let t = i == 0 ? i + 1 : i - 1
                                    let num = 0
                                    // 选后临近两个相邻空位需要大于2
                                    num = Number(temp[i][0]) < Number(temp[t][0]) ? Math.abs(Number(temp[i][0]) - Number(Math.min.apply(Math, temp[t]))) : Math.abs(Number(temp[i][0]) - Number(Math.max.apply(Math, temp[t])))
                                    if (num < 3) {
                                        ++flag
                                    } else {
                                        // 选择的座位是中间有空一个位置
                                        for (var s = 0; s < checkSelectSeatGrou.length; s++) {
                                            if (checkSelectSeatGrou[s + 1] && (Number(checkSelectSeatGrou[s + 1]) - Number(checkSelectSeatGrou[s]) != 1)) {
                                                if (checkSelectSeatGrou[s] == Number(temp[i][0]) + 1 || checkSelectSeatGrou[s] == Number(temp[i][0]) - 1) {
                                                    ++flag
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (flag > 0) {
                return true
            }
        },
        cutSeatFlag () {
            // 能选择的座位
            let seat = JSON.parse(JSON.stringify(this.unselectedSeat))
            // 选中的排数
            let selectColumn = []
            this.checkSelectSeatGrou = []
            this.selectSeat.filter(item => {
                if (!this.checkSelectSeatGrou[item.rowId]) this.checkSelectSeatGrou[item.rowId] = []
                this.checkSelectSeatGrou[item.rowId].push(String(Number(item.columnId)))
                let row = seat[item.rowId]
                if (row.indexOf(String(Number(item.columnId))) > -1) {
                    // 将选中的位置从没选择的位置中过滤掉
                    row.splice(row.indexOf(String(Number(item.columnId))), 1)
                    selectColumn.push(item.rowId)
                }
            })
            let grouNews = this.grouSingSeat(Array.from(new Set(selectColumn)), seat)
            let grouOlds = this.grouSingSeat(Array.from(new Set(selectColumn)), this.unselectedSeat)
            // 座位是否留单
            return this.checkSingSeat(grouNews, grouOlds)
        },
        submit () {
            if (this.selectSeat.length > 0) {
                if (this.cutSeatFlag()) {
                    this.$toast('相邻座位不能留空')
                    return
                }
                let cinemaScroll = {
                    left: this.$refs.seatTable.scrollLeft,
                    top: this.$refs.seatTable.scrollTop
                }
                sessionStorage.setItem('cinemaScroll', JSON.stringify(cinemaScroll))
                this.$emit('submit', this.selectSeat)
            }
        },
        touchstart (event) {
            var touch
            if (event.touches) {
                touch = event.touches[0]
            } else {
                touch = event
            }
            // 鼠标点击 面向页面 的 x坐标 y坐标
            let { clientX, clientY } = touch
            this.iX = clientX
            this.iY = clientY
            // 设置当前 状态为 鼠标按下
            this.mousedownState = true
        },
        touchmove (event) {
            let touch
            if (event.touches) {
                touch = event.touches[0]
            } else {
                touch = event
            }
            let { clientX, clientY } = touch
            let [x, y] = [clientX - this.iX, clientY - this.iY]
            let {
                style: actionMgrStyle
            } = this.$refs.seatTable
            actionMgrStyle.left = `${x}px`
            actionMgrStyle.top = `${y}px`
            event.preventDefault()
        },
        touchend (event) {
            this.mousedownState = false
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
                // 座位遍历处理
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
    .trapezoid {
        position: fixed;
        transform: translateX(50%);
        z-index: 4;
        width: 50%;
        text-align: center;
        height: 25px;
        line-height: 25px;
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
        border-bottom: 25px solid #cecdcd;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        transform: rotate(180deg);
    }
    .seat-content {
        background: #eee;
        height: 100%;
        .seat-table {
            overflow: scroll;
            padding: 45px 25px 45px 25px;
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
                    height: 25px;
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
                width: 21.5%;
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
                right: 3px;
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
