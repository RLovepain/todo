const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const merge = require('webpack-merge')

const defaultPlugins = [
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html') //根据template.html文件生成模板
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  })
]

const devServer = {
  port: 8080,
  overlay: {
    errors: true
  },
  open: true,
  hot: true
}

let config
config = merge(baseConfig, {
  entry: path.join(__dirname, '../practice/index.js'),
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: [
          // 在使用.vue文件进行开发的时候，应该使用vue-style-loader，否则无法使用热更新的功能
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devServer,
  resolve: {
    // 可以指定import的这个vue在哪里。
    // 为什么这么设置？因为打开vue里面的dist，里面有非常多版本的js文件，这是由于vue给我们提供了非常多不同环境的支持。默认情况下，开发环境我们import的是vue.runtime.esm.js，正式环境一般是vue.runtime.min.js。runtime和没有runtime的区别是，runtime不可以在vue对象里面写template
    // 如果不指定，默认使用runtime的vue文件，会报错，runtime-only不会进行编译
    alias: {
      vue: path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
  plugins: defaultPlugins.concat([new webpack.HotModuleReplacementPlugin()])
})

module.exports = config
