<template>
    <div>
      <setting-item name="位置">
        <el-select-v2 v-model="options.position" :options="positionOptions" />
      </setting-item>

        <setting-item name="地图类型">
        <el-select-v2
            v-model="options.mapTypes"
            multiple
            clearable
            :options="mapTypeOptions"
            placeholder="请选择"
            value-key="value.layer"
        />
        </setting-item>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    options: {
      type: Object,
      required: true,
    },
  });
  const positionOptions = [
    {
      value: "topright",
      label: "右上",
    },
    {
      value: "topleft",
      label: "左上",
    },
    {
      value: "bottomright",
      label: "右下",
    },
    {
      value: "bottomleft",
      label: "左下",
    },
  ];

  const mapTypeOptions = [
    {
        value: {
            title: "地图", //地图控件上所要显示的图层名称
            icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png", //地图控件上所要显示的图层图标（默认图标大小 80x80）
            layer: "TMAP_NORMAL_MAP" //地图类型，在原天地图api中以window.TMAP_NORMAL_MAP表示，此处为字符串
        },
        label: "地图",
    },
    {
        value:{
            title: "卫星",
            icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png",
            layer: "TMAP_SATELLITE_MAP"
        },
        label: "卫星",
    },
    {
        value:{
            title: "卫星混合",
            icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
            layer: "TMAP_HYBRID_MAP"
        },
        label: "卫星混合",
    },
    {
        value:{
            title: "地形",
            icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",
            layer: "TMAP_TERRAIN_MAP"
        },
        label: "地形",
    },
    {
        value:{
            title: "地形混合",
            icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",
            layer: "TMAP_TERRAIN_HYBRID_MAP"
        },
        label: "地形混合",
    },
  ]
  
  </script>
  
  <style scoped></style>
  