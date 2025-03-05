<template>
<div>
    <div>{{  fieldData?.label}}</div>
    <input type="text" :value="props.fieldData?.value" @input="ColorChanged" />
</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['input']);

function ColorChanged(event: Event){
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
}
</script>

<style>
</style>