const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function override(config) {
    config.output.library = 'ArchivalIIIFViewer';
    if (process.env.NODE_ENV === 'production') {
        config.output.filename = 'archivalIIIFViewer.min.js';
        config.entry = {archivalIIIFViewer: path.resolve(__dirname, 'src/index.tsx')};
        config.optimization = {
            minimizer: [
                new TerserPlugin({
                    extractComments: true,
                }),
                new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.(c|s[ac])ss$/,
                    cssProcessorOptions: {
                        map: { inline: false }
                    }
                })
            ],
        };
        config.plugins = [new MiniCssExtractPlugin({filename: '[name].min.css'})];
    }
    config.output.libraryExport = 'default';
    config.output.libraryTarget = 'umd';


    return config;
};

