<template>
    <div>{{ fieldData?.label }}</div>
    <select :value="fieldData?.value"  @input="DropdownChanged">
        <option v-for="(option, key) in Object.keys(fieldData?.options)" :key="key" :value="option">{{ fieldData?.options[option] }}</option>
    </select>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['input']);

function DropdownChanged(event: Event){
    const target = event.target as HTMLInputElement;
    emit('input', target.value);    
}

</script>

<style>
</style>