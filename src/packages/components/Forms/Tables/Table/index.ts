export * from "./config"
import image from '@/assets/images/chart/forms/el-table.png'
import { ConfigType, PackagesCategoryEnum,ChartFrameEnum } from '@/packages/index.d'
import { FormComponentsCategoryEnum, FormComponentsCategoryEnumName } from '../../index.d'
export const TableConfig: ConfigType = {
    key: 'Table',
    chartKey: 'VTable',
    conKey: 'VCTable',
    title: '表格',
    category: FormComponentsCategoryEnum.TABLE,
    categoryName: FormComponentsCategoryEnumName.TABLE,
    package: PackagesCategoryEnum.FORMS,
    chartFrame: ChartFrameEnum.ELEMENT_PLUS,
    image
}