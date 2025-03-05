<template>
  <main>
    <button @click="LoadWidget" type="button">Test Widget</button>
    <button @click="PreviewWidget" type="button">Preview Widget</button>
</main>
</template>

<script setup lang="ts">
import router from '../router/index';

function LoadWidget(){
  router.push("/widget");
  }

  function PreviewWidget(){
    router.push("/preview-widget");
    }
</script>