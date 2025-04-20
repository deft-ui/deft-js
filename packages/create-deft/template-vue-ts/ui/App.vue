<script setup lang="ts">
import {ref} from "@vue/runtime-core";
import Logo from "@/components/logo.vue";

const counter = ref(0);
function onClick() {
  counter.value++;
}

</script>

<template>
  <container class="app">
    <logo />
    <container>
      counter : {{counter}}
    </container>
    <button @click="onClick">
      Increment
    </button>
  </container>
</template>

<style scoped>
.app {
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}
</style>