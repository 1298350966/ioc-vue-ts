<template>
  <router-view>
    <template #default="{ Component, route }">
      <keep-alive  v-if="route.meta.keepAlive">
        <component :is="Component" :key="route.fullPath"></component>
      </keep-alive>
      <component
        v-else
        :is="Component"
        :key="route.fullPath"
      ></component>
    </template>
  </router-view>
</template>
