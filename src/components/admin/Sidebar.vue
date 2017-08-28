<template>
  <div id="sidebar" ref="sidebar">
    <h2>Filmy Admin</h2>

    <ul class="nav nav-pills nav-stacked">
      <li role="presentation" :class="{ active: active == 'dashboard' }">
        <router-link to="/dashboard">{{'dashboard' | i18n}}</router-link>
      </li>
      <li role="presentation" :class="{ active: active == 'settings' }">
        <router-link to="/settings">{{'setting' | i18n}}</router-link>
      </li>
      <li role="presentation" :class="{ active: active == 'categories' }">
        <router-link to="/categories">
          {{'category' | i18n}}
          <span class="badge">{{categories}}</span>
        </router-link>
      </li>
      <li role="presentation" :class="{ active: active == 'albums' }">
        <router-link to="/albums">
          {{'album' | i18n}}
          <span class="badge">{{albums}}</span>
        </router-link>
      </li>
      <hr/>
      <li role="presentation"><a target="_blank" href="/">{{'go to home page' | i18n}}</a></li>
    </ul>
  </div>
</template>

<script>
  import {sideBarBus} from '../../entries/admin-main'
  export default {
    created () {
      sideBarBus.$on('sideBarUpdate', (categories, albums) => {
        this.categories = categories
        this.albums = albums
      })
    },
    data () {
      return {
        categories: 0,
        albums: 0,
        active: 'dashboard'
      }
    },
    mounted: function () {
      this.$nextTick(function () {
      })
      this.$router.push('dashboard')
      this.$router.beforeEach((to, from, next) => {
        this.active = to.path.split('/')[1]
        next()
      })
      new Affix(this.$refs.sidebar, {
        offsetTop: 50
      })
    },
    methods: {
//      update (categories = this.categories, albums = this.albums) {
//        this.categories = categories
//        this.albums = albums
//      }
    }
  }
</script>

<style scoped>

</style>
