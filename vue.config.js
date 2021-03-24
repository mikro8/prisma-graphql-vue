// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

var path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, './dist/public'),
  pages: {
    index: {
      // entry for the page
      entry: __dirname + '/vue/src/main',
      // the source template
      template: __dirname + '/vue/src/public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'vue/src'),
      },
    },
  },
  devServer: {
    port: 4001,
  },
}
