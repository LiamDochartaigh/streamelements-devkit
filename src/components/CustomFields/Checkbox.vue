<template>
<div>
    <div>{{  fieldData?.label}}</div>
    <input type="checkbox" :checked="props.fieldData?.value" @input="ValueChanged" />
</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['input']);

function ValueChanged(event: Event){
    const target = event.target as HTMLInputElement;
    emit('input', target.checked);
}
</script>

<style>
</style>