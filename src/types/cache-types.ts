import { type Badge } from "./widget-types";

export interface DevKitCache {
    firstBadge: Badge;
    secondBadge: Badge;
    displayColor: string;
    sendMsgAsBroadcaster: boolean;
    sendMsgAsModerator: boolean;
    sendMsgAsSubscriber: boolean;
    channelPointRewards: {
        name: string;
        cost: number;
    }[];
}