<template>
  <div id="landing">
    <search-bar :router="$route.router"></search-bar>
    <landing-view :config="config"></landing-view>
    <Content :categories="categories"></Content>
  </div>
</template>

<script>
  import Config from '../models/Config'
  import Category from '../models/Category'
  import LandingView from '../components/LandingView.vue'
  import Content from '../components/Content.vue'
  import SearchBar from '../components/SearchBar.vue'
  export default {
    name: 'LandingPage',
    data () {
      return {
        config: {},
        categories: []
      }
    },
    mounted () {
      Promise.all([
        Config.load(),
        Category.load()
      ])
        .then(([config, categories]) => {
          this.config = config
          this.categories = categories
//          this.$dispatch('update-blog-title', this.config.title)
//          this.$dispatch('update-title', '')
          // emit
          this.$emit('update-blog-title', this.config.title)
          this.$emit('update-title', '')
        })
    },
    components: {
      LandingView,
      Content, // <Content :categories="categories"></Content>
      SearchBar
    }
  }
</script>
