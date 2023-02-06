const { defineConfig } = require("@vue/cli-service");
const CompressionWebpackPlugin = require("compression-webpack-plugin") 
const path = require('path')
const nowTime = new Date().getTime();
const {version} = require('./package.json')

const productionGzipExtensions = ["js", "css"]
function resolve(dir) {
  return path.join(__dirname, dir)
}

const externals = [
  {
    vue: 'Vue'
  },
  {
    'vue-router': 'VueRouter'
  },
  {
    axios: 'axios'
  },
  {
    md5: 'MD5'
  },
  {
    qs: 'Qs'
  }
  ]
  const cdn = {
  css: [],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/md5@2.3.0/dist/md5.min.js',
    'https://cdn.jsdelivr.net/npm/qs@6.11.0/dist/qs.min.js'
  ]
  }
module.exports = defineConfig({
  
  transpileDependencies: true,

   // 部署应用时的基本路径 URL，baseUrl从 Vue CLI 3.3 起，已弃用，使用publicPath来替代
  publicPath: '/',

  // build时构建文件的目录，构建时传入 --no-clean 可关闭该行为
  outputDir: 'dist',

  // build时放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',

   // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  indexPath: 'index.html',

  // 默认在生成的静态资源文件名中包含hash以控制缓存
  // 构建多页面应用，页面的配置
  //  pages: {
  //     index: {
  //         // page 的入口
  //         entry: 'src/main.js',
  //         // 模板来源
  //         template: 'public/index.html',
  //         // 在 dist/index.html 的输出
  //         filename: 'index.html',
  //         // 当使用 title 选项时，
  //         // template 中的 title 标签需要是 
  //         // <title><%= htmlWebpackPlugin.options.title %></title>
  //         title: '开发平台',
  //         // 在这个页面中包含的块，默认情况下会包含
  //         // 提取出来的通用 chunk 和 vendor chunk。
  //         chunks: ['chunk-vendors', 'chunk-common', 'index']
  //     },
  // }, 
  filenameHashing: false,

  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  lintOnSave: false,

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // css的处理
  css: {
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
    // 默认生产环境下是 true，开发环境下是 false
    // extract: false,

    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,
    //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    loaderOptions: {
      // postcss: {
      //   postcssOptions:{
      //     plugins: [
      //       // 把px单位换算成rem单位
      //       require("postcss-pxtorem")({
      //         rootValue: 192, // 换算的基数 375的设计稿，换算基数就是37.5 ,本项目是1920，则192
      //         propList: ["*"], //可以从px更改为rem的属性。
      //         // selectorBlackList: [".el"],// 要忽略的选择器并保留为px。
      //         minPixelValue: 0 // 设置要替换的最小像素值。
      //       })
      //     ]
      //   }
      // },
      sass: {
        implementation: require("sass"),
      },
      scss: {
        additionalData: `@import "@/assets/style/main.scss";`
      },
      less:{
        globalVars: {
          primary: '#fff',
        }
      },
      css: {
        modules: {
          auto: () => false,
        },
      }
    }, 
    
  },

  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    open: false,   // 设置浏览器自动打开项目
    port: 9002,   // 设置端口
    // host:"10.10.10.17",
    // 设置代理

    proxy: {
      '/app.js': {
        // target: 'http://127.0.0.1:8081/app.js',
        target: 'http://10.10.10.73:8081/app.js',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/app.js': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    },
    '/api': {
        // target: 'http://127.0.0.1:8081/api',  // 请
        target: 'http://10.10.10.73:8081/api',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/api': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    },
    '/app': {
        // target: 'http://127.0.0.1:8081/app',
        target: 'http://10.10.10.73:8081/app',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/app': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    },
    '/apc': {
        // target: 'http://127.0.0.1:8081/apc',
        target: 'http://10.10.10.73:8081/apc',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/apc': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    },
    '/editor': {
        // target: 'http://127.0.0.1:8081/editor', 
        target: 'http://10.10.10.73:8081/editor',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/editor': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    },
    '/flow': {
        // target: 'http://127.0.0.1:8081/flow',
        target: 'http://10.10.10.73:8081/flow',  // 请求的第三方接口，这里后端端口的8181
        changeOrigin: false,    // 在本地会创建一个虚拟服务器，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据交互就不会有跨域问题
        source: true,
        pathRewrite: { // 路径重写，
            '^/flow': ''  // 替换target中的请求地址，也就是说以后你在请求http://api/douban.com/v2/xxxx 这个地址的时候直接写成/api即可
        }
    }
      // '/app.js': {
      //     target: 'http://127.0.0.1:8081/app.js',
      //     changeOrigin: false,    // 开启跨域
      //     // secure: true,   // 如果是https接口，需要配置这个参数
      //     pathRewrite: {
      //       '^/app.js': ''
      //     }
      // },
      // '/api': {
      //     target: 'http://127.0.0.1:8081/api',
      //     changeOrigin: true,   
      //     source: false,
      //     pathRewrite: {
      //       '^/api': ''
      //     }
      // },
      // '/app': {
      //     target: 'http://127.0.0.1:8081/app',
      //     changeOrigin: true,    
      //     source: false,
      //     pathRewrite: {
      //       '^/app': ''
      //     }
      // },
      // '/apc': {
      //     target: 'http://127.0.0.1:8081/apc',
      //     changeOrigin: true,    
      //     source: false,
      //     pathRewrite: {
      //       '^/apc': ''
      //     }
      // },

    },
  },
  configureWebpack: {
    name: 'vue Admin Template',
    resolve: {
      alias: {
        '@': resolve('src'),
        '@static': resolve('public/static'),
      }
    },
    // output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
    //   filename: `\static\js\kh-[name]-${version}-${nowTime}.js`,
    //   chunkFilename: `\static\js\kh-[name]-${version}-${nowTime}.js`
    // },
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path][base].gzip", 
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240, //内容超过10KB进行压缩
        minRatio: 0.8,
      }),
    ]
  },

  chainWebpack: (config) => {
    // config.externals(externals)
    // config.plugin("html").tap((args) => {
    //   // args[0].title = "开发平台";
    //   // args[0].cdn = cdn
    //   return args;
    // });
    
    //图片压缩
    // config.module
    //   .rule('images')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     bypassOnDebug: true
    //   })
    //   .end()
    config
      .optimization.splitChunks({
        chunks: "all",
        minSize: 10000,//默认值，超过30K才独立分包
        automaticNameDelimiter:"-",//打包文件名默认连接符号
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(s?css|less|sass)$/,
            chunks: 'all',
            priority: 10
          },
          nodesInitial: {
            name:"chunk-nodesInitial",
            test: /[\/]node_modules[\/]/,
            priority: 10,
            minChunks: 1,
            chunks: "initial",//仅打包同步引用的依赖
            reuseExistingChunk: true
          },
          nodesAsync: {
              name:"chunk-nodesAsync",
              test: /[\/]node_modules[\/]/,
              priority: 9,
              minChunks: 1,
              chunks: "async",//仅打包异步引用的依赖
              reuseExistingChunk: true
          },
          // common: {
          //   name: 'chunk-common',
          //   chunks: 'all',
          //   minChunks: 5, // 拆分前必须共享模块的最小 chunks 数。
          //   maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          //   minSize: 0, // 生成 chunk 的最小体积（≈ 20kb)
          //   priority: 1, // 优化将优先考虑具有更高 priority（优先级）的缓存组
          //   reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
          // },
          // libs: {
          //   name: 'chunk-libs',
          //   test: /[\\/]node_modules[\\/]/,
          //   priority: 10,
          //   chunks: 'initial' // 只对最初依赖的第三方进行打包
          // },
          elementUI: {
            name: 'chunk-elementUI', // 将elementUI拆分为单个包
            priority: 20, // 权重值需要大于libs和app，否则它将被打包到libs或app中
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          vue: {
            name: 'chunk-vue', // 将elementUI拆分为单个包
            priority: 20, // 权重值需要大于libs和app，否则它将被打包到libs或app中
            test: /[\\/]node_modules[\\/]_?vue(.*)/ // in order to adapt to cnpm
          },
          vRegion: {
            name: 'chunk-vRegion', // 将elementUI拆分为单个包
            priority: 20, // 权重值需要大于libs和app，否则它将被打包到libs或app中
            test: /[\\/]node_modules[\\/]_?v-region(.*)/ // in order to adapt to cnpm
          },
          highcharts: {
            name: 'chunk-highcharts', // 将elementUI拆分为单个包
            priority: 20, // 权重值需要大于libs和app，否则它将被打包到libs或app中
            test: /[\\/]node_modules[\\/]_?highcharts(.*)/ // in order to adapt to cnpm
          },
          
          // commons: {
          //   name: 'chunk-commons',
          //   test: resolve('src/components'), // can customize your rules
          //   minChunks: 3, //  minimum common number
          //   priority: 5,
          //   reuseExistingChunk: true
          // }
        }
      })
  },
});
