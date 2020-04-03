import Vue from 'vue'

const component = {
  // model: 允许自定义组件在使用 v-model 时定制 prop 和 event
  // model: {
  //   prop: 'value1',
  //   event: 'change'
  // },
  props: ['value', 'value1'],
  template: `
    <div>
      <input type="text" @input="handleInput" :value="value" />
    </div>
  `,
  data() {
    return {}
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value) // 把新的值emit出去
    }
  }
}

new Vue({
  el: '#root',
  data() {
    return {
      value: '123'
    }
  },
  components: {
    CompOne: component
  },
  // v-model ——》props + 事件监听   <comp-one v-model="value"></comp-one>
  template: `
    <div>
      <comp-one :value="value" @input="value = arguments[0]"></comp-one>
    </div>
  `
})
