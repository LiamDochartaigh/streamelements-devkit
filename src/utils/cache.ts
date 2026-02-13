import { type DevKitCache } from "@/types/cache-types";
import SessionData from "@/assets/SessionUpdateData.json";

let cache = ref<DevKitCache>({
    firstBadge: {
        description: '',
        type: 'no-badge-selected',
        url: '',
        version: '1.0.0',
    },
    widgetDimensions: {
        width: 800,
        height: 1000,
    },
    secondBadge: {
        description: '',
        type: 'no-badge-selected',
        url: '',
        version: '1.0.0',
    },
    sidebarstate: true,
    displayColor: '#502fb5',
    displayName: 'test_user',
    userId: '',
    sendMsgAsBroadcaster: false,
    sendMsgAsSubscriber: false,
    sendMsgAsModerator: false,
    sendAsFirstMessage: false,
    bgColor: '#6e6e6e',
    channelPointRewards: [],
    recentMessages: [],
    session: SessionData.session
});

export function useDevKitCache() {
    const cacheString = localStorage.getItem('devkit-cache');
    const savedCache = cacheString ?  JSON.parse(cacheString) as DevKitCache : null;

    // Ensures data is present in every cache property
    // Useful when cache is updated, to ensure new properties are present in cache
    Object.keys(cache.value).forEach((key) => {
        if(savedCache && !Object.prototype.hasOwnProperty.call(savedCache, key)) {
            savedCache[key] = cache.value[key];
        }
    });

    cache.value = savedCache ? savedCache : cache.value;

    watch(cache, (newCache) => {
        localStorage.setItem('devkit-cache', JSON.stringify(newCache));
    }, { deep: true });

    return cache;
}