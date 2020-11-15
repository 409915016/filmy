<template>
  <div class="row">
    <div class="col-md-12 page-header">
      <h1>{{ "album" | i18n }}</h1>
    </div>

    <div class="col-md-12">
      <ul class="nav nav-pills col-sm-7">
        <li role="presentation" @click="showCategory()">
          <a>{{ "all" | i18n }}</a>
        </li>
        <li
          role="presentation"
          v-for="category in categories"
          :key="category.title"
          @click="showCategory(category)"
        >
          <a>{{ category.title }}</a>
        </li>
      </ul>
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
              <button class="btn" type="button" @click="search">
                <span class="fa fa-search" aria-hidden="true"></span>
                {{ "search" | i18n }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="col-md-12">
      <router-link
        class="album img-rounded"
        v-for="album in albums"
        :key="album._key"
        :to="{ path: `/albums/${album._key}` }"
      >
        <h3 class="album-title">
          {{ album.title }}
          <span class="category">{{ album.categoryTitle }}</span>
        </h3>
        <img :data-src="album.photos[0]" :alt="album.title" class="lazyload" />
      </router-link>
    </div>
  </div>
</template>

<script>
import Category from "../../models/Category";
import Album from "../../models/Album";
import { uniq } from "lodash";
import "lazysizes/lazysizes.min";
export default {
  data() {
    return {
      categories: [],
      albums: [],
      allAlbums: [],
      query: "",
    };
  },
  mounted() {
    Promise.all([
      Album.loadIfNotInit().then(() => Album.dump()),
      Category.loadIfNotInit().then(() => Category.dump()),
    ]).then(([albums, categories]) => {
      albums = this.patchCategoryInfo(albums, categories);
      this.allAlbums = albums;
      this.albums = albums;
      this.categories = categories;
    });
  },
  methods: {
    newer() {
      this.$router.push("/albums/new");
    },
    showCategory(category) {
      if (!category) return (this.albums = this.allAlbums);
      this.albums = this.allAlbums.filter((n) => n.category === category.name);
    },
    search() {
      Promise.all([
        Album.search("title", this.query),
        Album.search("content", this.query),
      ])
        .then(([a, b]) => uniq(a.concat(b)))
        .then((albums) => {
          albums = albums.map((n) => n.getCacheData());
          albums = this.patchCategoryInfo(albums);
          this.albums = albums;
        });
    },
    patchCategoryInfo(albums = this.albums, categories = this.categories) {
      for (const album of albums) {
        console.log();
        album.categoryTitle = categories
          .filter((n) => n.name === album.category)
          .shift().title;
      }
      return albums;
    },
  },
};
</script>

<style scoped>
.album {
  width: 287.5px;
  height: 287.5px;
  overflow: hidden;
  display: inline-block;
  margin: 2.5px;
  position: relative;
  cursor: pointer;
}

.album-title {
  position: absolute;
  color: #fff;
  bottom: 0;
  margin-left: 20px;
  text-shadow: 0 0 2px #666;
  font-size: 24px;
  line-height: 24px;
}

.album-title .category {
  font-size: 12px;
  line-height: 24px;
}

.album img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
