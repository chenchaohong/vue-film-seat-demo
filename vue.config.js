const path = require('path')
const WebpackScpPlugin = require('./plugins/webpack-scp-plugin')
const resolve = dir => {
    return path.join(__dirname, dir)
}

const config = {
    baseUrl: process.env.VUE_APP_PUBLIC_PATH,
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/components'))
    },
    configureWebpack: {
        plugins: []
    },
    devServer: {
        disableHostCheck: true,
        before: function (app) {
            if (!process.env.npm_config_proxydev) {
                app.use(require('connect-cgi-mock')({
                    root: resolve('mock'),
                    route: '/api'
                }))
            }
        }
    }
}

if (process.env.npm_config_proxydev) {
    config.devServer.proxy = {
        '/api': {
            target: 'http://localhost:8081',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
}
if (process.env.npm_config_deploy) {
    let options = {
        ip: process.env.VUE_APP_IP,
        user: process.env.VUE_APP_USER,
        password: process.env.VUE_APP_PASSWORD,
        src: resolve(process.env.VUE_APP_SRC),
        dist: process.env.VUE_APP_DIST
    }
    config.configureWebpack.plugins.push(new WebpackScpPlugin(options))
}

module.exports = config
