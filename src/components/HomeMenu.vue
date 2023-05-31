<template>
    <div>
        <span class="text-h5 font-weight-bold">My Vacation Diary</span> <br />
        <span class="text-caption">2023. 04. 29 - 2023. 05. 30</span>
        <v-select v-model='selectedIndex' :items='indexList' item-title="date" solo density="comfortable"
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
        <span class="text-h5">통계</span>
        <movements :movement="stat?.movement" class="mb-2" />
        <ul class="ms-5 mb-5">
            <li>
                방문한 장소: 총 {{ stat?.sum }}개 ({{ stat?.average }}/D)
            </li>
            <li>
                촬영한 이미지: 총 {{ stat?.imageCount }}개 ({{ stat?.imageCountAverage }}/D)
            </li>
        </ul>
        <span class="text-h5 mt-5">경로 필터</span>
        <v-row style="width: 300px;" class="ps-3 pb-3 mt-1">
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.walking" density="compact" hide-details label="도보" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.drive" density="compact" hide-details label="운전" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.bus" density="compact" hide-details label="버스" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.train" density="compact" hide-details label="전철" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.subway" density="compact" hide-details color="#000" label="지하철" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.airplane" density="compact" hide-details color="#000" label="비행기" />
            </v-col>
            <v-col cols="auto" class="pa-0 me-1">
                <v-checkbox v-model="initialCoordinate.taxi" density="compact" hide-details color="#000" label="택시" />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { formatDate } from "@/utils/date";
import { Ref, ref, watch } from 'vue';
import { ListIndex } from '@/model/listindex';
import Movements from '@/components/Movements.vue';

const store = useAppStore();
const { indexList, stat, initialCoordinate } = storeToRefs(store);
const selectedIndex: Ref<ListIndex | undefined> = ref(undefined);

const emit = defineEmits<{
    (e: 'selectIndex', date: string): void
}>()

watch(selectedIndex, (value) => emit('selectIndex', value?.date ?? ""));

function removeSelectedIndex() {
    if (selectedIndex.value) {
        selectedIndex.value = undefined;
    }
}

function setSelectedIndex(index: ListIndex) {
    selectedIndex.value = index
}

defineExpose({
    removeSelectedIndex, setSelectedIndex
})
</script>