import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import zh from './zh/index'
import en from './en/index'



const i18n = createI18n({
  locale: 'zh',
  messages: {
    zh: zh,
    en: en
  }
})


export default i18n