<template>
  <div v-contextmenu:contextmenu>
     <slot></slot>
  </div>
  <v-contextmenu class="ContentDropdown" ref="contextmenu">
    <v-contextmenu-item @click="handleMenuSelect(item.key)" v-show="!item.hidden" :disabled="item.disabled" v-for="(item, index) in menuOptions" :key="index">{{ item.label  }}</v-contextmenu-item>
  </v-contextmenu>
</template>

<script lang="ts" >
import {directive,Contextmenu, ContextmenuItem } from "v-contextmenu";
import "v-contextmenu/dist/themes/dark.css";
import { useContextMenu } from '../hooks/useContextMenu.hook'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
export default {
  name:"ContentDropdown",
  directives: {
    contextmenu: directive,
  },
  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
  },
  setup(){
    const {
      menuOptions,
      onClickOutSide,
      mousePosition,
      handleMenuSelect
    } = useContextMenu()
    const chartEditStore = useChartEditStore()
    return{
      menuOptions,
      onClickOutSide,
      mousePosition,
      handleMenuSelect,
      chartEditStore
    }
  },
  methods:{
    contextmenu(e:any){
      console.log(e);
    }
  }
}
</script>

<style lang="scss" scoped>
.ContentDropdown{
  z-index:9999;
}
</style>