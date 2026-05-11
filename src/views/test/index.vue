<template>
  <div class="page">

    <button @click="countPlus">{{ count }}</button>
    <div v-observe-visibility="handleVisibilityChange">
      <h1>可见时触发</h1>
    </div>
    <div class="list" style="height: 500px">
      <div
        v-for="item in list"
        style="height: 50px"
        :data-name="item.name"
        v-observe-visibility="handleVisibilityChange"
        :key="item.id"
        class="list-item"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
const countPlus = () => {
  console.log("count:", count.value);
  count.value++;
};

const list = ref(
  new Array(100).fill(0).map((_, index) => {
    return {
      id: index,
      name: `item ${index}`,
      count: Math.floor(Math.random() * 1000)
    };
  })
);

const handleVisibilityChange = (
  isVisible: boolean,
  entry: IntersectionObserverEntry
) => {
  console.log("isVisible:", isVisible);
  // console.log('entry:',entry)
  let name = entry.target.getAttribute("data-name");
  console.log("name:", name);
};
</script>

<style lang="scss" scoped>
@use "@/styles/_mixins.scss";

html,
body {
  height: 100%;
}
#app {
  height: 100%;
}

.page {
  height: 100%;
  width: calc(100% - 50px);
  overflow-y: auto;
  // @include custom-scrollbar;
}
.read-the-docs {
  color: #888;
  @include flex-center;
}
</style>
