<template>
  <div class="row">
    <div class="col-md-12 page-header">
      <h1 v-if="!newer">{{ album.title }}</h1>
      <h1 v-else>{{ "new" | i18n }} {{ "album" | i18n }}</h1>
    </div>

    <div class="col-md-12">
      <form>
        <div class="form-group">
          <label for="title">{{ "title" | i18n }}</label>
          <input type="text" class="form-control" v-model="album.title" />
        </div>

        <div class="form-group">
          <label for="category">{{ "category" | i18n }}</label>
          <select class="form-control" v-model="album.category">
            <option
              v-for="category in categories"
              :key="category._key"
              :selected="category.selected"
              :value="category.name"
            >
              {{ category.title }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="content">{{ "text content" | i18n }}</label>
          <textarea
            class="form-control"
            id="content"
            rows="7"
            v-model="album.content"
          ></textarea>
        </div>

        <div class="photos" :class="{ over: over }" ref="photos">
          <div class="photo img-rounded" v-for="(photo, index) in album.photos">
            <span
              @click="removePhoto(index)"
              class="remove-btn fa fa-remove"
              aria-hidden="true"
            ></span>
            <img :src="photo" />
          </div>
          <div class="photo">
            <span
              class="add-btn fa fa-plus"
              aria-hidden="true"
              ref="add"
            ></span>
          </div>
        </div>

        <div class="form-group">
          <div class="btn-group mr-2" role="group">
            <button class="btn btn-primary" type="button" @click="submit">
              <span class="fa fa-check" aria-hidden="true"></span>
              {{ "finish" | i18n }}
            </button>
          </div>

          <div class="btn-group mr-2" role="group">
            <button class="btn btn-danger" type="button" @click="Delete" v-if="!newer">
              <span class="fa fa-remove"></span>
              {{ "delete" | i18n }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Album from "../../models/Album";
import Category from "../../models/Category";
import Vue from "vue";
import qiniu from "qiniu.js";
import filmyBucket from "../../models/qiniu-bucket";
import swal from "sweetalert";
const URL = window.URL || window.webkitURL;
const swalp = (...args) => {
  return new Promise((resolve) => {
    swal(...args, (...argv) => resolve(...argv));
  });
};
export default {
  data() {
    return {
      album: {
        photos: [],
      },
      model: null,
      categories: [],
      newer: false,
      over: false,
      photosToUpload: new Map(),
    };
  },
  mounted() {
    qiniu.bind(this.$refs.add).on("file", this.addPhoto);
    if (qiniu.supportDnd) {
      qiniu.bind
        .dnd(this.$refs.photos, {})
        .on("over", () => (this.over = true))
        .on("out", () => (this.over = false));
    }
    Category.dump().then((categories) => (this.categories = categories));
    if (this.$route.params.key === "new") return (this.newer = true);
    Album.fetch(this.$route.params.key).then((album) => {
      if (this.categories.length > 0) {
        this.categories
          .filter((c) => c.name === album.getCacheData().category)
          .shift().selected = true;
      }
      this.model = album;
      this.album = album.getCacheData();
    });
  },
  methods: {
    removePhoto(index) {
      this.photosToUpload.delete(this.album.photos[index]);
      this.album.photos.splice(index, 1);
    },
    addPhoto(file) {
      this.over = false;
      file.imageView(
        {
          mode: 1,
          width: 125,
          height: 125,
        },
        (err, image) => {
          if (err) return;
          image.toBlob((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            this.album.photos.push(blobUrl);
            this.photosToUpload.set(blobUrl, file);
          });
        }
      );
    },
    submit() {
      const i18n = Vue.filter("i18n");
      swalp({
        title: i18n("input password"),
        type: "input",
        inputType: "password",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        showLoaderOnConfirm: true,
      })
        .then((password) => {
          return filmyBucket
            .fetchPutToken(password)
            .then((putToken) => [putToken, password]);
        })
        .then(([putToken, password]) => {
          if (this.photosToUpload.size === 0) {
            return [this.album.photos, password];
          } else {
            const files = [];
            for (const [, file] of this.photosToUpload.entries())
              files.push(file);
            return Promise.all(
              files.map((file) => {
                const key = `assets/photos/${Math.random()
                  .toString(32)
                  .substr(2)}`;
                return filmyBucket
                  .putFile(key, file, { putToken })
                  .then(() => filmyBucket.key(key).url());
              })
            )
              .then((urls) => {
                return this.album.photos
                  .filter((url) => url[0] === "h") // http://
                  .concat(urls);
              })
              .then((urls) => [urls, password]);
          }
        })
        .then(([photos, password]) => {
          if (this.newer) {
            this.model = new Album({});
          }
          return Promise.all(
            ["title", "category", "content"].map((key) => {
              return this.model.set(key, this.album[key]);
            })
          )
            .then(() => this.model.set("photos", photos))
            .then(() => password);
        })
        .then((password) => Album.saveToCloud(password))
        .then(() => {
          this.photosToUpload = new Map();
          swal({
            title: i18n("update succeed"),
            type: "success",
          });
        })
        .catch((err) => {
          swal({
            title: err.message || i18n("something went wrong"),
            type: "error",
          });
        });
    },
    Delete() {
      const i18n = Vue.filter("i18n");
      swalp({
        title: i18n("are you sure"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      })
        .then(() =>
          swalp({
            title: i18n("input password"),
            type: "input",
            inputType: "password",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
          })
        )
        .then((password) => this.model.remove().then(() => password))
        .then((password) => Album.saveToCloud(password))
        .then(() => {
          swal({
            title: i18n("update succeed"),
            type: "success",
          });
          this.$router.go(-1);
        })
        .catch((err) => {
          swal({
            title: err.message || i18n("something went wrong"),
            type: "error",
          });
        });
    },
  },
};
</script>

<style scoped>
.photos {
  width: 100%;
  min-height: 400px;
  border: 5px dashed #ccc;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
}
.photos.over {
  border-color: #888;
}
.photo {
  width: 125px;
  height: 125px;
  margin: 2.5px;
  float: left;
  position: relative;
}
.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo .remove-btn {
  display: none;
  position: absolute;
  font-size: 10px;
  width: 16px;
  height: 16px;
  padding-left: 1px;
  line-height: 16px;
  text-align: center;
  background: #d9534f;
  color: #fff;
  border-radius: 7px;
  top: -7px;
  right: -7px;
  cursor: pointer;
  z-index: 999;
}
.photo:hover .remove-btn {
  display: block;
}
.photo .add-btn {
  font-size: 25px;
  border: 2px dashed #999;
  cursor: pointer;
  color: #999;
  width: 125px;
  height: 125px;
  line-height: 125px;
  text-align: center;
}
</style>
