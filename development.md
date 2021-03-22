# WeBASE-Web-Mobile开发文档

本代码仅支持fisco-bcos 2.0以上版本，支持群组和群组切换。


## 1、开发环境搭建

### 1.1 依赖环境

| 环境     | 版本              |
| ------   | ---------------  |
| nodejs   | 1.8及以上         |

nodejs下载地址：https://nodejs.org/en/download/

### 1.2 安装依赖包

#### 1.2.1 拉取代码

> 执行命令：

    git clone https://github.com/WeBankFinTech/WeBASE-Web-Mobile.git

将代码放在你的工作目录，例如：D：\project

> 切换到项目目录：

    cd D:\project\WeBASE-Web-Mobile

> 使用命令：

    npm install

下载依赖包



### 1.3 启动项目

> 在项目根目录使用命令：

    npm run serve

> 控制台出现：

    Listening at http ://localhost:8080

> 在浏览器输入"http ://localhost:8080"。

> 默认端口是8080，可在vue.config.js文件中修改。

> 修改跨域配置，在vue.config.js中，修改devServer配置。

    devServer: {
            open: false,
            hotOnly: true,
            host: "localhost",
            port: 8080,
            proxy: {
                "/mgr": {
                    target: "http://127.0.0.1/", //在此修改跨域地址，这里是node_mgr服务ip和端口，且可以访问
                    // ws: true,
                    changeOrigin: true,
                    pathRewrite: {
                        "^/mgr": "",
                    },
                },
            },
        },

## 2、项目打包部署

### 2.1 项目打包

> 切换到项目根目录，执行命令：

    npm run build

> 进行打包，生成打包文件dist，在项目根目录下。

### 2.2 部署

请参考部署文档
