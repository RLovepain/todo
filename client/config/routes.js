// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [
  {
    path: '/', // 默认路由
    redirect: '/app'
  },
  {
    // path: '/app',
    path: '/app/:id', // id不同，但用的都是Todo组件（复用，不会销毁再创建，只是参数不一样）
    props: true, // 需要通过params来传参，还可以设置props，会把:id作为props传递到todo组件中来，就不需要通过this.$route对象获取id。建议这么做，万一以后vue-router升级，用法会发生变化。使用props就没有用到this.$route。这个是耦合的过程。
    // 尽量不要在组件里面使用$route
    // 也可以指定自己要传的props
    // props: {
    //   id: '456'
    // },
    // props: (route) => ({ id: route.query.b }),
    // component: Todo,
    component: () => import('../views/todo/todo.vue'),
    // 命名视图  多个组件
    // components: {

    //   default: Todo, // 没有名字的足尖上default
    //   a: Login // 组件Login的名字是a   <router-view name="a" />
    // },
    // 路由的命名，可以通过name进行路由跳转
    name: 'app',
    // 保存路由里面的信息（和路由没什么关系的配置）
    meta: {
      title: 'this is app',
      description: '我是app的描述'
    },
    // 子路由  router-view需要设置在todo.vue里面
    // children: [
    //   {
    //     path: 'test',
    //     component: Login
    //   }
    // ]
    // 路由独享钩子，进入路由之前调用
    beforeEnter(to, from, next) {
      // 执行顺序：before each invoked ——》app route before enter ——》before resolve invoked ——》after each invoked
      console.log('app route before enter')
      next()
    }
  },
  {
    path: '/login',
    // component: Login
    component: () => import('../views/login/login.vue')
    // components: {
    //   default: Login,
    //   a: Todo
    // }
  }
]

// 异步组件
// 路由非常多的时候，一下子用webpack打包就会非常大，初始加载的时间就会非常长，访问需要访问的页面的时候把其他页面的js一起加载，是比较浪费的行为
// 作用：对于不同的路由，只加载对应路由的代码和核心的代码
// 好处：首屏加载更快
