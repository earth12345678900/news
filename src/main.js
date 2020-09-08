import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'

// 导入amfe-flexible
import 'amfe-flexible'

import './utils/global'
import './utils/request'
import './utils/filter'
import './utils/vant'

Vue.config.productionTip = false

// 创建bus
const bus = new Vue()
// 挂载到原型链上
Vue.prototype.$bus = bus

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
