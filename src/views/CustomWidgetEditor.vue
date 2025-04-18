<template>
    <div class="widget-editor">
        <div class="sidebar">
            <div class="custom-fields">
                <div class="custom-field" v-for="(group, index) in customFieldGroups" :key="index">
                    <div class="custom-field-header"
                        @click="ExpandSidebarGroup(`${group}Group${index + 1}`.replace(/\s+/g, ''))">
                        <svg width="10px" style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path
                                d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                        <span>
                            <strong style="text-decoration: underline;">{{ group }}</strong>
                        </span>
                    </div>
                    <div :ref="el => customFieldsRefs[`${group}Group${index + 1}`.replace(/\s+/g, '')] = el"
                        style="display: none; padding: 10px;">
                        <div v-for="(field) in GetFieldsKeyByGroup(group)">
                            <CustomField :type="fieldsdata[field].type" :fieldData="fieldsdata[field]"
                                @input="FieldUpdated($event, field)" @btnClick="EditorButtonClicked" />
                        </div>
                    </div>
                </div>
            </div>
            <hr class="solid">
            <div style="padding: 10px;">
                <div class="input-section">
                    <div style="margin-bottom: 5px;"><strong>Test Message</strong></div>
                    <div class="input-container" style="position: relative; display: flex;">
                        <div style="position: relative; display: flex; flex-grow: 1;">
                            <div ref="textContent" class="text-input" contenteditable="true">
                            </div>
                            <EmoteSelection @emoteSelected="EmoteAdded"
                                style="position: absolute; right: 4px; align-self: anchor-center;" />
                        </div>
                    </div>
                    <div>
                        <div>Send Msg as Broadcaster</div>
                        <input type="checkbox" v-model="devKitCache.sendMsgAsBroadcaster" />
                    </div>
                    <div style="display: flex; margin-top: 2px; justify-content: space-between;">
                        <div style="display: flex; gap: 10px;">
                            <div style="display: flex; flex-direction: column;">
                                <div style="font-size: 0.6em">Badge 1</div>
                                <BadgeSelection @badge-selected="devKitCache.firstBadge = $event"
                                    :badge="devKitCache.firstBadge?.type" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <div style="font-size: 0.6em">Badge 2</div>
                                <BadgeSelection @badge-selected="devKitCache.secondBadge = $event"
                                    :badge="devKitCache.secondBadge ? devKitCache.secondBadge?.type : 'no-badge-selected'" />
                            </div>
                        </div>
                        <button class="button" @click="SendMessage">Send Message</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <div>Username Display Color</div>
                        <LD-ColorPicker v-model="devKitCache.displayColor" />
                    </div>
                </div>
            </div>
            <div style="padding: 10px;">
                <div class="input-section">
                    <div style="margin-bottom: 5px;"><strong>Add Channel Point Reward</strong></div>
                    <div style="display: flex; gap: 10px; flex-direction: column;">
                        <div>
                            <div>Reward Name</div>
                            <input v-model="rewardForm.name" type="text" placeholder="Enter Name" />
                        </div>
                        <div>
                            <div>Reward Cost</div>
                            <input v-model="rewardForm.cost" type="text" placeholder="0" />
                        </div>
                    </div>
                    <div style="margin-top: 10px;">
                        <button @click="AddChannelPointReward">Add New Reward</button>
                    </div>
                    <div v-for="(item, index) in devKitCache.channelPointRewards"
                        style="margin-top: 10px; display: flex; gap:10px; align-items: center;">
                        <div class="channel-point-reward" @click="GenEventByType(GenerateChannelPointRedeem({
                            amount: item.cost,
                            redemption: item.name,
                        }))">
                            <div>{{ item.name }}</div>
                            <div>{{ item.cost }}</div>
                        </div>
                        <div>
                            <button @click="devKitCache.channelPointRewards.splice(index, 1)" style="padding: 15px"><i
                                    class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <div><strong>Test Events</strong></div>
                <div>
                    <button class="button" @click="DeleteRandomMessage">Delete Random Message</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('follower-latest'))">Follow
                        Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('tip-latest'))">Donation Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('cheer-latest'))">Cheer Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('tip-latest', {
                        message: 'This is a test message!'
                    }))">Donation Message Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                        gifted: true,
                        tier: '2000',
                    }))">Gifted Sub Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('raid-latest'))">Raid Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                        message: 'This is a test sub!'
                    }))">Sub w/ Message Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                        message: 'This is a test sub!',
                        tier: '1000',
                    }))">Sub Event</button>
                </div>
                <div>
                    <button class="button" @click="GenEventByType(GenerateChannelPointRedeem({
                        amount: 1000,
                        redemption: 'Test Redeem',
                    }))">Channel Point Redeem</button>
                </div>
                <div>
                    <button class="button" @click="TriggerRandomEvent">Random Event</button>
                </div>
                <div>
                    <button class="button" @click="TriggerRandomMessage">Random Message</button>
                </div>
                <div>
                    <button class="button" @click="BanRandomUser">Ban/Timeout Random User</button>
                </div>
                <div>
                    <button class="button" @click="widgetKey++; simulate = !simulate">Simulation {{ `${simulate ? 'On' :
                        'Off'}`
                    }}</button>
                </div>
            </div>
        </div>
        <div class="overlay-wrapper">
            <div id="overlay" class="overlay">
                <WidgetPreview @field-updated="FieldUpdated($event.value, $event.key)" :key="widgetKey"
                    ref="widgetPreview" :simulate="simulate" :fields="fieldsdata">
                </WidgetPreview>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomField from "@/components/CustomFields/CustomField.vue";
