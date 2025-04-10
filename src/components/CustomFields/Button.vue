<template>
<div>
    <button @click="ButtonClicked">{{ fieldData?.label }}</button>
</div>
</template>

<script setup lang="ts">
const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['btnClick']);

function ButtonClicked(){
    emit('btnClick', {
        value: props.fieldData?.value,
        label: props.fieldData?.label
    });
}
</script>

<style>
</style>