const path = require('path')

module.exports = {
    devServer: devServerConfig => {
        return {
            ...devServerConfig,
            proxy: {
                // change xxx-api/login => /mock-api/v1/login
                // detail: https://cli.vuejs.org/config/#devserver-proxy
                [process.env.REACT_APP_BASE_API]: {
                    // target: `http://localhost:${mockServerPort}/mock-api/v1`,
                    target: process.env.REACT_APP_FULL_API,
                    changeOrigin: true,
                    ws: true,
                    pathRewrite: {
                        ['^' + process.env.REACT_APP_BASE_API]: ''
                    }
                }
            }
        }
    },
    webpack: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './src'),
            'components': path.resolve(__dirname, './src/components')
        }
    }
}
