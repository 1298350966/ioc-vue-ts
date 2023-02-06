<template>
    <el-collapse v-model="queryActiveNames" class="queryStyle">
        <el-collapse-item title="基础设置" name="0">
            <div class="report-set-margin-let">
                <div class="secondary-font-color" style="margin-top: 10px">控件</div>
                <div style="margin-bottom: 10px">
                    <span class="secondary-font-color">背景颜色</span>
                    <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
                    <span class="secondary-font-color">边框颜色</span>
                    <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
                </div>
                <div class="secondary-font-color" style="margin-top: 10px">填充边距</div>
                <div style="margin-bottom: 10px">
                    <el-tooltip class="item" effect="dark" content="上内边距">
                        <el-input-number v-model="item.paddingTop" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="右内边">
                        <el-input-number v-model="item.paddingRight" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下内边距">
                        <el-input-number v-model="item.paddingBottom" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="左内边距">
                        <el-input-number v-model="item.paddingLeft" style="width: 20%"></el-input-number>
                    </el-tooltip>
                </div>
                <el-checkbox v-model="item.style.mainTitleVisiable" class="secondary-font-color">
                    显示主标题/备注
                </el-checkbox>
                <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
                <div style="margin-bottom: 10px">
                    <el-input style="width: 90%" v-model="item.style.mainTitle"></el-input>
                    <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
                </div>

                <div style="margin-top: 10px;margin-bottom: 10px">
                    <div class="secondary-font-color" style="color: #C0C3CB;margin-bottom: 10px">控件类型
                    </div>
                    <el-radio-group v-model="item.style.widgetType">
                        <el-radio-button label="0">
                            <i class="icon iconfont icon-chuizhijuzhong"></i>
                            <span>水平</span>
                        </el-radio-button>
                        <el-radio-button label="1">
                            <i class="icon iconfont icon-shuipingjuzhong"></i>
                            <span>垂直</span>
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div style="margin-top: 10px;margin-bottom: 10px">
                    <div class="secondary-font-color" style="margin-bottom: 10px">显示字段标签</div>
                    <el-radio-group v-model="item.style.titleType">
                        <el-radio-button label="0">
                            <i class="icon iconfont icon-dingbu"></i>
                            <span>上方</span>
                        </el-radio-button>
                        <el-radio-button label="1">
                            <i class="icon iconfont icon-zuocelan1"></i>
                            <span>左侧</span>
                        </el-radio-button>
                    </el-radio-group>
                </div>
              <div style="margin-top: 10px;margin-bottom: 10px">
                <div class="secondary-font-color">标题设置(字体/颜色)</div>
                <el-select v-model="item.style.titleFontSize"
                           :popper-append-to-body="false" style="width: 20%">
                  <el-option v-for="item in Constants.viceValueSizeOptions"
                             :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
                <el-color-picker v-model="item.style.titleColor" show-alpha></el-color-picker>
              </div>
              <div style="margin-top: 10px;margin-bottom: 10px">
                <el-row :span="24"  v-if="item.style.widgetStyle">
                  <el-col :span="8" >
                    <div class="secondary-font-color">控件背景色</div>
                    <el-color-picker v-model="item.style.widgetStyle.backgroundColor" show-alpha></el-color-picker>
                  </el-col>
                  <el-col :span="8" >
                    <div class="secondary-font-color">控件字体颜色</div>
                    <el-color-picker v-model="item.style.widgetStyle.fontColor" show-alpha></el-color-picker>
                  </el-col>
                  <el-col :span="8" >
                    <div class="secondary-font-color">控件图标颜色</div>
                    <el-color-picker v-model="item.style.widgetStyle.iconColor" show-alpha></el-color-picker>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 10px;margin-bottom: 10px">
                <div class="secondary-font-color">控件边框样式</div>
                <el-select v-model="item.style.widgetStyle.borderSize"
                           :popper-append-to-body="false" style="width: 20%">
                  <el-option v-for="item in Constants.borderWidthOptions"
                             :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
                <el-color-picker v-model="item.style.widgetStyle.borderColor" show-alpha></el-color-picker>
              </div>

            </div>
        </el-collapse-item>
        <el-collapse-item title="字段样式" name="1">
            <el-row :span="24" class="report-set-margin-let">
                <el-col :span="24">
                    <el-row :span="24">
                        <el-col :span="12"><span style="color: white">字段标签</span></el-col>
                        <el-col :span="12"><span style="color: white">筛选器宽度</span></el-col>
                    </el-row>
                    <template v-if=" item && item.conditions.length>0">
                        <el-row style="padding-top: 5px;padding-bottom: 5px" :span="24"
                                v-for="(obj,key) in item.conditions " :key="key">
                            <el-col :span="12"><span style="color: white">{{obj.name}}</span></el-col>
                            <el-col :span="12">
                                <el-input-number v-model="obj.style.widthScale" size="mini"
                                                 :precision="2" :step="0.1" :max="10"
                                                 :min="0.5"
                                                 @change="queryWidgetChange"></el-input-number>
                            </el-col>
                        </el-row>
                    </template>
                </el-col>
            </el-row>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    export default {
        name: "QueryWidgetSet",
        created() {
        },
        props: {
            item: {required: false, type: Object}
        },
        data() {
            return {
                queryActiveNames: ['0'],
            }
        },
        watch: {},
        methods: {
            queryWidgetChange() {
                this.$forceUpdate();
                this.item.num++;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>
