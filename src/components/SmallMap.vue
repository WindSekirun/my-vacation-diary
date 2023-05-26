<template>
    <l-map ref="map" class="map" :zoom="16" :center="[props.media!.latitude, props.media!.longitude]"
        :max-bounds="findCenterBound(centerLatLng)" :options="leafletMapOptions" @ready="readyLeaflet">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" />
        <l-marker :lat-lng="centerLatLng" />
    </l-map>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { Media } from '@/model/page';
import { PropType } from 'vue';
import { MapOptions, Map, LatLng } from "leaflet";
import { computed } from "vue";
import { findCenterBound } from "@/utils/geo";

const props = defineProps({
    media: {
        type: Object as PropType<Media>
    }
});

const leafletMapOptions: MapOptions = {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: false,

}

let map: Map | null = null;
const centerLatLng = computed(() => new LatLng(props.media!.latitude, props.media!.longitude))

function readyLeaflet(mapObject: Map) {
    map = mapObject;
    setTimeout(() => map?.invalidateSize(), 200);
}
</script>