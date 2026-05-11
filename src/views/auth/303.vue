<template>
  <div class="w-full h-full"  >
    <div class="text-xl">正在跳转...</div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
const loading = ref(true)
const mode = import.meta.env.MODE;
const router = useRouter()
onMounted(()=>{
  console.log('mode', mode);
  if(mode==='development'){
    router.push('/devhome')
  } else {
    window.location.href=SYS_CONFIG.HOME_URL
  }
})
</script>

<style scoped>

</style>