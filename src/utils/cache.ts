import { type DevKitCache } from "@/types/cache-types";
import { type Badge } from "@/types/widget-types";

export function useDevKitCache() {
    const cacheString = localStorage.getItem('devkit-cache');
    const initialCache: DevKitCache = cacheString ? JSON.parse(cacheString) : {
        firstBadge: {},
        secondBadge: {},
        displayColor: '#502fb5',
        sendMsgAsBroadcaster: false,
    } as DevKitCache;
    const cacheRef = ref<DevKitCache>(initialCache);

    watch(cacheRef, (newCache) => {
        localStorage.setItem('devkit-cache', JSON.stringify(newCache));
    }, { deep: true });

    return cacheRef;
}