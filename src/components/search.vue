<template>
    <div class="search-content" >
        <div class="mint-searchbar">
            <div class="mint-searchbar-inner">
                <i class="icon-search"></i>
                <input ref="searchInput" type="search" placeholder="请输入搜索关键词"
                    v-model="searchName" class="mint-searchbar-core"
                    @keydown="_keydown">
            </div>
            <a class="mint-searchbar-cancel" @click="cancel">取消</a>
        </div>
        <ul class="search-list" v-if="!searchName && list.length > 0">
            <li class="record">搜索记录</li>
            <li v-for="(item, index) in list" :key="index" @click="change(item)">{{item}}</li>
            <li class="record clean" @click="cleanHistory"><i class="icon-trash-2"></i> 清空搜索记录</li>
        </ul>
        <div @click="select">
            <slot name="list"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cinema-search',
    props: {
        show: Boolean,
        defStoreName: Boolean, // 默认记录填充历史记录到输入框
        storeName: {
            type: String,
            default: 'cinema' // 历史搜索缓存的对象名 默认cinema
        }
    },
    data () {
        return {
            searchName: '',
            preHistory: 'history_',
            list: []
        }
    },
    created () {
        this.$nextTick(() => {
            this.getHistory()
            setTimeout(() => {
                this.$refs['searchInput'].focus()
            }, 1000)
        })
    },
    methods: {
        setHistory () {
            let storeName = this.preHistory + this.storeName
            let history = this.$ls.getItem(storeName) || []
            if (!this.searchName) return
            history.unshift(this.searchName)
            let num = history.length > 5 ? 6 : history.length
            let newHis = []
            for (let i = 0; i < num; i++) {
                newHis.push(history[i])
            }
            newHis = Array.from(new Set(newHis)) // 去重
            this.$ls.setItem(storeName, newHis)
            this.list = newHis
        },
        getHistory () {
            this.list = this.$ls.getItem(this.preHistory + this.storeName) || []
            if (this.defStoreName) {
                this.searchName = this.list[0]
            }
        },
        cleanHistory () {
            this.$ls.removeItem(this.preHistory + this.storeName)
            this.list = []
        },
        change (n) {
            this.searchName = n
            this.setHistory()
        },
        cancel () {
            this.$emit('cancel')
        },
        _keydown (e) { // 搜索键移动端得测
            let _keyCode = e.keyCode || e.which
            if (_keyCode == 13) {
                this.setHistory()
            }
        },
        select () { // 点击查询出的列表记录历史
            this.setHistory()
        }
    },
    watch: {
        // show: function (n, o) {
        //     if (n) {
        //         this.$nextTick(() => {
        //             this.searchName = ''
        //             this.getHistory()
        //             this.$refs['searchInput'].focus()
        //         })
        //     }
        // },
        searchName: function (n, o) {
            if (!n) {
                this.setHistory(n)
            }
            this.$emit('change', n)
        }
    }
}
</script>
<style lang="less">
    .search-content {
        width: 100%;
        height: 100%;
        background: #fff;
        .mint-searchbar {
            position: relative;
            -webkit-align-items: center;
            align-items: center;
            background: #fff;
            box-sizing: border-box;
            display: -webkit-flex;
            display: flex;
            padding: 10px 10px;
            z-index: 1;
            border-top: 0;
            border-bottom: 1px solid #d2cfcf;
        }
        .icon-search {
            font-size: 13px;
            color: #524f4f;
        }
        .mint-searchbar-inner {
            -webkit-align-items: center;
            align-items: center;
            background-color: #E8E8E8;
            border-radius: 2px;
            display: -webkit-flex;
            display: flex;
            -webkit-flex: 1;
            flex: 1;
            height: 28px;
            padding: 4px 6px;
            border-radius: 5px;
        }
        .mint-searchbar-core {
            -webkit-appearance: none;
            appearance: none;
            border: 0;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            outline: 0;
            background-color: #E8E8E8;
            padding-left: 5px;
        }
        .mint-searchbar-cancel {
            color: #3e3c3c;
        }
        .search-list {
            border-bottom: 1px solid #E8E8E8;
            font-size: 14px;
            li {
                height: 40px;
                line-height: 40px;
                margin-left: 10px;
                color: #3e3c3c;
            }
            li + li {
                border-top: 1px solid #E8E8E8;
            }
            .record {
                color: #9e9e9e;
            }
            .clean {
                text-align: center;
                .icon-trash-2 {
                    font-size: 13px;
                }
            }
        }
    }
</style>
