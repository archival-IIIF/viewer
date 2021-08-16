module.exports = {
    style: {
        modules: {
            localIdentName: 'archival-IIIF-viewer.css'
        }
    },
    webpack: {
        configure: {
            output: {
                library: 'ArchivalIIIFViewer',
                filename: 'archival-IIIF-viewer.min.js',
                libraryExport: 'default',
                libraryTarget: 'umd'
            },
            optimization: {
                runtimeChunk: false,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // vendor chunk
                    },
                },
            },
        },
        plugin: require('craco-plugin-scoped-css'),
    },
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    webpackConfig.plugins[5].options.filename = 'archival-IIIF-viewer.min.css';
                    return webpackConfig;
                },
            },
            options: {}
        }
    ],
}
