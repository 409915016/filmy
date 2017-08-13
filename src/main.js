// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import i18n from './libs/i18n'

Vue.config.productionTip = false

Vue.filter('i18n', i18n)
Vue.filter('toUpperCase', str => str.toUpperCase())
Vue.filter('toLowerCase', str => str.toLowerCase())
Vue.filter('firstLetterUpperCase', str =>
  str
    .replace(/([.!?;]+)/g, '$1|-|-|')
    .split('|-|-|')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s[0].toUpperCase() + s.slice(1))
    .reduce((a, b) => `${a} ${b}`)
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

// const password = `jm409915016`
// console.log(filmyBucket.fetchPutToken(password))
