const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath:
        process.env.NODE_ENV === "production"
            ? "/"
            : "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false,
    devServer: {
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
        config.plugins.delete("prefetch");
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
                    require('postcss-pxtorem')({
                        rootValue: 37.5,
                        propList: ['*']
                    })
                ]
            }
        }
    },
};
