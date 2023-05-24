<template>
  <v-container fluid class="primary fill-height pa-0">
    <map-container ref="container" @click-index="onClickIndex" @ready="readyMap" />
    <div class="floated">
      <v-card class="pa-5 rounded-shaped" min-width="300">
        <home-menu v-if="!page" ref="homeMenu" @selectIndex="loadPage" />
        <page-menu v-if="page" ref="pageMenu" />
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import MapContainer from '@/components/MapContainer.vue';
import HomeMenu from '@/components/HomeMenu.vue';
import PageMenu from '@/components/PageMenu.vue';

const store = useAppStore();
const { indexList, page } = storeToRefs(store);
const container: Ref<typeof MapContainer | undefined> = ref(undefined);
const homeMenu: Ref<typeof HomeMenu | undefined> = ref(undefined);
const pageMenu: Ref<typeof PageMenu | undefined> = ref(undefined);
const onClickIndex = (date?: string) => homeMenu.value?.setSelectedIndex(indexList.value.find(item => item.date == date));

await store.getListIndex();

async function loadPage(date: string) {
  if (!date) {
    revertToInitial();
    return;
  }
  await store.loadPage(date);
}

function revertToInitial() {
  homeMenu.value?.removeSelectedIndex()
  store.removePage();
  container.value?.fitToInitial();
}

function readyMap() {
  // 테스트용 코드
  homeMenu.value?.setSelectedIndex(indexList.value.find(item => item.date == '20230522'))
}
</script>

<style>
.floated {
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 1001;
}
</style>