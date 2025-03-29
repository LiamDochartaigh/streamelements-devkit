
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

// Use rendered text instead of message
const PREVIEW_CHAT_MESSAGES = [
    {
        name: "steviebiscuits",
        message: "I always find the best music from this stream. CatBag",
        renderedText: "I always find the best music from this stream. <img src=\"https://cdn.frankerfacez.com/emote/25927/1\" />"
    },
    {
        name: "johndoe123",
        message: "Hey everyone, what's up? PogChamp.",
        renderedText: `Hey everyone, what's up? <img src="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/3.0 4x" title="PogChamp" class="emote">.`
    },
    {
        name: "kittykat",
        message: "This stream is so much fun! Kappa",
        renderedText: `This stream is so much fun! <img src="https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/25/static/dark/3.0 4x" title="Kappa" class="emote">`
    },
    {
        name: "gamer_girl",
        message: "I love playing games with you all! <3",
        renderedText: `I love playing games with you all! <img src="https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/3.0 4x" title="&lt;3" class="emote">`
    },
    {
        name: "codingmaster",
        message: "I'm learning so much from this stream!",
        renderedText: "I'm learning so much from this stream!"
    },
    {
        name: "streamfan",
        message: "I never miss a stream! Keep up the great work.",
        renderedText: "I never miss a stream! Keep up the great work."
    },
    {
        name: "randomuser",
        message: "This chat is so friendly and welcoming! Keep it up! <3",
        renderedText: `This chat is so friendly and welcoming! Keep it up! <img src="https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/9/static/dark/3.0 4x" title="&lt;3" class="emote">`
    },
    {
        name: "H0bbitguy",
        message: "OMG that 360 no-scope was straight PogChamp! Enemy didn’t even touch you EZ Clap! Meanwhile, I’m here stuck in the gulag like KEKW. Teach me your ways, oh sweaty one BibleThump. Honestly, you're carrying harder than a backpack on TriHard mode.",
        renderedText: `OMG that 360 no-scope was straight <img src="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/3.0 4x" title="PogChamp" class="emote">! Enemy didn’t even touch you <img src="https://cdn.7tv.app/emote/01GB9W6V0000098BZVD7GKTW0F/1x.webp" srcset="https://cdn.7tv.app/emote/01GB9W6V0000098BZVD7GKTW0F/1x.webp 1x, https://cdn.7tv.app/emote/01GB9W6V0000098BZVD7GKTW0F/2x.webp 2x, https://cdn.7tv.app/emote/01GB9W6V0000098BZVD7GKTW0F/4x.webp 4x" title="EZ" class="emote">Clap! Meanwhile, I’m here stuck in the gulag like KEKW. Teach me your ways, oh sweaty one BibleThump. Honestly, you're carrying harder than a backpack on <img src="https://static-cdn.jtvnw.net/emoticons/v2/120232/static/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/120232/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/120232/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/120232/static/dark/3.0 4x" title="TriHard" class="emote">mode.`
    },
    {
        name: "emoteSpammer",
        message: " JinxLUL JinxLUL JinxLUL JinxLUL JinxLUL TwitchConHYPE TwitchConHYPE TwitchConHYPE TwitchConHYPE TwitchConHYPE NewRecord NewRecord NiceTry NiceTry NiceTry NiceTry FallWinning FallWinning FallWinning MechaRobot MechaRobot MechaRobot ImTyping ImTyping Shush Shush Shush",
        renderedText: `<img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/3.0 4x\" title=\"JinxLUL\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/3.0 4x\" title=\"JinxLUL\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/3.0 4x\" title=\"JinxLUL\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/3.0 4x\" title=\"JinxLUL\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4e1c5651219a462894aefa8b6720efc5/static/dark/3.0 4x\" title=\"JinxLUL\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/3.0 4x\" title=\"TwitchConHYPE\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/3.0 4x\" title=\"TwitchConHYPE\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/3.0 4x\" title=\"TwitchConHYPE\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/3.0 4x\" title=\"TwitchConHYPE\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_13b6dd7f3a3146ef8dc10f66d8b42a96/animated/dark/3.0 4x\" title=\"TwitchConHYPE\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/3.0 4x\" title=\"NewRecord\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_53f6a6af8b0e453d874bbefee49b3e73/static/dark/3.0 4x\" title=\"NewRecord\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/3.0 4x\" title=\"NiceTry\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/3.0 4x\" title=\"NiceTry\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/3.0 4x\" title=\"NiceTry\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1f524be9838146e3bc9e529c17f797d3/static/dark/3.0 4x\" title=\"NiceTry\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/3.0 4x\" title=\"FallWinning\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/3.0 4x\" title=\"FallWinning\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dee4ecfb7f0940bead9765da02c57ca9/static/dark/3.0 4x\" title=\"FallWinning\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/3.0 4x\" title=\"MechaRobot\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/3.0 4x\" title=\"MechaRobot\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_0be25a1663bd472495b91e0302cec166/static/dark/3.0 4x\" title=\"MechaRobot\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/3.0 4x\" title=\"ImTyping\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b0c6ccb3b12b4f99a9cc83af365a09f1/static/dark/3.0 4x\" title=\"ImTyping\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/3.0 4x\" title=\"Shush\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/3.0 4x\" title=\"Shush\" class=\"emote\"><img src=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0\" srcset=\"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_819621bcb8f44566a1bd8ea63d06c58f/static/dark/3.0 4x\" title=\"Shush\" class=\"emote\">`
    },
    {
        name: "twitchfan",
        message: "I love this channel so much! Kreygasm",
        renderedText: `I love this channel so much! <img src="https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/41/static/dark/3.0 4x" title="Kreygasm" class="emote">`
    },
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
    renderedText: string;
    badges?: typeof eventsData.chatMessage.event.data.badges,
    displayColor?: string,
    userId?: string
}) {
    const randomID = uuidv4();
    chatMessageIds.push(randomID);
    let randomMessageData = { ...eventsData.chatMessage };
    randomMessageData.event.data.text = opts.msgTxt;
    randomMessageData.event.data.badges = opts.badges ? opts.badges : randomMessageData.event.data.badges;
    randomMessageData.event.renderedText = opts.renderedText;
    randomMessageData.event.data.msgId = randomID;
    randomMessageData.event.data.emotes = PREVIEW_CHAT_EMOTES;
    randomMessageData.event.data.displayName = opts.name;
    randomMessageData.event.data.displayColor = opts.displayColor || "#FFFFFF";
    randomMessageData.event.data.userId = opts.userId ? opts.userId : (Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000).toString();
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
    return GenerateMessageEvent({
        name: randomMessageText.name,
        msgTxt: randomMessageText.message,
        renderedText: randomMessageText.renderedText
    });
}