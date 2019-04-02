<template>
    <div id="app">
        <transition :name="transition">
            <keep-alive :include="keepaliveList">
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'app',
    computed: {
        ...mapState('keepalive', {
            keepaliveList: state => state.list,
            transition: state => state.forward ? 'slide-left' : 'slide-right'
        })
    }
}
</script>