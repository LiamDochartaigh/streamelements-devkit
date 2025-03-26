<template>
    <div>
        <slot :props="activatorProps" name="activator" class="open-dialog-btn">
            <button v-bind="activatorProps">Default</button>
        </slot>
        <div v-if="modelValue" class="dialog-overlay" @click.self="modelValue = false">
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" @click="modelValue = false">&times;</button>
                </div>
                <div class="dialog-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>()

const activatorProps = {
    onclick: () => {
        modelValue.value = true
    },
    class: 'open-dialog-btn',
}

const props = defineProps({
    title: {
        type: String,
        default: 'Dialog Title'
    }
})
</script>

<style>
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.dialog-content {
    background-color: white;
    border-radius: 8px;
    min-width: 300px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.dialog-header h3 {
    margin: 0;
    font-size: 18px;
}

.dialog-body {
    padding: 20px;
}

.open-dialog-btn {
    border: none;
    cursor: pointer;
    background-color: transparent;
    aspect-ratio: 1/1;
    padding: 0px;
}
</style>