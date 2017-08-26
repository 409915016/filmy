<template>
  <div>
    <!-- Router View -->
    <router-view transition="fade" transition-mode="out-in"></router-view>
    <filmy-footer></filmy-footer>
  </div>
</template>

<script>
  import Footer from './Footer.vue'
  export default {
    data () {
      return {
        // Default document title
        blogTitle: 'Filmy'
      }
    },
    components: {
      'FilmyFooter': Footer
    },
    mounted () {
      // Using events to update title
      // 监听从子组件中触发的 $emit
      this
        .$on('update-title', title => {
          if (title !== '') {
            document.title = `${title} - ${this.blogTitle}`
          } else {
            document.title = this.blogTitle
          }
        })
        .$once('update-blog-title', _blogTitle => {
          this.blogTitle = _blogTitle
          document.title = _blogTitle
        })
    }
  }
</script>
