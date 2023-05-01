<template>
  <Suspense>
    <v-main>
      <router-view />
    </v-main>

    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
  //
</script>
