<script setup>
import {ref} from "@vue/runtime-core";
import Logo from "@/components/logo.vue";

const counter = ref(0);
function onClick() {
  counter.value++;
}

</script>

<template>
  <container :style="{
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 20,
  }">
    <logo />
    <container>
      counter : {{counter}}
    </container>
    <button :style="{
      borderRadius: 4,
      padding: '2 10',
    }" :hoverStyle="{
      backgroundColor: '#4b4e4f',
    }" @click="onClick">
      Increment
    </button>
  </container>
</template>