const SE_APkI: StreamElements_API = {
    responses: {},
    sendMessage: (message, data) => {
        return new Promise((resolve, reject) => {
            const response = 'resp_' + Math.random().toString(16).substr(2);
            data.response = response;
            data.request = message;
            SE_APkI.responses[response] = { resolve, reject };
            parent.postMessage(data, '*');
        });
    },
    counters: {
        get: key => {
            return SE_API.sendMessage('counter_get', { key });
        }
    },
    store: {
        get: key => {
            return SE_API.sendMessage('store_get', { key });;
        },
        set: (key, value) => {
            return SE_API.sendMessage('store_set', { key, value });;
        }
    },
    resumeQueue: () => {
        return SE_API.sendMessage('resume_queue');
    },
    sanitize: (message) => {
        return SE_API.sendMessage('sanitize', { message });
    },
    cheerFilter: (message) => {
        return SE_API.sendMessage('cheer_filter', { message });
    },
    setField: (key, value, reload) => {
        return SE_API.sendMessage('set_field', { key, value, reload });
    },
    getOverlayStatus: () => {
        return SE_API.sendMessage('overlay_status');
    }
};