<template>
    <div ref="iFrameContainer" class="widget"
        :style="{ width: widgetDimensions[0] + 'px', height: widgetDimensions[1] + 'px' }">
    </div>
</template>

<script setup lang="ts">
import lodash from "lodash";
import seData from "@/assets/StreamElementsData.json";
import SessionData from "@/assets/SessionUpdateData.json";
import { type IndexableType } from '@/utility/CustomTypes';
import { widgets } from "@/widget-registry";
import SE_API from "@/assets/SE_API?raw";

const props = defineProps({
    fields: {
        type: Object as PropType<IndexableType>,
        required: true
    },
    simulate: {
        type: Boolean as PropType<boolean>,
        default: false
    }
});

const widgetName = useRouter().currentRoute.value.query.name as string;
const widget = widgets.find(widget => widget.name === widgetName)!;

const originalFieldsdata: IndexableType = lodash.cloneDeep(props.fields);
const updatedCSS = ref(widget.assets.css);
const updatedJS = ref(widget.assets.js);
const updatedHTML = ref(widget.assets.template);
const updatedSeData: IndexableType = seData;
const iFrameContainer = ref();
const timeoutId = ref<number | null>(null);
let chatCounter = 0;

let sessionData: IndexableType = lodash.cloneDeep(SessionData);

function ResetWidget() {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
    }
    sessionData = lodash.cloneDeep(SessionData);
    InitializeWidget();
}

function ApplyTemplateToFile(fileString: string) {
    let fieldsKeys = Object.keys(originalFieldsdata);
    fieldsKeys.forEach(key => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        fileString = fileString.replace(pattern, props.fields[key].value);
    });
    fieldsKeys.forEach(key => {
        const pattern = new RegExp(`{\\s*${key}\\s*}`, 'g');
        fileString = fileString.replace(pattern, props.fields[key].value);
    });
    return fileString;
}

function WrapJSFile(fileString: string) {
    return `(function() { ${fileString} })();`;
}

const widgetDimensions = computed(() => {
    return [800, 800];
});

function InitializeWidget() {

    let fieldsKeys = Object.keys(props.fields);
    fieldsKeys.forEach(key => {
        updatedSeData.fieldData[key] = props.fields[key].value;
    });

    updatedCSS.value = ApplyTemplateToFile(widget.assets.css);
    updatedJS.value = ApplyTemplateToFile(widget.assets.js);
    updatedJS.value = WrapJSFile(updatedJS.value);
    updatedHTML.value = ApplyTemplateToFile(widget.assets.template);
    iFrameContainer.value.innerHTML = "";
    const iframe = document.createElement('iframe');
    iframe.srcdoc = updatedHTML.value;
    iFrameContainer.value.appendChild(iframe);
    iframe.classList.add("widget-iframe");

    iframe.onload = () => {
        const iFrameDocument = iframe.contentDocument;
        if (iFrameDocument) {

            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.type = 'text/javascript';

            script.addEventListener("load", function () {
                const scriptElement = iFrameDocument.createElement('script');
                scriptElement.innerHTML = updatedJS.value;
                scriptElement.id = "custom-widget-script";

                const apiElement = iFrameDocument.createElement('script');
                apiElement.innerHTML = SE_API;
                apiElement.id = "custom-widget-api";

                const styleElement = iFrameDocument.createElement('style');
                styleElement.textContent = updatedCSS.value;
                styleElement.id = "custom-widget-style";

                iFrameDocument.head.appendChild(styleElement);
                iFrameDocument.head.appendChild(scriptElement);
                iFrameDocument.head.appendChild(apiElement);

                iFrameDocument.body.style.height = widgetDimensions.value[1] + 'px';
                iFrameDocument.body.style.overflow = 'hidden';

                LoadChatBox();
                //LoadGoals();
            });
            iFrameDocument.head.appendChild(script);
        }
    }
}

