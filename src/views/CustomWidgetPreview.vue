<template>
    <div ref="iFrameContainer" class="widget"
        :style="{ width: widgetDimensions[0] + 'px', height: widgetDimensions[1] + 'px' }">
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import lodash from "lodash";

import seData from "../assets/StreamElementsData.json"
import eventsData from "../assets/StreamEventsData.json"
import SessionData from "../assets/SessionUpdateData.json";
import { type IndexableType } from '@/utility/CustomTypes';
import { v4 as uuidv4 } from 'uuid';

//CHANGE ACTIVE WIDGET AND WIDGET TYPE HERE
let currentWidget: WidgetTypes = WidgetTypes.chat;
import customHTML from "../widgets/Free Chat Widget/custom.html?raw"
import customCSS from "../widgets/Free Chat Widget/custom.css?raw"
import customFields from "../widgets/Free Chat Widget/custom.json"
import customJS from "../widgets/Free Chat Widget/custom.js?raw"

const originalFieldsdata: IndexableType = customFields;
const fieldsdata: IndexableType = customFields;
const updatedCSS = ref(customCSS);
const updatedJS = ref(customJS);
const updatedHTML = ref(customHTML);
const updatedSeData: IndexableType = seData;
const eventsDataTypes: IndexableType = eventsData;
const iFrameContainer = ref();
const timeoutId = ref<number | null>(null);
const enum WidgetTypes {
    chat,
    goal,
    eventlist
}
const customFieldGroups = ref<string[]>([]);
let chatMessageIds: string[] = [];
let chatMessageUserIds: string[] = [];
let chatCounter = 0;
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

let sessionData: IndexableType = lodash.cloneDeep(SessionData);

function ResetWidget() {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
    }
    sessionData = lodash.cloneDeep(SessionData);
    InitializeWidget();
}

function BuildSidebar() {
    const groups: string[] = [];
    Object.keys(fieldsdata).forEach(currkey => {
        if (groups.filter(group => group === fieldsdata[currkey].group.toString()).length === 0) {
            groups.push(fieldsdata[currkey].group.toString());
        }
    });
    customFieldGroups.value = groups;
}

function ApplyTemplateToFile(fileString: string) {
    let fieldsKeys = Object.keys(originalFieldsdata);
    fieldsKeys.forEach(key => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        fileString = fileString.replace(pattern, fieldsdata[key].value);
    });
    fieldsKeys.forEach(key => {
        const pattern = new RegExp(`{\\s*${key}\\s*}`, 'g');
        fileString = fileString.replace(pattern, fieldsdata[key].value);
    });
    return fileString;
}

function WrapJSFile(fileString: string) {
    return `(function() { ${fileString} })();`;
}

const widgetDimensions = computed(() => {
    if (currentWidget == WidgetTypes.chat) {
        return [800, 1000];
    }
    else if (currentWidget == WidgetTypes.goal) {
        return [1435, 290];
    }
    else if (currentWidget == WidgetTypes.eventlist) {
        return [800, 800];
    }
    else {
        return [800, 800];
    }
});

function InitializeWidget() {

    let fieldsKeys = Object.keys(fieldsdata);
    fieldsKeys.forEach(key => {
        updatedSeData.fieldData[key] = fieldsdata[key].value;
    });

    updatedCSS.value = ApplyTemplateToFile(customCSS);
    updatedJS.value = ApplyTemplateToFile(customJS);
    updatedJS.value = WrapJSFile(updatedJS.value);
    updatedHTML.value = ApplyTemplateToFile(customHTML);
    iFrameContainer.value.innerHTML = "";
    const iframe = document.createElement('iframe');
    iframe.srcdoc = updatedHTML.value;
    iFrameContainer.value.appendChild(iframe);
    iframe.classList.add("widget-iframe");

    iframe.onload = () => {
        const iFrameDocument = iframe.contentDocument;
        if (iFrameDocument) {

            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.type = 'text/javascript';

            script.addEventListener("load", function () {
                const scriptElement = iFrameDocument.createElement('script');
                scriptElement.innerHTML = updatedJS.value;
                scriptElement.id = "custom-widget-script";

                const styleElement = iFrameDocument.createElement('style');
                styleElement.textContent = updatedCSS.value;
                styleElement.id = "custom-widget-style";

                iFrameDocument.head.appendChild(styleElement);
                iFrameDocument.head.appendChild(scriptElement);

                iFrameDocument.body.style.height = widgetDimensions.value[1] + 'px';
                iFrameDocument.body.style.overflow = 'hidden';

                if (currentWidget === WidgetTypes.chat) {
                    LoadChatBox();
                }
                else if (currentWidget === WidgetTypes.goal) {
                    LoadGoals();
                }
                else if (currentWidget === WidgetTypes.eventlist) {
                }
                else {
                    console.log("Invalid Widget Type");
                }
            });
            iFrameDocument.head.appendChild(script);
        }
    }
}

function LoadGoals() {
    const loadEvent = new CustomEvent('onWidgetLoad', { detail: updatedSeData });
    DispatchIframeEvent(loadEvent);
    SimulateGoals();
}

function LoadChatBox() {
    const loadEvent = new CustomEvent('onWidgetLoad', { detail: updatedSeData });
    DispatchIframeEvent(loadEvent);
    SimulateChat(true);
}

function SimulateGoals() {
    const randomAmount = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    sessionData.session["follower-total"].count += randomAmount;
    const randTime = Math.floor(Math.random() * (4500 - 1500 + 1) + 1500);

    const updateEvent = new CustomEvent('onSessionUpdate', { detail: sessionData });
    timeoutId.value = setTimeout(() => {
        DispatchIframeEvent(updateEvent);
        SimulateGoals();
    }, randTime);
}

function SimulateChat(continuously: boolean = true) {
    if (continuously) {

        let eventData;
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        if (chatCounter < randomNumber) {
            eventData = GenerateRandomMessage();
            chatCounter++;
        }
        else {
            eventData = GenerateRandomEvent();
            chatCounter = 0;
        }

        const messageEvent = new CustomEvent('onEventReceived', { detail: lodash.cloneDeep(eventData) });
        const randTime = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
        timeoutId.value = setTimeout(((eventDataCopy) => {
            return () => {
            DispatchIframeEvent(eventDataCopy);
            SimulateChat(continuously);
            };
        })(messageEvent), randTime);
    }
    else {
        for (let i = 0; i < 10; i++) {
            let randTime;
            if (i == 0) randTime = 1000;
            else randTime = Math.floor(Math.random() * (500 - 150 + 1) + 150);

            setTimeout(() => {
                let eventData;
                const randomNumber = Math.round(Math.random());
                if (randomNumber == 0) {
                    eventData = GenerateRandomMessage();
                }
                else {
                    eventData = GenerateRandomEvent();
                }
                const event = new CustomEvent('onEventReceived', { detail: eventData });
                DispatchIframeEvent(event);
            }, randTime);
        }
    }
}

function GenerateRandomEvent() {
    const eventKeys = Object.keys(eventsData.alertEvents);
    const event = eventsDataTypes.alertEvents[eventKeys[Math.floor(Math.random() * eventKeys.length)]];
    event.event._id = uuidv4();
    return event;
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

function DispatchIframeEvent(event: CustomEvent) {
    const iframe = iFrameContainer.value.querySelector('iframe') as HTMLIFrameElement;
    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
        iframeWindow.dispatchEvent(event);
    }
}

onMounted(() => {
    ResetWidget()
    BuildSidebar();
});

onBeforeUnmount(() => {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
    }
})
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