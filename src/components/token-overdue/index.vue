<script setup lang="ts">
import { useSysStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const sysStore = useSysStore();

const confirm = () => {
  sysStore.logout();
  const redirect = route.path;
  const query = route.query;
  router.push({
    path: "/login",
    query: {
      redirect,
      ...query
    }
  });
};
</script>

<template>
  <el-dialog
    v-model="sysStore.showTokenDialog"
    title="系统提示"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
    center
    class="token-overdue-dialog"
  >
    <div class="tips">
      <svg-icon icon="token-tishi"></svg-icon>
      <span class="fw">登录超时，请重新登录</span>
    </div>
    <template #footer>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.token-overdue-dialog {
  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;

    .token-tishi {
      width: 30px;
      height: 30px;
      color: #f9b145;
      margin-right: 16px;
      flex-shrink: 0;
    }
  }
}
</style>
