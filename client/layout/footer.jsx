// jsx就是把html写在js里面
// .vue和.jsx最终都会转换成render方法，但是最终的render方法不可能是jsx，而是通过createElement来创建节点的。

// 如果引入所有的样式文件都要调用cssModules的话，要先引入className  <div id={className.footer}>
// import className from "../assets/styles/footer.styl";

import '../assets/styles/footer.styl'

export default {
  data () {
    return {
      author: 'Grace'
    }
  },
  render () {
    return (
      <div id="footer">
        <span>Written by {this.author}</span>
      </div>
    )
  }
}
