/**
 * 动态加载高德地图
 *
 * @export
 * @param {*} key 高德地图key
 * @param {*} plugins 高德地图插件
 * @param {string} [v='1.4.14'] 高德地图版本
 * @returns
 */
export default function loadTMap(key="386b50155b6c69456fe30d057cdbb88b", v = 4.0) {
    return new Promise(function (resolve, reject) {
        if (typeof T !== 'undefined') {
            // eslint-disable-next-line no-undef
            resolve(T);
            return true
        }
        window.onCallback = function () {
            // eslint-disable-next-line no-undef
            resolve(T)
        };
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://api.tianditu.gov.cn/api?v=${v}&tk=${key}`;
        script.onerror = reject;
        script.onload =  function() {
            console.log('加载成功!')
            resolve(T)
        }
        document.head.appendChild(script);
    })
}
