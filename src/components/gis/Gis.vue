<template>
  <div style="height:100%">
    <GaoDeGis
      v-if="gisType === '高德'"
      :from-parent-gis-obj="fromParentGisObj"
      :gis-init-obj="gisInitObj"
      @recGisMsg="$emit('recGisMsg', $event)"
      :child-resp="childResp"
    ></GaoDeGis>
    <TianDiTuGis
      v-else-if="gisType === '天地图'"
      :from-parent-gis-obj="fromParentGisObj"
      :gis-init-obj="gisInitObj"
      @recGisMsg="$emit('recGisMsg', $event)"
      :child-resp="childResp"
    ></TianDiTuGis>
  </div>
</template>

<script>
import GaoDeGis from "./GaoDeGis.vue";
import TianDiTuGis from "./TianDiTuGis.vue";
export default {
  props: ["fromParentGisObj", "gisInitObj", "childResp", "gisType"],
  components: {
    GaoDeGis,
    TianDiTuGis,
  },
};
</script>

<style></style>
