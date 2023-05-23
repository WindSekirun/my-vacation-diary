<template>
    <div v-if="props.movement != null" class="ms-5">
        <ul>
            <li>
                <span v-if="props.movement.walking != 0">
                    <v-icon icon="mdi-walk" size="x-small"></v-icon> {{ props.movement.walking }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.drive != 0">
                    <v-icon icon="mdi-car" size="x-small"></v-icon> {{ props.movement.drive }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.bus != 0">
                    <v-icon icon="mdi-bus" size="x-small"></v-icon> {{ props.movement.bus }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.train != 0">
                    <v-icon icon="mdi-train-car-passenger" size="x-small"></v-icon> {{ props.movement.train }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.subway != 0">
                    <v-icon icon="mdi-subway" size="x-small"></v-icon> {{ props.movement.subway }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.airplane != 0">
                    <v-icon icon="mdi-airplane-takeoff" size="x-small"></v-icon> {{ props.movement.airplane }} km
                </span>
            </li>
            <li>
                <span v-if="props.movement.taxi != 0">
                    <v-icon icon="mdi-taxi" size="x-small"></v-icon> {{ props.movement.taxi }} km
                </span>
            </li>
        </ul>
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