export default {
  // 异步代码
  // 第一个参数是store，第二个参数是一个对象
  updateCountAsync(store, data) {
    console.log('aaaaaavvv')
    setTimeout(() => {
      store.commit('updateCount', {
        num: data.num
      })
    }, data.time)
  }
}
