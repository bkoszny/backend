const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: ['aws-sdk'],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  stats: 'minimal'
};