<template>
  <div id="app">
    <Header></Header>
    <p>{{ counter }}</p>
    <p>{{ fullName }}</p>
    <p>{{ textA }}</p>
    <p>{{ textB }}</p>
    <p>{{ textPlus }}</p>
    <h1>{{ textC }}</h1>
    <!-- {name:'app'}是一个对象，不能把它当做字符串处理，所以要动态绑定:to -->
    <!-- <router-link :to="{ name: 'app' }"> -->
    <!-- <router-link to="/app"> -->
    <router-link to="/app/123">app123</router-link>
    <router-link to="/app/456">app456</router-link>
    <router-link to="/login">login</router-link>
    <!-- 过渡，在global.style里面设置样式.fade-enter-active, .fade-leave-active, .fade-enter, .fade-leave-to -->
    <transition name="fade">
      <router-view />
    </transition>
    <Footer />
    <!-- 命名视图  不同名字的router-view，在不同的路由下，给它有不同的组件	 -->
    <!-- 使用场景：传统的三栏布局，上面一个顶部栏，左侧一个菜单栏，中间是显示的内容。如果顶部栏点击一个部分之后，菜单栏要进行大的切换，这个时候就可以给左侧的菜单栏加一个router-view，切换不同的菜单。这个情况用的不多。 -->
    <router-view name="a" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'

// console.log(Header.__docs);

export default {
  components: {
    Header,
    Footer
  },
  computed: {
    // textA () {
    //   return this.$store.state.a.text
    // },
    // textB () {
    //   return this.$store.state.b.text
    // },  // 也可以通过mapState来映射
    // 方便于组件内部使用数据，当和vuex中state的count名字一样，直接用mapState来映射state
    // ...mapState(['count']),
    // 如果不同名的话，要用obj来处理。vuex的state里面的是count，组件里面使用的是counter
    // ...mapState({
    //   counter: 'count'
    // }),
    // 还可以传方法
    ...mapState({
      counter: (state) => state.count,
      textA: (state) => state.a.text,
      textB: (state) => state.b.text,
      textC: (state) => state.c.text
    }),
    // count() {
    //   return this.$store.state.count
    // },
    // 使用mapGetters来映射vuex里的getters
    // ...mapGetters(['fullName', 'a/textPlus'])
    // 使用this['a/textPlus']过于麻烦，就可以用对象
    ...mapGetters({
      fullName: 'fullName',
      textPlus: 'a/textPlus'
    })
    // fullName() {
    //   return this.$store.getters.fullName
    // }
  },
  mounted () {
    // console.log(this.$route) // 路由信息
    // console.log(this.$route.fullPath) // "/app/123"
    // console.log(this.$route.meta) // "{title:"this is app",description:"xxxx"}"
    // console.log(this.$route.name) // "app"
    // console.log(this.$route.params) // {id: "123"}  通过this.$route.params.id获取id
    // console.log(this.$route.path) // "/app/123"
    // /app/123?a=111&b=222   params: {id: "123"}, query: {a: "111", b: "222"}
    console.log(this.$store, this['a/textPlus']) // 每一个组件内部都会加一个this.$store对象
    let i = 1
    // dispatch actions
    // this.$store.dispatch('updateCountAsync', {
    //   num: 88,
    //   time: 1000
    // })
    // 直接传参即可
    this.updateCountAsync({
      num: 88,
      time: 1000
    })
    // 映射模块a里的mutations
    // this.updateText('123')  // 放到全局里调用时
    this['a/updateText']('123') // 放到a模块里面 namespaced:true
    this['a/add']()
    this.testAction()
    // setInterval(() => {
    //   this.$store.commit('updateCount', {
    //     num: i++,
    //     num2: 2
    //   }) // 调用mutations里面的updateCount方法
    // }, 1000)
    setInterval(() => {
      this.updateCount({
        num: i++,
        num2: 2
      }) // 调用mutations里面的updateCount方法
    }, 1000)
  },
  methods: {
    // 映射vuex里面的actions
    ...mapActions(['updateCountAsync', 'a/add', 'testAction']),
    // 映射vuex里面的mutations
    // 好处就是不需要再传名字了，方便操作
    // ...mapMutations(['updateCount', 'updateText'])
    ...mapMutations(['updateCount', 'a/updateText'])
    // updateText是模块a的mutations，vuex默认会把所有的mutations放到全局空间。如果你需要把模块a的mutations放到他自己的空间，就需要声明一个属性namespaced:true
    // 这样，每个模块里面都可以写相同名字的mutations
  }
}
</script>

<style lang="stylus" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  #cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #999;
    opacity: 0.2;
    z-index: -1;
  }
}
</style>
