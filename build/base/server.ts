import type { ServerOptions } from 'vite'
// 服务端渲染

const server: ServerOptions = {
    // 是否开启 https
    https: false,
    // 端口号
    port: 9001,
    host: "0.0.0.0",
    // 本地跨域代理
    proxy: {
        "/api/": {
            target: 'http://10.10.10.83:3000/api/',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/api/, '')
        },
        "/apc": {
            target: 'http://10.10.10.83:3000/apc/',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/apc/, '')
        },
        "/safe-production": {
            target: 'http://10.10.10.50:8081/safe-production',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/safe-production/, '')
        },
        "/closed-park": {
            target: 'http://10.10.10.50:8081/closed-park',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/closed-park/, '')
        },
        "/wisdom-envprotect": {
            target: 'http://10.10.10.50:8081/wisdom-envprotect',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/data-envprotect/, '')
        },
        "/wisdom-energy": {
            target: 'http://10.10.10.50:8081/wisdom-energy',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/wisdom-energy/, '')
        },
        "/wisdom-emergency": {
            target: 'http://10.10.10.50:8081/wisdom-emergency',
            changeOrigin: false,
            rewrite: path => path.replace(/^\/wisdom-emergency/, '')
        },
        // '/app.js': {
        //     target: 'http://10.10.10.50:9081/api.js',
        //     changeOrigin: false,
        //     rewrite: path => path.replace(/^\/app.js/, '')
        // },
        // '/api': {
        //     target: 'http://10.10.10.50:9081/api',
        //     changeOrigin: false,
        //     rewrite: path => path.replace(/^\/api/, '')
        // },
        // '/apc': {
        //     target: 'http://10.10.10.50:9081/apc',
        //     changeOrigin: false,
        //     rewrite: path => path.replace(/^\/apc/, '')
        // },
    },
}
export default server