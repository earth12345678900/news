// 全局注册组件
import Vue from 'vue'
import HmHeader from '../components/HmHeader.vue'
// 导入HmLogo组件
import HmLogo from '../components/HmLogo.vue'
// 导入导航条
import HmNav from '../components/HmNav.vue'
// 导入新闻列表组件
import HmPost from '../components/HmPost.vue'
// 评论组件
import HmComment from '../components/HmComment.vue'
// 楼层组件
import HmFloor from '../components/HmFloor.vue'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-nav', HmNav)
Vue.component('hm-post', HmPost)
Vue.component('hm-comment', HmComment)
Vue.component('hm-floor', HmFloor)
