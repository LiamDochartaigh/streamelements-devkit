<template>
    <div>
        <div>{{ fieldData?.label }}</div>
        <select :value="props.fieldData?.value" @change="TextChanged">
            <template v-for="font in googleFonts">
                <option :value="font.family">
                    <span :style="{ fontFamily: `${font.family}, ${font.category}` }">{{ font.family }}</span>
                </option>
            </template>
        </select>
    </div>
</template>

<script setup lang="ts">
import fonts from "@/assets/fonts.json";
import WebFont from 'webfontloader';

interface GoogleFont {
    family: string;
    category: string;
    variants: string[];
}

const props = defineProps({
    fieldData: Object
});

const googleFonts: GoogleFont[] = fonts.map((font) => ({ family: font.family, category: font.category, variants: font.variants }));
let dropdownMenuEl: HTMLElement | null = null;

const primaryFonts: string[] = fonts.slice(0, 20).map(fontObject => {
    let variants = fontObject.variants.map(variant => variant === 'regular' ? '400' : variant);
    return `${fontObject.family}:${variants.join(',')}`;
});

let fontsLoaded = primaryFonts.length;

function GetFont(fontFamily: string) {
    return googleFonts.filter(font => {
        return font.family === fontFamily;
    })[0];
}

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

// function dropDownToggle(open: boolean) {
//     if (open) {
//         nextTick(() => {
//             const menuId: string = (() => {
//                 const selectEl = fontDropdown.value?.$el as HTMLElement;
//                 const ariaOwnsEl = selectEl.querySelector('.v-input__control')?.querySelector('[aria-owns]') as HTMLElement | null;
//                 if (ariaOwnsEl) return ariaOwnsEl.getAttribute('aria-owns')!;
//                 else return '';
//             })();
//             dropdownMenuEl = document.querySelector(`#${menuId}`)?.querySelector('.v-list') as HTMLElement | null;
//             if (dropdownMenuEl) {
//                 dropdownMenuEl.addEventListener('scroll', handleScroll);
//             }
//         })
//     }
//     else {
//         dropdownMenuEl?.removeEventListener('scroll', handleScroll);
//     }
// }


onUnmounted(() => {
    dropdownMenuEl?.removeEventListener('scroll', handleScroll);
})

onMounted(() => {
    LoadPrimaryFonts();
})

const emit = defineEmits(['input']);

function TextChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
}
</script>

<style>
    </style>