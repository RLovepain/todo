const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractPlugin = require("extract-text-webpack-plugin");
const baseConfig = require("./webpack.config.base");
const merge = require("webpack-merge");

const isDev = process.env.NODE_ENV === "development"; //开发环境

const defaultPlugins = [
  new VueLoaderPlugin(), // vue-loader的使用都是需要伴生 VueLoaderPlugin的
  new HTMLPlugin(),
  // 给webpack在编译的过程中，以及我们写js代码的时候，都可以调用process.env进行判断；
  // 现在的vue、react的代码会根据不同的环境区分打包，vue的dist目录里面有很多不同版本的vue的源代码，在开发环境是一个比较大的版本（包括错误信息的提示、各种功能——正式环境不需要有），所以要对环境进行区分，去选择不同版本的源代码打包进去（webpack在打包的时候，也会根据这个变量，选择不同版本的源代码进行打包）
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  })
];

const devServer = {
  port: 8000,
  overlay: {
    errors: true
  },
  open: true,
  hot: true
};

let config;

if (isDev) {
  // merge方法得到的是新的config，不会修改baseConfig
  config = merge(baseConfig, {
    devtool: "#cheap-module-eval-source-map",
    module: {
      rules: {
        test: /\.styl(us)?$/,
        use: [
          // 在使用.vue文件进行开发的时候，应该使用vue-style-loader，否则无法使用热更新的功能
          "vue-style-loader",
          "css-loader",
          // {
          //   loader: "css-loader",
          //   options: {
          //     module: true, //开启cssModules，引入其他css文件的时候，也调用cssModules模式
          //     localIdentName: isDev
          //       ? "[path]-[name]-[hash:base64:5]"
          //       : "[hash: base64: 5]"
          //   }
          // },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          "stylus-loader"
        ]
      }
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
} else {
  config = merge(baseConfig, {
    // 后面的覆盖baseConfig里面相同的内容
    entry: {
      app: path.join(__dirname, "../client/index.js"),
      vender: ["vue"]
    },
    output: {
      filename: "[name].[chunkhash:8].js"
    },
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          use: ExtractPlugin.extract({
            fallback: "vue-style-loader",
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
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin("styles.[md5:contenthash:hex:8].css"),
      new webpack.optimize.SplitChunksPlugin({
        name: "vender"
      }),
      new webpack.optimize.RuntimeChunkPlugin({
        name: "runtime"
      })
    ])
  });
}

module.exports = config;
