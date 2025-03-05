<template>
    <component class="custom-field" :is="fieldType" :fieldData="fieldData" />
</template>

<script setup lang="ts">
import { defineProps, computed, defineAsyncComponent } from 'vue';
import { type IndexableType } from '@/utility/CustomTypes';
const props = defineProps({
    type: String,
    fieldData: Object
});

const fieldType = computed(() => {
    if (props.type !== undefined) {
        return customFieldTypes[props.type];
    }
});

const customFieldTypes: IndexableType = {
    slider: defineAsyncComponent(() => import('./Slider.vue')),
    number: defineAsyncComponent(() => import('./Number.vue')),
    colorpicker: defineAsyncComponent(() => import('./ColorPicker.vue')),
    text: defineAsyncComponent(() => import('./Textfield.vue')),
    textfield: defineAsyncComponent(() => import('./Textfield.vue')),
    dropdown: defineAsyncComponent(() => import('./Dropdown.vue')),
    googleFont: defineAsyncComponent(() => import('./GoogleFont.vue')),
    checkbox: defineAsyncComponent(() => import('./Checkbox.vue')),
    button: defineAsyncComponent(() => import('./Button.vue')),
    hidden: defineAsyncComponent(() => import('./Hidden.vue')),
}
</script>

<style>
</style>