export { }

declare global {
    const SE_API: StreamElements_API;
    type MessageConfig = {
        'counter_get': {
            data: { key: string };
            response: Promise<{
                counter: string;
                value: number;
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
    interface StreamElements_API {
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
        setField: (key: string, value: any, reload: boolean) => MessageConfig['set_field']['response'];
        getOverlayStatus: () => MessageConfig['overlay_status']['response'];
    }
}
