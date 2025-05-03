<template>
<div>
    <button @click="ButtonClicked">{{ fieldData?.label }}</button>
</div>
</template>

<script setup lang="ts">
const props = defineProps({
    fieldData: Object,
    fieldIndex: String,
});

const emit = defineEmits(['btnClick']);

function ButtonClicked(){
    emit('btnClick', {
        value: props.fieldData?.value,
        field: props.fieldIndex
    });
}
</script>

<style>
</style>