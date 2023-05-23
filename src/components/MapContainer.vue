<template>
    <l-map ref="map" class="map" :zoom="14" :options="leafletMapOptions" @ready="readyLeaflet">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" :attribution="attribution" />
        <l-control-zoom position="topright" />
        <l-control-attribution position="bottomright" :prefix="prefixAttribution"></l-control-attribution>
        <!-- <l-geo-json :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json> -->
    </l-map>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlZoom, LControlAttribution } from "@vue-leaflet/vue-leaflet";
import { MapOptions, Map, LatLng, LatLngBounds } from 'leaflet';
import { PropType } from "vue";
import { Page } from "@/model/page";

let map: Map | null = null;

const leafletMapOptions: MapOptions = {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false,
}
const prefixAttribution = '<a href="https://github.com/WindSekirun/my-vacation-diary">WindSekirun/my-vacation-diary</a>'
const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="https://leafletjs.com/">Leaflet</a>'

function readyLeaflet(mapObject: Map) {
    map = mapObject;

    // 기본 위치 설정
    const southWest = new LatLng(34.612981223659446, 138.15003080797183);
    const northEast = new LatLng(36.07136559435007, 140.735302583135);
    const bounds = new LatLngBounds(southWest, northEast)
    map?.fitBounds(bounds)
}

</script>

<style>
.map {
    width: 100%;
    height: 100%;
}
</style>