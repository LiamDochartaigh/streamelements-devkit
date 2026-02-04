<template>
    <div class="fullscreen-overlay" :style="!showDialog ? 'display: none;' : ''">
        <div ref="dialogRef" class="dialog">
            <div style="position: absolute; right: 1em;">
                <button class="button" @click="hideDialog">X</button>
            </div>
            <div class="dialog_header">Session Data</div>
            <div class="dialog_tabs">
                <div @click="dialogTab = 0" class="dialog_tab" :class="dialogTab === 0 ? 'selected' : ''">
                    Labels
                    <div class="dialog_underline"></div>
                </div>
                <div class="dialog_tab" @click="dialogTab = 1" :class="dialogTab === 1 ? 'selected' : ''">
                    Goals
                    <div class="dialog_underline"></div>

                </div>
                <div class="dialog_tab" @click="dialogTab = 2" :class="dialogTab === 2 ? 'selected' : ''">
                    Session Data
                    <div class="dialog_underline"></div>

                </div>
                <div class="dialog_tab" @click="dialogTab = 3" :class="dialogTab === 3 ? 'selected' : ''">
                    Totals
                    <div class="dialog_underline"></div>

                </div>
                <div class="dialog_tab" @click="dialogTab = 4" :class="dialogTab === 4 ? 'selected' : ''">
                    Aggregates
                    <div class="dialog_underline"></div>
                </div>
            </div>
            <div class="dialog_content">
                <template v-if="dialogTab === 0">
                    <div class="dialog_content_row">
                        <div class="dialog_content_cell">
                            <div>Latest Follower</div>
                            <div class="subtitle">Name</div>
                            <div><input v-model="devKitCache.session['follower-latest']['name']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Latest Subscriber</div>
                            <div class="subtitle">Name</div>
                            <div><input v-model="devKitCache.session['subscriber-latest']['name']"></input></div>
                        </div>
                    </div>
                    <div class="dialog_content_row">
                        <div class="dialog_content_cell">
                            <div>Latest Tipper</div>
                            <div class="subtitle">Name</div>
                            <div><input v-model="devKitCache.session['tip-latest']['name']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Latest Cheerer</div>
                            <div class="subtitle">Name</div>
                            <div><input v-model="devKitCache.session['cheer-latest']['name']"></input></div>
                        </div>
                    </div>
                    <div class="dialog_content_row">
                        <div class="dialog_content_cell">
                            <div>Recent Tips</div>
                            <div class="input-tags">
                                <template
                                    v-for="{ name, amount, createdAt, type } in devKitCache.session['tip-recent']">
                                    <span class="tag">{{ name }}</span>
                                </template>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Recent Subscribers</div>
                            <div class="input-tags">
                                <template
                                    v-for="{ name, amount, createdAt, type } in devKitCache.session['subscriber-recent']">
                                    <span class="tag">{{ name }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="dialog_content_row">
                        <div class="dialog_content_cell">
                            <div>Recent Cheers</div>
                            <div class="input-tags">
                                <template
                                    v-for="{ name, amount, createdAt, type } in devKitCache.session['cheer-recent']">
                                    <span class="tag">{{ name }}</span>
                                </template>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Recent Followers</div>
                            <div class="input-tags">
                                <template
                                    v-for="{ name, amount, createdAt, type } in devKitCache.session['follower-recent']">
                                    <span class="tag">{{ name }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="dialogTab === 1">
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Follow Goal Progress</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['follower-goal']['amount']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Sub Goal Progress</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['subscriber-goal']['amount']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Tip Goal Progress</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['tip-goal']['amount']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Cheer Goal Progress</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['cheer-goal']['amount']"></input></div>
                        </div>
                    </div>
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Revenue Goal</div>
                            <div><input></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Merchandise Goal Items</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['merch-goal-items']['amount']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Merchandise Goal Orders</div>
                            <div><input v-model.number="devKitCache.session['merch-goal-orders']['amount']"></input>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="dialogTab === 2">
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Follower Count</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['follower-session']['amount']"></input></div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Subscriber Count</div>
                            <div><input type="number"
                                    v-model.number="devKitCache.session['subscriber-session']['amount']"></input></div>
                        </div>
                    </div>
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Top Tip</div>
                            <div style="display: flex;">
                                <div>
                                    <div class="subtitle">Name</div>
                                    <div><input
                                            v-model="devKitCache.session['tip-session-top-donation']['name']"></input>
                                    </div>
                                </div>
                                <div>
                                    <div class="subtitle">Amount</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['tip-session-top-donation']['amount']"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Top Cheer</div>
                            <div style="display: flex;">
                                <div>
                                    <div class="subtitle">Name</div>
                                    <div><input
                                            v-model="devKitCache.session['cheer-session-top-donation']['name']"></input>
                                    </div>
                                </div>
                                <div>
                                    <div class="subtitle">Amount</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['cheer-session-top-donation']['amount']"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Top Tipper</div>
                            <div style="display: flex;">
                                <div>
                                    <div class="subtitle">Name</div>
                                    <div><input
                                            v-model="devKitCache.session['tip-session-top-donator']['name']"></input>
                                    </div>
                                </div>
                                <div>
                                    <div class="subtitle">Amount</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['tip-session-top-donator']['amount']"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Top Cheerer</div>
                            <div style="display: flex;">
                                <div>
                                    <div class="subtitle">Name</div>
                                    <div><input
                                            v-model="devKitCache.session['cheer-session-top-donator']['name']"></input>
                                    </div>
                                </div>
                                <div>
                                    <div class="subtitle">Name</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['cheer-session-top-donator']['amount']"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div style="display: flex;">
                                <div>
                                    <div>Tip Count</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['tip-count']['count']"></input>
                                    </div>
                                </div>
                                <div>
                                    <div>Tips Amount</div>
                                    <div><input type="number"
                                            v-model.number="devKitCache.session['tip-session']['amount']"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="dialogTab === 3">
                    <div class="dialog_content_row gap-half">
                        <div class="dialog_content_cell">
                            <div>Total Subscribers</div>
                            <div><input type="number" disabled
                                    v-model.number="devKitCache.session['subscriber-total']['count']"></input>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Total Followers</div>
                            <div><input type="number" disabled
                                    v-model.number="devKitCache.session['follower-total']['count']"></input>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Total Cheers</div>
                            <div><input type="number" disabled
                                    v-model.number="devKitCache.session['cheer-total']['amount']"></input>
                            </div>
                        </div>
                        <div class="dialog_content_cell">
                            <div>Total Tips</div>
                            <div><input type="number" disabled
                                    v-model.number="devKitCache.session['tip-total']['amount']"></input>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="dialog_footer">
                <div>
                    <button class="button" @click="ResetSessionData">Reset Session Data</button>
                </div>
            </div>
        </div>
    </div>
    <div class="widget-editor" :style="{ backgroundColor: devKitCache.bgColor }">
        <div class="sidebar">
            <div class="sidebar-content" v-if="sidebarOpen">
                <div class="custom-fields">
                    <div class="custom-field" v-for="(group, index) in customFieldGroups" :key="index">
                        <div class="custom-field-header"
                            @click="ExpandSidebarGroup(`${group}Group${index + 1}`.replace(/\s+/g, ''))">
                            <svg width="10px" style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <path
                                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                            <span>
                                <strong style="text-decoration: underline;">{{ group }}</strong>
                            </span>
                        </div>
                        <div :ref="el => customFieldsRefs[`${group}Group${index + 1}`.replace(/\s+/g, '')] = el"
                            style="display: none; padding: 10px;">
                            <div v-for="(field) in GetFieldsKeyByGroup(group)">
                                <CustomField :type="fieldsdata[field].type" :fieldData="fieldsdata[field]"
                                    :fieldIndex="field" @input="FieldUpdated($event, field, true)"
                                    @btnClick="EditorButtonClicked" />
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="solid">
                <div style="padding: 10px;">
                    <div class="input-section">
                        <div style="margin-bottom: 5px;"><strong>Test Message</strong></div>
                        <div class="input-container" style="position: relative; display: flex;">
                            <div style="position: relative; display: flex; flex-grow: 1;">
                                <div ref="textContent" class="text-input" contenteditable="true"
                                    @focus="recentMessagePos = devKitCache.recentMessages.length"
                                    @blur="recentMessagePos = devKitCache.recentMessages.length">
                                </div>
                                <EmoteSelection @emoteSelected="EmoteAdded"
                                    style="position: absolute; right: 4px; align-self: anchor-center;" />
                            </div>
                        </div>
                        <div>
                            <div>Display Name</div>
                            <input type="text" v-model="devKitCache.displayName" />
                        </div>
                        <div>
                            <div>User Id (Random if not provided)</div>
                            <input type="text" v-model="devKitCache.userId" />
                        </div>
                        <div>
                            <div>Send Msg as Broadcaster</div>
                            <input type="checkbox" v-model="devKitCache.sendMsgAsBroadcaster" />
                        </div>
                        <div>
                            <div>Send Msg as Subscriber</div>
                            <input type="checkbox" v-model="devKitCache.sendMsgAsSubscriber" />
                        </div>
                        <div>
                            <div>Send Msg as Moderator</div>
                            <input type="checkbox" v-model="devKitCache.sendMsgAsModerator" />
                        </div>
                        <div>
                            <div>Send as "First Message"</div>
                            <input type="checkbox" v-model="devKitCache.sendAsFirstMessage" />
                        </div>
                        <div style="display: flex; margin-top: 2px; justify-content: space-between;">
                            <div style="display: flex; gap: 10px;">
                                <div style="display: flex; flex-direction: column;">
                                    <div style="font-size: 0.8em">Badge 1</div>
                                    <BadgeSelection @badge-selected="devKitCache.firstBadge = $event"
                                        :badge="devKitCache.firstBadge?.type" />
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <div style="font-size: 0.8em">Badge 2</div>
                                    <BadgeSelection @badge-selected="devKitCache.secondBadge = $event"
                                        :badge="devKitCache.secondBadge ? devKitCache.secondBadge?.type : 'no-badge-selected'" />
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 5px; display: flex; flex-direction: column; gap: 0.5em;">
                            <div>
                                <button class="button" @click="SendMessage()">Send Message</button>
                            </div>
                            <div>
                                <button :disabled="messageRedeem ? true : false" class="button"
                                    @click="SendMessage(true)">Send Highlighted Message</button>
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <LD-ColorPicker v-model="devKitCache.displayColor" />
                        </div>
                    </div>
                </div>
                <div style="padding: 10px;">
                    <div class="input-section">
                        <div style="margin-bottom: 5px;"><strong>Add Channel Point Reward</strong></div>
                        <div style="display: flex; gap: 10px; flex-direction: column;">
                            <div>
                                <div>Reward Name</div>
                                <input v-model="rewardForm.name" type="text" placeholder="Enter Name" />
                            </div>
                            <div>
                                <div>Reward Cost</div>
                                <input v-model="rewardForm.cost" type="text" placeholder="0" />
                            </div>
                            <div>
                                <div>Reward Id</div>
                                <input v-model="rewardForm.id" type="text" placeholder="redeem id" />
                            </div>
                            <div>
                                <div>Message Required</div>
                                <input type="checkbox" v-model="rewardForm.messageRequired" />
                            </div>

                        </div>
                        <div style="margin-top: 10px;">
                            <button @click="AddChannelPointReward">Add New Reward</button>
                        </div>
                        <div v-for="(item, index) in devKitCache.channelPointRewards"
                            style="margin-top: 10px; display: flex; gap:5px; align-items: center;">
                            <button :disabled="messageRedeem ? true : false" class="channel-point-reward" @click="item.messageRequired ? messageRedeem = { id: item.id, amount: item.cost, redemption: item.name } : GenEventByType(GenerateChannelPointRedeem({
                                amount: item.cost,
                                redemption: item.name,
                                id: item.id,
                                name: displayName,
                            }))">
                                <div>
                                    <div>{{ item.name }}</div>
                                    <div>{{ item.cost }}</div>
                                    <div v-if="item.messageRequired" style="font-style: italic; font-size: 0.5em;">
                                        Message
                                        Required</div>
                                </div>
                            </button>
                            <div>
                                <button :disabled="messageRedeem ? true : false"
                                    @click="devKitCache.channelPointRewards.splice(index, 1)" style="padding: 5px"><i
                                        class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div v-if="messageRedeem" class="alert" style="margin-top: 10px;">Send message to complete
                            redeem
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <div><strong>Test Events</strong></div>
                    <div>
                        <button class="button" @click="DeleteRandomMessage">Delete Random Message</button>
                    </div>
                    <div>
                        <button class="button"
                            @click="GenEventByType(GenerateEvent('follower-latest', { name: displayName, userId: userId }))">Follow
                            Event</button>
                    </div>
                    <div>
                        <button style="min-width: 100px;" class="button"
                            @click="GenEventByType(GenerateEvent('tip-latest', { name: displayName, userId: userId, amount: donationAmount }))">Donation
                            Event
                        </button>
                        <button class="button" @click="GenEventByType(GenerateEvent('tip-latest', {
                            message: 'This is a test message!',
                            name: displayName,
                            userId: userId,
                            amount: donationAmount
                        }))">Donation Message Event</button>
                        <input style="min-height: 2em;" placeholder="donation amount" type="number"
                            v-model="donationAmount" />
                    </div>
                    <div>
                        <button class="button"
                            @click="GenEventByType(GenerateEvent('cheer-latest', { name: displayName, userId: userId, amount: cheerAmount }))">Cheer
                            Event</button>
                        <input style="min-height: 2em;" placeholder="cheer amount" type="number"
                            v-model="cheerAmount" />
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            gifted: true,
                            tier: '1000',
                            name: displayName,
                            userId: userId,
                            amount: giftSubAmount,
                            bulkGifted: true
                        }))">Gifted Sub Event</button>
                        <input style="min-height: 2em;" placeholder="num gifted subs" type="number"
                            v-model="giftSubAmount" />
                    </div>
                    <div>
                        <button class="button"
                            @click="GenEventByType(GenerateEvent('raid-latest', { name: displayName, userId: userId, amount: raidAmount }))">Raid
                            Event</button>
                        <input style="min-height: 2em;" placeholder="number of raiders" type="number"
                            v-model="raidAmount" />
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            message: 'This is a test sub!',
                            name: displayName,
                            userId: userId
                        }))">Sub w/ Message Event</button>
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            message: 'This is a test sub!',
                            tier: '1000',
                            name: displayName,
                            userId: userId
                        }))">Sub Event</button>
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            message: 'This is a test sub!',
                            tier: '2000',
                            name: displayName,
                            userId: userId
                        }))">Sub Event T2</button>
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            message: 'This is a test sub!',
                            tier: '3000',
                            name: displayName,
                            userId: userId
                        }))">Sub Event T3</button>
                    </div>
                    <div>
                        <button class="button" @click="GenEventByType(GenerateEvent('subscriber-latest', {
                            message: 'This is a test sub!',
                            tier: 'prime',
                            name: displayName,
                            userId: userId
                        }))">Sub Event Prime</button>
                    </div>
                    <div>
                        <button class="button" @click="TriggerRandomEvent">Random Event</button>
                    </div>
                    <div>
                        <button class="button" @click="TriggerRandomMessage">Random Message</button>
                    </div>
                    <div>
                        <button class="button" @click="BanRandomUser">Ban/Timeout Random User</button>
                    </div>
                    <div>
                        <button class="button" @click="widgetKey++; simulate = !simulate">Simulation {{ `${simulate ?
                            'On' :
                            'Off'}`
                        }}</button>
                    </div>
                </div>
                <div style="padding: 10px;">
                    <div class="input-section">
                        <div><strong>Editor Settings</strong></div>
                        <div>
                            <button class="button" @click.stop="showDialog = true;">Edit Session Data</button>
                        </div>
                        <div>
                            <button class="button" @click="CopyPreviewURL">Copy Preview URL</button>
                        </div>
                        <div>Editor Background Color</div>
                        <LD-ColorPicker :mode="'compact'" v-model="devKitCache.bgColor" />
                        <div>Widget Dimensions</div>
                        <div style="display: flex; gap: 10px;">
                            <input class="widget-dimensions-input" type="number"
                                v-model="devKitCache.widgetDimensions.width" placeholder="800" />
                            <input class="widget-dimensions-input" type="number"
                                v-model="devKitCache.widgetDimensions.height" placeholder="1000" />
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <div class="sidebar-close-btn">
                <div class="sidebar-close-btn-content" @click="sidebarOpen = !sidebarOpen">
                    <svg style="fill: #616161; width: 1em; height: 1em; rotate: 270deg;"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path
                            d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM441 335C450.4 344.4 450.4 359.6 441 368.9C431.6 378.2 416.4 378.3 407.1 368.9L320.1 281.9L233.1 368.9C223.7 378.3 208.5 378.3 199.2 368.9C189.9 359.5 189.8 344.3 199.2 335L303 231C312.4 221.6 327.6 221.6 336.9 231L441 335z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="overlay-wrapper">
            <div id="overlay" class="overlay">
                <WidgetPreview @field-updated="FieldUpdated($event.value, $event.key, $event.reload ?? false)"
                    :key="widgetKey" ref="widgetPreview" :simulate="simulate" :fields="fieldsdata">
                </WidgetPreview>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomField from "@/components/CustomFields/CustomField.vue";
