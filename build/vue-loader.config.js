// vue-loader的配置

// require.resolve加载自己写的loader
// const docsLoader = require.resolve("./doc-loader");

module.exports = isDev => {
  return {
    // 写.vue文件的时候会写template，第一行写完后面有一个空格，然后换行了，一般很难注意到那个空格，在生成模板的时候会把空格渲染出来，空格对html样式、节点的判断有影响，导致开发过程中的错误。
    preserveWhiteSpace: true,
    // 使用extract-text-webpack-plugin把css样式独立打包出来的时候，.vue文件里的样式不会打包出来，此设置帮助把.vue里的style样式打包到独立的css文件里面（vue默认不会把.vue里的样式打包出来，使用异步加载，加载到这个模块的时候，通过js去渲染样式，它认为效率更高，首屏加载更快）
    extractCSS: !isDev, //true，开发环境不需要，正式环境需要
    // postcss 读取全局的postcss.config，全局的配置
    // hotRoload: false //根据传入的process.env.NODE_ENV是否等于production来判断，production的话会关闭热承载功能。根据环境变量生成。

    // 可以给vue-loader自定义模块，输出到组件的options
    // 不仅可以给自定义模块定义loader，对于默认的模块，我们也可以指定loader
    //   loaders: {
    //     docs: docsLoader,
    //     // js: "coffee-loader" //不同的模块用对应的loader来解析
    //   },
    //   // 在解析代码之前
    //   preLoaders: {},
    //   // 指定的loader解析完之后
    //   postLoader: {}

    // 在组件style里面，加上module，就会按照cssModules里面的方式来编译style部分的内容
    // 会给组件加上$style的变量，编译结果是：<header :class="$style.mainHeader">  原来是 <header class="main-header">
    // 好处：不会有命名的冲突；可以自己定义class名称；保密性比较好
    cssModules: {
      localIdentName: isDev
        ? "[path]-[name]-[hash:base64:5]"
        : "[hash: base64: 5]", //css的className最终编译成独一无二的名字，使用vue文件进行开发时，只有在当前的文件里面才会生成这个名字，在其他文件里面是无法调用的
      camelCase: true //给javascript变量命名的时候，使用驼峰命名法。它会把css类名的横杠连接的方式转化为camelCase的方式
    }
  };
};

// 样式的热承载是通过vue-style-loader，而不是通过vue-loader给.vue文件生成的component对象进行热承载的功能

// <docs>#123 = 456</docs>
