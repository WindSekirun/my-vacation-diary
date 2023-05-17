<template>
    <div class="mt-5">
        <span class="text-h4 font-weight-bold">Gallery</span>
        <div ref="galleryContainer" class="inline-gallery-container mt-5"></div>
        <v-row class="mt-5 mb-5">
            <v-col v-for="(item, index) in imageMediaList" :key="index" cols="1">
                <v-img :src="makeUrl(item.thumbnail)" aspect-ratio="1" cover class="bg-grey-lighten-2"
                    @click="clickThumbnail(index)" />
            </v-col>
        </v-row>
        <div v-for="(item, index) in imageMediaList" :key="index" style="display:none" :id="`caption` + index">
            <h4>on </h4>
        </div>
    </div>
</template>

<script lang="ts" setup>
import lightGallery from 'lightgallery';
import { PropType, ref } from 'vue'
import { Page, MediaType } from "@/model/page";
import { makeUrl } from '@/store/api';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { GalleryItem } from 'lightgallery/lg-utils';
import { LightGallery } from 'lightgallery/lightgallery';

const props = defineProps({
    page: {
        type: Object as PropType<Page>
    }
})

const galleryContainer = ref(null as HTMLElement | null);
let innerGallery: LightGallery | null = null;
const imageMediaList = computed(() => props.page?.medias.filter(item => item.type == MediaType.IMAGE));

onMounted(() => {
    const container = galleryContainer.value as HTMLElement
    const elements: GalleryItem[] = imageMediaList.value!.map((item, index) => {
        return {
            src: makeUrl(item.original),
            thumb: makeUrl(item.thumbnail),
            subHtml: `#caption${index}`,
            alt: `img${index}`
        }
    })

    innerGallery = lightGallery(container, {
        speed: 500,
        plugins: [],
        container: container,
        dynamic: true,
        hash: false,
        closable: false,
        showMaximizeIcon: true,
        dynamicEl: elements
    })

    innerGallery.openGallery();
})

function clickThumbnail(index: number) {
    const gallery = innerGallery as unknown as LightGallery
    if (!gallery) {
        return;
    }
    gallery.slide(index);
}


</script>

<style lang="css">
@import url('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery.css');
@import url('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lg-zoom.css');

.inline-gallery-container {
    width: 100%;
    height: 0;
    padding-bottom: 45%;
}
</style>