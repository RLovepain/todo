const path = require("path");
const createVueLoaderOptions = require("./vue-loader.config.js");

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "../client/index.js"),
  output: {
    filename: "bundle.[hash:8].js",
    path: path.join(__dirname, "../dist")
  },
  module: {
    rules: [
      // vue文件已经指定用vue-loader来处理，eslint-loader只是做代码检测，所以不能让eslint-loader默认处理文件vue文件
      // 希望这么做：使用vue-loader处理vue文件之前，先进行代码检测，如果代码检测不过，就不进行vue-loader处理
      {
        test: /\.(vue|js|jsx)$/,
        loader: "eslint-loader",
        exclude: /node_modules/, //node_modules里面的一些js文件是经过babel处理的，不符合standard标准，可能是es5的规则，所以排除掉，standard是es6甚至es7的规则
        enforce: "pre" //预处理，对于这几种类型的文件，使用真正的loader加载他们之前，都会通过eslint-loader处理一遍。post后处理
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: createVueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/ // 忽略掉node_modules里面的文件，node_modules里面也都是js文件，在发布的过程中已经编译过了
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "resources/[path][name].[hash:8].[ext]"
              // 使用url-loader的时候，需要把静态文件归置得更合理，放到一个单独的文件夹里面，只要把路径写完整就可以了。[path]装饰符，在webpack编译的过程中，它引用的文件会生成path、name、hash、扩展名的变量，用[]的方式进行引用，最终生成名字的时候都会把变量覆盖进去————》静态资源生成的文件目录更好看
            }
          }
        ]
      }
    ]
  }
};

// plugins不需要，因为不同的环境定义的plugins不一样

module.exports = config;