import WidgetPreview from "@/components/WidgetPreview.vue";
import { type IndexableType } from '@/utility/CustomTypes';
import { widgets } from "@/widget-registry";
import EmoteSelection from "@/components/EmoteSelection.vue";
import { Emote } from '@/types/widget-types';
import BadgeSelection from "@/components/BadgeSelection.vue";
import { WidgetEvents } from "@/se-types";
import { GenerateChannelPointRedeem, GenerateEvent } from "@/utils/events";
import SessionData from "@/assets/SessionUpdateData.json";
import { nanoid } from "nanoid";

const widgetName = useRouter().currentRoute.value.query.name as string;

const widget = computed(() => { return widgets.find(widget => widget.name === widgetName)! });
const widgetPreview = ref<InstanceType<typeof WidgetPreview>>();
const widgetKey = ref(0);
const textContent = ref<HTMLDivElement>();
const donationAmount = ref();
const cheerAmount = ref();
const raidAmount = ref();
const giftSubAmount = ref();
const recentMessagePos = ref(0);
const sidebarOpen = ref(true);

const fieldsdata = ref<IndexableType>(JSON.parse(widget.value.assets.fields));
const simulate = ref(false);
const customFieldGroups = ref<string[]>([]);
const customFieldsRefs = ref<IndexableType>({});
const devKitCache = useDevKitCache();
const dialogTab = ref(0);
const showDialog = ref(false);
const dialogRef = ref();
const messageRedeem = ref<{
    redemption: string,
    amount: number,
    id: string,
} | undefined>();

