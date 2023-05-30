<template>
    <v-overlay v-model="visible">
        <v-container fluid fill-height class="primary pa-0 background">
            <v-img :src="makeUrl(detailMedia?.original)" class="image-container" />
            <v-row class="menu-container pe-8 ps-8 pt-6 pb-3">
                <span class="text-height-h6" style="color: #999">{{ mediaIndex }}</span>
                <v-spacer></v-spacer>
                <v-icon icon="mdi-close" color="#999" size="large" @click="clickCloseIcon" />
            </v-row>
            <v-responsive class="info pa-5" width="300">
                <span class="text-h6">{{ title }}</span> <br />
                <span class="text-body-1">{{ formatDateTime(detailMedia?.time) }}</span> <br />
                <span class="text-body-2">{{ detailMedia?.model }}</span> <br />
                <v-divider class="mt-2 mb-2"></v-divider>
                <span class="text-caption" v-if="detailMedia?.desc"> {{ detailMedia?.desc }}</span>
                <v-divider class="mt-2 mb-5" v-if="detailMedia?.desc"></v-divider>
                <small-map :media="detailMedia" style="height: 100px" />
            </v-responsive>
            <thumbnail class="thumbnail" :padding-top="40" @click-item="clickThumbnailItem" ref="thumbnail" />
        </v-container>
    </v-overlay>
</template>

<script setup lang="ts">
import { Media } from '@/model/page';
import { makeUrl } from '@/store/api';
import { Ref, computed, ref, watch } from 'vue'
import Thumbnail from './Thumbnail.vue';
import SmallMap from './SmallMap.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { useKeypress } from "vue3-keypress";

const store = useAppStore();
const { page, detailMedia } = storeToRefs(store);
const thumbnail: Ref<typeof Thumbnail | undefined> = ref(undefined);
const visible = ref(true);
const title = computed(() => {
    const fileName = detailMedia.value?.original.split("/").at(-1);
    return fileName?.substring(0, fileName.lastIndexOf('.'));
});
const mediaIndex = computed(() => `${(page.value?.medias?.indexOf(detailMedia.value!) ?? 0) + 1} / ${page.value?.medias?.length}`)
dayjs.extend(utc);
watch(detailMedia, (media) => {
    thumbnail.value?.focusIndex(page.value?.medias?.indexOf(media!));
})

useKeypress({
    keyEvent: "keydown",
    keyBinds: [
        {
            keyCode: "left",
            success: () => keyDown(-1),
        },
        {
            keyCode: "right",
            success: () => keyDown(1),
        },
    ],
    isActive: detailMedia
});

function clickThumbnailItem(item: Media) {
    store.setDetailMedia(item);
}

function clickCloseIcon() {
    store.removeDetailMedia();
}

function formatDateTime(date: string | undefined) {
    return dayjs.utc(date).format("YYYY. MM. DD. HH:mm:ss")
}

function keyDown(direction: number) {
    const list = page.value?.medias;
    if (!list) return;

    const index = list.indexOf(detailMedia.value!);
    const item = list.at(index + direction);
    if (item) {
        store.setDetailMedia(item);
    } else if (direction == 1) {
        store.setDetailMedia(list[0]);
    }
}
</script>

<style>
.background {
    background-color: #222222;
}

.thumbnail {
    bottom: 1rem;
    left: 2rem;
    right: 2rem;
}

.menu-container {
    background-color: #222222;
    position: absolute;
    top: 0rem;
    left: 0rem;
    right: 0rem;
    z-index: 1001;
}

.image-container {
    height: 100vh;
    padding-top: 3rem;
    padding-bottom: 10%;
}

.info {
    position: absolute;
    top: 3.3rem;
    left: 1rem;
    z-index: 1001;
    border: 0.5px solid white;
    color: #e2e2e2;
}
</style>