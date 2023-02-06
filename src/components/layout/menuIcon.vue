
<template>
  <div class="menuIcon">
      <el-image
            class="icon"
             v-if="iconUpload"
            :src="iconUpload | KHImg"
            fit="cover">
            <div slot="error" class="image-slot">
              <i class="icon" :class="className"></i>
            </div>
            </el-image>
       <i  class="icon" v-else :class="className"></i>
    </div>
</template>

<script>
import {defaultIconName} from "@static/MicroAppIcon/MicroAppIcons.js"
export default {
 props: {
    iconName: {
      type: String,
      default: "",
    },
    iconUpload: {
      type: String,
      default: "",
    },
  },

computed:{
    className() {
      let classObject = {};
      let iconName = this.iconName
      classObject.KHIcon = true;
      // 兼容icon以前配置
      if(/^icon/.test(iconName)){
        iconName =  iconName.replace(/^icon/,"KHIcon-");
      }
      classObject[(iconName || defaultIconName)] = true;
      return classObject;
    }
}
}
</script>
<style lang="scss" scoped>

.menuIcon{
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
 
    .icon{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        // justify-content: center;
    }
}
</style>

