<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来做什么"
      @keyup.enter="addTodo"
    >
    <Item
      v-for="todo in filterTodos"
      :key="todo.id"
      :todo="todo"
      @del="deleteTodo"
    />
    <Tabs
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAll="clearAllCompletedTodo"
    />
    <!-- <router-view /> -->
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
// import { constants } from 'crypto'

let id = 0

export default {
  // 从login进入app，执行顺序：全局钩子before each invoked ——》路由钩子app route before enter ——》组件钩子todo before route enter——》before resolve invoked ——》after each invoked
  // 在路由进来之前，通过to拿到一些信息
  // 注意：在beforeRouteEnter里面，是拿不到this（上下文）的
  beforeRouteEnter(to, from, next) {
    console.log('todo before route enter')
    // console.log(this) // undefined
    // vm表示组件被创建之后的实例对象
    next((vm) => {
      console.log('after enter vm.id is', vm.id) // 注意props:['id']，才能获取vm.id
    })
  },
  // 什么时候触发？同一个组件在不同的路由下面进行显示，比如/app/123和/app/456切换，app组件是复用的
  // 执行顺序：before each invoked——》todo before route update——》before resolve invoked ——》after each invoked
  // 使用场景：在数据是要根据params里的id来获取对应数据的时候，就可以在beforeRouteUpdate里面去处理
  // 如果不这么处理，就要通过watch路由传进来的id，id有变化的时候进行处理。增加watch开销，会增加应用的复杂度
  // 推荐用beforeRouteUpdate钩子，钩子里面还可以控制，如果获取数据出错，可以通过next()进行撤销，弹出错误提醒
  beforeRouteUpdate(to, from, next) {
    console.log('todo before route update')
    // console.log(this)
    next()
  },
  // 从app跳到login，app是被离开的，beforeRouteLeave最先触发。执行顺序：todo before route leave——》before each invoked ——》before resolve invoked ——》after each invoked
  // 使用场景：用于提醒，比如修改了表单，离开该路由的时候表单数据会丢失，就提醒一下要不要离开，离开的话就执行next()，不离开的话就不执行next()
  beforeRouteLeave(to, from, next) {
    console.log('todo before route leave')
    if (global.confirm('are you sure?')) {
      next()
    }
  },
  components: {
    Item,
    Tabs
  },
  // 接收路由传过来的id，这样就不需要通过this.$route获取
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filterTodos() {
      if (this.filter === 'all') {
        return this.todos
      }
      const filterCompleted = this.filter === 'completed'
      return this.todos.filter((todo) => todo.completed === filterCompleted)
    }
  }, // id就不需要从路由上来读取  解耦的过程
  mounted() {
    console.log('todo mounted') // 复用组件的时候，第一次使用会触发，第二次使用不会触发 ，会导致应用出现错误，而且它不能控制路由的行为 。这种场景建议使用beforeRouteUpdate和watch
  },
  // mounted () {
  // console.log(this.id) // 123
  // },
  methods: {
    addTodo(e) {
      if (e.target.value !== '') {
        this.todos.unshift({
          id: id++,
          content: e.target.value,
          completed: false
        })
        e.target.value = ''
      }
    },
    deleteTodo(id) {
      this.todos.splice(
        this.todos.findIndex((todo) => id === todo.id),
        1
      )
    },
    toggleFilter(state) {
      console.log(state)
      this.filter = state
    },
    clearAllCompletedTodo() {
      this.todos = this.todos.filter((todo) => todo.completed === false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: none;
  outline: none;
  color: inherit;
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 36px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>
