<template>
  <background class="pa-5">
    <v-sheet height="100%" color="rgb(255, 255, 255, 0.6)" class="rounded-xl pa-5">
      <v-icon icon="mdi-arrow-left" @click="onBackClicked()" size="x-large"></v-icon>
      <div class="mt-3" />
      <span class="text-h3 font-weight-bold">About</span>
      <div class="mt-3" />
      The source code of this site (My Vaction Diary) is released under the GPLv3 license.<br />
      <a href="https://github.com/WindSekirun/my-vacation-diary">WindSekirun/my-vacation-diary</a>
      <div class="mt-2" />
    </v-sheet>
  </background>
</template>
 
<script lang="ts" setup>
import Background from '@/components/Background.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function onBackClicked() {
  router.back();
}
</script>