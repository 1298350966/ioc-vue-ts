<template>
  <div class="broadcast">
    <div class="leaflet-popup-content">
      <h4 >{{ name  || '--' }}</h4>
      <div class="item">车道数: {{ laneCount || '--'}}</div>
      <div class="item">道闸位置: {{ address || '--'}}</div>
      <div class="item">值班人员: {{ dutyPerson || '--'}}</div>
      <div class="item">值班电话: {{ dutyPhone || '--'}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    name:string,
    laneCount:number
    address:string,
    dutyPerson:string,
    dutyPhone:string,
 
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