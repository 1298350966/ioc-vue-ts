<template>
  <preview v-if="isPreview" :key="key" :rootConfig="rootConfig"></preview>
</template>

<script setup lang="ts">
import { getSessionStorageInfo } from './utils'
import type { ChartEditStorageType } from './index.d'
import { SavePageEnum } from '@/enums/editPageEnum'
import { setSessionStorage } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { ref } from 'vue'
import Preview from './index.vue'
import { findOneViewsHttp } from '@/api/apiHttp/views'

const props = defineProps<{
  id:string
}>()

let key = ref(Date.now());

const route = useRoute()
const isPreview = ref(false)
const rootConfig = ref(null)

async function getDataHttp(){
  const {id} = props
  const res = await findOneViewsHttp(id as string)
  if(res.data && res.data.config){
    rootConfig.value = JSON.parse(res.data.config) 
    isPreview.value = true
  }
}
getDataHttp()

</script>
