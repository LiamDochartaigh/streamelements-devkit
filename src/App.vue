<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Courier+New&display=swap');

html,
body {
  height: 100%;
  position: relative;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  margin: 0;
}

#app {
  height: 100%;
}
</style>