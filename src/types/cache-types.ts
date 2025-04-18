import { type Badge } from "./widget-types";

export interface DevKitCache {
    firstBadge: Badge;
    secondBadge: Badge;
    displayColor: string;
    sendMsgAsBroadcaster: boolean;
    channelPointRewards: {
        name: string;
        cost: number;
    }[];
}