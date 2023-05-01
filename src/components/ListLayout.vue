<template>
    <v-responsive class="d-flex align-center text-center fill-height">
        <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" max-width="344" v-bind="props">
                <v-img :src="data.thumbnail" height="200" cover aspect-ratio="1.778"></v-img>

                <v-overlay :model-value="isHovering" contained scrim="#222222" class="align-center justify-center">
                    <span class="text-h5">{{ formattedDate }}</span>
                    <br />
                    <span class="text-h6">in {{ location }}</span>
                    <br />
                    <v-btn variant="flat">자세히 보기</v-btn>
                </v-overlay>
            </v-card>
        </v-hover>
    </v-responsive>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { computed } from 'vue';

const data = defineProps<{
    date: string,
    location: string,
    thumbnail: string
}>()

const formattedDate = computed(() => dayjs(data.date, "YYYYMMDD").format('YYYY.MM.DD'))
</script>
