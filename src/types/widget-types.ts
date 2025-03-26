import seEventData from '@/assets/StreamEventsData.json';

export type WidgetTypes = 'chat' | 'goal' | 'eventlist';

export interface WidgetConfig {
    type: WidgetTypes;
}

export type EventTypes = keyof typeof seEventData.alertEvents;
export interface Emote {
    name: string;
    src: string;
    srcset: string;
}