<template>
  <div class="automaticeRminder">
    <div class="setInfo">
      <p class="title">发送提醒时间</p>
      <p class="text">
        流程到达该节点超过
        <el-input
          class="inputText"
          type="number"
          min="1"
          v-model="setting.time"
          placeholder="请输入时间"
        ></el-input>
        <el-select
          class="selectText"
          v-model="setting.unit"
          placeholder="请选择单位"
        >
          <el-option
            v-for="item in timeUnitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        处理人仍然未处理，系统自动发送提醒
      </p>

      <p class="title">被提醒人</p>
      <el-form>
        <selectRemindedPerson
          v-if="setting.remind"
          :recipient="setting.remind"
        ></selectRemindedPerson>
      </el-form>

      <p class="title">提醒方式</p>
      <p>
        <el-checkbox-group v-model="setting.remindType">
          <el-checkbox
            v-for="(item, index) in remindTypeOptions"
            :key="index"
            :label="item.value"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </p>
      <p class="title">
        <span>标题</span>
        <el-popover
          popper-class="popper"
          placement="bottom"
          width="200"
          trigger="click"
        >
          <div class="addVariableBox">
            <!-- <div class="variable-title">
              <span class="icon"></span>
              <span class="fromName">{{ AppManagementConfig.formName }}</span>
            </div> -->
            <div class="variable-name-box">
              <span
                class="variable-name"
                v-for="(variable, index) in addVariable"
                :key="index"
                @click="
                  setting.title = setting.title + '${' + variable.model + '}'
                "
                >{{ variable.name }}</span
              >
            </div>
          </div>
          <span slot="reference">增加变量</span>
        </el-popover>
      </p>
      <tagInput
        :variableList="addVariable"
        v-model="setting.title"
      ></tagInput>

      <p class="title">
        <span>内容</span>
        <el-popover
          popper-class="popper"
          placement="bottom"
          width="200"
          trigger="click"
        >
          <div class="addVariableBox">
            <!-- <div class="variable-title">
              <span class="icon"></span>
              <span class="fromName">{{ formName() }}</span>
            </div> -->
            <div class="variable-name-box">
              <span
                class="variable-name"
                v-for="(variable, index) in addVariable"
                :key="index"
                @click="
                  setting.content =
                    setting.content + '${' + variable.model + '}'
                "
                >{{ variable.name }}</span
              >
            </div>
          </div>
          <span slot="reference">增加变量</span>
        </el-popover>
      </p>
      <tagInput
        style="min-height: 52px;"
        class="tagInput"
        :variableList="addVariable"
        v-model="setting.content"
      ></tagInput>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import selectRemindedPerson from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/selectRemindedPerson/selectRemindedPerson'
import tagInput from "@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/treatmentMethod/tagInput";
export default {
  components: { selectRemindedPerson, tagInput },
  props: ["setting"],
  data() {
    return {
      timeUnitOptions: [
        { label: "分钟", value: "minute" },
        { label: "小时", value: "hour" },
        { label: "天", value: "day" },
      ],
      remindTypeOptions: [
        { label: "应用内消息提醒", value: "1" },
        { label: "短信提醒", value: "2" },
        { label: "电话提醒", value: "3" },
      ],
    };
  },
  computed: {
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
      stateConfig: (state) => state.appManagement.stateConfig,
    }),
    addVariable() {
      let mainFromConfigfilter = []
      let mainFromConfig = this.formDataconfig.filter((value) => {
        return value.type !== "table";
      });
      mainFromConfig.forEach((value) => {
        if(value.type == "gis_select"){
          let { lat, lnt, address,latName,lntName,addressName } = value.modelExt;
          mainFromConfigfilter.push({model:lat,name:latName })
          mainFromConfigfilter.push({model:lnt,name: lntName})
          mainFromConfigfilter.push({model:address,name: addressName})
          
        }else if(value.type == "region_select"){
          let { province, provinceName, city, cityName, area, areaName } = value.modelExt;
          mainFromConfigfilter.push({model:province,name:provinceName })
          mainFromConfigfilter.push({model:city,name: cityName})
          mainFromConfigfilter.push({model:area,name: areaName})

        }else if(value.type == "data_select" ||
          value.type == "org_select" ||
          value.type == "user_select" ||
          value.type == "role_select" ||
          value.type == "company_select" ||
          value.type == "dic_select" ||
          value.type == "current_user"){
          mainFromConfigfilter.push({model:value.model,name: value.name + "ID"})
          mainFromConfigfilter.push({model:value.label_model,name: value.name})
        }else{
          mainFromConfigfilter.push({model:value.model,name: value.name})
        }
      })
      return mainFromConfigfilter
    },
  },
  mounted() {
    // console.log(this.getFormName,11111);
  },
};
</script>

<style lang="scss" scope>
.automaticeRminder {
  .setInfo {
    position: relative;
    background: #ebf4fc;
    padding: 10px 15px;
    .title {
      position: relative;
      color: #333333;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }
    .text {
      color: #646464;
      .inputText {
        width: 120px;
      }
      .selectText {
        width: 120px;
      }
    }
  }
  .tagInput {
    height: 52px;
  }
}
::v-deep .el-popover {
    padding: 0;
  }
.addVariableBox {
  height: 200px;
  overflow: hidden;

  .variable-title {
    display: block;
    //    height: 40px;
    display: flex;
    align-content: center;
    margin-bottom: 10px;
    overflow: auto;
    .icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: #1296db;
      border-radius: 7px;
      border: 1px solid #bfbfbf;
    }
    .fromName {
      margin-left: 10px;
      display: flex;
      align-content: center;
    }
  }
  .variable-name-box {
    overflow: auto;
    height: calc(100% );
  }
  .variable-name {
    display: block;
    line-height: 30px;
    padding: 0 10px;
    overflow: auto;
    &:hover {
      background: #1295db38;
    }
  }
}
</style>