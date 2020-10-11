/* eslint-disable */
import {CATEGORIES, ALBUMS, SET_CATEGORIES, SET_ALBUMS, COMMIT_CATEGORIES, COMMIT_ALBUMS} from "@/store/types"

// initial state
const state = () => ({
  categories: 0,
  albums    : 0
})

// getters
const getters = {
  categories(state) {
    return state.categories
  },
  albums(state) {
    return state.albums
  }
}

// actions
const actions = {
  [COMMIT_CATEGORIES]({commit}, number) {
    commit(SET_CATEGORIES, number)
  },
  [COMMIT_ALBUMS]({commit}, number) {
    commit(SET_ALBUMS, number)
  }
}

// mutations
const mutations = {
  [SET_CATEGORIES](state, number) {
    state.categories = number
  },
  [SET_ALBUMS](state, number) {
    state.albums = number
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
