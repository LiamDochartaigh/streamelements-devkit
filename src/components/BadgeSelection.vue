<template>
    <Dialog v-model:model-value="dialog" :title="`Select Badge`">
        <template #activator="{ props }">
            <div style="width: 20px">
                <button v-bind="props">
                    <template v-if="badge === 'no-badge-selected'">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </template>
                    <template v-else>
                        <img style="width: 100%;" :src="fetchedBadge.url" />
                    </template>
                </button>
            </div>
        </template>
        <div>
            <button style="cursor: pointer;" v-for="(badge, index) in customBadges" @click="selectBadge(index)">
                <template v-if="badge.set_id === 'no-badge-selected'">
                    <svg width="72" height="72" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                            clip-rule="evenodd"></path>
                    </svg>
                </template>
                <template v-else>
                    <img :src="badge.versions[0].image_url_4x" />
                </template>
            </button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import badges from '@/assets/globalTwitchBadges.json'
import { Badge } from '@/types/widget-types';

const dialog = ref(false);

const noBadgeSelected: typeof badges.data[number][] = [{
    set_id: 'no-badge-selected',
    versions: [{
        description: 'No Badge',
        id: 'no-badge-selected',
        image_url_4x: '',
        click_action: 'no-action',
        click_url: '',
        image_url_1x: '',
        image_url_2x: '',
        title: 'No Badge',
    }]
}];

const customBadges = ref(noBadgeSelected.concat(badges.data));

const props = defineProps({
    badge: {
        type: String,
        default: 'broadcaster'
    }
});

const fetchedBadge = computed(() => {
    const fetched = customBadges.value.find(badge => badge.set_id === props.badge);
    const mapFn = (badge: typeof badges.data[number]) => {
        return {
            description: badge.versions[0].description,
            type: badge.set_id,
            url: badge.versions[0].image_url_4x,
            version: badge.versions[0].id
        } as Badge
    }
    if (!fetched) return mapFn(noBadgeSelected[0]);
    return mapFn(fetched);
});

function selectBadge(index: number) {
    const badgeSelected = customBadges.value[index];
    emit('badgeSelected', {
        description: badgeSelected.versions[0].description,
        type: badgeSelected.set_id,
        url: badgeSelected.versions[0].image_url_4x,
        version: badgeSelected.versions[0].id
    } as Badge);
    dialog.value = false;
}

const emit = defineEmits<{
    badgeSelected: [Badge]
}>()

onMounted(() => {
    emit('badgeSelected', fetchedBadge.value);
});
</script>

<style scoped></style>