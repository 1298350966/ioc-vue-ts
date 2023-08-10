<template>
  <div v-if="triggerConfig.updateValue">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="请求参数" name="1">
            <el-tabs v-model="requestActiveName" class="demo-tabs">
              <el-tab-pane  :label="RequestParamsTypeEnum.PARAMS" :name="RequestParamsTypeEnum.PARAMS">
                <el-table  :data="triggerConfig.updateValue['request.requestParams.Params']" class="w-100%" border>
                  <el-table-column prop="key" label="目标参数">
                    <template #default="{ row }">
                      <el-select-v2 class="w-100%" v-model="row.key" :options="getOptions('Params')" clearable allow-create
                        filterable></el-select-v2>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="映射字段">
                    <template #default="{ row }">
                      <el-select-v2 class="w-100%"  v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                        filterable></el-select-v2>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button class="w-100% mt-2" @click="addParams(triggerConfig.updateValue['request.requestParams.Params'])"> 添加参数设置</el-button>
              </el-tab-pane>
              <!-- <el-tab-pane :label="RequestParamsTypeEnum.HEADER">
            <el-table :data="triggerConfig.updateValue['request.requestParams.Header']" class="w-100%" border>
              <el-table-column prop="key" label="目标参数">
              </el-table-column>
              <el-table-column prop="value" label="映射字段">
                <template #default="{ row }">
                  <el-select-v2 v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                    filterable></el-select-v2>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane> -->
              <el-tab-pane v-if="targetConfig.request.requestHttpType != RequestHttpEnum.GET" :label="RequestParamsTypeEnum.BODY" :name="RequestParamsTypeEnum.BODY">
                <el-radio-group v-model="requestParamsBodyType" name="radiogroup">
                  <el-radio v-for="bodyEnum in RequestBodyEnumList" :key="bodyEnum" :label="bodyEnum">
                    {{ bodyEnum }}
                  </el-radio>
                </el-radio-group>
                <div v-if="requestParamsBodyType == 'form-data'">
                  <el-table :data="triggerConfig.updateValue['request.requestParams.Body.form-data']" class="w-100%"
                    border>
                    <el-table-column prop="key" label="目标参数">
                                  <template #default="{ row }">
                            <el-select-v2 class="w-100%" v-model="row.key" :options="getOptions('Body.form-data')" clearable allow-create
                              filterable></el-select-v2>
                          </template>
                    </el-table-column>
                    <el-table-column prop="value" label="映射字段">
                      <template #default="{ row }">
                        <el-select-v2 v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                          filterable></el-select-v2>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button class="w-100% mt-2" @click="addParams(triggerConfig.updateValue['request.requestParams.Body.form-data'])"> 添加参数设置</el-button>
                </div>
                <div v-else-if="requestParamsBodyType == 'json'">
                  <el-table :data="triggerConfig.updateValue['request.requestParams.Body.json']" class="w-100%"
                    border>
                    <el-table-column prop="key" label="目标参数">
                      <template #default="{ row }">
                          <el-select-v2 class="w-100%" v-model="row.key" :options="getOptions('Body.json')" clearable allow-create
                            filterable></el-select-v2>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="映射字段">
                      <template #default="{ row }">
                        <el-select-v2 class="w-100%" v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                          filterable></el-select-v2>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button class="w-100% mt-2" @click="addParams(triggerConfig.updateValue['request.requestParams.Body.json'])"> 添加参数设置</el-button>
                </div>
                <div v-else-if="requestParamsBodyType == 'x-www-form-urlencoded'">
                  <el-table :data="triggerConfig.updateValue['request.requestParams.Body.x-www-form-urlencoded']"
                    class="w-100%" border>
                    <el-table-column prop="key" label="目标参数">
                                  <template #default="{ row }">
                            <el-select-v2 class="w-100%" v-model="row.key" :options="getOptions('Body.x-www-form-urlencoded')" clearable allow-create
                              filterable></el-select-v2>
                          </template>
                    </el-table-column>
                    <el-table-column prop="value" label="映射字段">
                      <template #default="{ row }">
                        <el-select-v2 class="w-100%" v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                          filterable></el-select-v2>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button class="w-100% mt-2" @click="addParams(triggerConfig.updateValue['request.requestParams.Body.x-www-form-urlencoded'])"> 添加参数设置</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script setup lang="ts">
