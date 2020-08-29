import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'
// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入amfe-flexible
import 'amfe-flexible'
// 全局注册组件
import HmHeader from './components/HmHeader.vue'
// 导入HmLogo组件
import HmLogo from './components/HmLogo.vue'
import moment from 'moment'
// 导入导航条
import HmNav from './components/HmNav.vue'
import axios from 'axios'

// 所有组件都是vue实例 讲axios挂载到vue原型上 所有地方都能访问
// 习惯挂载到原型上的加$
Vue.prototype.$axios = axios
// 给axios配置默认基准地址
axios.defaults.baseURL = 'http://localhost:3000'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-nav', HmNav)
// 定义全局过滤器
Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})
Vue.use(Vant)

Vue.config.productionTip = false

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
