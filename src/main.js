import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import axios from '@/libs/axios'
import mixins from '@/libs/mixins'
import directives from '@/directive'
import filters from '@/libs/filters'
import ls from '@/libs/vueStore'
import {
    Cell, Swipe, SwipeItem, Toast, MessageBox, Button, Header, Navbar,
    TabItem, TabContainer, TabContainerItem, Switch, InfiniteScroll,
    Spinner, IndexList, IndexSection,
    Indicator
} from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/styles/index.less'
import PageLoading from '@/components/layout/PageLoading.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ItemCell from '@/components/cinema/ItemCell.vue'
import FastClick from 'fastclick'

Vue.config.productionTip = false

Vue.mixin(mixins)
Vue.use(directives)
Vue.use(ls)

Vue.component(Cell.name, Cell)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Switch.name, Switch)
Vue.component(Spinner.name, Spinner)
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)
Vue.use(InfiniteScroll)

Vue.component(PageLoading.name, PageLoading)
Vue.component(PageHeader.name, PageHeader)
Vue.component(ItemCell.name, ItemCell)

Vue.prototype.$http = axios
Vue.prototype.$toast = Toast
Vue.prototype.$alert = MessageBox
Vue.prototype.$loading = Indicator

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// store 恢复
if (sessionStorage.getItem('VUEX_STORE')) {
    store.replaceState(JSON.parse(sessionStorage.getItem('VUEX_STORE')))
    sessionStorage.removeItem('VUEX_STORE')
}

// 页面刷新或离开
window.onunload = function () {
    sessionStorage.setItem('VUEX_STORE', JSON.stringify(store.state))
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

FastClick.attach(document.body)
