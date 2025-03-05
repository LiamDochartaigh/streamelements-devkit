<template>
<div>
    <div style="font-size:medium"><strong>{{  fieldData?.label}}</strong></div>
</div>
</template>

<script setup lang="ts">
import type { stringify } from 'uuid';
import { defineProps } from 'vue';

defineProps({
    fieldData: Object
});

</script>

<style>
</style>