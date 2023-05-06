<template>
    <div v-if="props.movement != null">
        <span v-if="props.movement.walking != 0" class="me-2">
            <v-icon icon="mdi-walk" size="x-small"></v-icon> {{ props.movement.walking }} km
        </span>
        <span v-if="props.movement.bus != 0" class="me-2">
            <v-icon icon="mdi-bus" size="x-small"></v-icon> {{ props.movement.bus }} km
        </span>
        <span v-if="props.movement.train != 0" class="me-2">
            <v-icon icon="mdi-train-car-passenger" size="x-small"></v-icon> {{ props.movement.train }} km
        </span>
        <span v-if="props.movement.airplane != 0" class="me-2">
            <v-icon icon="mdi-airplane-takeoff" size="x-small"></v-icon> {{ props.movement.airplane }} km
        </span>
    </div>
</template>

<script lang="ts" setup>
import { Movement } from '@/model/page';
import { PropType } from 'vue'

const props = defineProps({
    movement: {
        type: Object as PropType<Movement>
    }
})

</script>