const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [autoprefixer()]
};

// 用来后处理css的， 把stylus编译成css后 ，通过postcss去优化css代码，优化的过程是通过一系列组件来优化
// autoprefixer插件：我们会用到一些加浏览器前缀的css属性，而我们不希望要一个一个去声明，就使用autoprefixer，帮我们自动处理css属性加前缀
// 对于jsx文件，用babel-loader进行操作
// 同时给styl文件添加一个对象 postcss-loader...
