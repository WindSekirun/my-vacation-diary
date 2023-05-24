<template>
    <div>
        <v-row align="center" justify="center">
            <v-col cols="auto">
                <v-btn density="comfortable" variant="text" icon="mdi-chevron-left" @click="clickLeft" :disabled="page?.date == '20230429'"/>
            </v-col>

            <v-col cols="auto">
                <span class="text-h5 font-weight-bold">{{ formatDate(page?.date) }}</span>
            </v-col>

            <v-col cols="auto">
                <v-btn density="comfortable" variant="text" icon="mdi-chevron-right" @click="clickRight" :disabled="page?.date == '20230530'" />
            </v-col>
        </v-row>

        <div class="mt-5" />
        <span class="text-h6">이동 거리</span>
        <movements :movement="page?.movement" />

        <div class="mt-5" />
        <span class="text-h6">장소 바로가기</span>
        <v-select v-model='selectPlace' :items='placeList' item-title="name" solo flat density="compact"
          placeholder="장소 선택" clearable return-object item-value="name" class="mt-2" v-if="geojson">
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>
                {{ item.value.address }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-select>

        <div class="mt-2" />
        <v-btn append-icon="mdi-link-variant" block color="info" class="copyButton" :data-clipboard-text="copyUrl ">링크 복사</v-btn>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { formatDate } from '@/utils/date';
import { storeToRefs } from 'pinia';
import Movements from './Movements.vue';
import { Feature, GeoJsonRoot, Properties } from '@/model/geojson';
import { Ref, computed, ref, watch } from 'vue';
import { distinctByReverse } from '@/utils/array';
import { LatLng } from 'leaflet';
import ClipboardJS from 'clipboard';

const emit = defineEmits<{
    (e: 'mapFly', latLng: LatLng): void,
    (e: 'mapFitToPage'): void
}>()


const store = useAppStore();
const { page, geojson } = storeToRefs(store);
const selectPlace: Ref<Properties | undefined> = ref(undefined);
const geoPointList: Ref<Feature[]> = computed(() => {
    const originalGeoPointList = (geojson.value as GeoJsonRoot).features
        .filter((item) => item.geometry.type == "Point");
    return distinctByReverse(originalGeoPointList, (item) => item.properties.name);
});
const placeList: Ref<Properties[]> = computed(() => geoPointList.value.map((item) => item.properties));
const copyUrl = computed(() => {
  const newUrl = new URL(window.location.origin);
  newUrl.searchParams.append('date', page.value?.date ?? "")
  return newUrl.toString();
})

watch(selectPlace, (value) => {
  if (!value) {
    emit('mapFitToPage');
    return;
  }

  const point = geoPointList.value.find((item) => item.properties.name == value!.name)
  if (!point) return
  const coordinates = point.geometry.coordinates;
  const latLng = new LatLng(coordinates[1], coordinates[0]);
  emit('mapFly', latLng);
})

async function clickLeft() {
    await store.previousPage();
}

async function clickRight() {
    await store.nextPage();
}

const clipboard = new ClipboardJS('.copyButton');
clipboard.on('success', event => {
  alert('링크를 복사했습니다.');
})
</script>