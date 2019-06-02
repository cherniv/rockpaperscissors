const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

const appDirectory = path.resolve(__dirname);

var PRODUCTION = process.argv.indexOf('-p') !== -1;
var DEVELOPMENT = !PRODUCTION;

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: __dirname,
  devServer: { // needed only for dev
    inline: true, 
    port: 8088, 
    historyApiFallback: true 
  }, 
  devtool: 'source-map',
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  entry: {
    // polyfill non-standard APIs
    // app entry file
    main: './src/index.js'
  },
  output: {
    //path: path.resolve(appDirectory, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.ttf$/,
        loader: "url-loader", // or directly file-loader
        include: path.resolve(__dirname, "node_modules/react-native-vector-icons"),
      },
      {
        test: /\.js$/,
        include: [
          // anything that needs to be compiled to ES5
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, "node_modules/react-native-flags"),
          path.resolve(appDirectory, "node_modules/react-native-swiper"),
          path.resolve(appDirectory, "node_modules/react-native-gesture-handler"), // for react-navigation
          path.resolve(appDirectory, "node_modules/react-native-vector-icons"), // for react-navigation
          //path.resolve(appDirectory, "node_modules/react-navigation"),
          path.resolve(appDirectory, "node_modules/@react-navigation"),
          //path.resolve(appDirectory, "node_modules/react-navigation-tabs"),
          //path.resolve(appDirectory, "node_modules/react-navigation-drawer"),
          //path.resolve(appDirectory, "node_modules/react-navigation-stack"),
          //path.resolve(appDirectory, "node_modules/react-native-tab-view"),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            presets: ['module:metro-react-native-babel-preset'],
            plugins: [
              // needed to support async/await
              //'@babel/plugin-transform-runtime'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    //new webpack.DefinePlugin({ '__DEV__': false })
  ].concat(DEVELOPMENT ? [
    //new webpack.DefinePlugin({ '__DEV__': true })
  ] : []),
  resolve: {
    alias: Object.assign(
      {
        // use commonjs modules due to mock haste resolver aliases
        'react-native$': 'react-native-web'
      },

     
    ),
    extensions: ['.web.js', '.js', '.json']
  }
};