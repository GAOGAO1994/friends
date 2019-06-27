import Vue from 'vue'
import App from './App'

import store from 
// #ifdef H5
'./store/index-h5'
// #endif
// #ifndef H5
'./store/index'
// #endif

//全局服务引入
import http from './http'
import route from './route'


Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$croute = route

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
