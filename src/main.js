import Vue from 'vue'

// import "public\static\MicroAppIcon\MicroAppIcons.css"
import "@static/MicroAppIcon/MicroAppIcons.css"
import "@/assets/style/index.scss"
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import VueX from 'vuex'
import App from './App'
import VueRouter from 'vue-router';
import index from './router'
import store from './vuex/store'
import KHConfig from './utils/khConfig.js'
import KHHttp from './utils/khHttp.js'
import KHUtils from './utils/khUtils.js'
import KHForm from './utils/khForm.js'
import KHReport from './utils/report/khReport.js'
import KHReportSet from './utils/report/khReportSet.js'
import KHChart from './utils/report/khChart.js'
import LineColumnChart from './utils/report/LineColumnChart.js'
import PieChart from './utils/report/PieChart.js'
import CompositeChart from './utils/report/CompositeChart.js'
import WidgetHelper from './utils/report/WidgetHelper.js'
import FormWidgetHelper from './utils/form/FormWidgetHelper.js'
import constants_ from './components/Constants'//引用文件
import microAppIcons_ from './components/micro-app/MicroAppIcons'
import widgetStyleConstants from './components/WidgetStyleConstants'//引用文件
Vue.prototype.Constants = constants_//挂载到Vue实例上面
Vue.prototype.MicroAppIcons = microAppIcons_//挂载到Vue实例上面
Vue.prototype.WidgetStyleConstants = widgetStyleConstants//挂载到Vue实例上面
Vue.prototype.showM=true
import VueClipboard from 'vue-clipboard2'
import VueDND from 'awe-dnd'
import vRegion from 'v-region'; // 行政区划选择器
import './promission' // 动态获取后台传递的路由信息
import './utils/global' // 全局路由
import HighchartsDrilldown from 'highcharts/modules/drilldown';

var Highcharts = require('highcharts/highstock');
require('highcharts/modules/sankey')(Highcharts); // 在 Highcharts 加载之后加载功能模块
HighchartsDrilldown(Highcharts);
VueClipboard.config.autoSetContainer = true;
import SingleTable from "@/components/table/SingleTable"
import MDataRefWidget from "@/components/form-widget/MDataRefWidget";

Vue.use(VueX);
Vue.component('SingleTable',SingleTable);
Vue.component('MDataRefWidget',MDataRefWidget);
Vue.use(VueRouter);
Vue.use(ElementUI, {size: 'small'});
Vue.use(VueDND);
Vue.use(vRegion);
Vue.use(VueClipboard);
Vue.config.productionTip = false;
Vue.use(KHConfig);
Vue.use(KHHttp);
Vue.use(KHUtils);
Vue.use(KHForm);
Vue.use(KHReport);
Vue.use(KHReportSet);
Vue.use(KHChart);
Vue.use(LineColumnChart);
Vue.use(PieChart);
Vue.use(CompositeChart);
Vue.use(WidgetHelper);
Vue.use(FormWidgetHelper);
Vue.prototype.$EventBus = new Vue();

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
new Vue({
    router: index,
    store,
    render: h => h(App)
}).$mount("#app");

