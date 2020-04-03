import Vue from 'vue'

const component = {
  props: {
    active: Boolean,
    propOne: String
  },
  template: `
    <div>
      <input type="text" v-model="text" />
      <span>{{propOne}}</span>
    </div>
  `,
  data() {
    return {
      text: 123
    }
  },
  mounted() {
    console.log('comp mounted')
  }
}

// 使用基础 Vue 构造器，创建一个“子类”
// const CompVue = Vue.extend(component)

// // 创建 CompVue 实例，并挂载到一个元素上
// // data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数
// new CompVue({
//   el: '#root',
//   // 如果是props就获取不到
//   propsData: {
//     propOne: 'xxx'
//   },
//   // new里面传入data，会覆盖默认值
//   data: {
//     text: '123'
//   },
//   // component里的mounted先辈调用，然后new里的mounted才被调用
//   mounted() {
//     console.log('instance mounted')
//   }
// })

// -----------------------------------------------------------------------

const component2 = {
  // 指定从哪个组件进行继承
  extends: component,
  data() {
    return {
      text: 1111
    }
  },
  // 继承之前的mounted先调用，再调用继承后的mounted
  mounted() {
    console.log('comp2 mounted')
    console.log(this.$parent.$options.name) // Root  说明Comp的$parent是new Vue的实例，就算指定了parent，也是Root。
    this.$parent.text = 3333 // 可以改变text，在子组件内部直接通过$parent去调用它的父组件。不建议在子组件里面改parent。
  }
}

// $parent是可以改变的
const parent = new Vue({
  name: 'parent'
})

new Vue({
  parent: parent, // 指定parent
  name: 'Root', // 转换成$options里面的内容
  el: '#root',
  components: {
    Comp: component2
  },
  data: {
    text: 9999
  },
  mounted() {
    console.log(this.$parent.$options.name) // parent
  },
  // template: `<comp></comp>` // Comp的$parent就是new Vue的实例
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
  // 9999  1111
})

// 什么时候需要使用extends？
// 当我们开发了一个组件，组件的功能已经很完善了，可以使用到一些场景。但是这个组件的功能比较广泛，使用起来会有很多配置项。在自己的业务开发里面使用的时候，不需要用到这么多配置项，就可以设置默认值，也有可能要去扩展它的属性——》就可以通过先去extends，再去把你想要覆盖的内容覆盖掉——》达到扩展的功能，不需要写新的组件。

// 可以给组件指定parent
// 只有在进行new Vue的时候，才可以去指定parent，不建议在子组件里面修改parent
