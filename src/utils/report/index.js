import Vue from 'vue';
import KHReport from '@/utils/report/khReport.js'
import KHReportSet from '@/utils/report/khReportSet.js'
import KHChart from './khChart';
import LineColumnChart from '@/utils/report/LineColumnChart.js'
import PieChart from '@/utils/report/PieChart.js'
import CompositeChart from '@/utils/report/CompositeChart.js'
import WidgetHelper from '@/utils/report/WidgetHelper.js'
import Constants from '@/components/Constants'//引用文件
import widgetStyleConstants from '@/components/WidgetStyleConstants'//引用文件
if(!Vue.prototype.Constants){
    Vue.prototype.Constants = Constants//挂载到Vue实例上面
}
if(!Vue.prototype.WidgetStyleConstants){
    Vue.prototype.WidgetStyleConstants = widgetStyleConstants//挂载到Vue实例上面
}
Vue.use(KHReport);
Vue.use(KHReportSet);
Vue.use(KHChart);
Vue.use(PieChart);
Vue.use(LineColumnChart);
Vue.use(CompositeChart);
Vue.use(WidgetHelper);