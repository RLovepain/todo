import Vue from 'vue'

const ChildComponent = {
  template: `<div>child component: {{data}}</div>`,
  inject: ['yeye', 'data'],
  mounted() {
    console.log(this.$parent.$options.name) // mycomp
    console.log(this.yeye, this.data) // mycomp
  }
}

const component = {
  name: 'mycomp',
  components: {
    ChildComponent
  },
  // 起到布局的作用，要在div里面放内容，就要用到slot
  // template: `
  //   <div :style="style">
  //     <div class="header" style="color: pink">
  //       <slot name="header"></slot>
  //     </div>
  //     <div class="body" style="color: green">
  //       <slot name="body"></slot>
  //     </div>
  //   </div>
  // `,
  template: `
    <div :style="style">
      <slot :value="value" aaa="andy"></slot>
      <child-component></child-component>
    </div>
  `,
  data() {
    return {
      style: {
        width: '200px', // 不支持写数字
        height: '200px',
        border: '1px solid red'
      },
      value: 'component value'
    }
  }
}

new Vue({
  components: {
    CompOne: component
  },
  // provide初始化的时候，这个vue对象还没有初始化成功，所以获取不到this.value
  // provide: {
  //   return {
  //     yeye: this,
  //     value: this.value
  // },
  // 如果需要进行和这个vue对象上的值挂钩的传递，要通过function来return这个对象，才会在对象初始化过程中去调用provide得到相应的值
  provide() {
    const data = {}
    // Vue里面reactive实现的原理，劫持data里的value属性，每次获取value都赋予新的值
    Object.defineProperty(data, 'value', {
      get: () => this.value,
      enumerable: true // 可以读取，不设置的话就不能读取
    })
    return {
      yeye: this,
      data // 在孙组件里，使用的就是data，不是value了
    }
    // return {
    //   yeye: this,
    //   value: this.value
    // }
  },
  el: '#root',
  data() {
    return {
      value: '123'
    }
  },
  mounted() {
    console.log(this.$refs.comp) // 组件
    console.log(this.$refs.comp.value) // component value
    console.log(this.$refs.span) // span节点
  },
  template: `
    <div>
      <comp-one ref="comp">
        <span slot-scope="props" ref="span">{{props.value}} {{props.aaa}}</span>
      </comp-one>
      <input type="text" v-model="value" />
    </div>
  `
})

// 插槽 slot
// （1）匿名插槽
// （2）具名插槽  <slot name="header"></slot>  <span slot="header">这是header</span>
// （3）作用域插槽
// <slot></slot>  <comp-one><span> {{ value }}</span></comp-one>使用的是new Vue实例里的value
// 如果想要用组件里的value，要用到作用域插槽。这个插槽有自己的作用域
// <slot value="456"></slot>   <comp-one><span slot-scope="props">{{props.value}}</span></comp-one>
// slot-scope指定后面的变量，就是通过组件内部传出来的值

// ref  获得指定的组件 或者 节点，可以通过$refs.xxx直接调用该组件的值或者方法

// provider   inject和provide  跨层级进行组件沟通
// provider默认不提供reactive属性，在父组件里面修改值，不会影响孙组件的值，不会导致孙组件重新渲染。如果要实现响应式怎么办？
// 我们要自己给需要reactive的属性提供get方法   Object.defineProperty，但是不推荐使用，以后可能会变
