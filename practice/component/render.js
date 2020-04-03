import Vue from 'vue'

const component = {
  props: ['props1'],
  name: 'mycomp',
  // template: `
  //   <div :style="style">
  //     <slot></slot>
  //   </div>
  // `,
  render(createElement) {
    return createElement(
      'div',
      {
        style: this.style
        // 触发
        // on: {
        //   click: () => {
        //     this.$emit('click')
        //   }
        // }
      },
      // this.$slots.default // 不是[slot]
      // [this.$slots.default, this.props1]
      [this.$slots.header, this.props1]
    )
  },
  data() {
    return {
      style: {
        width: '200px',
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
  el: '#root',
  data() {
    return {
      value: '123'
    }
  },
  methods: {
    handleClick() {
      console.log('clicked')
    }
  },
  // template: `
  //   <div>
  //     <comp-one ref="comp">
  //       <span ref="span">{{value}}</span>
  //     </comp-one>
  //   </div>
  // `,
  // render () {
  //   return this.$createElement()  //每一个vue实例都有这个创造节点的函数
  // }
  render(createElement) {
    return createElement(
      'comp-one', // 组件名 或者 节点名
      {
        ref: 'comp', // 属性
        props: {
          props1: this.value
        },
        // on: {
        //   click: this.handleClick
        // },
        // 使用on的话，需要在组件中emit一下
        // 使用nativeOn，默认把事件绑定到组件的根节点上（此处是指带有style的div），不需要emit
        nativeOn: {
          click: this.handleClick
        }
      },
      [
        // 子节点以数组进行传递
        createElement(
          'span',
          {
            ref: 'span',
            // 这部分内容放到哪个slot名下，组件里面this.$slot.header，默认情况是this.$slot.default
            slot: 'header', // 写了slot，组件里面会自动生成this.$slot对象
            domProps: {
              // 指定DOM里的内容，会覆盖下面的this.value
              innerHTML: '<span>我是span标签</span>'
            },
            attrs: {
              id: 'test-id'
            }
          },
          this.value
        )
      ]
    )
  }
})

// template里面的字符串，如何变成html节点？——》编译成render方法

// 创建出来的不是html节点，而是一个叫做VNode的一个类，是在内存里存储的类似于DOM结构的一个结构，会和DOM结构进行对比。这部分DOM结构需要更新的话，就把这部分VNode转换成DOM内容，然后填到真正的DOM结构里面去。

// nativeOn：直接把事件绑定到组件的根节点的原生DOM上，如果本省就是DOM，就直接绑定到这个DOM上。

// 目前为止，写vue的方式有三种：template，render方法，jsx
