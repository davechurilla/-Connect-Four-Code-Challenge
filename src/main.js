// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // The connect four state of the game is represented as a two dimensional array. After every turn, this state is updated.
  props: {
    initGrid: [], row: Number, col: Number
  },
  components: { App },
  template: '<App/>'
})
