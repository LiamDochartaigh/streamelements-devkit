<template>
    <div class="custom-select">
        <div class="selected-value" @click="toggleDropdown">
            <slot name="selection" :item="value"></slot>
        </div>
        <div v-if="isOpen" class="dropdown" @scroll="handleScroll" ref="dropdown">
            <div v-for="option in options" @click="selectOption(option)" class="option">
                <slot name="item" :item="option">{{ option }}</slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import { PropType } from 'vue';

const isOpen = ref(false)
const dropdown = ref(null)

const props = defineProps({
    options: {
        type: Object as PropType<T[]>
    },
    value: {
        type: Object as PropType<T>
    }
});

const toggleDropdown = () => {
    console.log("M")
    isOpen.value = !isOpen.value
}

const selectOption = (option: T) => {
    console.log("UUH")
    isOpen.value = false;
    emit('update', option);
}

const emit = defineEmits<{
    update: [T],
    scroll: [Event]
}>()

const handleScroll = (event: Event) => {
    emit('scroll', event);
}
</script>

<style>
.custom-select {
  position: relative;
  width: 200px;
}

.selected-value {
  border: 1px solid #5e5e5e;
  padding: 8px;
  cursor: pointer;
  background-color: white;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  z-index: 1000;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover {
  background-color: #f0f0f0;
}
</style>