<template>
    <div v-if="props.movement != null" class="ms-5">
        <ul>
            <li v-if="props.movement.walking && props.movement.walking != 0">
                <v-icon icon="mdi-walk" size="x-small" /> 도보 {{ formatNumber(props.movement.walking) }} km
            </li>
            <li v-if="props.movement.drive && props.movement.drive != 0">
                <v-icon icon="mdi-car" size="x-small" /> 운전 {{ formatNumber(props.movement.drive) }} km
            </li>
            <li v-if="props.movement.bus && props.movement.bus != 0">
                <v-icon icon="mdi-bus" size="x-small" /> 버스 {{ formatNumber(props.movement.bus) }} km
            </li>
            <li v-if="props.movement.train && props.movement.train != 0">
                <v-icon icon="mdi-train-car-passenger" size="x-small" /> 전철 {{ formatNumber(props.movement.train) }} km
            </li>
            <li v-if="props.movement.subway && props.movement.subway != 0">
                <v-icon icon="mdi-subway" size="x-small" /> 지하철 {{ formatNumber(props.movement.subway) }} km
            </li>
            <li v-if="props.movement.airplane && props.movement.airplane != 0">
                <v-icon icon="mdi-airplane-takeoff" size="x-small" /> 비행기 {{ formatNumber(props.movement.airplane) }} km
            </li>
            <li v-if="props.movement.taxi && props.movement.taxi != 0">
                <v-icon icon="mdi-taxi" size="x-small" /> 택시 {{ formatNumber(props.movement.taxi) }} km
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

function formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

</script>