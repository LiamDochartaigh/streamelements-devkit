<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <input type="number" :value="props.fieldData?.value" @input="NumberChanged" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    fieldData: Object
});

const emit = defineEmits(['input']);

function NumberChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
}
</script>

<style></style>