const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');


module.exports = (env) => {
    const plugins = [
        new HtmlWebpackPlugin({template: './public/index.html'}),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'public/favicon.ico', to: 'favicon.ico'},
                {from: 'public/manifest.json', to: 'manifest.json'},
            ]
        }),
    ]
    if (env.development) {
        require('dotenv').config({path: '.env.development.local'});
    } else {
        plugins.push(new webpack.SourceMapDevToolPlugin({
            filename: 'archival-IIIF-viewer.min.js.map'
        }));
    }

    return {
        mode: 'development',
        entry: './src/Init.tsx',
        devtool: env.development ? undefined : false,
        output: {
            path: path.join(__dirname, '/build'),
            library: 'ArchivalIIIFViewer',
            filename: 'archival-IIIF-viewer.min.js',
            sourceMapFilename: 'archival-IIIF-viewer.map.js',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },
        devServer: {
            static: './build',
            compress: true,
            port: process.env.PORT ?? 3000
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css']
        },
        plugins
    }
}
