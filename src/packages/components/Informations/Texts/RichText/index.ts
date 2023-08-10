import image from '@/assets/images/chart/informations/text_static.png'
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const RichTextConfig: ConfigType = {
  key: 'RichText',
  chartKey: 'VRichText',
  conKey: 'VCRichText',
  title: '富文本',
  category: ChatCategoryEnum.TEXT,
  categoryName: ChatCategoryEnumName.TEXT,
  package: PackagesCategoryEnum.INFORMATIONS,
  image
}