function LoadGoals() {
    const loadEvent = new CustomEvent('onWidgetLoad', { detail: updatedSeData });
    DispatchIframeEvent(loadEvent);
    SimulateGoals();
}

function LoadChatBox() {
    const loadEvent = new CustomEvent('onWidgetLoad', { detail: updatedSeData });
    DispatchIframeEvent(loadEvent);
}

function SimulateGoals() {
    const randomAmount = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    sessionData.session["follower-total"].count += randomAmount;
    const randTime = Math.floor(Math.random() * (4500 - 1500 + 1) + 1500);

    const updateEvent = new CustomEvent('onSessionUpdate', { detail: sessionData });
    timeoutId.value = setTimeout(() => {
        DispatchIframeEvent(updateEvent);
        SimulateGoals();
    }, randTime);
}

function SimulateChat(continuously: boolean = true) {
    if (continuously) {

        let eventData;
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        if (chatCounter < randomNumber) {
            eventData = GenerateRandomMessage();
            chatCounter++;
        }
        else {
            eventData = GenerateRandomEvent();
            chatCounter = 0;
        }

        const messageEvent = new CustomEvent('onEventReceived', { detail: lodash.cloneDeep(eventData) });
        const randTime = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
        timeoutId.value = setTimeout(((eventDataCopy) => {
            return () => {
                DispatchIframeEvent(eventDataCopy);
                SimulateChat(continuously);
            };
        })(messageEvent), randTime);
    }
    else {
        for (let i = 0; i < 10; i++) {
            let randTime;
            if (i == 0) randTime = 1000;
            else randTime = Math.floor(Math.random() * (500 - 150 + 1) + 150);

            setTimeout(() => {
                let eventData;
                const randomNumber = Math.round(Math.random());
                if (randomNumber == 0) {
                    eventData = GenerateRandomMessage();
                }
                else {
                    eventData = GenerateRandomEvent();
                }
                const event = new CustomEvent('onEventReceived', { detail: eventData });
                DispatchIframeEvent(event);
            }, randTime);
        }
    }
}

function DispatchIframeEvent(event: CustomEvent | MessageEvent) {
    const iframe = iFrameContainer.value.querySelector('iframe') as HTMLIFrameElement;
    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
        iframeWindow.dispatchEvent(event);
    }
}

function MessageHandler(event: MessageEvent<{
    key: string;
    request: string;
    response: string;
    value: string;
}>): void {

    const resolveEvent = (result: any) => new MessageEvent('message', {
        data: {
            listener: event.data.response,
            event: undefined,
            result: result
        }
    });

    if (event.data.request == 'store_set') {
        localStorage.setItem(event.data.key, event.data.value);
        DispatchIframeEvent(resolveEvent({
            key: event.data.key,
            message: 'successfully updated key'
        }));
    }
    else if (event.data.request == 'store_get') {
        const data = localStorage.getItem(event.data.key);
        DispatchIframeEvent(resolveEvent({
            value: data
        }));
    }
}

onMounted(() => {
    ResetWidget();
    if(props.simulate){
        SimulateChat(true);
    }
    window.addEventListener('message', MessageHandler);
});

onBeforeUnmount(() => {
    if (timeoutId.value) {
        clearTimeout(timeoutId.value);
    }
    window.removeEventListener('message', MessageHandler);
})

defineExpose({
    DispatchIframeEvent,
});

</script>

<style>
/* Add your custom styles here */
.widget {
    position: relative;
}

.sidebar {
    min-width: 200px;
    height: 100%;
    background-color: #dbdbdb;
}

.widget-editor {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
}

.widget-iframe {
    width: 100%;
    height: 100%;
    position: relative;
    border: 0;
    font-size: 100%;
    font: inherit;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
}

.overlay {
    width: 1920px;
    height: 1080px;
    transform: scale(0.59537);
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    transform-origin: top left;
}

.overlay-wrapper {
    position: relative;
}

.custom-field-group {
    margin-bottom: 10px;
}
</style>