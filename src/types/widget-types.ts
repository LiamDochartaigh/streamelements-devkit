export type WidgetTypes = 'chat' | 'goal' | 'eventlist';

export interface WidgetConfig {
    type: WidgetTypes;
}

export interface Emote {
    name: string;
    src: string;
    srcset: string;
}

export interface Badge {
    type: string;
    version: string;
    url: string;
    description: string;
}