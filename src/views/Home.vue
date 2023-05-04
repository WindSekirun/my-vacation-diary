<template>
  <full-page ref="fullpage" :options="options" id="fullpage">
    <div class="section main">
      <v-container class="fill-height">
        <v-responsive class="d-flex align-center">
          <span class="text-h2 font-weight-bold">My Vacation Diary</span>
          <div class="mt-3" />
          <span class="text-h4">A travelogue of monthly</span>
          <div class="mt-0" />
          <span class="text-h6">2023. 04. 29 - 2023. 05. 30 by @WindSekirun</span>
          <div class="mt-5" />
          <v-responsive max-width="400">
            <v-text-field v-model="searchText" label="Search" variant="solo" append-inner-icon="mdi-magnify"
              single-line hide-details @click:append-inner="onSearchClicked()"></v-text-field>
          </v-responsive>
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
import { ref } from 'vue';

const store = useAppStore();
const { list } = storeToRefs(store);
const searchText = ref('');

const options = {
  licenseKey: "gplv3-license",
  anchors: ['page1', 'page2'],
  sectionsColor: ['#ffffff', '#eeeeee'],
}

await store.getListIndex();

function onSearchClicked() {
  // TODO: Filter list index
}
</script>

<style>
.main {
  background: url('../assets/main_background.avif');
  background-size: cover;
  height: 100vh;
}
</style>