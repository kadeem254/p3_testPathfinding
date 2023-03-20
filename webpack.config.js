const Path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',

  entry: {
    app: {
      import: "./src/app.js",
    }
  },

  output: {
    path: Path.resolve( __dirname, "build" ),
    clean: true,
  },

  // watch: true,
  watchOptions:{
    aggregateTimeout: 200,
    poll: 1000,
    ignored: '**/node_modules',
  },

  module: {
    rules: [
      // css
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
      // scss
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
      // images
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/i,
        type: "asset/resource",
        generator:{
          filename: "images/[contenthash][ext]"
        }
      },
      // fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator:{
          filename: "fonts/[name][ext]"
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/htmlTemplates/index.html",
      filename: "index.html",
      title: "WEB TEMPLATE 001"
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
    }),
  ]
}
