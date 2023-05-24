<template>
  <v-container fluid class="primary fill-height pa-0">
    <map-container ref="container" @click-index="onClickIndex" @ready="readyMap" />
    <div class="menu">
      <v-card class="pa-5 rounded-shaped" min-width="300">
        <home-menu v-if="!page" ref="homeMenu" @selectIndex="loadPage" />
        <page-menu v-if="page" ref="pageMenu" @mapFly="mapFly" @mapFitToPage="mapFitToPage" @focusToInitial="focusToInitial" />
      </v-card>
    </div>
    <v-slide-y-reverse-transition>
      <thumbnail class="thumbnail" v-if="page" />
    </v-slide-y-reverse-transition>
  </v-container>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import MapContainer from '@/components/MapContainer.vue';
import HomeMenu from '@/components/HomeMenu.vue';
import PageMenu from '@/components/PageMenu.vue';
import { LatLng } from 'leaflet';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import Thumbnail from '@/components/Thumbnail.vue';

const store = useAppStore();
const route = useRoute();
const { indexList, page } = storeToRefs(store);
const container: Ref<typeof MapContainer | undefined> = ref(undefined);
const homeMenu: Ref<typeof HomeMenu | undefined> = ref(undefined);
const pageMenu: Ref<typeof PageMenu | undefined> = ref(undefined);
const onClickIndex = (date?: string) => homeMenu.value?.setSelectedIndex(indexList.value.find(item => item.date == date));

await store.getListIndex();

async function loadPage(date: string) {
  if (!date) {
    focusToInitial();
    return;
  }
  await store.loadPage(date);
}

function focusToInitial() {
  homeMenu.value?.removeSelectedIndex()
  store.removePage();
  container.value?.fitToInitial();
}

function mapFly(latLng: LatLng) {
  container.value?.flyTo(latLng);
}

function mapFitToPage() {
  container.value?.fitToPage();
}

function readyMap() {
  const date = route.query.date;
  if (date) {
    const findItem = indexList.value.find(item => item.date == date);
    if (findItem) {
      homeMenu.value?.setSelectedIndex(findItem)
    }
  }
}
</script>

<style>
.menu {
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 1001;
}

.thumbnail {
  position: absolute;
  bottom: 1em;
  left: 2em;
  right: 2em;
  z-index: 1001;
}
</style>