module.exports = {
  devServer: {
    host: '0.0.0.0',
    open: true,
    hot: true,
    port: '8080',
    https: false,
    proxy: {
      '/api': {
        target: 'http://192.168.21.208:8080',
        // target: 'http://192.168.21.236:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  lintOnSave: false,
}
