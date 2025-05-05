<template>
  <main>
    <h2>Select Widget to Preview</h2>
    <template v-if="step === 0">
      <button style="margin-right: 5px;" v-for="(item) in widgets" @click="ChooseWidget(item)">{{ item.name }}</button>
    </template>
    <template v-else-if="step === 1">
      <div>
        <button style="margin-right: 5px;" @click="LoadWidget" type="button">Test Widget</button>
        <button @click="PreviewWidget" type="button">Preview Widget</button>
      </div>
      <div>
        <button style="padding: 10px; margin-top: 10px" @click="step = 0">Change Widget</button>
      </div>

    </template>
  </main>
</template>

<script setup lang="ts">
import router from '../router/index';
import { widgets } from '@/widget-registry';

const step = ref(0);
const widget = ref<typeof widgets[number]>();


function ChooseWidget($event: typeof widgets[number]) {
  step.value = 1;
  widget.value = $event;
}

function LoadWidget() {
  router.push({
    name: "widget",
    query: {
      name: widget.value?.name,
    }
  });  
}

function PreviewWidget() {
  router.push({
    name: "preview-widget",
    query: {
      name: widget.value?.name,
    }
  });  
}
</script>