import { type Badge } from "./widget-types";

interface ChannelPointReward {
    
}

export interface DevKitCache {
    firstBadge: Badge;
    secondBadge: Badge;
    displayColor: string;
    sendMsgAsBroadcaster: boolean;
    channelPointRewards: ChannelPointReward[];
}