import { widgets } from "@/widget-registry";
import WidgetPreview from "@/components/WidgetPreview.vue";
import { type IndexableType } from '@/utility/CustomTypes';
import EmoteSelection from "@/components/EmoteSelection.vue";
import { Emote } from '@/types/widget-types';
import BadgeSelection from "@/components/BadgeSelection.vue";
import { WidgetEvents } from "@/se-types";
import { GenerateChannelPointRedeem, GenerateEvent } from "@/utils/events";

const widgetName = useRouter().currentRoute.value.query.name as string;
const widget = widgets.find(widget => widget.name === widgetName)!;
const widgetPreview = ref<InstanceType<typeof WidgetPreview>>();
const widgetKey = ref(0);
const textContent = ref<HTMLDivElement>();

const fieldsdata = ref<IndexableType>(JSON.parse(widget.assets.fields));
const simulate = ref(false);
const customFieldGroups = ref<string[]>([]);
const customFieldsRefs = ref<IndexableType>({});
const devKitCache = useDevKitCache();
const rewardForm = ref({
    name: '',
    cost: 0
});

function AddChannelPointReward() {
    if (devKitCache.value.channelPointRewards.length >= 3) return;
    devKitCache.value.channelPointRewards.push({
        name: rewardForm.value.name,
        cost: rewardForm.value.cost
    });
}

function FieldUpdated(event: any, fieldName: any) {
    fieldsdata.value[fieldName].value = event;
    widgetKey.value++;
}

function EmoteAdded(emote: Emote) {
    const emoteTemplate = `<img class="emote" srcset="${emote.srcset}" src="${emote.src}" alt="${emote.name}" />`
    textContent.value!.innerHTML += (emoteTemplate);
}

function GenEventByType(eventData: WidgetEvents) {
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function EditorButtonClicked(clickEvent: any) {
    const eventData = ButtonClicked(clickEvent.label, clickEvent.label);
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
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

function SendMessage() {
    if (textContent.value?.innerHTML == '<br>'
        || textContent.value?.innerHTML == ''
    ) return;
    const badgesArr = [];
    if (devKitCache.value.firstBadge && devKitCache.value.firstBadge.type !== 'no-badge-selected') { badgesArr.push(devKitCache.value.firstBadge); }
    if (devKitCache.value.secondBadge && devKitCache.value.secondBadge.type !== 'no-badge-selected') { badgesArr.push(devKitCache.value.secondBadge); }

    let eventData = GenerateMessageEvent({
        msgTxt: textContent.value!.innerHTML,
        renderedText: textContent.value!.innerHTML,
        name: 'test_user',
        channel: devKitCache.value.sendMsgAsBroadcaster ? 'test_user' : 'test_channel',
        badges: badgesArr,
        displayColor: devKitCache.value.displayColor,
        userId: '12345678'
    });
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
    textContent.value!.innerText = '';
}

function BanRandomUser() {
    let eventData = GenerateBanEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

function DeleteRandomMessage() {
    let eventData = GenerateDeleteMessageEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

function HandleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && document.activeElement === textContent.value) {
        SendMessage();
        event.preventDefault();
    }
}

onMounted(() => {
    BuildSidebar();
    document.addEventListener('keydown', HandleKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', HandleKeyDown);
});
</script>

<style>
.input-section {
    padding: 16px;
    border-radius: 8px;
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.channel-point-reward {
    padding: 16px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
    background-color: #95c1d3;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.text-input {
    width: 100%;
    padding: 10px;
    background-color: white;
    border: 2px #ff62db solid;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.btn-group {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
}

.widget {
    position: relative;
}

.custom-field-header {
    cursor: pointer;
    background-color: #bdbdbd;
    padding: 10px;
}

.sidebar {
    min-width: 300px;
    max-width: 300px;
    height: 100%;
    background-color: #dbdbdb;
    overflow: auto;
    overflow-x: hidden;
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

.button {
    padding: 10px;
}
</style>