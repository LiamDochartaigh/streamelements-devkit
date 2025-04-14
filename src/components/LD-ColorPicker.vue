<template>
    <div>
        <div class="color-inputs">
            <div class="hex-input">
                <label for="hex">Hex</label>
                <input type="text" id="hex" :value="modelValue" @input="updateColor($event)"
                    placeholder="#RRGGBB" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" />
            </div>
            <div class="color-selector">
                <label for="color-input">Color</label>
                <input type="color" id="color-input" :value="modelValue" @input="updateColor($event)" />
            </div>
        </div>
        <div v-if="mode === 'full'" class="preset-colors">
            <button v-for="(color, index) in presetColors" :key="index" class="preset-color"
                :style="{ backgroundColor: color }" @click="emit('update:modelValue', color)" :title="color"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: String,
        default: '#000000'
    },
    mode: {
        type: String as PropType<'compact' | 'full'>,
        default: 'full'
    },
    presetColors: {
        type: Array as PropType<string[]>,
        default: () => [
            '#F44336', '#E91E63', '#9C27B0', '#673AB7',
            '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
            '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
            '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
            '#795548', '#9E9E9E', '#607D8B', '#000000',
            '#FFFFFF'
        ]
    }
});

const emit = defineEmits(['update:modelValue']);

const updateColor = (event: Event) => {
    const color = (event.target as HTMLInputElement).value;
    emit('update:modelValue', color);
};

onMounted(() => {
    if (!props.modelValue) {
        emit('update:modelValue', '#000000');
    }
});
</script>

<style scoped>
.color-inputs {
    display: flex;
    margin-bottom: 16px;
    gap: 8px;
}

.hex-input,
.color-selector {
    display: flex;
    flex-direction: column;
}

.hex-input {
    flex: 2;
}

.color-selector {
    flex: 1;
}

input[type="text"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

input[type="color"] {
    height: 36px;
    width: 100%;
    padding: 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: transparent;
}

label {
    margin-bottom: 4px;
    font-size: 12px;
    color: #666;
}

.preset-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.preset-color {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: transform 0.2s;
}

.preset-color:hover {
    transform: scale(1.1);
}
</style>