<template>
  <div class="broadcast">
    <div class="leaflet-popup-content">
      <h4 >{{ name  || '--' }}</h4>
      <div class="item">状态: {{ status || '--'}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    name:string,
    status:string,
  }>()
  // console.log(`output->`,aaType)
</script>

<style lang="scss" scoped>
.broadcast{
  width:393px;
  height:272px;
  box-sizing:border-box;
  padding: 35px 40px 20px 45px;
  border-radius: 4px;
  background: url("./img/infowindowBg.png") 50% no-repeat;
  background-size: 100% 100%;
  color: #fff;
  h4{
    position: relative;
    top: 4px;
    padding-bottom: 20px;
    padding-right: 95px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 24px;
    font-weight: 700;
    color: #fffc00;
  }
  .item{
    line-height: 28px;
    font-size: 16px;
  }
}
</style>