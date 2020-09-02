// 全局注册组件
import Vue from 'vue'
import HmHeader from '../components/HmHeader.vue'
// 导入HmLogo组件
import HmLogo from '../components/HmLogo.vue'
// 导入导航条
import HmNav from '../components/HmNav.vue'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-nav', HmNav)
