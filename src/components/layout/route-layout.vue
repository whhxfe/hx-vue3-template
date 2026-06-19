<template>
  <AppLayout :title="(route.meta?.title as string) || ''" :menu="route.meta?.menu as any[] || []">
    <router-view />
  </AppLayout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { AppLayout } from "@/components"

const route = useRoute()
</script>

<style lang="scss" scoped></style>