<template>
    <div class="widget-editor">
        <div class="sidebar">
            <div v-for="(group, index) in customFieldGroups" :key="index">
                <span @click="ExpandSidebarGroup(`${group}Group${index + 1}`.replace(/\s+/g, ''))"><strong>{{ group
                }}</strong></span>
                <div class="custom-field-group"
                    :ref="el => customFieldsRefs[`${group}Group${index + 1}`.replace(/\s+/g, '')] = el"
                    style="display: none; padding: 0px 5px 0px 5px;">
                    <div v-for="(field) in GetFieldsKeyByGroup(group)">
                        <CustomField :type="fieldsdata[field].type" :fieldData="fieldsdata[field]"
                            @input="FieldUpdated($event, field)" @click="EditorButtonClicked" />
                    </div>
                </div>
            </div>
            <div>
                <button @click="DeleteRandomMessage">Delete Random Message</button>
            </div>
            <div>
                <button @click="TriggerRandomEvent">Trigger Random Event</button>
            </div>
            <div>
                <button @click="TriggerRandomMessage">Trigger Random Message</button>
            </div>
            <div>
                <button @click="BanRandomUser">Ban/Timeout Random User</button>
            </div>
            <div>
                <button @click="widgetKey++; simulate = !simulate">Simulation {{ `${simulate ? 'On' : 'Off'}` }}</button>
            </div>
        </div>
        <div class="overlay-wrapper">
            <div id="overlay" class="overlay">
                <WidgetPreview :key="widgetKey" ref="widgetPreview" :simulate="simulate" :fields="fieldsdata"></WidgetPreview>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomField from "@/components/CustomFields/CustomField.vue";
import { widgets } from "@/widget-registry";
import WidgetPreview from "@/components/WidgetPreview.vue";
import { type IndexableType } from '@/utility/CustomTypes';

const widgetName = useRouter().currentRoute.value.query.name as string;
const widget = widgets.find(widget => widget.name === widgetName)!;
const widgetPreview = ref<InstanceType<typeof WidgetPreview>>();
const widgetKey = ref(0);

const fieldsdata = ref<IndexableType>(JSON.parse(widget.assets.fields));
const simulate = ref(false);
const customFieldGroups = ref<string[]>([]);
const customFieldsRefs = ref<IndexableType>({});

function FieldUpdated(event: any, fieldName: any) {
    fieldsdata.value[fieldName].value = event;
    widgetKey.value++;
}

function EditorButtonClicked(clickEvent: any) {
    if (clickEvent == "hexeum_test_message") {
        const event = new CustomEvent('onEventReceived', { detail: ButtonClicked() });
        widgetPreview.value?.DispatchIframeEvent(event);
    }
}

function ExpandSidebarGroup(refID: string) {
    if (customFieldsRefs.value[refID]) {
        customFieldsRefs.value[refID].style.display = customFieldsRefs.value[refID].style.display === 'none' ? '' : 'none';
    }
}

function BuildSidebar() {
    const groups: string[] = [];
    Object.keys(fieldsdata.value).forEach(currkey => {
        if (groups.filter(group => group === fieldsdata.value[currkey].group.toString()).length === 0) {
            groups.push(fieldsdata.value[currkey].group.toString());
        }
    });
    customFieldGroups.value = groups;
}

function GetFieldsKeyByGroup(groupName: string) {
    let filteredObject: IndexableType = {};
    Object.keys(fieldsdata.value).forEach(key => {
        if (fieldsdata.value[key].group === groupName) {
            filteredObject[key] = fieldsdata.value[key];
        }
    });
    return Object.keys(filteredObject);
}

function TriggerRandomEvent() {
    let eventData = GenerateRandomEvent();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function TriggerRandomMessage() {
    let eventData = GenerateRandomMessage();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function BanRandomUser() {
    let eventData = GenerateBanEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

function DeleteRandomMessage() {
    let eventData = GenerateDeleteMessageEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

onMounted(() => {
    BuildSidebar();
});
</script>

<style>
/* Add your custom styles here */
.widget {
    position: relative;
}

.sidebar {
    min-width: 200px;
    height: 100%;
    background-color: #dbdbdb;
}

.widget-editor {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
}

.widget-iframe {
    width: 100%;
    height: 100%;
    position: relative;
    border: 0;
    font-size: 100%;
    font: inherit;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
}

.overlay {
    width: 1920px;
    height: 1080px;
    transform: scale(0.59537);
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    transform-origin: top left;
}

.overlay-wrapper {
    position: relative;
}

.custom-field-group {
    margin-bottom: 10px;
}
</style>