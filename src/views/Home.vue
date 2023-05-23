<template>
  <v-container fluid class="primary fill-height pa-0">
    <map-container ref="container" />
    <div class="floated">
      <v-card class="pa-3" width="350">
        <span class="text-h5 font-weight-bold">My Vacation Diary</span>
        <v-select v-model='selectedIndex' :items='indexList' item-title="name" solo flat density="compact"
          placeholder="Select place" clearable return-object item-value="name">
        </v-select>

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

const router = useRouter();
const route = useRoute();
const store = useAppStore();
const { indexList } = storeToRefs(store);
const selectedIndex: Ref<ListIndex | undefined> = ref(undefined);

await store.getListIndex();


</script>
<style>
.floated {
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 1001;
}
</style>