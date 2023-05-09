<template>
    <div class="mt-5">
        <span class="text-h4 font-weight-bold">Gallery</span>
        <lightGallery :settings="gallerySettings" class="mt-2">
            <a v-for="(item, index) in imageMediaList" :data-src="makeUrl(item.original)" :key="index"
                :data-sub-html="`#caption` + index">
                <img :alt="`img` + index" :src="makeUrl(item.thumbnail)" />
            </a>
            <div v-for="(item, index) in imageMediaList" :key="index" style="display:none" :id="`caption` + index">
                <h4>{{ item.original }}</h4>
                <p>
                    A beautiful Sunrise this morning taken En-route to Keswick not one as
                    planned but I'm extremely happy I was passing the right place at the
                    right time....
                </p>
            </div>
        </lightGallery>
    </div>
</template>

<script lang="ts" setup>
import lightGallery from 'lightgallery/vue';
import { PropType } from 'vue'
import { Page, MediaType } from "@/model/page";
import { makeUrl } from '@/store/api';
import { computed } from 'vue';
import { LightGallerySettings } from 'lightgallery/lg-settings';

const props = defineProps({
    page: {
        type: Object as PropType<Page>
    }
})
const gallerySettings: LightGallerySettings = {
    speed: 500,
    plugins: []
}

const imageMediaList = computed(() => props.page?.medias.filter(item => item.type == MediaType.IMAGE));

</script>

<style lang="css">
@import url('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery.css');
@import url('https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lg-zoom.css');
</style>