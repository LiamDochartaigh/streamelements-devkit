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
    displayName: string;
    sendMsgAsBroadcaster: boolean;
    sendMsgAsModerator: boolean;
    sendMsgAsSubscriber: boolean;
    channelPointRewards: {
        name: string;
        cost: number;
    }[];
    [string: string]: any;
}