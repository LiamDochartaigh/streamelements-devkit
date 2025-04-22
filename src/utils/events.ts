
import { v4 as uuidv4 } from 'uuid';
import { type WidgetEvents } from '@/se-types';

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

export function ButtonClicked(field: string, value: string) {
    return {
        listener: "event:test",
        event: {
            listener: "widget-button",
            field: field,
            value: value,
        }
    };
}

export function GenerateRandomEvent() {
    const events: WidgetEvents['listener'][] = ['follower-latest', 'subscriber-latest', 'cheer-latest', 'tip-latest', 'raid-latest'];
    const event = events[Math.floor(Math.random() * events.length)];
    const eventData = GenerateEvent(event);
    return eventData;
}

export function GenerateEvent(type: WidgetEvents['listener'], opts?: {
    gifted?: boolean,
    bulkGifted?: boolean,
    isCommunityGift?: boolean,
    tier?: (WidgetEvents & { listener: 'subscriber-latest' })['event']['tier'],
    message?: string,
}) {
    const name = PREVIEW_CHAT_MESSAGES[Math.floor(Math.random() * PREVIEW_CHAT_MESSAGES.length)].name;
    const sender = PREVIEW_CHAT_MESSAGES[Math.floor(Math.random() * PREVIEW_CHAT_MESSAGES.length)].name;
    const avatar = "https://cdn.streamelements.com/assets/dashboard/my-overlays/overlay-default-preview-2.jpg";
    const providerId = "135181000";
    const sessionTop = false;
    const randomBitAmounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const randomDollarAmounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomIndex = randomBitAmounts[Math.floor(Math.random() * randomBitAmounts.length)];

    let event: WidgetEvents = {} as WidgetEvents;

    if (type === 'follower-latest') {
        event = {
            listener: 'follower-latest',
            event: {
                _id: uuidv4(),
                avatar: avatar,
                displayName: name,
                name: name,
                originalEventName: 'follower-latest',
                providerId: providerId,
                sessionTop: sessionTop,
                type: 'follower'
            }
        }
    }
    else if (type === 'subscriber-latest') {
        event = {
            listener: 'subscriber-latest',
            event: {
                _id: uuidv4(),
                amount: opts?.bulkGifted ? 10 : 1,
                displayName: name,
                name: name,
                message: opts?.message || "",
                type: 'subscriber',
                tier: opts?.tier,
                sessionTop: sessionTop,
                originalEventName: 'subscriber-latest',
                providerId: providerId,
                avatar: avatar,
                ...(opts?.bulkGifted ? {
                    bulkGifted: true,
                    avatar: '',
                    sessionTop: false,
                    sender: name,
                } : opts?.gifted ? {
                    sender: sender,
                    gifted: true,
                    ...(opts.isCommunityGift ? {
                        isCommunityGift: true,
                        playedAsCommunityGift: false,
                    } : {})
                } : {})
            }
        }
    }
    else if (type === 'cheer-latest') {
        event = {
            listener: 'cheer-latest',
            event: {
                _id: uuidv4(),
                amount: randomBitAmounts[randomIndex],
                avatar: avatar,
                displayName: name,
                name: name,
                message: opts?.message || "",
                originalEventName: 'cheer-latest',
                providerId: providerId,
                sessionTop: sessionTop,
                type: 'cheer',
            }
        }
    }
    else if (type === 'tip-latest') {
        event = {
            listener: 'tip-latest',
            event: {
                _id: uuidv4(),
                amount: randomDollarAmounts[randomIndex],
                avatar: avatar,
                displayName: name,
                name: name,
                message: opts?.message || "",
                originalEventName: 'tip-latest',
                providerId: providerId,
                sessionTop: sessionTop,
                type: 'tip',
            }
        }
    }
    else if (type === 'raid-latest') {
        event = {
            listener: 'raid-latest',
            event: {
                _id: uuidv4(),
                amount: 200,
                avatar: avatar,
                displayName: name,
                name: name,
                originalEventName: 'raid-latest',
                providerId: providerId,
                sessionTop: sessionTop,
                type: 'raid',
            }
        }
    }
    return event;
}

