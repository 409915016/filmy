<template>
  <div class="row">
    <div class="col-md-12 page-header">
      <h1>{{ "dashboard" | i18n }}</h1>
    </div>

    <div class="col-md-12">
      <div class="row">
        <div class="col-md-4 dashboard-number">
          <h1>{{ numbers.categories }}</h1>
          <p>{{ "number of categories" | i18n }}</p>
        </div>
        <div class="col-md-4 dashboard-number">
          <h1>{{ numbers.albums }}</h1>
          <p>{{ "number of albums" | i18n }}</p>
        </div>
        <div class="col-md-4 dashboard-number">
          <h1>{{ numbers.photos }}</h1>
          <p>{{ "number of photos" | i18n }}</p>
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <h3>{{ "rates of categories" | i18n }}</h3>

      <div class="progress" style="height: 24px">
        <div
          v-for="category in categories"
          :key="category.id"
          v-bind:class="[{ 'progress-bar': true }, pickBarColor()]"
          v-bind:style="{ width: category.rate * 100 + '%'}"
          role="progressbar"
          :aria-valuenow="category.rate * 100"
          aria-valuemin="0" aria-valuemax="100"
        >{{ category.rate > 0 ? category.title : '' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import Category from "../../models/Category";
import Album from "../../models/Album";
import { NUMBER, COMMIT_CATEGORIES, COMMIT_ALBUMS } from "@/store/types"
const NUM_ZERO = 0

export default {
  data() {
    return {
      NUM_ZERO,
      numbers: {
        categories: 0,
        albums: 0,
        photos: 0,
      },
      categories: [],
    };
  },
  mounted() {
    Promise.all([
      Category.loadIfNotInit().then(() => Category.dump()),
      Album.loadIfNotInit().then(() => Album.dump()),
    ]).then(([categories, albums]) => {
      this.numbers.categories = categories.length;
      this.numbers.albums = albums.length;
      this.numbers.photos = albums
        .map((album) => album.photos.length)
        .reduce((a, b) => a + b, NUM_ZERO);
      for (const category of categories) {
        category.rate =
          albums.filter((album) => album.category === category.name).length /
          albums.length;
      }
      this.categories = categories;
      this.$store.dispatch(`${NUMBER}/${COMMIT_CATEGORIES}`, categories.length)
      this.$store.dispatch(`${NUMBER}/${COMMIT_ALBUMS}`, albums.length)
    });
  },
  methods: {
    ...mapActions([
      COMMIT_CATEGORIES, COMMIT_ALBUMS
    ]),
    pickBarColor: (function () {
      let last = null;
      const colors = ["success", "primary", "info", "warning", "danger"];
      return function pickOne() {
        const color =
          "bg-" +
          colors[Math.round(Math.random() * (colors.length - 1))].toString();
        if (color === last) {
          return pickOne();
        } else {
          last = color;
          return color;
        }
      };
    })(),
  },
  computed: {
    pickBarAndColor: function () {
      return {
        "progress-bar": true,
      };
    },
  },
};
</script>

<style scoped>
.dashboard-number {
  text-align: center;
  padding: 5px 0;
  border-right: 1px solid #ccc;
}

.dashboard-number:last-child {
  border-right: none;
}

.dashboard-number h1 {
  font-size: 5rem;
}

.dashboard-number p {
  font-size: 1.7rem;
}

/*.progress-labels {*/
/*  margin-top: -15px;*/
/*}*/

/*.progress-label {*/
/*  display: inline-block;*/
/*  float: left;*/
/*  font-size: 1.8rem;*/
/*  line-height: 1.9rem;*/
/*  text-align: center;*/
/*}*/
</style>
