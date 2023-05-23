<template>
  <v-container fluid class="primary fill-height pa-0">
    <map-container ref="container" :center="getCenterOfIndexList(indexList)" @click-index="onClickIndex" />
    <div class="floated">
      <v-card class="pa-5 rounded-shaped" min-width="300">
        <span class="text-h5 font-weight-bold">My Vacation Diary</span>
        <v-select v-model='selectedIndex' :items='indexList' item-title="date" solo flat density="compact"
          placeholder="날짜 선택" clearable return-object item-value="date" class="mt-5">
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>
                {{ item.value.title }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
          <template #selection="{ item }">
            {{ formatDate(item.value.date) }}
          </template>
        </v-select>

        <div v-if="page" class="mb-10">
          <!-- <v-btn @click="revertToInitial()" variant="text" class="pa-0" prepend-icon="mdi-arrow-left">{{ formatDate(page.date)
          }}</v-btn> -->
          <movements :movement="page.movement" />
          <!-- <v-select></v-select> -->
        </div>

        <v-expand-transition>
          <div v-if="visibleStat">
            <span class="text-h5">통계</span>
            <movements :movement="stat?.movement" class="mb-2" />
            방문한 장소: 총 {{ stat?.sum }}개 (평균 {{ stat?.average }}개)
          </div>
        </v-expand-transition>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ListIndex } from '@/model/listindex';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MapContainer from '@/components/MapContainer.vue';
import { getCenterOfIndexList } from '@/utils/geo';
import { onMounted } from 'vue';
import { formatDate } from "@/utils/date";
import Movements from '@/components/Movements.vue';
import { watch } from 'vue';

const router = useRouter();
const route = useRoute();
const store = useAppStore();
const { indexList, stat, page } = storeToRefs(store);
const container: Ref<typeof MapContainer | undefined> = ref(undefined);
const selectedIndex: Ref<ListIndex | undefined> = ref(undefined);
const visibleStat = ref(true);
const onClickIndex = (date?: string) => selectedIndex.value = indexList.value.find(item => item.date == date);
watch(selectedIndex, (value) => loadPage(value?.date ?? ""));

await store.getListIndex();

async function loadPage(date: string) {
  if (!date) {
    revertToInitial();
    return;
  }
  await store.loadPage(date);
  visibleStat.value = false;
}

function revertToInitial() {
  if (selectedIndex.value) {
    selectedIndex.value = undefined;
  }
  store.removePage();
  container.value?.fitToInitial();
  visibleStat.value = true;
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