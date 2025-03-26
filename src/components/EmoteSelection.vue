<template>
    <Dialog :title="`Select an Emote`">
        <template #activator="{ props }">
            <div v-bind="props" style="width: 20px">
                <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" role="presentation"
                    aria-hidden="true" focusable="false" class="ScIconSVG-sc-1q25cff-1 jpczqG">
                    <g>
                        <path
                            d="M7 11a1 1 0 100-2 1 1 0 000 2zM14 10a1 1 0 11-2 0 1 1 0 012 0zM10 14a2 2 0 002-2H8a2 2 0 002 2z">
                        </path>
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z" clip-rule="evenodd">
                        </path>
                    </g>
                </svg>
            </div>
        </template>

        <div>
            <button style="cursor: pointer;" v-for="emote in emotes" :key="emote.name" @click="selectEmote(emote.name)">
                <img :srcset="emote.srcset" :src="emote.src" :alt="emote.name" />
            </button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import emotes from '@/assets/emotes.json'
import { Emote } from '@/types/widget-types';

const typedEmotes: { [key: string]: Emote } = emotes;

function selectEmote(emoteName: string) {
    emit('emoteSelected', typedEmotes[emoteName])
}

const emit = defineEmits<{
    emoteSelected: [Emote]
}>()
</script>

<style scoped></style>