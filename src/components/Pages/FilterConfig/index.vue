<template>
  <div class="FilterConfig-tree">
    <div class="operators">
      <div class="operator-item" :class="{ active: filters.type == FiltersEnum.AND }">
        <el-button @click="filters.type = FiltersEnum.AND" class="mr-10%">并且</el-button>
        <svg preserveAspectRatio="none" width="100" height="20" viewBox="0 0 100 20" class="operator-path">
          <path d="M45 0 V5 Q45 10 50 10 H95 Q100 10 100 15 V20" vector-effect="non-scaling-stroke" fill="none"
            stroke="currentColor" stroke-width="2"></path>
        </svg>
      </div>
      <div class="operator-item" :class="{ active: filters.type == FiltersEnum.OR }">
        <el-button @click="filters.type = FiltersEnum.OR" class="ml-10%">或者</el-button>
        <svg preserveAspectRatio="none" width="100" height="20" viewBox="0 0 100 20" class="operator-path">
          <path d="M55 0 V5 Q55 10 50 10 H5 Q0 10 0 15 V20" vector-effect="non-scaling-stroke" fill="none"
            stroke="currentColor" stroke-width="2"></path>
        </svg>
      </div>
    </div>
    <div class="expressions">
      <div class="expressions-content" v-for="(condition, index) in filters.conditions" :key="index">
        <div class="line"></div>
        <div class="operators" v-if="condition.conditions.length > 1">
          <div class="operator-item" :class="{ active: condition.type == FiltersEnum.AND }">
            <el-button @click="condition.type = FiltersEnum.AND" class="mr-10%">并且</el-button>
            <svg preserveAspectRatio="none" width="100" height="20" viewBox="0 0 100 20" class="operator-path">
              <path d="M45 0 V5 Q45 10 50 10 H95 Q100 10 100 15 V20" vector-effect="non-scaling-stroke" fill="none"
                stroke="currentColor" stroke-width="2"></path>
            </svg>
          </div>
          <div class="operator-item" :class="{ active: condition.type == FiltersEnum.OR }">
            <el-button @click="condition.type = FiltersEnum.OR" class="ml-10%">或者</el-button>
            <svg preserveAspectRatio="none" width="100" height="20" viewBox="0 0 100 20" class="operator-path">
              <path d="M55 0 V5 Q55 10 50 10 H5 Q0 10 0 15 V20" vector-effect="non-scaling-stroke" fill="none"
                stroke="currentColor" stroke-width="2"></path>
            </svg>
          </div>
        </div>
        <div class="conditions-box">
          <div class="condition" v-for="(item, index) in condition.conditions">
            <div class="line"></div>
            <el-select-v2 style="width: 100%;" v-model.trim="item.key" :options="mappingFieldOptions" allow-create filterable clearable></el-select-v2>
            <el-select-v2 style="width: 100%;" v-model="item.condition" :options="getConditionOptions(item)" allow-create filterable clearable></el-select-v2>
            <el-select-v2 style="width: 100%;" v-model.trim="item.value" :options="[]" allow-create filterable clearable></el-select-v2>
            <!-- <el-input v-model="item.key"></el-input>
            <el-input v-model="item.condition"></el-input>
            <el-input v-model="item.value"></el-input> -->
            <el-icon @click="deleteCondition(condition, index)">
              <Delete />
            </el-icon>
          </div>
        </div>
        <div class="expression-add" @click="addCondition(condition.conditions)">
          <el-icon>
            <CirclePlusFilled />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="bottom-box">
      <div class="line"></div>
      <el-button class="w-100%" @click="addConditions">新增条件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, indexOf } from 'lodash';
import { conditionConfig, conditionsConfig, filtersType, numberConditionOptions, stringConditionOptions } from './config';
import { EventConfigFiltersType, FiltersEnum } from './type';
const props = defineProps<{
  filters: EventConfigFiltersType
  mappingFieldOptions:{
    label: string;
    value: string;
    type?:string
  }[]
}>()


function getConditionOptions({ key }) {
  const option = props.mappingFieldOptions.find((e) => e.value == key)
  let type = option && option.type
  if (type == "number") {
    return numberConditionOptions
  } else {
    return stringConditionOptions
  }
}

function addConditions() {
  props.filters.conditions.push(cloneDeep(conditionsConfig))
}

function addCondition(conditions) {
  conditions.push(cloneDeep(conditionConfig))
}
function deleteCondition(condition, index) {
  condition.conditions.splice(index, 1)
  if (condition.conditions.length == 0) {
    const filterIndex = props.filters.conditions.indexOf(condition)
    props.filters.conditions.splice(filterIndex, 1)
  }
}


</script>

<style lang="scss" scoped>
.FilterConfig-tree {
  --line-height: 15px;
  --line-color: #1b6ecc;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  .operators {
    display: flex;

    .operator-item {
      width: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;

      .el-button {
        width: 90px;
      }
    }

    .operator-path {
      width: 100%;
      color: #3333337c
    }

    .active {
      .el-button {
        background-color: var(--line-color);
      }

      .operator-path {
        color: var(--line-color)
      }
    }
  }


  .expressions {
    display: flex;
    flex-flow: column;
    gap: var(--line-height);

    .expressions-content,
    .condition {
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 5px 10px;
      position: relative;
      z-index: 1;

      &:before,
      &::after {
        background-color: var(--line-color);
        border: 1px solid hsla(0, 0%, 100%, .5);
        border-radius: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        content: "";
        height: 10px;

        position: absolute;
        -webkit-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        transform: translateX(-50%);
        width: 10px;
      }

      &:before {
        top: -6px;
        left: 50%;
      }

      &::after {
        bottom: -6px;
        left: 50%;
      }

      &:first-child {
        margin-top: 15px;
      }

    }

    .expressions-content {
      border: 2px solid var(--line-color);
    }

    .condition {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 20px;
      justify-self: center;
      justify-items: center;
      align-items: center;
      gap: var(--line-height);
      padding: 10px 10px;
      background-color: #282a2e56;
      margin-top: var(--line-height);
      border-radius: 7px;

      // background-color: ;
      &:last-child::after {
        display: none;
      }

      .el-icon {
        cursor: pointer;
      }

      &:last-child {
        margin-bottom: 10px;
      }
    }
  }

  .line {
    position: absolute;
    height: var(--line-height);
    width: 2px;
    background-color: var(--line-color);
    top: -20px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .expression-add {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    z-index: 1;
    // color: rgb(9, 197, 197);
    cursor: pointer;

    &:hover {
      transform: translate(-50%, -50%) scale(1.4);
    }
  }

  .bottom-box {
    margin-top: 15px;
    position: relative;

    .el-button {
      background-color: var(--line-color);
    }

    &:before {
      background-color: var(--line-color);
      border: 1px solid hsla(0, 0%, 100%, .5);
      border-radius: 50%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      content: "";
      height: 10px;
      position: absolute;
      -webkit-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
      width: 10px;
      top: -5px;
      left: 50%;
    }

  }
}
</style>