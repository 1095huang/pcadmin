var path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');

// const autoprefixer = require('autoprefixer');

// const ManifestPlugin = require('webpack-manifest-plugin');

var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

console.log(process.env.NODE_ENV);

console.log('============================start===============================');

function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

var cssLoader = {
    loader: 'css-loader',
    options: {
        minimize: false,
        sourceMap: true
    }
};

function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader];
    if (loader) {
        loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
                sourceMap: true
            })
        });
    }
    return ['vue-style-loader'].concat(loaders);
}

module.exports = {
    entry: {
        app: './client/index.js',
        vendor: [
            'vue',
            'vue-router',
            'vuex',
            'vue-resource'
        ]
    },

    context: path.resolve(__dirname, '../'),

    output: {
        filename: 'static/pcadmin/[name]-[chunkHash:5].js',
        path: resolve('dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('pcadmins')
        }
    },

    devServer: {
        contentBase: resolve('dist'),
        openPage: 'view/index.html',
        open: true
    },

    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: [new RegExp(`node_modules\\${path.sep}(?!pcadmin-.*)`)],
                // include: '/client/',
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: generateLoaders(),
                        less: generateLoaders('less')
                    },
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            outputPath: 'assets/'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: true,
                            gifsicle: {
                                interlaced: false
                            },
                            mozjpeg: {
                                progressive: true,
                                arithmetic: false
                            },
                            optipng: false,
                            pngquant: {
                                floyd: 0.5,
                                speed: 2
                            },
                            svgo: {
                                plugins: [
                                    { removeTitle: true },
                                    { convertPathData: false }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                // 使所有以 .json5 结尾的文件使用 `json5-loader`
                test: /\.json5$/,
                loader: 'json5-loader'
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'markdown-loader'
                    }
                ]
            },
            {
                test: /\.code$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            }
        ]
    },

    plugins: [

        // new ManifestPlugin(),

        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '../')
        }),

        new HtmlWebpackPlugin({
            filename: './view/index.html',
            template: './view/index.html',
            title: '系统',
            inject: true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),

        new FriendlyErrorsPlugin()
    ]
};
