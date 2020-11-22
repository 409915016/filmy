<template>
  <div id="search-bar" :class="{ active: active, static: static }">
    <span id="search-icon" class="icon" @click="openOrSearch">&#xe600;</span>
    <input type="search" id="search-query" v-model="text" @keyup.enter="openOrSearch">
    <span id="close-icon" class="icon" @click="close" v-if="!static">&#xe601;</span>
  </div>
</template>

<script>
  export default {
    props: {
        value: String,
        options: Object,
        static: {
            type: Boolean,
            default: false
        }
    },

    data () {
      return {
        text: '',
        query: '',
        active: this.static ? 1 : false
      }
    },

    methods: {
      openOrSearch () {
        if (this.static) return this.search()
        if (!this.active) {
          this.active = true
        } else {
            this.$emit('on-change', {
                value: this.text,
                query: this.options || {}
            })
        }
      },

      close () {
        this.active = false
        this.text = ''
      },

      search () {
        this.$emit('on-change', {
            value: this.text,
            query: this.options || {}
        })
      }
    },
      watch: {
          value: {
              handler(val) {
                  if (!val) return
                  this.text = val
                  this.search();
              },
              immediate: true
          }
      }
  }
</script>

<style scoped>
  #search-bar {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 5vw;
    right: 0;
    margin-top: 0;
    border: 1px solid hsla(0,0%,100%,.6);
    outline: none;
    margin: 0 auto -40px;
    margin-right: 7.5vw !important;
    z-index: 5;
    border-radius: 20px;
    opacity: 0.65;
    transition: all .5s ease;
    max-width: 400px;
    overflow: hidden;
  }
  #search-bar.active {
    width: 85vw;
    opacity: 1;
    background: rgba(255,255,255,.25);
  }
  #search-bar.static {
    border-color: #333;
  }
  #search-icon {
    margin-left: -1px;
  }
  #search-query {
    background: transparent;
    border: none;
    width: calc(100% - 79px);
    height: 100%;
    display: inline;
    float: left;
    position: relative;
    outline: none;
    color: #FFF;
    font-size: 16px;
  }
  #search-bar.static #search-query {
    color: #333;
  }
  .icon {
    display: inline-block;
    font-family: iconfont;
    width: 40px;
    height: 100%;
    line-height: 40px;
    text-align: center;
    float: left;
    color: #FFF;
  }
  #search-bar.static .icon {
    color: #333;
  }
</style>
