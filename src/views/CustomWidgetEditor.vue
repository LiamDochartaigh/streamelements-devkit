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
        </div>
        <div class="overlay-wrapper">
            <div id="overlay" class="overlay">
                <WidgetPreview ref="widgetPreview" :fields="fieldsdata"></WidgetPreview>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomField from "@/components/CustomFields/CustomField.vue";
import eventsData from "../assets/StreamEventsData.json"
import { type IndexableType } from '@/utility/CustomTypes';
import { v4 as uuidv4 } from 'uuid';
import { widgets } from "@/widget-registry";
import WidgetPreview from "@/components/WidgetPreview.vue";

const widgetName = useRouter().currentRoute.value.query.name as string;
const widget = widgets.find(widget => widget.name === widgetName)!;
const widgetPreview = ref<InstanceType<typeof WidgetPreview>>();

const fieldsdata = ref<IndexableType>(JSON.parse(widget.assets.fields));
const eventsDataTypes: IndexableType = eventsData;
const customFieldGroups = ref<string[]>([]);
const customFieldsRefs = ref<IndexableType>({});
let chatMessageIds: string[] = [];
let chatMessageUserIds: string[] = [];
let preview_Messages_Counter = 0;

const PREVIEW_CHAT_EMOTES = [
    {
        "type": "ffz",
        "name": "CatBag",
        "id": "25927",
        "gif": false,
        "urls": {
            "1": "https://cdn.frankerfacez.com/emote/25927/1",
            "2": "https://cdn.frankerfacez.com/emote/25927/2",
            "4": "https://cdn.frankerfacez.com/emote/25927/4"
        },
        "start": 0,
        "end": 6
    },
    {
        "type": "twitch",
        "name": "LUL",
        "id": "425618",
        "gif": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/3.0"
        },
        "start": 13,
        "end": 15
    },
    {
        "type": "twitch",
        "name": "DansGame",
        "id": "33",
        "gif": false,
        "animated": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/33/static/dark/3.0"
        },
        "start": 0,
        "end": 8
    },
    {
        "type": "twitch",
        "name": "<3",
        "id": "9",
        "gif": false,
        "animated": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/3.0"
        },
        "start": 9,
        "end": 11
    },
    {
        "type": "twitch",
        "name": "Kreygasm",
        "id": "41",
        "gif": false,
        "animated": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/3.0"
        },
        "start": 12,
        "end": 20
    },
    {
        "type": "twitch",
        "name": "Kappa",
        "id": "25",
        "gif": false,
        "animated": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/3.0"
        },
        "start": 21,
        "end": 26
    },
    {
        "type": "twitch",
        "name": "PogChamp",
        "id": "305954156",
        "gif": false,
        "animated": false,
        "urls": {
            "1": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/1.0",
            "2": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/2.0",
            "4": "https://static-cdn.jtvnw.net/emoticons/v2/305954156/static/dark/3.0"
        },
        "start": 27,
        "end": 35
    }
];

const PREVIEW_CHAT_MESSAGES = [
    {
        name: "steviebiscuits",
        message: "I always find the best music from this stream. CatBag"
    },
    {
        name: "johndoe123",
        message: "Hey everyone, what's up? PogChamp"
    },
    {
        name: "kittykat",
        message: "This stream is so much fun! Kappa"
    },
    {
        name: "gamer_girl",
        message: "I love playing games with you all! <3"
    },
    {
        name: "codingmaster",
        message: "I'm learning so much from this stream!"
    },
    {
        name: "streamfan",
        message: "I never miss a stream! Keep up the great work."
    },
    {
        name: "randomuser",
        message: "This chat is so friendly and welcoming! Keep it up! <3"
    },
    {
        name: "twitchfan",
        message: "I love this channel so much! Kreygasm"
    }
];

function FieldUpdated(event: any, fieldName: any) {
    fieldsdata.value[fieldName].value = event;
}

function EditorButtonClicked(clickEvent: any) {
    if (clickEvent == "hexeum_test_message") {
        const event = new CustomEvent('onEventReceived', { detail: eventsData.editorButtonClickEvent })
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

function GenerateRandomEvent() {
    const eventKeys = Object.keys(eventsData.alertEvents);
    const event = eventsDataTypes.alertEvents[eventKeys[Math.floor(Math.random() * eventKeys.length)]];
    event.event._id = uuidv4();
    return event;
}

function TriggerRandomEvent() {
    let eventData = GenerateRandomEvent();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function GenerateRandomMessage() {
    const randomMessageText = PREVIEW_CHAT_MESSAGES[preview_Messages_Counter];
    const randomID = uuidv4();
    chatMessageIds.push(randomID);
    let randomMessageData = { ...eventsData.chatMessage };
    randomMessageData.event.data.text = randomMessageText.message;
    randomMessageData.event.data.msgId = randomID;
    randomMessageData.event.data.emotes = PREVIEW_CHAT_EMOTES;
    randomMessageData.event.data.displayName = randomMessageText.name;
    randomMessageData.event.data.userId = (Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000).toString();
    if (!chatMessageUserIds.includes(randomMessageData.event.data.userId)) {
        chatMessageUserIds.push(randomMessageData.event.data.userId);
    }
    preview_Messages_Counter++;
    if (preview_Messages_Counter > PREVIEW_CHAT_MESSAGES.length - 1) {
        preview_Messages_Counter = 0;
    }

    return randomMessageData;
}

function TriggerRandomMessage() {
    let eventData = GenerateRandomMessage();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function BanRandomUser() {
    const eventData = { ...eventsData.deleteMessages };
    const randomId = chatMessageUserIds[Math.floor(Math.random() * chatMessageUserIds.length)];
    eventData.event.userId = randomId;
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function DeleteRandomMessage() {
    const eventData = { ...eventsData.deleteMessage };
    const randomId = chatMessageIds[Math.floor(Math.random() * chatMessageIds.length)];
    eventData.event.msgId = randomId;
    chatMessageIds.splice(chatMessageIds.indexOf(randomId), 1);
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
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