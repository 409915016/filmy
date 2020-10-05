/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'

import 'sweetalert'

import i18n from '@/libs/i18n'
import Admin from '@/components/admin/Admin.vue'

// Routes
import DashboardRoute from '@/router-components/admin/Dashboard.vue'
import SettingsRoute from '@/router-components/admin/Settings.vue'
import CategoriesRoute from '@/router-components/admin/Categories.vue'
import CategoryRoute from '@/router-components/admin/Category.vue'
import AlbumsRoute from '@/router-components/admin/Albums.vue'
import AlbumRoute from '@/router-components/admin/Album.vue'

// Qiniu Cloud Storage Bucket Instance
import filmyBucket from '@/models/qiniu-bucket'

Vue.filter('i18n', i18n)
Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: DashboardRoute
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardRoute
    },
    {
        path: '/categories',
        name: 'categories',
        component: CategoriesRoute
    },
    {
        path: '/categories/:name',
        name: 'category',
        component: CategoryRoute
    },
    {
        path: '/albums',
        name: 'albums',
        component: AlbumsRoute
    },
    {
        path: '/albums/:key',
        name: 'album',
        component: AlbumRoute
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsRoute
    }
]

const router = new VueRouter({
    routes
})

// Promisify sweetalert
const swalp = (...args) => {
    return new Promise(resolve => {
        swal(...args, (...argv) => resolve(...argv))
    })
}

// Confirm the admin password
swalp({
        title: i18n('input password'),
        type: 'input',
        inputType: 'password',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        showLoaderOnConfirm: true
    })
    // Check the password
    .then(password => filmyBucket.fetchPutToken(password))
    .then(() => {
        swal({
            type: 'success',
            title: i18n('welcome back'),
            timer: 1500,
            showConfirmButton: false
        })

        new Vue({
            el: '#admin',
            router,
            render: h => h(Admin)
        })
    })
    .catch(() => {
        console.log('fail')
        swalp({
            title: i18n('password wrong'),
            type: 'error'
        })
    });

export const sideBarBus = new Vue()