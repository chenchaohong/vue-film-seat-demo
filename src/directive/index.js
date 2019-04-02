import directive from './directives'
export default {
    install (Vue) {
        Vue.directive('draggable', directive.draggable)
        Vue.directive('money', directive.money)
        Vue.directive('number', directive.number)
        Vue.directive('maxheight', directive.maxheight)
    }
}
