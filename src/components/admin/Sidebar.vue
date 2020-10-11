<template>
  <div id="sidebar" ref="sidebar">
    <h2>Filmy Admin</h2>

    <ul class="nav nav-pills flex-column">
      <li
        role="presentation"
        class="nav-item"
        :class="{ active: active == 'dashboard' }"
      >
        <router-link class="nav-link" active-class="active" to="/dashboard">{{
          "dashboard" | i18n
        }}</router-link>
      </li>
      <li
        role="presentation"
        class="nav-item"
        :class="{ active: active == 'settings' }"
      >
        <router-link class="nav-link" active-class="active" to="/settings">{{
          "setting" | i18n
        }}</router-link>
      </li>
      <li
        role="presentation"
        class="nav-item"
        :class="{ active: active == 'categories' }"
      >
        <router-link class="nav-link" active-class="active" to="/categories">
          {{ "category" | i18n }}
          <span class="badge badge-pill badge-secondary">{{ categories }}</span>
        </router-link>
      </li>
      <li
        role="presentation"
        class="nav-item"
        :class="{ active: active == 'albums' }"
      >
        <router-link class="nav-link" active-class="active" to="/albums">
          {{ "album" | i18n }}
          <span class="badge badge-pill badge-secondary">{{ albums }}</span>
        </router-link>
      </li>
      <hr />
      <li role="presentation" class="nav-item">
        <a target="_blank" class="nav-link" href="/">{{
          "go to home page" | i18n
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CATEGORIES, ALBUMS }from "@/store/types"
export default {
  data() {
    return {
      active: "dashboard",
    };
  },
  mounted: function () {
    this.$nextTick(function () {});
    this.$router.push("dashboard");
    this.$router.beforeEach((to, from, next) => {
      this.active = to.path.split("/")[1];
      next();
    });
    new Affix(this.$refs.sidebar, {
      offsetTop: 50,
    });
  },
  computed: {
    ...mapGetters({categories: CATEGORIES, albums: ALBUMS})
  }

};
</script>

<style scoped>
</style>