const displayName = computed(() => {
    return devKitCache.value.displayName.length === 0 ? undefined : devKitCache.value.displayName;
});

const userId = computed(() => {
    return devKitCache.value.userId.length === 0 ? undefined : devKitCache.value.userId;
});

const rewardForm = ref({
    name: '',
    cost: 0,
    messageRequired: false,
    id: ''
});

function CopyPreviewURL() {
    navigator.clipboard.writeText(`${window.location.origin}/preview-widget?name=${widgetName}&width=${devKitCache.value.widgetDimensions.width}&height=${devKitCache.value.widgetDimensions.height}`)
}

function ResetSessionData() {
    devKitCache.value.session = {
        ...SessionData.session
    };
    widgetKey.value++;
}

function AddChannelPointReward() {
    if (devKitCache.value.channelPointRewards.length >= 10) return;
    devKitCache.value.channelPointRewards.push({
        name: rewardForm.value.name,
        cost: rewardForm.value.cost,
        messageRequired: rewardForm.value.messageRequired,
        id: rewardForm.value.id ? rewardForm.value.id : nanoid()
    });
}

function FieldUpdated(event: any, fieldName: any, reload: boolean) {
    fieldsdata.value[fieldName].value = event;
    if (reload === undefined || reload) {
        widgetKey.value++;
    }
}

