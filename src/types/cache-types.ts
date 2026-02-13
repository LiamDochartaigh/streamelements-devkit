import { type Badge } from "./widget-types";

export interface DevKitCache {
    firstBadge: Badge;
    secondBadge: Badge;
    displayColor: string;
    bgColor: string;
    widgetDimensions: {
        width: number;
        height: number;
    };
    sidebarstate: boolean;
    displayName: string;
    userId: string;
    sendMsgAsBroadcaster: boolean;
    sendMsgAsModerator: boolean;
    sendAsFirstMessage: boolean;
    sendMsgAsSubscriber: boolean;
    channelPointRewards: {
        name: string;
        cost: number;
        messageRequired: boolean;
        id: string;
    }[];
    [string: string]: any;
    recentMessages: string[];
    session: {
        "follower-goal": {
            amount: number;
        },
        "follower-total": {
            count: number;
        },
        "subscriber-goal": {
            amount: number;
        },
        "subscriber-total": {
            count: number;
        },
        "cheer-goal": {
            amount: number;
        },
        "cheer-total": {
            amount: number;
        },
        "tip-total": {
            amount: number;
        },
        "tip-goal": {
            amount: number;
        }
        [key: string]: any;
    }
}