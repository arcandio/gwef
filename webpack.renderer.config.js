const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
rules.push({
	test: /\.(png|jpe?g|gif|svg)$/i,
	use: [{loader: 'url-loader'}]
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
