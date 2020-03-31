const path = require("path");
const webpack = require("webpack");
// 处理.vue文件
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// 处理html
const HTMLPlugin = require("html-webpack-plugin");
// extract-text-webpack-plugin 把非javascript代码的东西单独打包成静态资源文件，我们希望引用css文件的时候，在html头里面引入一个单独的css文件
const ExtractPlugin = require("extract-text-webpack-plugin");

//启用脚本的时候，设置的环境变量存在于process.env这个对象中
const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web", //开发的是前端项目，跑在浏览器里面，webpack的编译目标是web平台
  entry: path.join(__dirname, "src/index.js"), // __dirname 这个文在所在的目录地址，也就是根目录；拼接起来，得到一个绝对路径
  output: {
    // filename在正式环境和开发环境是不一样的。在正式环境要使用chunkhash，在开发环境的时候不能使用chunkhash，否则devSServer会报错。
    filename: "bundle.[hash:8].js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader" //处理jsx文件
      },
      {
        test: /\.css$/,
        use: [
          "vue-style-loader", //把css文件写入html里面，作为样式
          "css-loader" //读取css文件
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            // loader可以配置选项
            loader: "url-loader", // 把图片转换成base64代码，直接写入html文件，对于小图片作用大，减少http请求;url-loder不依赖于file-loader，file-loader作用是把一个文件输出到另一个文件夹中，
            options: {
              limit: 1024, // 文件小于1024，就写入html代码
              name: "[name]-aaa.[ext]" //输出原来的名字，ext是原来的扩展名
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(), // vue-loader的使用都是需要伴生 VueLoaderPlugin的
    new HTMLPlugin(),
    // 给webpack在编译的过程中，以及我们写js代码的时候，都可以调用process.env进行判断；
    // 现在的vue、react的代码会根据不同的环境区分打包，vue的dist目录里面有很多不同版本的vue的源代码，在开发环境是一个比较大的版本（包括错误信息的提示、各种功能——正式环境不需要有），所以要对环境进行区分，去选择不同版本的源代码打包进去（webpack在打包的时候，也会根据这个变量，选择不同版本的源代码进行打包）
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    })
  ]
};

if (isDev) {
  // styl要区分环境来做
  // /stylus-loader专门用来处理stylus文件，处理完成后变成css文件，交给css-loader.webpack的loader就是这样一级一级向上传递，每一层loader只处理自己关心的部分
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      "vue-style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true //stylus-loader会生成一个map，postcss-loader也会生成一个map，但是设置了sourceMap:true，postcss-loader就会直接使用前面生成的map，编译的效率会更高
        }
      },
      "stylus-loader"
    ]
  });
  // 在页面上帮助调整代码的
  // 使用的是.vue格式的开发模式，写的都是es6的代码，代码在浏览器里面是不能直接运行的，如果直接去调试浏览器里面的代码，代码都是经过编译的，我们可能都看不懂。
  // 我们使用的方式是使用Source Map（源映射）进行代码的映射，真正在浏览器中调试的时候，发现打开的还是我们自己写的代码，这样调试起来比较顺眼，能很快定位到错误。
  // sourcemap是为了解决 开发代码 与 实际运行代码 不一致时，帮助我们debug到原始开发代码的技术
  // 这个功能webpack已经提供了，配置config.devtool
  config.devtool = "#cheap-module-eval-source-map"; // 不同的Source Map映射方式，官方推荐，cheap-module-eval-source-map，效率高，准确率高
  // devServer是webpack2以后有的
  config.devServer = {
    port: 8000,
    // host: "0.0.0.0", //可用通过127.0.0.1访问，或者通过内网ip访问 （如果直接设置成localhost，通过ip访问不了；通过ip，其他电脑也可以访问，localhost不可）
    overlay: {
      errors: true //webpack编译过程中会报错
    },
    // historyFallback: {
    // 把没有匹配的地址都映射到一个index.html上
    // },
    open: true,
    hot: true //只更新变化的组件，不会整个页面刷新
  };
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin() //减少不需要的信息展示，webpack4已弃用
  );
} else {
  // 类库稳定性比较高，而业务代码是经常需要更新迭代的，我们希望使用浏览器能尽可能长的时间去缓存静态文件，减少用户流量，使加载速度更快，所以需要把类库单独拆分出来进行打包
  config.entry = {
    app: path.join(__dirname, "src/index.js"),
    vender: ["vue"]
  };
  // 配置正式环境的filename
  // hash和chunkhash的区别：如果使用hash，app和vender的hash值一样，app.4d9f55f8.js和vender.4d9f55f8.js
  // chunk可以理解为在entry里面声明的不同的节点，使用异步加载的时候每一个加载的模块都是一个chunk；我们使用hash的话，所有打包出来的每一个js的模块，都是同样一个hash，是整个应用的hash；使用chunkhash的话，每一个chunk都会生成一个hash。所以一旦使用不同的entry，或者要把类库文件单独打包的时候，必须使用chunkhash，否则单独打包就没有任何意义，因为每次业务代码更新，他的hash也会变。
  config.output.filename = "[name].[chunkhash:8].js";
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: ExtractPlugin.extract({
      // style-loader相当于把css-loader处理的内容包了一层js代码，把css代码写到html里面去，写成style标签
      fallback: "style-loader",
      // 单独处理css文件
      use: [
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true
          }
        },
        "stylus-loader"
      ]
    })
  });
  config.plugins.push(
    // 导出一个独立的css文件，指定静态文件的名字，根据css文件的内容进行Hash，得到哟个单独的值，而不是和output bundle.js一样
    // new ExtractPlugin("styles.[contentHash:8].css") 无法使用，因为webpack4.3包含了contenthash这个关键字段，所以在ExtractPlugin中不能使用contenthash，要使用md5:contenthash:hex:8代替
    new ExtractPlugin("styles.[md5:contenthash:hex:8].css"),
    // 打包类库
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vender"
    // })
    // 这个插件不能用了，webpack4里面改用 webpack.optimize.SplitChunksPlugin 和 webpack.optimize.RuntimeChunkPlugin来替代
    new webpack.optimize.SplitChunksPlugin({
      name: "vender"
    }),
    // 把生成在app.js的webpack相关代码单独打包到一个文件，好处是当我们在有新的模块加入的时候，webpack会给每个模块加id。
    // 我们有新的模块加入的时候，插入的顺序可能在中间，会导致每一个后面的模块的id都发生变化，导致我们打包出来的内容的hashh会产生变化，hash想使用浏览器长缓存的作用就失去了效果。使用这个方法可以规避上述问题。
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "runtime"
    // })
    new webpack.optimize.RuntimeChunkPlugin({
      name: "runtime"
    })
  );
}

module.exports = config;

// 因为配置文件同时用在正式环境和开发环境，所以配置要根据不同的环境进行判断，如何进行判断？————》在跑npm scripts的时候，设定一个环境变量，来标识现在是开发环境还是正式环境。————》要安装一个包，cross-env
// 在不同的平台上，设置环境变量的方式不一样
// Mac上："build": "NODE_ENV=production webpack --config webpack.config.js" 就能读取环境变量
// Windows上："build": "set NODE_ENV=production webpack --config webpack.config.js"
// 如果不想为平台的不同写不同的命令，就是用cross-env