function EmoteAdded(emote: Emote) {
    const emoteTemplate = `<img class="emote" srcset="${emote.srcset}" src="${emote.src}" alt="${emote.name}" />`
    textContent.value!.innerHTML += (emoteTemplate);
}

function GenEventByType(eventData: WidgetEvents) {
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function EditorButtonClicked(clickEvent: any) {
    const eventData = ButtonClicked(clickEvent.field, clickEvent.value);
    parent.postMessage({
        request: 'btnClick',
        data: eventData
    }, '*');
}

function ExpandSidebarGroup(refID: string) {
    if (customFieldsRefs.value[refID]) {
        customFieldsRefs.value[refID].style.display = customFieldsRefs.value[refID].style.display === 'none' ? '' : 'none';
    }
}

function BuildSidebar() {
    const groups: string[] = [];
    Object.keys(fieldsdata.value).forEach(currkey => {
        if (groups.filter(group => group === fieldsdata.value[currkey].group.toString()).length === 0) {
            groups.push(fieldsdata.value[currkey].group.toString());
        }
    });
    customFieldGroups.value = groups;
}

function GetFieldsKeyByGroup(groupName: string) {
    let filteredObject: IndexableType = {};
    Object.keys(fieldsdata.value).forEach(key => {
        if (fieldsdata.value[key].group === groupName) {
            filteredObject[key] = fieldsdata.value[key];
        }
    });
    return Object.keys(filteredObject);
}

function TriggerRandomEvent() {
    let eventData = GenerateRandomEvent();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function TriggerRandomMessage() {
    let eventData = GenerateRandomMessage();
    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);
}

function SendMessage(highlighted = false) {
    if (textContent.value?.innerHTML == '<br>'
        || textContent.value?.innerHTML == ''
    ) return;
    const badgesArr = [];
    if (devKitCache.value.firstBadge && devKitCache.value.firstBadge.type !== 'no-badge-selected') { badgesArr.push(devKitCache.value.firstBadge); }
    if (devKitCache.value.secondBadge && devKitCache.value.secondBadge.type !== 'no-badge-selected') { badgesArr.push(devKitCache.value.secondBadge); }

    if (messageRedeem.value) {
        // Send channel points
        GenEventByType(GenerateChannelPointRedeem({
            amount: messageRedeem.value.amount,
            id: messageRedeem.value.id,
            redemption: messageRedeem.value.redemption,
            name: displayName.value
        }));
    }

    let eventData = GenerateMessageEvent({
        msgTxt: textContent.value!.innerHTML,
        renderedText: textContent.value!.innerHTML,
        name: displayName.value,
        channel: devKitCache.value.sendMsgAsBroadcaster ? displayName.value : 'test_channel',
        badges: badgesArr,
        tags: {
            mod: devKitCache.value.sendMsgAsModerator ? '1' : '0',
            subscriber: devKitCache.value.sendMsgAsSubscriber ? '1' : '0',
            ...(devKitCache.value.sendAsFirstMessage ? {
                "first-msg": '1'
            } : {}),
            ...(highlighted ? {
                "msg-id": 'highlighted-message'
            } : {}),
            ...(messageRedeem.value ? {
                "custom-reward-id": messageRedeem.value.id
            } : {}),
        },
        displayColor: devKitCache.value.displayColor,
        userId: devKitCache.value.userId,
    });

    const event = new CustomEvent('onEventReceived', { detail: eventData });
    widgetPreview.value?.DispatchIframeEvent(event);

    // Only push a new recent message if different from the last message
    if (devKitCache.value.recentMessages[devKitCache.value.recentMessages.length - 1] !== textContent.value?.innerHTML) {
        devKitCache.value.recentMessages.push(textContent.value!.innerHTML);
        if (devKitCache.value.recentMessages.length > 20) {
            devKitCache.value.recentMessages.shift();
        }
    }

    textContent.value!.innerText = '';
    messageRedeem.value = undefined;
    recentMessagePos.value = devKitCache.value.recentMessages.length;
}

function BanRandomUser() {
    let eventData = GenerateBanEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

function DeleteRandomMessage() {
    let eventData = GenerateDeleteMessageEvent();
    widgetPreview.value?.DispatchIframeEvent(eventData);
}

function HandleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && document.activeElement === textContent.value) {
        SendMessage();
        event.preventDefault();
    }
    else if (event.key === 'ArrowUp' && document.activeElement === textContent.value) {

        recentMessagePos.value--;
        if (recentMessagePos.value - 1 < 0) {
            recentMessagePos.value = devKitCache.value.recentMessages.length;
        }

        const recentText = devKitCache.value.recentMessages[recentMessagePos.value];
        textContent.value.innerHTML = recentText;

        event.preventDefault();
    }
    else if (event.key === 'ArrowDown' && document.activeElement === textContent.value) {

        if (recentMessagePos.value + 1 <= devKitCache.value.recentMessages.length - 1) {
            recentMessagePos.value++;
            const recentText = devKitCache.value.recentMessages[recentMessagePos.value];
            textContent.value.innerHTML = recentText;
        }
        else {
            textContent.value.innerHTML = '';
        }
        event.preventDefault();
    }
}

