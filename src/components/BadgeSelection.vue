<template>
    <Dialog v-model:model-value="dialog" :title="`Select Badge`">
        <template #activator="{ props }">
            <button v-bind="props">
                <div style="width: 20px">
                    <img style="width: 100%;" :src="badge.url" />
                </div>
            </button>
        </template>

        <div>
            <button style="cursor: pointer;" v-for="(badge, index) in badges.data" @click="selectBadge(index)">
                <img :src="badge.versions[0].image_url_4x" />
            </button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import badges from '@/assets/globalTwitchBadges.json'
import { Badge } from '@/types/widget-types';
import { PropType } from 'vue';

const dialog = ref(false);

const props = defineProps({
    badge: {
        type: Object as PropType<Badge>,
        default: badges.data.filter(badge => badge.set_id === 'broadcaster')
            .map(badge => ({
                description: badge.versions[0].description,
                type: badge.set_id,
                url: badge.versions[0].image_url_4x,
                version: badge.versions[0].id
            } as Badge))[0]
    }
});

function selectBadge(index: number) {
    const badgeSelected = badges.data[index];
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
    emit('badgeSelected', props.badge);
});
</script>

<style scoped></style>