<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <LD-ColorPicker mode="compact" v-model:modelValue="props.fieldData.value"
            @update:modelValue="emit('input', $event)" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    fieldData: {
        type: Object as PropType<{
            label: string;
            value: string;
        }>,
        required: true
    }
});

const emit = defineEmits(['input']);

function ColorChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
}
</script>

<style></style>