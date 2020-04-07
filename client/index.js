import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './app.vue'
import createRoute from './config/router.js'
import createStore from './store/store' // createStore方法

// import './assets/styles/test.css';
import './assets/styles/style.styl'
import './assets/styles/global.styl'

Vue.use(VueRouter)
Vue.use(Vuex)

const root = document.createElement('div')
document.body.appendChild(root)

const router = createRoute() // 防止内存溢出，同一个地方创建router/store，能更好的维护代码
const store = createStore() // 创建store

// 注册新的模块，动态加载模块
store.registerModule('c', {
  state: {
    text: 3
  }
})
// 解绑module
// store.unregisterModule('c')

// 第一个方法接收state，返回一个新的值，表示想要监听到这个返回值
// 第二个方法是第一个方法返回值有变化的时候才会调用，作为回调函数
// store.watch(
//   (state) => state.count + 1,
//   (newCount) => {
//     console.log('new count watch:', newCount)
//   }
// )

// 订阅 会拿到所有mutation的变化
// 用处：当任何mutation被调用的时候，都可以拿到mutation的回调，可以在回调里面进行操作，看看哪些mutations被调用了，可以提高工作效率
// store.subscribe((mutation, state) => {
//   console.log(mutation.type)
//   console.log(mutation.payload)
//   // 可以知道调用了哪个mutation，以及传入的参数
// })

// 拿到action的变化，获取action的名字和传入的参数
// store.subscribeAction((action, state) => {
//   console.log(action.type)
//   console.log(action.payload)
// })
// 主要用于vuex插件

// 全局钩子
// 不跳转的话，只会执行beforeEach
// 前置守卫，判断有没有登录
router.beforeEach((to, from, next) => {
  // console.log('before each invoked')
  // if (to.fullPath === '/app') {
  //   next('/login') // 执行以后next()，路由才会跳转。里面传的东西和routes.js里的配置一样。
  //   // next({
  //   //   path:'/login',
  //   //   replace: false
  //   // })
  // } else {
  //   next()
  // }
  next()
})

// 解析守卫
router.beforeResolve((to, from, next) => {
  // console.log('before resolve invoked')
  next()
})

// 后置守卫
router.afterEach((to, from) => {
  // console.log('after each invoked')
})

new Vue({
  render: (h) => h(App),
  router,
  store // vue也是类似于DOM结构的树结构，把store放在最外层，每一个组件才能获取到store(Todo是App的子树，如果把store放在Todo上，只有Todo的子节点才能获取，App是它的上层节点，是获取不到store的)
}).$mount(root)

// 使用场景：使用了router的异步加载功能，我们发现有一个store模块，只有在异步加载的那个模块才会用到，别的地方用不到，我们能不能把这部分代码也拆分到异步加载的模块里面去呢？
// 首先，store有动态注册模块的功能，vuex已提供这个功能    store.registerModule
