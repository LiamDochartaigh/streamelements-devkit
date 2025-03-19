export { }

declare global {
    const SE_API: StreamElements_API;
    type Message = 'counter_get' | 'store_get' | 'store_set' | 'resume_queue' | 'sanitize' | 'cheer_filter' | 'set_field' | 'overlay_status';
    // do the message types?
    // different input and response for each message type?
    interface StreamElements_API {
        responses: {
            [key: string]: { resolve: (value: any) => void, reject: (reason?: any) => void }
        };
        sendMessage: (message: string,
            data: { response: string, request: string, key?: string, value?: string, message?: string, reload?: string }) => Promise<any>;
        counters: {
            get: (key: string) => Promise<any>;
        }
        store: {
            get: (key: string) => Promise<{ value: any; }>;
            set: (key: string, value: any) => Promise<{ key: string; message: string }>;
        },
        resumeQueue: () => Promise<any>;
        sanitize: (message: string) => Promise<any>;
        cheerFilter: (message: string) => Promise<any>;
        setField: (key: string, value: any, reload: string) => Promise<any>;
        getOverlayStatus: () => Promise<any>
    }
}
