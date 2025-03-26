<template>
    <div>
        <button @click="showDialog = true" class="open-dialog-btn">
            <slot name="activator">Button</slot>
        </button>
        <div v-if="showDialog" class="dialog-overlay" @click.self="showDialog = false">
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" @click="showDialog = false">&times;</button>
                </div>
                <div class="dialog-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const showDialog = ref(false);
const props = defineProps({
    title: {
        type: String,
        default: 'Dialog Title'
    }
})
const emit = defineEmits(['dialog-submit'])

</script>

<style scoped>
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
}
</style>