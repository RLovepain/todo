import Vue from 'vue'

const component = {
  // props：用来定义这个组件被外部使用的时候它的可变的行为。不同的地方使用这个组件是为了实现各自不同的功能，通过props来体现，指定组件可变的行为
  // 命名变量的时候也遵循camelCase，自定义属性的时候用连接符，vue内部会自动转换成camelCase
  props: {
    active: {
      // type: Boolean, // 希望active是Boolean类型，不是的话提示一个warning，但依然可以使用
      // required: true,
      // default: false, // 定义了default，就可以不写required: true，默认必须要传的
      // default(){   // 如果是对象的话，是一个函数
      //   return {
      //     ...
      //   }
      // }
      // 如果需要更严格的验证，使用validator属性
      validator(value) {
        return typeof value === 'boolean'
      }
    },
    propOne: String
  },
  template: `
    <div>
      <input type="text" v-model="text" />
      <span @click="handleChange">{{propOne}}</span>
      <span v-show="active">see me if active</span>
    </div>
  `,
  // 如果写data: {text: 123}，会报错。不是new Vue的组件，data是一个function，return的是一个新建的对象。因为组件是要复用的，每一个组件里的data都是独立的，不能相互影响。
  // mounted() {
  //   // 组件内部props的值不能修改，会报错，它是外部传过来了，子节点不能去修改父节点的定义
  //   this.propOne = 'inner content'
  // },
  data() {
    return {
      text: 123
    }
  },
  methods: {
    handleChange() {
      this.$emit('change')
    }
  }
}

// 把component变成vue组件？
// 组件名开头大写，遵循camelCase命名；使用组件的时候用小写加连接符
// 为什么开头大写？因为vue组件可以看成一个类，而类的开头是需要大写的

// 用Vue的component方法，全局注册组件
// Vue.component('CompOne', component)

new Vue({
  // 局部注册
  components: {
    CompOne: component
  },
  data: {
    prop1: 'text'
  },
  methods: {
    handleChange() {
      this.propOne += 1
    }
  },
  mounted() {
    console.log(this.$refs.comp1) // comp1组件
  },
  el: '#root',
  template: `
    <div>
      <comp-one ref="comp1" :active="true" :prop-one="prop1" v-on:change="handleChange"></comp-one>
      <comp-one :active="false"></comp-one>
    </div>
  `
})
