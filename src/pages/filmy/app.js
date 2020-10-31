/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/libs/i18n'

import LandingRoute from '@/router-components/Landing.vue'
import CategoryRoute from '@/router-components/Category.vue'
import AlbumRoute from '@/router-components/Album.vue'
import SearchRoute from '@/router-components/Search.vue'

import '@/assets/css/layout.css'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'landing',
        component: LandingRoute
    },
    {
        path: '/category/:name',
        name: 'category',
        component: CategoryRoute
    },
    {
        path: '/album/:key',
        name: 'album',
        component: AlbumRoute
    },
    {
        path: '/search/:query',
        name: 'search',
        component: SearchRoute
    }
]

const router = new VueRouter({
    routes
})

Vue.filter('i18n', i18n)
Vue.filter('toUpperCase', str => str.toUpperCase())
Vue.filter('toLowerCase', str => str.toLowerCase())
Vue.filter('firstLetterUpperCase', str =>
    str
        .replace(/([.!?;]+)/g, '$1|-|-|')
        .split('|-|-|')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s[0].toUpperCase() + s.slice(1))
        .reduce((a, b) => `${a} ${b}`)
)

new Vue({
    el: '#app',
    router: router,
    template: '<router-view></router-view>'
    // render: h => h(Admin)
})
