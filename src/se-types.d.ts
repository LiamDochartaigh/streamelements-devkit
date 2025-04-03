import type { event } from "jquery";
import type { extend } from "lodash";
import type CustomField from "./components/CustomFields/CustomField.vue";

export { };

declare global {
    interface Window {
        addEventListener(type: 'onWidgetLoad', listener: (event: CustomEvent<WidgetLoadEvent>) => void): void;
        addEventListener(type: 'onEventReceived', listener: (event: CustomEvent<WidgetEventConfig>) => void): void;
        addEventListener(type: 'onSessionUpdate', listener: (event: CustomEvent<SessionUpdateEvent>) => void): void;
    }

    interface SessionUpdateEvent {
        session: SessionData
    }

    interface CustomFields { }

    type WidgetEventConfig =
        {
            listener: 'follower-latest';
            event: {
                avatar: string;
                displayName: string;
                name: string;
                originalEventName: 'follower-latest';
                providerId: string;
                sessionTop: boolean;
                type: 'follower';
                _id: string;
            }
        } | {
            listener: 'subscriber-latest'
            event: {
                amount: number;
                avatar: string;
                displayName: string;
                name: string;
                originalEventName: "subscriber-latest"
                providerId: string;
                sessionTop: boolean;
                type: "subscriber"
                _id: string;
                sender?: string;
                bulkGifted?: boolean;
                gifted?: boolean;
                message?: string;
                tier?: '1000' | '2000' | '3000' | 'prime';
                isCommunityGift?: boolean;
                playedAsCommunityGift?: boolean;
            }
        } | {
            listener: 'tip-latest';
            event: {
                amount: number;
                avatar: string;
                displayName: string;
                name: string;
                originalEventName: "tip-latest"
                providerId: string;
                sessionTop: boolean;
                type: "tip";
                message?: string;
                _id: string;
            }
        } | {
            listener: 'cheer-latest';
            event: {
                amount: number;
                avatar: string;
                displayName: string;
                providerId: string;
                message?: string;
                name: string;
                _id: string;
                sessionTop: boolean;
                type: 'cheer';
                originalEventName: 'cheer-latest';
            }
        } | {
            listener: 'raid-latest';
            event: {
                amount: number;
                avatar: string;
                displayName: string;
                name: string;
                originalEventName: 'raid-latest';
                providerId: string;
                sessionTop: boolean;
                type: 'raid';
                _id: string;
            }
        } | {
            listener: 'message';
            event: {
                data: {
                    badges: {
                        description: string;
                        type: string;
                        url: string;
                        version: string;
                    }[];
                    channel: string;
                    displayColor: string;
                    displayName: string;
                    emotes: {
                        animated: boolean;
                        end: number;
                        gif: boolean;
                        id: string;
                        name: string;
                        start: number;
                        type: string;
                        urls: { [key as number]: string };
                    }[];
                    isAction: boolean;
                    msgId: string;
                    nick: string;
                    tags: { [key: string]: string };
                    text: string;
                    time: number;
                    userId: string;
                },
                renderedText: string;
                service: string;
            }
        } | {
            listener: 'delete-message';
            event: {
                msgId: string;
            }
        } | {
            listener: 'delete-messages';
            event: {
                userId: string;
            }
        } | {
            listener: 'event:skip';
            event: {}
        } | {
            listener: 'alertService:toggleSound';
            event: {
                muted: boolean;
            }
        } | {
            listener: 'bot:counter';
            event: {
                counter: string;
                value: number;
            }
        } | {
            listener: 'kvstore:update';
            event: {
                data: {
                    key: string;
                    value: any;
                }
            }
        } | {
            listener: 'event:test';
            event: {
                field: string;
                value: ButtonTypes;
                listener: 'widget-button';
            }
        }

    interface WidgetLoadEvent {
        channel: {
            username: string;
            providerId: string;
            id: string;
            avatar: string;
            apiToken: string;
        },
        currency: {
            code: string;
            symbol: string;
            name: string;
        },
        fieldData: CustomFields,
        overlay: {
            isEditorMode: boolean;
            muted: boolean;
        },
        recents: {
            name: string;
            createdAt: string;
            type: string;
            amount?: number;
        }[],
        session: {
            data: SessionData,
            settings: {
                autoReset: boolean;
                calendar: boolean;
                resetOnStart: boolean;
            }
        }

    }

    interface SessionData {
        "follower-latest": {
            name: string;
        };
        "follower-session": {
            count: number;
        };
        "follower-week": {
            count: number;
        };
        "follower-month": {
            count: number;
        };
        "follower-goal": {
            amount: number;
        };
        "follower-total": {
            count: number;
        };
        "subscriber-latest": {
            name: string;
            amount: number;
            tier: string;
            message: string;
        };
        "subscriber-new-latest": {
            amount: number;
            message: string;
            name: string;
        };
        "subscriber-resub-latest": {
            amount: number;
            message: string;
            name: string;
        };
        "subscriber-gifted-latest": {
            amount: number;
            message: string;
            name: string;
            sender: string;
            tier: string;
        };
        "subscriber-session": {
            count: number;
        };
        "subscriber-new-session": {
            count: number;
        };
        "subscriber-resub-session": {
            count: number;
        };
        "subscriber-gifted-session": {
            count: number;
        };
        "subscriber-week": {
            count: number;
        };
        "subscriber-month": {
            count: number;
        };
        "subscriber-goal": {
            amount: number;
        };
        "subscriber-total": {
            count: number;
        };
        "subscriber-points": {
            amount: number;
        };
        "subscriber-alltime-gifter": {
            amount: number;
            name: string;
        };
        "host-latest": {
            name: string;
            amount: number;
        };
        "raid-latest": {
            name: string;
            amount: number;
        };
        "cheer-session": {
            amount: number;
        };
        "cheer-week": {
            amount: number;
        };
        "cheer-month": {
            amount: number;
        };
        "cheer-total": {
            amount: number;
        };
        "cheer-count": {
            count: number;
        };
        "cheer-goal": {
            amount: number;
        };
        "cheer-latest": {
            name: string;
            amount: number;
        };
        "cheer-session-top-donation": {
            amount: number;
            name: string;
        };
        "cheer-weekly-top-donation": {
            amount: number;
            name: string;
        };
        "cheer-monthly-top-donation": {
            amount: number;
            name: string;
        };
        "cheer-alltime-top-donation": {
            amount: number;
            name: string;
        };
        "cheer-session-top-donator": {
            amount: number;
            name: string;
        };
        "cheer-weekly-top-donator": {
            amount: number;
            name: string;
        };
        "cheer-monthly-top-donator": {
            amount: number;
            name: string;
        };
        "cheer-alltime-top-donator": {
            amount: number;
            name: string;
        };
        "tip-latest": {
            name: string;
            amount: number;
            message: string;
        };
        "tip-session-top-donation": {
            name: string;
            amount: number;
        };
        "tip-weekly-top-donation": {
            name: string;
            amount: number;
        };
        "tip-monthly-top-donation": {
            name: string;
            amount: number;
        };
        "tip-alltime-top-donation": {
            name: string;
            amount: number;
        };
        "tip-session-top-donator": {
            name: string;
            amount: number;
        };
        "tip-weekly-top-donator": {
            name: string;
            amount: number;
        };
        "tip-monthly-top-donator": {
            name: string;
            amount: number;
        };
        "tip-alltime-top-donator": {
            name: string;
            amount: number;
        };
        "tip-session": {
            amount: number;
        };
        "tip-week": {
            amount: number;
        };
        "tip-month": {
            amount: number;
        };
        "tip-total": {
            amount: number;
        };
        "tip-count": {
            count: number;
        };
        "tip-goal": {
            amount: number;
        };
        "merch-goal-orders": {
            amount: number;
        };
        "merch-goal-items": {
            amount: number;
        };
        "merch-goal-total": {
            amount: number;
        };
        "merch-latest": {
            amount: number;
            items: any[];
            name: string;
        };
        "follower-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
        }>;
        "subscriber-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
            tier: string;
            amount: number;
        }>;
        "host-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
            amount: number;
        }>;
        "raid-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
            amount: number;
        }>;
        "cheer-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
            amount: number;
        }>;
        "tip-recent": Array<{
            name: string;
            amount: number;
            createdAt: string;
            type: string;
        }>;
        "merch-recent": Array<{
            name: string;
            createdAt: string;
            type: string;
        }>;
        "charityCampaignDonation-alltime-top-donation": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-alltime-top-donator": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-latest": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-monthly-top-donation": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-monthly-top-donator": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-recent": Array<{
            name: string;
            amount: number;
            createdAt: string;
            type: string;
        }>;
        "charityCampaignDonation-weekly-top-donation": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-weekly-top-donator": {
            amount: number;
            name: string;
        };
        "cheerPurchase-alltime-top-donation": {
            amount: number;
            name: string;
        };
        "cheerPurchase-alltime-top-donator": {
            amount: number;
            name: string;
        };
        "cheerPurchase-latest": {
            amount: number;
            name: string;
        };
        "cheerPurchase-monthly-top-donation": {
            amount: number;
            name: string;
        };
        "cheerPurchase-monthly-top-donator": {
            amount: number;
            name: string;
        };
        "cheerPurchase-recent": Array<{
            name: string;
            amount: number;
            createdAt: string;
            type: string;
        }>;
        "cheerPurchase-weekly-top-donation": {
            amount: number;
            name: string;
        };
        "cheerPurchase-weekly-top-donator": {
            amount: number;
            name: string;
        };
        "purchase-latest": {
            amount: number;
            avatar: string;
            items: any[];
            message: string;
            name: string;
        };
        "superchat-alltime-top-donation": {
            amount: number;
            name: string;
        };
        "superchat-alltime-top-donator": {
            amount: number;
            name: string;
        };
        "superchat-count": {
            count: number;
        };
        "superchat-goal": {
            amount: number;
        };
        "superchat-latest": {
            amount: number;
            name: string;
        };
        "superchat-month": {
            amount: number;
        };
        "superchat-monthly-top-donation": {
            amount: number;
            name: string;
        };
        "superchat-monthly-top-donator": {
            amount: number;
            name: string;
        };
        "superchat-recent": Array<{
            name: string;
            amount: number;
            createdAt: string;
            type: string;
        }>;
        "superchat-session": {
            amount: number;
        };
        "superchat-total": {
            amount: number;
        };
        "superchat-week": {
            amount: number;
        };
        "superchat-weekly-top-donation": {
            amount: number;
            name: string;
        };
        "superchat-weekly-top-donator": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-session-top-donation": {
            amount: number;
            name: string;
        };
        "charityCampaignDonation-session-top-donator": {
            amount: number;
            name: string;
        };
        "cheerPurchase-session-top-donation": {
            amount: number;
            name: string;
        };
        "cheerPurchase-session-top-donator": {
            amount: number;
            name: string;
        };
        "hypetrain-latest": {
            active: number;
            amount: number;
            level: number;
            levelChanged: number;
            name: string;
            type: string;
        };
        "hypetrain-latest-top-contributors": any[];
        "hypetrain-level-goal": {
            amount: number;
        };
        "hypetrain-level-progress": {
            amount: number;
            percent: number;
        };
        "hypetrain-total": {
            amount: number;
        };
        "superchat-session-top-donation": {
            amount: number;
            name: string;
        };
        "superchat-session-top-donator": {
            amount: number;
            name: string;
        };
    }

    const SE_API: SE_GLOBAL.SE_API;
    type MessageConfig = {
        'counter_get': {
            data: { key: string };
            response: Promise<{
                count: number;
                id: string;
            }>;
        };
        'store_get': {
            data: { key: string };
            response: Promise<{
                value: any;
            }>;
        };
        'store_set': {
            data: { key: string; value: any };
            response: Promise<{
                message: string;
                key: string;
            }>;
        };
        'set_field': {
            data: { key: string; value: any; reload: boolean };
            response: Promise<any>;
        };
        'sanitize': {
            data: { message: string };
            response: Promise<{
                result: {
                    message: string;
                };
                skip: boolean;
            }>;
        };
        'cheer_filter': {
            data: { message: string };
            response: Promise<string>;
        };
        'overlay_status': {
            data: {};
            response: Promise<{
                isEditorMode: boolean,
                muted: boolean
            }>;
        };
        'resume_queue': {
            data: {};
            response: never;
        };
    };

    namespace SE_GLOBAL {
        interface SE_API {
            responses: {
                [key: string]: { resolve: (value: any) => void, reject: (reason?: any) => void }
            };
            sendMessage: <M extends keyof MessageConfig>(message: M, data?: MessageConfig[M]['data']) => MessageConfig[M]['response'];
            counters: {
                get: (key: string) => MessageConfig['counter_get']['response'];
            }
            store: {
                get: (key: string) => MessageConfig['store_get']['response'];
                set: (key: string, value: any) => MessageConfig['store_set']['response'];
            },
            resumeQueue: () => MessageConfig['resume_queue']['response'];
            sanitize: (message: string) => MessageConfig['sanitize']['response'];
            cheerFilter: (message: string) => MessageConfig['cheer_filter']['response'];
            setField: <Key extends keyof CustomFields>(key: Key, value: CustomFields[Key], reload: boolean = false) => MessageConfig['set_field']['response'];
            getOverlayStatus: () => MessageConfig['overlay_status']['response'];
        }
    }

    namespace SE_Secure_API {

    };
}