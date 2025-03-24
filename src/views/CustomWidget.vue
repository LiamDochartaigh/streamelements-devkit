<template>
    <WidgetPreview :fields="fieldsdata"></WidgetPreview>
</template>

<script setup lang="ts">
import { type IndexableType } from '@/utility/CustomTypes';
import { widgets } from "@/widget-registry";

const widgetName = useRouter().currentRoute.value.query.name as string;
const widget = widgets.find(widget => widget.name === widgetName)!;
const fieldsdata = ref<IndexableType>(JSON.parse(widget.assets.fields));
</script>

<style scoped></style>