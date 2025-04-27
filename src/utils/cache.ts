import { type DevKitCache } from "@/types/cache-types";

export function useDevKitCache() {
    const cacheString = localStorage.getItem('devkit-cache');
    const initialCache: DevKitCache = cacheString ? JSON.parse(cacheString) : {
        firstBadge: {
            description: '',
            type: 'no-badge-selected',
            url: '',
            version: '1.0.0',
        },
        secondBadge: {
            description: '',
            type: 'no-badge-selected',
            url: '',
            version: '1.0.0',
        },
        displayColor: '#502fb5',
        sendMsgAsBroadcaster: false,
        sendMsgAsSubscriber: false,
        sendMsgAsModerator: false,
        bgColor: '#FFFFFF',
        channelPointRewards: []
    } as DevKitCache;
    const cacheRef = ref<DevKitCache>(initialCache);

    watch(cacheRef, (newCache) => {
        localStorage.setItem('devkit-cache', JSON.stringify(newCache));
    }, { deep: true });

    return cacheRef;
}