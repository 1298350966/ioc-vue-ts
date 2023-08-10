import {
  Events as PieCommonEvents,
  PieCommonConfig
} from './PieCommon/index'
import {
  Events as PieRingEvents,
  PieRingConfig
} from './PieRing/index'
import {
  Events as PieRoseEvents,
  PieRoseConfig
} from './PieRose/index'
import {
  Events as PieCircleEvents,
  PieCircleConfig
} from './PieCircle/index'
import {
  Events as MultiLoopPieEvents,
  MultiLoopPieConfig
} from './MultiLoopPie/index'


export const seriesConfig = {
  center:['50%', '50%'],  //圆心坐标，支持绝对值（px）和百分比，百分比计算min(width, height) * 50%
  radius:[0, '75%'], //	半径，支持绝对值（px）和百分比，百分比计算比，min(width, height) / 2 * 75%， 传数组实现环形图，[内半径，外半径]
  startAngle:"90", //开始角度, 饼图（90）、仪表盘（225），有效输入范围：[-360,360]
  minAngle:0, //最小角度，可用于防止某item的值过小而影响交互
  clockWise:true, //显示是否顺时针
  roseType:null, //南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
  selectedOffset:10, //选中是扇区偏移量
  selectedMode:null, //选中模式，默认关闭，可选single，multiple
} 

export const PiesEvents = {
  [PieCommonConfig.key]: PieCommonEvents,
  [PieCircleConfig.key]: PieCircleEvents,
  [PieRingConfig.key]: PieRingEvents,
  [PieRoseConfig.key]: PieRoseEvents,
  [MultiLoopPieConfig.key]: MultiLoopPieEvents,
}

export default [PieCommonConfig, PieRingConfig, PieRoseConfig, MultiLoopPieConfig, PieCircleConfig]