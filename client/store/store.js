import Vuex from 'vuex'

// 为什么是defaultState，不是defaultMutations？
// 服务端渲染的时候会有一部分数据传到客户端，我们会用拿到的数据去覆盖default数据。default的数据和业务不相关，所以只是默认的数据，不会真正的状态。
// mutations只是操作，操作都是一样的。
import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

// 因为在外层创建store，所以Vue.use(Vuex)放到外面即可

// 因为我们要使用服务端渲染，所以每次都是新生成一个store，不能用同一个store
// 用同一个store会有内存溢出的问题
// export default store

export default () => {
  const store = new Vuex.Store({
    // strict:true, // 这样就不可以在mutations外面修改store里的数据。开发环境下使用，为了规范代码，正式环境下不要使用。
    strict: isDev,
    state: defaultState,
    mutations,
    getters,
    actions,
    // vuex的插件，其实就是方法
    plugins: [
      (store) => {
        console.log('my plugin invoked') // vue初始化的时候就会被调用
        // 通过subscribe或者watch进行操作，根据自己的需求定义
      }
    ],
    modules: {
      // 可以给模块加名字，每个模块有自己的作用域（命名空间）
      // 模块下面还可以声明模块
      a: {
        namespaced: true,
        // updateText是模块a的mutations，vuex默认会把所有的mutations放到全局空间。如果你需要把模块a的mutations放到他自己的空间，就需要声明一个属性namespaced:true
        // 这样，每个模块里面都可以写相同名字的mutations
        state: {
          text: 1
        },
        mutations: {
          // state是a的state
          updateText(state, text) {
            state.text = text
          }
        },
        getters: {
          // textPlus(state) {
          //   return state.text + 1
          // }
          // 如果模块a里的getters依赖于全局的state
          // getters是指所有的getters方法，rootState就是指全局的state
          textPlus(state, getters, rootState) {
            return state.text + rootState.count + rootState.b.text // 也能拿到模块b的state
          }
        },
        actions: {
          // context是指整个模块的state,commit方法以及rootState
          // add(context)
          // commit会在当前模块来找，不会到全局找。如果全局找的话，要加上参数{root:true}
          add({ state, commit, rootState }) {
            commit('updateText', rootState.count)
            commit('updateCount', { num: 56789 }, { root: true })
          }
        }
      },
      b: {
        state: {
          text: 2
        },
        actions: {
          testAction({ commit }) {
            // 调用a的updateText
            commit('a/updateText', 'test test')
            // 模块b没有声明namespaced，actions是全局的
            // 如果声明为true，那么就要使用{root:true}
          }
        }
      }
    }
  })

  // 发现修改代码，都会刷新整个页面，不是hot module replacement，如何做到？
  if (module.hot) {
    module.hot.accept(
      [
        './state/state',
        './mutations/mutations.js',
        './actions/actions.js',
        './getters/getters.js'
      ],
      () => {
        // import只能写在最外层，不能在具体的业务逻辑里面写import
        const newState = require('./state/state').default
        const newMutations = require('./mutations/mutations').default
        const newActions = require('./actions/actions').default
        const newGetters = require('./getters/getters').default
        // 每次创建一个store，都要添加这个方法
        store.hotUpdate({
          state: newState,
          mutations: newMutations,
          getters: newGetters,
          actions: newActions
        })
      }
    )
  }
  return store
}
// 以上做到热更新，不用刷新整个页面
