const path = require('path');

module.exports = {
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  stats: {
    errorDetails: true,
  },
};
