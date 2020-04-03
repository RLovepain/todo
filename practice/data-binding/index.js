import Vue from 'vue'

new Vue({
  el: '#root',
  // 简单的一元运算可以写在template里面——》通过一行语句，能得到一个返回结果的
  // 动态添加class的三种方式
  //  :class='{active: isActive}'  对象
  //  :class="[isActive ? 'active' : '']"   数组
  //  :class='[{active: isActive}]'  数组里面是对象，可以添加多个类名
  template: `
    <div :class='{active: isActive}' :style='[styles, styles2]'>
      <p v-html="html"></p>
      <h2>{{arr.join(' ')}}</h2>
      <h2>{{getJoinedArr(arr)}}</h2>
    </div>
  `,
  data: {
    isActive: false,
    arr: [1, 2, 3],
    html: '<span>我是span</span>',
    styles: {
      color: 'red',
      appearance: 'none' // 消除浏览器的默认样式，vue会根据浏览器，自动帮助加前缀（加prefix）  -webkit-appearance: none;
    },
    styles2: {
      color: 'green'
    } // vue会自动计算，相同的话，后面的会覆盖前面的
  },
  computed: {
    classNames() {}
  },
  methods: {
    handleClick() {
      alert('clicked') // eslint-disable-line
    },
    // 推荐通过computed来做
    getJoinedArr(arr) {
      return arr.join(' ')
    }
  }
})
