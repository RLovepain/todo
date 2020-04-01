import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  template: '<div ref="div">{{text}} {{obj.a}}</div>',
  data: {
    text: 0,
    obj: {}
  }
  // 直接在这里进行watch，在组件被销毁的时候，watch就跟着销毁，不需要手动销毁，比较方便。
  // watch: {
  //   text: (newText, oldText) => {
  //     console.log(`${newText}` + ':' + `${oldText}`)
  //   }
  // }
})

app.$mount('#root')

// let i = 1000

// 修改值
setInterval(() => {
  app.text += 1 // 会引起页面重新染渲染
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.text += 1 // vue是异步渲染的。页面一下子显示5，不是每一次加一都显示一次。如果我们要去操作DOM节点，就要等到DOM渲染完成。$nextTick就是vue下一次进行更新的时候，才会调用传进去的回调函数。
  // // app.$options.data.text += 1 // 企图通过options来改data，发现没有任何变化。说明我们传入的options里面的data其实在通过Vue在init这个对象的时候做过一些修改，不是直接使用$options.data，不是同一个对象，所以直接修改$options里的数据是没有作用的。
  // app.$data.text += 1 // 可以变化，和app.text是同一个属性，其实app.text是代理app.$data.text，是相通的。
  // i++
  // app.obj.a = i // obj里面的a没有初始化，如果修改的话，不会更新到视图里面，页面不会展示a。可以通过forceUpdate方法，强制重新渲染一次。
  // app.$forceUpdate()  // 不建议使用，除非万不得已，会导致应用性能低
  // app.$set(app.obj, 'a', i) // 声明一下a，a变成响应式的了，相当于把a补上去了，推荐使用
  // app.$delete()   // 删除一个属性，但是属性还是响应式的，会导致内存溢出
}, 1000)

// vue实例上的属性
console.log(app.$data)
console.log(app.$props)
console.log(app.$el) // <div>0</div>
console.log(app.$options) // new Vue()里的整个对象
// 给render方法重新赋值是有作用的，要等下一次有值变化的时候，重新渲染，才会生效
// app.$options.render = h => {
//   return h('div', {}, 'new render function')
// }
console.log(app.$root) // vue实例，以树状结构往下进行渲染的，最上面有一个根节点，根节点就是new出来的app
console.log(app.$root === app) // true，整个vue应用当中，每一个节点都可以进行调用
console.log(app.$children) // <item><div></div></item>  就是[<div></div>]
console.log(app.$slots) // 插槽，编译成对象挂到vue实例上
console.log(app.$scopedSlots)
console.log(app.$refs) // 帮助我们快速定位到模板里面的某一个节点，或者某一个组件
console.log(app.$isServer) // false，一般情况用不到，只有在服务端渲染才会做这个判断。因为有一些代码可以在服务端运行，有一些不可以。项目里面加入了服务端渲染，我们就要去判断有些情况在服务端运行，有的只能在客户端运行。这个值帮助进行判断。

// vue实例上的方法
const unwatch = app.$watch('text', (newText, oldText) => {
  console.log(`${newText}`, `${oldText}`) // 字符串
  // console.log(newText, oldText) // 数字
}) // 1 0; 2 1; 3 2; ...   和写在options里的watch一样
// 我们进行组件开发的时候，经常会有路由跳转，相关的watch要及时销毁，否则会造成内存溢出。需要注销watch的话：
unwatch()

// 监听事件
app.$on('test', (a, b) => {
  console.log('test emited', `${a}`, `${b}`)
})
// 触发事件，可以传值
app.$emit('test', 1, 2)
// 以上二者同时作用域一个vue对象，才会生效

// $once只触发一次
// app.$once('test', (a, b) => {
//   console.log('test emited', `${a}`, `${b}`)
// })
// setInterval(() => {
//   app.$emit('test', 1, 2)
// }, 1000)

// 强制组件重新渲染一次
// app.$forceUpdate()

// app.$set(...)
// app.$delete(...)
// vm.$nextTick(...)
