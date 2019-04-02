const path = require('path')
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
console.log(process.env)

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

module.exports = config
