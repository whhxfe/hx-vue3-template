<template>
  <HxLayout :title="(route.meta?.title as string) || ''" :menu="route.meta?.menu as any[] || []">
    <router-view />
  </HxLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { HxLayout } from "@/hx-components"

const route = useRoute()
</script>

<style lang="scss" scoped></style>