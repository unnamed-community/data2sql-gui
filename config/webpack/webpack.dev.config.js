const path = require('path')
const merge = require('webpack-merge')
const ElectronConnectPlugin = require('webpack-electron-connect-plugin')

const baseConfig = require('./webpack.base.config')
const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'dev')

module.exports = merge(baseConfig, mainConfig, rendererConfig, {
  output: {
    filename: '[name].js',
    path: OUTPUT_DIR
  },
  plugins: [
    new ElectronConnectPlugin({
      type: "reload",
      options: {
        path: path.resolve(OUTPUT_DIR, 'main.js'),
        stopOnClose: true,
        spawnOpt: {
          cwd: OUTPUT_DIR,
          env: {
            environment: 'development'
          }
        }
      }
    })
  ]
})
