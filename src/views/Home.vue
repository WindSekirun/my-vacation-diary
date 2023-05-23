<template>
  <v-container fluid class="primary fill-height pa-0">
    <map-container ref="container" :center="getCenterOfIndexList(indexList)" @click-index="onClickIndex" />
    <div class="floated">
      <v-card class="pa-5 rounded-shaped" min-width="500">
        <span class="text-h5 font-weight-bold">My Vacation Diary</span>
        <v-select v-model='selectedIndex' :items='indexList' item-title="date" solo flat density="compact"
          placeholder="날짜 선택" clearable return-object item-value="date" class="mt-3">
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>
                {{ item.value.title }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
          <template #selection="{ item }">
            {{ formatDate(item.value.date) }} :: {{ item.value.title }}
          </template>
        </v-select>
        <v-btn class="text-h6 pa-0" variant="text" @click="expandStat = !expandStat"
          :append-icon="expandStat ? 'mdi-menu-up' : 'mdi-menu-down'">
          통계
        </v-btn>

        <v-expand-transition>
          <div v-if="expandStat">
            <movements :movement="stat?.movement" />
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
const { indexList, stat } = storeToRefs(store);
const container: Ref<typeof MapContainer | undefined> = ref(undefined);
const selectedIndex: Ref<ListIndex | undefined> = ref(undefined);
const expandStat = ref(true);
const onClickIndex = (date?: string) => selectedIndex.value = indexList.value.find(item => item.date == date);
watch(selectedIndex, (value) => loadPage(value?.date ?? ""));

await store.getListIndex();

async function loadPage(date: string) {
  if (!date) {
    store.removePage();
    container.value?.fitToInitial()
    return;
  }
  await store.loadPage(date);
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