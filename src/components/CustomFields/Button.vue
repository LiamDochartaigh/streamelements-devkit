<template>
<div>
    <div>{{  fieldData?.label}}</div>
    <button @click="ButtonClicked">{{ fieldData?.label }}</button>
</div>
</template>

<script setup lang="ts">
const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['click']);

function ButtonClicked(){
    emit('click', props.fieldData?.value);
}
</script>

<style>
</style>