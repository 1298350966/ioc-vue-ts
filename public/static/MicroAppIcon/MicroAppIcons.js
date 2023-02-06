
import iconfont from "./icon/KHIcon.json"
// 默认菜单图标
export const defaultIconName = "KHIcon-peixunkaoshi"
// 图标库
export const appIcons = iconfont.glyphs.map((glyph)=>{
    return {
        name:glyph.name,
        iconName: iconfont.css_prefix_text + glyph.font_class,
    }
})
    


