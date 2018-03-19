'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const eslintFormatter = require('react-dev-utils/eslintFormatter');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);
const path = require('path');

const deployDir = process.argv.some(arg => arg.indexOf('deployDir') > 1 ) ? process.argv[process.argv.findIndex(function(arg){
        return arg.indexOf('deployDir') > 1;
    })].split("=")[1] : null;

const cssFilename = 'static/css/[name].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
    : {};

module.exports = {
    devtool: 'source-map',
    entry: {
        index: [require.resolve('./polyfills'), paths.appIndexJs ],
    },
    output: {
        path:  paths.appBuild,
        filename: 'static/js/[name].bundle.js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: shouldUseRelativeAssetPaths ? '' : publicPath
    },
    resolve: {
        modules: [
            paths.path.resolve(__dirname, "src"),
            paths.node,
        ],
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            'react-native': 'react-native-web'
        }
    },

    module: {
        rules: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.sass$/,
                    /\.scss$/,
                    /\.json$/,
                    /\.svg$/
                ],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(js|jsx|mjs)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            eslintPath: require.resolve('eslint'),

                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: paths.appSrc,
            },
            {
                test:  /\.mock/,
                loader: 'null-loader'
            },
            {
                test: /\.(js|jsx)$/,
                include: [paths.appSrc],
                loader: 'babel-loader'
            },
            {
                test: /\.(css|sass|scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: {
                        loader: 'style-loader',
                        options: {
                            hmr: false,
                        },
                    },
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                minimize: true,
                                sourceMap: false,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                config: {
                                    path: paths.path.resolve(__dirname, 'postcss.config.js'),
                                },
                            },
                        },
                        {loader: 'sass-loader'}
                    ]
                })
            },
            {
                test: /\.svg$/,
                loader: 'file-loader',
                options: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }
        ]
    },
    plugins: [
        new InterpolateHtmlPlugin(env.raw),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: 'stats.json'}),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
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
                minifyURLs: true
            }
        }),
        new webpack.DefinePlugin(env.stringified),
        new webpack.DefinePlugin({MOCKS_ENABLED: false}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false,
                drop_console: true
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new ExtractTextPlugin({filename: cssFilename})
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};