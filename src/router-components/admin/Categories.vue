<template>
  <div class="row">
    <div class="col-md-12 page-header">
        <h1>{{ "category" | i18n }}</h1>
    </div>

    <div class="col-md-6">
      <form class="form-inline">
        <div class="form-group">
          <button @click="newer" class="btn btn-primary">
            <span class="fa fa-plus" aria-hidden="true"></span>
            {{ "new" | i18n }}
          </button>
        </div>
       
      </form>
    </div>

    <div class="col-md-6">
      <form class="form-inline">
         <div class="form-group">
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="query" />
            <div class="input-group-append">
              <button class="btn" @click="search">
                <span
                  class="fa fa-search"
                  aria-hidden="true"
                ></span>
                {{ "search" | i18n }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="col-md-12">
      <router-link
        class="category img-rounded"
        v-for="category in categories"
        :to="{ path: `/categories/${category.name}` }"
      >
        <h1 class="category-title">
          {{ category.title }} ({{ category.count }})
        </h1>
        <img
          :data-src="category.cover"
          :alt="category.title"
          class="lazyload"
        />
      </router-link>
    </div>
  </div>
</template>

<script>
import Category from "../../models/Category";
import Album from "../../models/Album";
import { uniqBy } from "lodash";
import "lazysizes/lazysizes.min";
export default {
  data() {
    return {
      categories: [],
      albums: [],
      query: "",
    };
  },
  mounted: function () {
    Promise.all([
      Category.loadIfNotInit().then(() => Category.dump()),
      Album.loadIfNotInit().then(() => Album.dump()),
    ]).then(([categories, albums]) => {
      for (const category of categories) {
        category.count = albums.filter(
          (album) => album.category === category.name
        ).length;
      }
      this.albums = albums;
      this.categories = categories;
    });
  },

  methods: {
    newer() {
      this.$router.push("/categories/new");
    },
    search() {
      Promise.all([
        Category.search("title", this.query),
        Category.search("name", this.query),
      ])
        .then(([a, b]) => a.concat(b))
        .then((result) => uniqBy(result, (n) => n.getCacheData().name))
        .then((result) => result.map((n) => n.getCacheData()))
        .then((categories) => {
          for (const category of categories) {
            category.count = this.albums.filter(
              (album) => album.category === category.name
            ).length;
          }
          this.categories = categories;
        });
    },
  },
};
</script>

<style scoped>
.category {
  width: 49%;
  margin: 10px 0.5%;
  height: 200px;
  overflow: hidden;
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.category-title {
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 200px;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 2px #666;
  margin: 0;
}

.category img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
