<template>
  <full-page ref="fullpage" :options="options" id="fullpage">
    <div class="section">
      <v-container class="fill-height">
        <v-responsive class="d-flex align-center text-center fill-height">
            
        </v-responsive>
      </v-container>
    </div>
    <div class="section">
      <v-row>
        <v-col v-for="(item, index) in list" :key="index" cols="12" sm="3">
          <list-layout :date="item.date" :thumbnail="item.thumbnail" :location="item.location" />
        </v-col>
      </v-row>
    </div>
  </full-page>
</template>

<script lang="ts" setup>
import ListLayout from '@/components/ListLayout.vue';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const store = useAppStore();

const { list } = storeToRefs(store);

const options = {
  anchors: ['page1', 'page2'],
  sectionsColor: ['#222222', '#111111']
}

await store.getListIndex();
</script>
