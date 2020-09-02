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

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
