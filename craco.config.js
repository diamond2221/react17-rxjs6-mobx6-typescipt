const path = require('path')
const CracoLessPlugin = require('craco-less');
const CracoAlias = require("craco-alias");

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
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {},//不修改主题就注释掉这行
                        javascriptEnabled: true,
                    },
                },
            },
        },
        // {
        //     plugin: CracoAlias,
        //     options: {
        //         source: "tsconfig",
        //         // baseUrl SHOULD be specified
        //         // plugin does not take it from tsconfig
        //         baseUrl: "./src",
        //         /* tsConfigPath should point to the file where "baseUrl" and "paths"
        //         are specified*/
        //         tsConfigPath: "./tsconfig.paths.json"
        //     }
        // }
    ]
}