export function GenerateDeleteMessageEvent() {
    const randomId = chatMessageIds[Math.floor(Math.random() * chatMessageIds.length)];
    const eventData = {
        listener: "delete-message",
        event: {
            msgId: randomId
        }
    }
    chatMessageIds.splice(chatMessageIds.indexOf(randomId), 1);
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    return event;
}

export function GenerateBanEvent() {
    const randomId = chatMessageUserIds[Math.floor(Math.random() * chatMessageUserIds.length)];
    const eventData = {
        listener: "delete-messages",
        event: {
            userId: randomId
        }
    };
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    return event;
}



export function GenerateMessageEvent(opts: {
    name: string;
    msgTxt: string;
    renderedText: string;
    badges?: (WidgetEvents & { listener: 'message' })['event']['data']['badges'],
    tags?: Partial<(WidgetEvents & { listener: 'message' })['event']['data']['tags']>,
    displayColor?: string,
    userId?: string,
    channel?: string
}) {


    const randomID = uuidv4();
    const badgeTags = opts.badges?.map(badge => `${badge.type}/${badge.version}`) || [];

    const chatMessage: (WidgetEvents & { listener: 'message' }) = {
        listener: "message",
        event: {
            service: "twitch",
            data: {
                time: 1698339405912,
                tags: {
                    "badge-info": "",
                    badges: badgeTags.join(",") || "moderator/1",
                    "client-nonce": "e9f7e38996c0063fa9a8e2f8fc8c5bc2",
                    color: "",
                    "display-name": opts.name,
                    emotes: "",
                    "first-msg": "0",
                    flags: "",
                    id: "49e016c7-c47b-4679-9cf0-83e27a48dd8d",
                    mod: opts.tags?.mod || "0",
                    "returning-chatter": "0",
                    "room-id": "135181000",
                    subscriber: opts.tags?.subscriber || "0",
                    "tmi-sent-ts": "1698339405295",
                    turbo: "0",
                    "user-id": "135181000",
                    "user-type": ""
                },
                nick: opts.name,
                userId: opts.userId || (Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000).toString(),
                displayName: opts.name,
                displayColor: opts.displayColor || "#FFFFFF",
                badges: opts.badges || [
                    {
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }
                ],
                channel: opts.channel || 'test_channel',
                text: opts.msgTxt,
                isAction: false,
                emotes: PREVIEW_CHAT_EMOTES,
                msgId: randomID,
            },
            renderedText: opts.renderedText
        }
    };

    chatMessageIds.push(randomID);
    if (!chatMessageUserIds.includes(chatMessage.event.data.userId)) {
        chatMessageUserIds.push(chatMessage.event.data.userId);
    }
    preview_Messages_Counter++;
    if (preview_Messages_Counter > PREVIEW_CHAT_MESSAGES.length - 1) {
        preview_Messages_Counter = 0;
    }
    return chatMessage;
}

export function GenerateChannelPointRedeem(opts: {
    redemption: string,
    amount: number,
}) {

    const name = PREVIEW_CHAT_MESSAGES[Math.floor(Math.random() * PREVIEW_CHAT_MESSAGES.length)].name;
    return {
        listener: "event",
        event: {
            type: "channelPointsRedemption",
            provider: "twitch",
            channel: "68020094ae0629c42e670e42",
            flagged: false,
            createdAt: "2025-04-18T07:39:09.704Z",
            data: {
                amount: opts.amount,
                username: name,
                displayName: name,
                providerId: "135181000",
                redemption: opts.redemption,
                quantity: 0,
                avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/0f1e5ffe-9737-47fa-ad2a-ea9faba6f626-profile_image-300x300.png"
            },
            _id: "6802019dbd5d8c18ea237b77",
            expiresAt: "2025-05-16T07:39:09.709Z",
            updatedAt: "2025-04-18T07:39:09.704Z",
            activityId: "6802019dbd5d8c18ea237b77",
            sessionEventsCount: 1
        }
    } as (WidgetEvents & { listener: 'event' }) & { event: { type: 'channelPointsRedemption' } };
}

export function GenerateRandomMessage() {
    const randomMessageText = PREVIEW_CHAT_MESSAGES[preview_Messages_Counter];
    return GenerateMessageEvent({
        name: randomMessageText.name,
        msgTxt: randomMessageText.message,
        renderedText: randomMessageText.renderedText
    });
}