const { override, addWebpackPlugin } = require('customize-cra');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = override(
  (config) => {
    // Find the existing HtmlWebpackPlugin
    const htmlPlugin = config.plugins.find(
      (plugin) => plugin instanceof HtmlWebpackPlugin
    );

    if (htmlPlugin) {
      // Update the plugin options
      htmlPlugin.options = {
        ...htmlPlugin.options,
        template: './public/index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      };
    }

    return config;
  }
); 