<template>
  <div class="layout-2">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  
  header {
    height: 60px;
  }
  
  main {
    height: calc(100% - 60px);
    overflow: hidden;
    display: flex;

    aside {
      flex-shrink: 0;
      width: 240px;
      box-shadow: 6px 0px 6px #00000012;
    }
    
    section {
      width: calc(100% - 240px);
      height: 100%;
      overflow-y: auto;
      padding: 20px;
      background-color: #eee;
    }
  }
}

:deep(.el-menu) {
  width: 100%;
  height: 100%;
  
  .el-menu-item {
    height: 48px;
    line-height: 48px;
  }
  
  .el-submenu__title {
    height: 48px;
    line-height: 48px;
  }
  
  i.aid {
    margin-right: 16px;
    font-size: 1.5em;
  }
  
  .menu-text {
    vertical-align: baseline;
  }
}
</style>
    