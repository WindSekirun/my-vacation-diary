<template>
  <background class="pa-5">
    <v-sheet height="100%" color="rgb(255, 255, 255, 0.6)" class="rounded-xl pa-5 scroll">
      <v-icon icon="mdi-arrow-left" @click="onBackClicked()" size="x-large"></v-icon>
      <div class="mt-2" />
      <span class="text-h3 font-weight-medium me-3">{{ formattedDate }}</span>
      <span class="text-h4">in {{ page?.location }}</span>
      <div class="mt-2" />
      <div v-if="page?.movements != null">
        <movements :movement="page.movements" />
      </div>
      <leaflet-map class="mt-5" v-if="page != null" :page="page" />
      <!-- <gallery v-if="page != null" :page="page" /> -->
    </v-sheet>
  </background>
</template>
 
<script lang="ts" setup>
import Background from '@/components/Background.vue';
import LeafletMap from '@/components/LeafletMap.vue';
import Movements from '@/components/Movements.vue';
import { useAppStore } from '@/store/app';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const store = useAppStore();
const route = useRoute();
const { page } = storeToRefs(store);

const routeDate = route.params.date as string;
await store.loadPage(routeDate)

const formattedDate = computed(() => dayjs(page.value?.date, "YYYYMMDD").format('YYYY. MM. DD.'))

function onBackClicked() {
  router.back();
}
</script>

<style>
.scroll {
  overflow-y: auto;
}
</style>