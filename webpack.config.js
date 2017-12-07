const { resolve } = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [

        './main.js'
        // the entry point of our app
    ],
    resolve: {
        extensions: ['.js'],
    },
    output: {
        filename: 'bundle.js',
        // the output bundle

        path: resolve(__dirname, 'dist'),
    },

    context: resolve(__dirname, 'src'),

    devtool: 'source-map',

    // module: {
    //     rules: [{
    //         test: /\.(js|jsx)$/,
    //         use: [
    //             'babel-loader'
    //         ],
    //         exclude: /node_modules/
    //     },
    //     {
    //         test: /\.css$/,
    //         use: [
    //           { loader: 'style-loader' },
    //           {
    //             loader: 'css-loader',
    //             options: {
    //               modules: true,
    //               localIdentName: '[path][name]__[local]--[hash:base64:5]'
    //             }
    //           }
    //         ]
    //       }],
    // },

    plugins: [
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
};
