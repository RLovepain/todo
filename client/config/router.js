// router对象的配置项及用途

import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)
// const router = new Router({
//   routes
// })

// export default router   // 这样写全局每次import的都是一个router，但是有的时候需要创建router，怎么处理？

export default () => {
  return new Router({
    routes,
    mode: 'history',
    base: '/base/',
    // 作用：在配置的path前面都会加上/base/，路由从原来的/app变成/base/app
    // 称为基路径，所有的路由都在这个路径基础之上
    // 不是强制性的，如果不加上/base/直接敲回车，还是能够进行正常跳转
    // 有的时候需要区分页面途径或者其他路径的时候会用到，不常用
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
    // 给全局写样式的时候用到的一些东西，可点击的vue-router的路由，一般都会使用router-link来做，因为它本质是转换成a标签，a标签的href属性是有利于整个网站的seo的。但是a标签默认行为是页面跳转，不是前端的路由跳转，所以router-link里面是给a标签添加了事件的，点击a标签，才根据href使用vue-router的api进行前端路由的跳转。这就是router-link帮我们做的事情。
    // 提供这些配置项，在全局写class，指定链接被激活的时候显示什么样的样式
    // 二者区别：完全匹配会加上exact-active-link类名，部分重合加上active-link类名和exact-active-link类名
    // 有两个路由/login和/login/exact
    // 跳转/login：/login会加上active-link类名和exact-active-link类名，/login/exact不会加上任何类名
    // 跳转/login/exact：/login/exact加上active-link类名和exact-active-link类名，同时/login会加上active-link类名 ——》/login看成/login/exact的子集
    scrollBehavior(to, from, savedPosition) {
      // console.log(to, from) // 完整的路由对象
      // console.log(savedPosition) // 滚动条滚动的位置
      // 如果之前访问过，下次还是滚动到这个位置；如果之前没有访问过，就让滚动条滚动到最上面
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    // url后面跟的?a=xxx&b=yyy  这个就是query，是携带页面进来时的参数（字符串）
    // parseQuery(query) {
    //   // 字符串转成json对象
    // },
    // stringifyQuery(obj) {
    //   // json对象转成字符串
    // },
    // 不是所有浏览器都支持history路由方式（页面不跳转的情况下，内容切换）。在不支持的情况下，vue自动fallback到哈希的模式，通过 fallback: true来处理。如果不需要vue这么做，就fallback:false，那么单页应用就变成了了多页应用，每一次路由跳转都会到后端，并返回新的内容，比较耗时。一般都要设置。
    fallback: true
  })
}
