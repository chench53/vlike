const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // app.use(
  //   '/chain',
  //   createProxyMiddleware({
  //     target: 'https://rinkeby.infura.io/v3/bbf6b774ab29429d98322d03c268f5e8',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/chain': ''
  //       }
  //   })
  // );
};