import { RequestBodyEnum, RequestHttpEnum, RequestParamsTypeEnum } from '@/enums/httpEnum';
import { CreateComponentType } from '@/packages/index.d';
import { EChartEventTriggerType } from '../../type';
import { componentListUpdate } from '../../config';
import { get } from 'lodash';


const props = defineProps({
  triggerConfig: {
    type: Object as PropType<EChartEventTriggerType>
  },
  targetConfig: {
    type: Object as PropType<CreateComponentType>
  },
  mappingFieldOptions: {
    type: Array
  }
})

const activeName = ref("1")
const requestParamsBodyType = ref(RequestBodyEnum.NONE)
const requestActiveName = ref(RequestParamsTypeEnum.PARAMS)
// props.targetConfig.request.requestParams.Header
const paramsMapping = ref({
  Header: [],
  Params: []
})
const requestParamsOptions = reactive({
  Params: getOptions('Params'),
  "form-data": getOptions('Body.form-data'),
  json: getOptions('Body.json'),
  "x-www-form-urlencoded": getOptions('Body.x-www-form-urlencoded')
})

const RequestBodyEnumList = computed(() => {
  let list = [
    RequestBodyEnum.FORM_DATA,
    RequestBodyEnum.X_WWW_FORM_URLENCODED,
    RequestBodyEnum.JSON
  ]
  // if (requestParamsOptions['form-data'].length > 0) {
  //   list.push(RequestBodyEnum.FORM_DATA)
  // }
  // if (requestParamsOptions['x-www-form-urlencoded'].length > 0) {
  //   list.push(RequestBodyEnum.X_WWW_FORM_URLENCODED)
  // }
  // if (requestParamsOptions.json.length > 0) {
  //   list.push(RequestBodyEnum.JSON)
  // }
  requestParamsBodyType.value = list[0] || null
  return list
})

// function componentListParams() {
//   const { Header, Params, Body } = props.targetConfig.request.requestParams
//   const { updateValue } = props.triggerConfig
//   requestParams.Header = updateValue['request.requestParams.Header'] || []
//   requestParams.Params = updateValue['request.requestParams.Body.form-data'] || []
//   requestParams['form-data'] = updateValue['request.requestParams.Body.json'] || []
//   requestParams.json  = updateValue['request.requestParams.Body.json'] || []
//   requestParams['x-www-form-urlencoded']  = updateValue['request.requestParams.Body.x-www-form-urlencoded'] || []
//   updateValue['request.requestParams.Header'] = Object.keys(Header).map((key) => {
//     return {
//       key: key,
//       value: Header[key]
//     }
//   })
//   updateValue['request.requestParams.Params'] = Object.keys(Params).map((key) => {
//     return {
//       key: key,
//       value: Params[key]
//     }
//   })
//   updateValue['request.requestParams.Body.form-data'] = Object.keys(Body["form-data"]).map((key) => {
//     return {
//       key: key,
//       value: Body["form-data"][key]
//     }
//   })
//   updateValue['request.requestParams.Body.json'] = Object.keys(Body["json"]).map((key) => {
//     return {
//       key: key,
//       value: Body["json"][key]
//     }
//   })
//   updateValue['request.requestParams.Body.x-www-form-urlencoded'] = Object.keys(Body["x-www-form-urlencoded"]).map((key) => {
//     return {
//       key: key,
//       value: Body["x-www-form-urlencoded"][key]
//     }
//   })
// }
function addParams(data) {
  data.push({
    key: "",
    value: ""
  })
}

function requestParamsDataFilter(data) {
    data = data.filter((e) => !!e.key)
}
function getOptions(key) {
  const requestParams = props.targetConfig.request.requestParams
  return Object.keys(get(requestParams, key)).map((key) => ({
    label: key,
    value: key
  }))
}
onMounted(() => {
  if (!props.triggerConfig.updateValue) {
    props.triggerConfig.updateValue = componentListUpdate
  }
})


onBeforeUnmount(() => {
  const { updateValue } = props.triggerConfig
  if(updateValue){
    Object.keys(updateValue).forEach((key) => {
        requestParamsDataFilter(updateValue[key])
    })
  }
})
</script>

<style scoped></style>