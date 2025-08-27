<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <custom-dropdown @update="TextChanged" :value="currFont" :options="googleFonts" @scroll="handleScroll">
            <template #selection="{ item }">
                <div :style="{ fontFamily: `${item?.family}, ${item?.category}` }">{{
                    item?.family || 'Choose an option' }}</div>
            </template>
            <template #item="{ item }">
                <span :style="{ fontFamily: `${item.family}, ${item.category}` }">
                    {{ item.family }}
                </span>
            </template>
        </custom-dropdown>
    </div>
</template>

<script setup lang="ts">
import fonts from "@/assets/fonts.json";
import WebFont from 'webfontloader';

const props = defineProps({
    fieldData: Object
});

const googleFonts: GoogleFont[] = fonts.map((font) => ({ family: font.family, category: font.category, variants: font.variants }));
const currFont = computed(() => {
    return googleFonts.find(font => font.family === props.fieldData?.value);
})

const primaryFonts: string[] = fonts.slice(0, 20).map(fontObject => {
    let variants = fontObject.variants.map(variant => variant === 'regular' ? '400' : variant);
    return `${fontObject.family}:${variants.join(',')}`;
});
let fontsLoaded = primaryFonts.length;

function LoadPrimaryFonts() {
    WebFont.load({
        google: {
            families: primaryFonts
        },
    });
}

function LoadFont(fontFamily: string) {
    const fontObject = fonts.find(font => font.family == fontFamily)
    if (fontObject) {
        const variants = fontObject.variants.map(variant => variant === 'regular' ? '400' : variant);
        const fontToLoad = `${fontObject.family}:${variants.join(',')}`;
        WebFont.load({
            google: {
                families: [fontToLoad]
            }
        });
        fontsLoaded++;
    }
}

const handleScroll = (event: Event) => {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const listItemHeight = element.scrollHeight / fonts.length;

    const incrementPercentage = (listItemHeight / element.scrollHeight) * 100;
    const scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const bufferHeight = Math.round(clientHeight / listItemHeight);
    const fontsToLoad = (Math.round(scrolledPercentage / incrementPercentage) - fontsLoaded) + bufferHeight;

    //Not triggered on open close
    if (fontsToLoad > 0) {
        for (let i = 0; i < fontsToLoad; i++) {
            const fontIndex = fontsLoaded + i;
            if (fontIndex < fonts.length) {
                LoadFont(fonts[fontIndex].family);
            }
        }
        fontsLoaded += fontsToLoad;
    }
};

onMounted(() => {
    console.log(currFont.value, props.fieldData!.value);
    LoadPrimaryFonts();
})

const emit = defineEmits(['input']);

function TextChanged(font: GoogleFont) {
    LoadFont(font.family);
    emit('input', font.family);
}
</script>

<style>
    </style>