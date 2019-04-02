const ls = {
    prefix: 'film_',
    installed: false,
    install: function (Vue) {
        Object.defineProperty(Vue.prototype, '$ls', {
            get () {
                return {
                    setItem (key, value) {
                        this.storage().setItem(ls.prefix + key, JSON.stringify(value))
                    },
                    getItem (key) {
                        var _strinify = this.storage().getItem(ls.prefix + key)
                        try {
                            return JSON.parse(_strinify)
                        } catch (e) {
                            return _strinify || null
                        }
                    },
                    removeItem (key) {
                        this.storage().removeItem(ls.prefix + key)
                    },
                    removeAll () {
                        var store = this.storage()
                        // 过滤不需要删除的缓存 注意加上前缀
                        var filter = []
                        for (var item in store) {
                            if (item && item.indexOf(ls.prefix) > -1 && filter.indexOf(item) < 0) {
                                store.removeItem(item)
                            }
                        }
                    },
                    storage () {
                        try {
                            return window.localStorage
                        } catch (e) {
                            alert('浏览器安全级别过高无法访问本地缓存，请先将网站设置到信任站点，并重启浏览器，或换用Chrome浏览器！')
                        }
                    }
                }
            }
        })
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(ls)
}
export default ls
