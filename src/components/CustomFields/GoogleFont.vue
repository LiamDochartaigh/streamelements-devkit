<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <input type="text" :value="props.fieldData?.value" @input="TextChanged" />
    </div>
</template>

<script setup lang="ts">
import fonts from "@/assets/fonts.json";
import webfont from 'webfontloader';

interface GoogleFont {
    family: string;
    category: string;
    variants: string[];
}

const props = defineProps({
    fieldData: Object
});

const googleFonts: GoogleFont[] = fonts.map((font) => ({ family: font.family, category: font.category, variants: font.variants }));

const emit = defineEmits(['input']);

function TextChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
}
</script>

<style>
    </style>