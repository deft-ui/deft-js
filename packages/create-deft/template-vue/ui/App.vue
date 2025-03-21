<script setup>
import {ref} from "@vue/runtime-core";
import Logo from "@/components/logo.vue";

const counter = ref(0);
function onClick() {
  counter.value++;
}

</script>

<template>
  <div :style="{
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 20,
  }">
    <logo />
    <div>
      counter : {{counter}}
    </div>
    <button :style="{
      borderRadius: 4,
      padding: '2 10',
    }" :hoverStyle="{
      backgroundColor: '#4b4e4f',
    }" @click="onClick">
      Increment
    </button>
  </div>
</template>