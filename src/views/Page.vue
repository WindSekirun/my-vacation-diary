<template>
  <background class="pa-5">
    <v-sheet height="100%" color="rgb(255, 255, 255, 0.6)" class="rounded-xl pa-5">
      <v-icon icon="mdi-arrow-left" @click="onBackClicked()" size="x-large"></v-icon>
      <div class="mt-2" />
      <span class="text-h3 font-weight-medium me-3">{{ formattedDate }}</span>
      <span class="text-h4">in {{ page?.location }}</span>
      <div class="mt-2" />
      <div v-if="page?.movements != null">
        <span v-if="page.movements.walking != 0" class="me-2">
          <v-icon icon="mdi-walk" size="x-small"></v-icon> {{ page.movements.walking }} km
        </span>
        <span v-if="page.movements.bus != 0" class="me-2">
          <v-icon icon="mdi-bus" size="x-small"></v-icon> {{ page.movements.bus }} km
        </span>
        <span v-if="page.movements.train != 0" class="me-2">
          <v-icon icon="mdi-train-car-passenger" size="x-small"></v-icon> {{ page.movements.train }} km
        </span>
        <span v-if="page.movements.airplane != 0" class="me-2">
          <v-icon icon="mdi-airplane-takeoff" size="x-small"></v-icon> {{ page.movements.airplane }} km
        </span>
      </div>

    </v-sheet>
  </background>
</template>
 
<script lang="ts" setup>
import Background from '@/components/Background.vue';
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

console.log(page.value?.movements);

const formattedDate = computed(() => dayjs(page.value?.date, "YYYYMMDD").format('YYYY. MM. DD.'))

function onBackClicked() {
  router.back();
}
</script>