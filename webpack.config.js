var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var fs = require('fs')
var path = require('path')

var IS_PRODUCTION = (process.argv.indexOf('-p') !== -1)
if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = IS_PRODUCTION ? 'production' : 'development'
}

var config = {
    devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
        common: './examples/common.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/examples/build',
        publicPath: '/build/'
    },
    module: {
        loaders: [],
    },
    plugins: []
}

// Add an entry for every example
fs.readdirSync(path.join(__dirname, 'examples')).forEach(dir => {
    if (dir === 'build') {
        return
    }
    console.log(dir)
    const fullDir = path.join(__dirname, 'examples', dir)
    const entry = path.join(fullDir, 'bootstrap.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      config.entry[dir] = entry
    }
})

// 
// Javascript
//
config.babel = {
    presets: [
        ['es2015']
    ],
    plugins: [
        'transform-vue-jsx',
        'babel-plugin-transform-object-rest-spread'
    ]
}
config.resolve = {
    extensions: ['', '.js', '.vue']
}
config.module.loaders.push({
    test: /\.vue$/,
    loader: 'vue',
    include: __dirname + '/examples'
})
config.module.loaders.push({
    test: /\.js$/,
    loader: 'babel',
    include: __dirname + '/examples'
})

// 
// Styles
//
config.postcss = [
    autoprefixer(),
]
config.vue = {
    postcss: config.postcss
}
// Postprocces the scss files with postcss 
var styleLoaders = ['css?sourceMap', 'postcss', 'sass?sourceMap']
config.module.loaders.push({
    test: /\.scss$/,
    include: __dirname + '/examples',
    loaders: ['style'].concat(styleLoaders)
})
config.module.loaders.push({
    test: /\.css$/,
    exclude: __dirname + '/examples',
    loaders: ['style', 'css']
})
config.module.loaders.push({
    test: /\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/, // css resources
    loader: 'url'
})
// 
// Webpack Dev Server
//
config.devServer = {
    stats: {
        chunks: false,
        version: false,
        assets: false,
        hash: false,
        color: true,
    }
}
config.plugins.push(new webpack.DefinePlugin({
    INJECT_WEBPACK_DEV_SERVER_SCRIPT: (process.argv[1].match(/webpack-dev-server$/) !== null) && (process.argv.indexOf('--inline') === -1),
    IS_PRODUCTION: IS_PRODUCTION,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}))

//
// Other
//
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'common' }))


module.exports = config
