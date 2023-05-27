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
        <ul class="ms-5">
            <li>
                방문한 장소: 총 {{ stat?.sum }}개 ({{ stat?.average }}/D)
            </li>
            <li>
                촬영한 이미지: 총 {{ stat?.imageCount }}개 ({{ stat?.imageCountAverage }}/D)
            </li>
        </ul>
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
const { indexList, stat } = storeToRefs(store);
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