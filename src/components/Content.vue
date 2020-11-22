<template>
  <div id="content">
    <div id="content-categories">
      <router-link v-for="category in categories"
                   :key="category._key"
                   :to="{ path: `/category/${category.name}'` }">
            <Category :category="category"/>
      </router-link>
    </div>
  </div>
</template>

<script>
  import CategoryItem from './Category.vue'
  export default {
    props: ['categories'],
    components: {
      Category: CategoryItem // <Category :category="category.getCacheData()"></Category>
    }
  }
</script>

<style scoped>
  #content {
    overflow: hidden;
    display: block;
  }

  #content.category-page {
    overflow: hidden;
    padding: 0;
  }

  @media only screen and (min-width: 500px) {
    #content {
      overflow-x: scroll;
      padding-left: 1vw;
    }

    #content-categories {
      margin-right: -1000%;
    }
  }

  .move-to-top-leave {
    position: absolute;
    top: 0;
  }

  #home {
    cursor: pointer;
    position: absolute;
    z-index: 999;
    color: white;
    padding: 1rem;
    font-family: Arial;
  }

  #home .icon-arrow-left {
    vertical-align: middle;
  }
</style>
