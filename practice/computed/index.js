import Vue from 'vue'

new Vue({
  el: '#root',
  // 需要在页面中显示全名
  template: `
      <div>
        <p>简单情况下显示Name，用模板字符串拼接: {{firstName + ' ' + lastName}}</p>
        <p>使用computed：{{fullName}}</p>
        <p>使用methods：{{getName()}}</p>
        <p>监听firstName的变化 allName:{{allName}}</p>
        <p>Number: {{number}}</p>
        <p><input type="text" v-model="number" /></p>
        <p>FirstName:<input type="text" v-model="firstName" /></p>
        <p>LastName:<input type="text" v-model="lastName" /></p>
        <p>输入名字: <input type="text" v-model="fullName"/></p>
        <p><input type="text" v-model="obj.a" /></p>
      </div>
    `,
  data: {
    firstName: 'Grace',
    lastName: 'Fan',
    number: 0,
    allName: '',
    obj: {
      a: '123',
      b: 0
    }
  },
  // computed的好处：
  // 在number变化的时候，要把变化后的number更新到页面上去，整个页面都会重新渲染，getName方法就会被调用，而computed不会重新计算——》computed性能消耗比较小
  // 一般用在：我们拿到的数据，并不是真正想要显示的数据，需要通过计算，把这些数据处理一下来显示
  computed: {
    fullName() {
      console.log('full name')
      // return this.firstName + ' ' + this.lastName
      return `${this.firstName} ${this.lastName}`
    }
    // 也可以做设置的写法，但是一般不推荐
    // fullName: {
    //   get() {
    //     console.log('full name')
    //     return `${this.firstName} ${this.lastName}`
    //   },
    //   set(name) {
    //     const names = name.split(' ')
    //     this.firstName = names[0]
    //     this.lastName = names[1]
    //   }
    // }
  },
  // mounted() {
  //   this.obj = {
  //     a: '345'
  //   }
  // },
  watch: {
    // 一般用于：监听到一个数据的变化，你要向后台发送一个请求（或者做一个指定的操作），computed做不到，只能通过watch来做
    // watch方法最初绑定的时候是不会执行的，只有变化了一次以后才会执行
    // firstName(newName, oldName) {
    //   this.allName = newName + ' ' + this.lastName
    // }
    firstName: {
      handler(newName, oldName) {
        this.allName = newName + ' ' + this.lastName
      },
      immediate: true // 声明了这个属性以后，立马会先执行一遍handler里面的代码
    },
    // obj: {
    //   handler() {
    //     console.log('obj.a changed')
    //   },
    //   immediate: true,
    //   deep: true // 如果deep:false，不会触发obj的handler。handler默认监听obj这个属性，只有给obj重新赋值才会监听到(例如mounted里面给obj重新赋值，就会触发)。——》deep:true 深入观察，把obj下面的属性一层一层遍历一遍，所有的属性都加上监听事件，但是开销比较大。——》如何优化？使用'obj.a'即可。
    // },
    'obj.a': {
      handler() {
        console.log('obj.a changed')
      },
      immediate: true
    },
    // 如果在watch里面修改你所依赖的数值
    'obj.b': {
      handler() {
        this.obj.b += 1
      },
      immediate: true
    }
  },
  methods: {
    getName() {
      console.log('getName invoked')
      return `${this.firstName} ${this.lastName}`
    }
  }
})

// 在computed和watch里面不要去修改你所依赖的值，尽量做到只去生成一个值。如果做了修改，可能会导致无限循环的watch事件的触发
