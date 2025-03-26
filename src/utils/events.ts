
import { v4 as uuidv4 } from 'uuid';
import eventsData from "../assets/StreamEventsData.json"
import { type IndexableType } from '@/utility/CustomTypes';
import { type EventTypes } from '@/types/widget-types';

const eventsDataTypes: IndexableType = eventsData;
let preview_Messages_Counter = 0;
let chatMessageIds: string[] = [];
let chatMessageUserIds: string[] = [];

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

export function ButtonClicked() {
    return eventsData.editorButtonClickEvent;
}

export function GenerateRandomEvent() {
    const eventKeys = Object.keys(eventsData.alertEvents);
    const event = eventsDataTypes.alertEvents[eventKeys[Math.floor(Math.random() * eventKeys.length)]];
    event.event._id = uuidv4();
    return event;
}

export function GenerateEvent(type: EventTypes) {
    const event = eventsDataTypes.alertEvents[type];
    event.event._id = uuidv4();
    return event;
}

export function GenerateDeleteMessageEvent() {
    const eventData = { ...eventsData.deleteMessage };
    const randomId = chatMessageIds[Math.floor(Math.random() * chatMessageIds.length)];
    eventData.event.msgId = randomId;
    chatMessageIds.splice(chatMessageIds.indexOf(randomId), 1);
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    return event;
}

export function GenerateBanEvent() {
    const eventData = { ...eventsData.deleteMessages };
    const randomId = chatMessageUserIds[Math.floor(Math.random() * chatMessageUserIds.length)];
    eventData.event.userId = randomId;
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    return event;
}

export function GenerateMessageEvent(opts: {
    name: string;
    msgTxt: string;
    badges?: typeof eventsData.chatMessage.event.data.badges,
    displayColor?: string
}) {
    const randomID = uuidv4();
    chatMessageIds.push(randomID);
    let randomMessageData = { ...eventsData.chatMessage };
    randomMessageData.event.data.text = opts.msgTxt;
    randomMessageData.event.data.badges = (opts.badges && opts.badges[0]) ? opts.badges : randomMessageData.event.data.badges;
    randomMessageData.event.renderedText = opts.msgTxt;
    randomMessageData.event.data.msgId = randomID;
    randomMessageData.event.data.emotes = PREVIEW_CHAT_EMOTES;
    randomMessageData.event.data.displayName = opts.name;
    randomMessageData.event.data.displayColor = opts.displayColor || "#FFFFFF";
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

export function GenerateRandomMessage() {
    const randomMessageText = PREVIEW_CHAT_MESSAGES[preview_Messages_Counter];
    return GenerateMessageEvent({ name: randomMessageText.name, msgTxt: randomMessageText.message });
}