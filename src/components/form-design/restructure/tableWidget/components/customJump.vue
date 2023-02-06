<template>
  <div class="customJump">
    <template v-if="KHUtils.isNull(customUrl)">
        <component :is="customComponent" v-bind="customProps" v-if="customHackSet"  @closeCustomDialog="closeCustomDialog"></component>
    </template>
    <template v-else>
        <div :style="'height:'+ iframeHeight">
            <iframe v-if="customUrl !== ''" :src="customUrl" style="width: 100%;height: 100%;overflow: auto"></iframe>
        </div>
    </template>
  </div>
</template>

<script>
export default {
  props:["customUrl","customComponent","customProps","customHackSet","iframeHeight"],
  mounted:{
    closeCustomDialog(){
      this.$emit('close', param); 
    }
  }
}
</script>

<style>

</style>