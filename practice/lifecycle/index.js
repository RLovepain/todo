import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  // template: '<div>{{text}}</div>',  // template模板会解析成render方法
  data: {
    text: 0
  },
  beforeCreate() {
    console.log(this.$el, 'beforeCreate') // undefined  数据ok，但是响应式不ok，不要这里去修改数据
  },
  created() {
    console.log(this.$el, 'created') // undefined  跟数据有关的操作可以放在created里面，也可以放在mounted里面
  },
  beforeMount() {
    console.log(this.$el, 'beforeMount') // <div id="root"></div>
  },
  mounted() {
    console.log(this.$el, 'mounted') // <div>0</div> 跟DOM有关的操作放在mounted里面
  },
  beforeUpdate() {
    console.log(this, 'beforeUpdate')
  },
  updated() {
    console.log(this, 'updated')
  },
  actived() {
    console.log(this, 'actived')
  },
  deactived() {
    console.log(this, 'deactived')
  },
  beforeDestroy() {
    console.log(this, 'beforeDestroy')
  },
  destroyed() {
    console.log(this, 'destroyed')
  },
  // 解析template成render方法是比较消耗时间的，使用.vue开发的时候是不用template的。vue-loader帮我们进行了处理，在页面执行vue代码的时候效率更高。
  render(h) {
    // throw new TypeError('render error') // 手动报错
    console.log('render function invoked') // 在beforeMount和mounted之间执行
    return h('div', {}, this.text)
  },
  // renderError 开发的时候才会被调用，帮我们调试render里的错误
  renderError(h, err) {
    return h('div', {}, err.stack) // 错误信息渲染在页面中，只有本组件render错误的时候才会报错，如果是组件的子组件错误的话不会报错，它不关心。
  },
  // errorCaptured 会向上冒泡，并且可以用在正式环境，帮助我们搜集线上的开发错误，只需要在根组件书写，它所有的子组件报任何错误都可以捕捉，除非子组件阻止冒泡。
  errorCaptured() {}
})

app.$mount('#root')

// 更新数据
// setInterval(() => {
//   app.text = app.text += 1
// }, 1000)

// 销毁组件，会解除所有的事件监听
// setTimeout(() => {
//   app.$destroy()
// }, 2000)

// new的时候，beforeCreate——》created——》beforeMount——》mounted    都是一次性的，服务端渲染的时候只会调用beforeCreate和created，不会调用beforeMount和mounted，服务端没有DOM执行的环境。
// 如果不进行挂载，不指定el，也不执行$mount方法的话，beforeCreate——》created
// 页面更新，beforeCreate——》created——》beforeMount——》mounted——》beforeUpdate——》updated——》beforeUpdate——》updated——》...
// 销毁组件，beforeCreate——》created——》beforeMount——》mounted——》beforeDestroy——》destroyed
