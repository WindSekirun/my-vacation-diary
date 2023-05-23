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
                    <v-list-item-subtitle class="mb-2">
                        {{ item.title }}
                    </v-list-item-subtitle>
                    <v-divider />
                    <v-list-item-action>
                        <v-btn class="pa-0" variant="text" @click="clickMarker(item)">바로가기</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </l-popup>
        </l-marker>

        <!-- page -->
        <l-geo-json v-if="geojson" :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json>
    </l-map>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlZoom, LControlAttribution, LMarker, LPopup, LGeoJson } from "@vue-leaflet/vue-leaflet";
import { MapOptions, Map, LatLng, LatLngBounds, GeoJSONOptions, marker } from 'leaflet';
import { PropType, computed, watch } from "vue";
import { formatDate } from "@/utils/date";
import { ListIndex } from "@/model/listindex";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { bbox } from "@turf/turf";

let map: Map | null = null;
const leafletMapOptions: MapOptions = {
    zoomControl: false,
    attributionControl: false,
}
const geoJsonLayerOptions: GeoJSONOptions = {
    pointToLayer: function (geoJsonPoint: any, latlng: LatLng) {
        const target = marker(latlng, {
            title: geoJsonPoint.properties.name,
        });
        target.bindPopup(`${geoJsonPoint.properties.name} - ${geoJsonPoint.properties.address}`)
        return target
    }
}
const prefixAttribution = '<a href="https://github.com/WindSekirun/my-vacation-diary">WindSekirun/my-vacation-diary</a>'
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://leafletjs.com/">Leaflet</a>'

const props = defineProps({
    center: {
        type: Object as PropType<LatLng>
    }
})
const emit = defineEmits<{
    (e: 'clickIndex', date: string): void
}>()

const store = useAppStore();
const { indexList, page, geojson } = storeToRefs(store);
const visibleIndexMarker = computed(() => !page.value);
watch(geojson, () => fitToPage());

function readyLeaflet(mapObject: Map) {
    map = mapObject;
    fitToInitial()
}

function clickMarker(item: ListIndex) {
    emit('clickIndex', item.date);
}

function fitToInitial() {
    if (props.center) {
        map?.setZoom(6)
        map?.panTo(props.center)
    }
}

function fitToPage() {
    if (!geojson || !geojson.value) return
    // bbox extent in minX, minY, maxX, maxY order
    // [ 126.44069569999999, 37.4423662, 141.67868869999998, 43.2015095 ]
    const box = bbox(geojson.value)
    const southWest = new LatLng(box[1], box[0])
    const northEast = new LatLng(box[3], box[2])
    const bounds = new LatLngBounds(southWest, northEast)
    map?.fitBounds(bounds)
}

defineExpose({
    fitToInitial
})
</script>

<style>
.map {
    width: 100%;
    height: 100%;
}
</style>