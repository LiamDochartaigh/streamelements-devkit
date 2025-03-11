<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <input type="range" :min="props.fieldData?.min" :max="props.fieldData?.max" :value="props.fieldData?.value"
            @input="NumberChanged" />
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