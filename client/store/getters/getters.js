// 后台返回的数据我们不能直接使用，需要我们把数据组装一下才能在很多地方使用
export default {
  fullName(state) {
    return `${state.firstName} ${state.lastName}`
  }
}
