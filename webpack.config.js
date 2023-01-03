/*
  Temporarily delete the following contents in package.json and run "npm run build"

  "type": "module",
  "module": "./",
*/
const path = require('path');
const json = require('./package.json');
const projectName = json.name.toLowerCase().replace(/@/gi, '').replace(/-/gi, '_').replace(/\//gi, '_').replace(/\./gi, '_');

module.exports = {
  target: ['web', 'es5'],
  entry: {
    index: ['./index.js'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `${projectName}.min.js`,
    library: {
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            configFile: path.resolve(__dirname, 'babel.config.js'),
          },
        },
      },
    ],
  },
  plugins: [],
  devtool: 'source-map',
  mode: 'production',
};
