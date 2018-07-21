const path = require('path')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config')
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'prod')

module.exports = merge(baseConfig, mainConfig, rendererConfig, {
  output: {
    filename: '[name].js',
    path: OUTPUT_DIR
  }
})
