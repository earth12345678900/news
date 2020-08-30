import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'
// 导入vant
import Vant, { Toast } from 'vant'
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

// 配置axios拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
  console.log('请求拦截器', config)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  console.log('响应拦截器', response)
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 跳转到登录页
    router.push('/login')
    // 清除token 和 id
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // 给出登陆失败的提示
    Toast.fail('登陆信息失效')
  }
  return response
})

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
