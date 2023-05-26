<template>
    <l-map ref="map" class="map" :zoom="12" :options="leafletMapOptions" @ready="readyLeaflet">
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

const centerLatLng = computed(() => new LatLng(props.media!.latitude, props.media!.longitude))

function readyLeaflet(mapObject: Map) {
    mapObject.setZoom(12);
    mapObject.fitBounds(findCenterBound(centerLatLng.value));
    mapObject.panTo(centerLatLng.value, { animate: true })
}

</script>