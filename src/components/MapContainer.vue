<template>
    <l-map ref="map" class="map" :zoom="6" :options="leafletMapOptions" @ready="readyLeaflet">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            :attribution="attribution" />
        <l-control-zoom position="topright" />
        <l-control-attribution position="bottomright" :prefix="prefixAttribution"></l-control-attribution>

        <!-- initial marker -->
        <l-marker v-for="(item, index) in indexList" :key="index" :lat-lng="[item.latitude, item.longitude]"
            :visible="visibleIndexMarker">
            <l-popup :options="{ minWidth: 200 }">
                <v-list-item class="pa-0">
                    <v-list-item-title>
                        {{ formatDate(item.date) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ item.title }}
                    </v-list-item-subtitle>
                </v-list-item>
            </l-popup>
        </l-marker>

        <!-- page -->
        <!-- <l-geo-json :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json>  -->
    </l-map>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlZoom, LControlAttribution, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { MapOptions, Map, LatLng, LatLngBounds } from 'leaflet';
import { PropType, Ref, computed, ref } from "vue";
import { Page } from "@/model/page";
import { formatDate } from "@/utils/date";
import { ListIndex } from "@/model/listindex";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";

let map: Map | null = null;
const leafletMapOptions: MapOptions = {
    zoomControl: false,
    attributionControl: false,
}
const prefixAttribution = '<a href="https://github.com/WindSekirun/my-vacation-diary">WindSekirun/my-vacation-diary</a>'
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://leafletjs.com/">Leaflet</a>'

const props = defineProps({
    center: {
        type: Object as PropType<LatLng>
    }
})
const emit = defineEmits(['ready']);
const store = useAppStore();
const { indexList, page } = storeToRefs(store);
const visibleIndexMarker = computed(() => !page.value);

function readyLeaflet(mapObject: Map) {
    map = mapObject;
    if (props.center) {
        map?.panTo(props.center)
    }
    emit('ready')
}

function clickMarker(item: ListIndex) {

}

// defineExpose({
//     initialSetup
// })
</script>

<style>
.map {
    width: 100%;
    height: 100%;
}
</style>