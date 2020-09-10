import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/user/Login.vue'
// import Register from '../views/user/Register.vue'
// import User from '../views/user/User.vue'
// import UserEdit from '../views/user/UserEdit.vue'
// import MyFollow from '../views/user/MyFollow.vue'
// import MyComment from '../views/user/MyComment.vue'
// import MyStar from '../views/user/MyStar.vue'
// import Index from '../views/news/Index.vue'
// import Mange from '../views/news/Mange.vue'
// import PostDetail from '../views/news/PostDetail.vue'
// import Search from '../views/news/Search.vue'
const Login = () => import(/* webpackChunkName: "user" */'../views/user/Login.vue')
const Register = () => import(/* webpackChunkName: "user" */'../views/user/Register.vue')
const User = () => import(/* webpackChunkName: "user" */'../views/user/User.vue')
const UserEdit = () => import(/* webpackChunkName: "user" */'../views/user/UserEdit.vue')
const MyFollow = () => import(/* webpackChunkName: "user" */'../views/user/MyFollow.vue')
const MyComment = () => import(/* webpackChunkName: "user" */'../views/user/MyComment.vue')
const MyStar = () => import(/* webpackChunkName: "user" */'../views/user/MyStar.vue')
const Index = () => import(/* webpackChunkName: "index" */'../views/news/Index.vue')
const Mange = () => import(/* webpackChunkName: "news" */'../views/news/Mange.vue')
const PostDetail = () => import(/* webpackChunkName: "news" */'../views/news/PostDetail.vue')
const Search = () => import(/* webpackChunkName: "news" */'../views/news/Search.vue')
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/register',
    component: Register,
    name: 'register'
  },
  {
    path: '/user',
    component: User,
    name: 'user'
  },
  {
    path: '/user-edit',
    component: UserEdit,
    name: 'user-edit'
  },
  {
    path: '/myfollow',
    component: MyFollow,
    name: 'myfollow'
  },
  {
    path: '/mycomment',
    component: MyComment,
    name: 'mycomment'
  },
  {
    path: '/mystar',
    component: MyStar,
    name: 'mystar'
  },
  {
    path: '/',
    component: Index,
    name: 'index'
  },
  {
    path: '/mange',
    component: Mange,
    name: 'mange'
  },
  {
    // 动态路由
    path: '/post-detail/:id',
    component: PostDetail,
    name: 'postdetail'
  },
  {
    // 动态路由
    path: '/search',
    component: Search,
    name: 'search'
  }
]

const router = new VueRouter({
  routes: routes
})

// 是否去个人中心 不是 放行 是判断是否有token 有放行 没有跳转到登陆页面
router.beforeEach((to, from, next) => {
  // if (to.name === 'user') {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  const authUrls = ['/user', '/user-edit', '/myfollow', '/mycomment', '/mystar']
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
})

export default router
