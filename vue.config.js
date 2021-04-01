const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
    return path.join(__dirname, dir);
}
// const isProd = process.env.NODE_ENV === 'production'
// const cdn = {
//     externals: {
//         vue: 'Vue',
//         'vue-router': 'VueRouter',
//         vuex: 'Vuex',
//         axios: 'axios',
//         'ant-design-vue': 'antd',
//         'vue-ls': 'VueStorage',
//     },
//     css: [],
//     js: [
//         '//unpkg.com/vue@2.6.12/dist/vue.min.js',
//         '//unpkg.com/vue-router@3.4.9/dist/vue-router.min.js',
//         '//unpkg.com/vuex@3.5.1/dist/vuex.min.js',
//         '//unpkg.com/axios@0.21.0/dist/axios.min.js',
//         '//unpkg.com/ant-design-vue@1.7.2/dist/antd.min.js',
//         '//unpkg.com/vue-ls@3.2.1/dist/vue-ls.min.js',
//     ]
// };
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false,
    devServer: {
        before(app) {
            app.get(/.*.(js)$/, (req, res, next) => {
                req.url = req.url + '.gz';
                res.set('Content-Encoding', 'gzip');
                next();
            })
        },
        open: false,
        hotOnly: true,
        host: "localhost",
        port: 8080,
        proxy: {
            "/mgr": {
                target: "http://127.0.0.1/",
                // ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/mgr": "",
                },
            },
        },
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugins.delete("preload");
        config.plugins.delete("prefetch");
        
        config.optimization.minimize(true);
        config.optimization.splitChunks({
            chunks: 'all'
        })
        config.resolve.alias
            .set("@", resolve("./src"))
            .set("assets", resolve(".src/assets"))
            .set("components", resolve("./src/components"))
            .set("views", resolve("src/views"));
        const svgRule = config.module.rule("svg");
        svgRule.uses.clear();
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, "./src/svgIcons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            });
        const fileRule = config.module.rule("file");
        fileRule.uses.clear();
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, "./src/svgIcons"))
            .end()
            .use("file-loader")
            .loader("file-loader");
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require("postcss-pxtorem")({
                        rootValue: 37.5,
                        propList: ["*"],
                    }),
                ],
            },
        },
    },
    configureWebpack: {
        plugins: [
            new CompressionPlugin({
                algorithm: "gzip",
                test: /\.js$|\.css$/,
                filename: "[path].gz[query]",
                minRatio: 0.8,
                threshold: 10240,

            }),
        ],
    },
};
