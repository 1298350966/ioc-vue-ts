<template>
    <section style="height: 100%;
            display: flex;
            flex-direction: column;">
        <el-row>
            <el-form :inline="true" :model="retGisObj" :rules="retGisObjRules" ref="retGisObj">
                <el-form-item label="纬度:" prop="lat">
                    <el-input v-model="retGisObj.lat" style="width: 120px" placeholder="纬度"></el-input>
                </el-form-item>
                <el-form-item label="经度:" prop="lnt">
                    <el-input v-model="retGisObj.lnt" style="width: 120px" placeholder="经度"></el-input>
                </el-form-item>
                <el-form-item label="地址:">
                    <el-input v-model="retGisObj.address" placeholder="可输入地址查询" style="width: 400px"
                              prefix-icon="el-icon-search"></el-input>
                </el-form-item>
                <!--/定位范围配置，启用定位功能时生效-->
                <el-form-item label="范围:" v-if="retGisObj.positionScope">
                    <el-input-number v-model="retGisObj.positionScope"  :min="1" :max="100000"  ></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="placeSearch">定位</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row style="flex: 1;">
            <el-col :span="24" style="height: 100%;">
                <div id="gisMap" class="mapContainer" v-loading="loading">
                </div>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer" style="height: 32px;">
                <span
                    style="float: left;color: #333333;font-size: 14px;margin-top: 10px">提示：可标记地图上某点来获取测站经纬度和详细地址</span>
        </div>
    </section>
</template>

<script>
import TMapMixins from '@/components/gis/TMap/Mixins/TMapMixins'
    export default {
        name: "GaoDeGis",
        mixins:[TMapMixins],
        props: ['fromParentGisObj', 'gisInitObj', 'childResp'],
    }
</script>
<style scoped>
.mapContainer {
  height: 100%;
  min-height: 50vh;
}
</style>