function hideDialog() {
    showDialog.value = false;
    widgetKey.value++;

}

function handleClickOutside(event: PointerEvent) {
    if (showDialog.value && dialogRef.value && !dialogRef.value.contains(event.target)) {
        hideDialog();
    }
}

onMounted(() => {
    BuildSidebar();
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', HandleKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', HandleKeyDown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

</script>


<style>
.fullscreen-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    pointer-events: none;
}

.dialog {
    max-width: 900px;
    max-height: 500px;
    background-color: #bdbdbd;
    box-shadow: 0px 2px 5px 0px #00000096;
    border-radius: 15px;
    padding: 1em;
    box-sizing: border-box;
    pointer-events: all;
    position: relative;
}

.dialog_header {
    font-size: 1.5em;
}

.dialog_tabs {
    display: flex;
    margin-top: 0.5em;
}

.dialog_tab {
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1em;
    position: relative;
    font-weight: 600;
}

.dialog_tab:first-child {
    padding-left: 0;
}

.dialog_tab:last-child {
    padding-right: 0;
}

.dialog_tab.selected {
    color: #00b7ff;
}

.dialog_tab.selected .dialog_underline {
    background-color: #00b7ff;
}

.dialog_underline {
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: 1px;
    background-color: #12121263;
}

.gap-half {
    gap: 0.5em;
}

.dialog_tab .dialog_underline {
    position: absolute;
}

.dialog_content {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    display: flex;
    flex-direction: column;
}

.dialog_content_row {
    display: flex;
}

.dialog_content_cell {
    flex: 1;
    box-sizing: border-box;
}

.dialog_content_cell div {
    white-space: nowrap;
}

.dialog_content_cell .subtitle {
    font-size: 0.8em;
}

.dialog .input-tags {
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
    box-sizing: border-box;
    max-width: 100%;
    overflow-y: scroll;
    position: relative;
    max-height: 100px;
}

.dialog .input-tags .tag {
    background-color: #5e5e5e;
    padding: 0.3em;
    border-radius: 0.4em;
}

.widget-dimensions-input {
    display: flex;
    max-width: 7em;
}

.input-section {
    padding: 16px;
    border-radius: 8px;
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.channel-point-reward {
    padding: 16px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    background-color: #95c1d3;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.text-input {
    width: 100%;
    padding: 10px;
    background-color: white;
    border: 2px #ff62db solid;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    white-space: pre-wrap;
}

.btn-group {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
}

.custom-field-header {
    cursor: pointer;
    background-color: #bdbdbd;
    padding: 10px;
}

.sidebar {
    position: relative;
}

.sidebar-content {
    min-width: 300px;
    max-width: 300px;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    background-color: #dbdbdb;
    z-index: 2;
}

.sidebar-close-btn {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    margin-right: -1.55em;
    top: 0;
    bottom: 0;
    z-index: 1;
}

.sidebar-close-btn-content {
    background-color: #dbdbdb;
    display: flex;
    align-items: center;
    padding: 0.2em;
    min-width: 1.2em;
    min-height: 2em;
    justify-content: end;
    border-radius: 0.5em;
    cursor: pointer;
}

.widget-editor {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
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
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.button {
    padding: 10px;
}

.alert {
    color: rgb(190, 35, 35);
}
</style>