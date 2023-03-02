const PATH = require("path");
const MINI_CSS_EXTRACT_PLUGIN = require("mini-css-extract-plugin");
const HTML_WEBPACK_PLUGIN = require("html-webpack-plugin");

module.exports = {
  mode: 'development',

  entry: {
    app: {
      import: "./src/app.js",
    }
  },

  output: {
    path: PATH.resolve( __dirname, "build" ),
    clean: true,
  },

  watch: true,
  watchOptions:{
    aggregateTimeout: 200,
    poll: 1000,
    ignored: '**/node_modules',
  },

  module: {
    rules: [
      // scss
      {
        test: /\.s(a|c)ss$/i,
        use: [
          MINI_CSS_EXTRACT_PLUGIN.loader,
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
      }
    ]
  },

  plugins: [
    new HTML_WEBPACK_PLUGIN({
      template: "./src/htmlTemplates/index.html",
      filename: "index.html",
      title: "WEB TEMPLATE 001"
    }),
    new MINI_CSS_EXTRACT_PLUGIN({})
  ]
}