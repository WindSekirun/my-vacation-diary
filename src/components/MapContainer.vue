<template>
    <l-map ref="map" class="map" :zoom="6" :options="leafletMapOptions" @ready="readyLeaflet">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            :attribution="attribution" />
        <l-control-zoom position="topright" />
        <l-control-attribution position="bottomright" :prefix="prefixAttribution"></l-control-attribution>
        <l-control-scale position="bottomleft" :imperial="true" :metric="false"></l-control-scale>

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
        <l-polyline v-for="(item, index) in coordinateStatList" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker" />

        <!-- page -->
        <l-geo-json v-if="geojson" :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json>

        <l-marker v-for="(item, index) in page?.medias" :key="index" :lat-lng="[item.latitude, item.longitude]"
            ref="mediaMarkers" :icon="mediaMarkerIcon" :name="item.original">
            <l-popup :options="{ minWidth: 200 }">
                <v-list-item class="pa-0">
                    <v-img :src="makeUrl(item.thumbnail)" cover width="200" height="112.5" :aspect-ratio="16 / 9"></v-img>
                    <v-divider />
                    <v-list-item-action>
                        <v-btn class="pa-0" variant="text" @click="clickMediaMarker(item)" block>바로가기</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </l-popup>
        </l-marker>
    </l-map>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlZoom, LControlAttribution, LMarker, LPopup, LGeoJson, LPolyline, LControlScale } from "@vue-leaflet/vue-leaflet";
import { MapOptions, Map, LatLng, LatLngBounds, GeoJSONOptions, marker, Icon } from 'leaflet';
import { Ref, computed, ref, watch } from "vue";
import { formatDate } from "@/utils/date";
import { ListIndex } from "@/model/listindex";
import { Media } from "@/model/page";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import { bbox } from "@turf/turf";
import { getCenterOfIndexList } from "@/utils/geo";
import { makeUrl } from "@/store/api";

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

const emit = defineEmits<{
    (e: 'clickIndex', date: string): void,
    (e: 'ready'): void,
    (e: 'showImageViewer', media: Media): void,
}>()

const store = useAppStore();
const { indexList, page, geojson, stat } = storeToRefs(store);
const mediaMarkers: Ref<typeof LMarker | undefined> = ref(undefined)
const visibleIndexMarker = computed(() => !page.value);
const coordinateStatList = computed(() => stat.value!.coordinates!.map(item => {
    return item.map(item => new LatLng(item[0], item[1]));
}));
const initialCenterPoint = computed(() => getCenterOfIndexList(indexList.value));
const mediaMarkerIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
})
watch(geojson, () => fitToPage());

function readyLeaflet(mapObject: Map) {
    map = mapObject;
    fitToInitial()
    emit('ready')
}

function clickMarker(item: ListIndex) {
    emit('clickIndex', item.date);
}

function clickMediaMarker(item: Media) {
    emit('showImageViewer', item);
}

function fitToInitial() {
    if (initialCenterPoint.value) {
        map?.setZoom(6)
        map?.panTo(initialCenterPoint.value)
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

function flyTo(latLng: LatLng) {
    map?.flyTo(latLng, 16, {
        animate: true,
        duration: 0.3
    })
}

function focusToMediaMarker(media: Media) {
    const index = page.value?.medias?.indexOf(media) ?? -1;
    const list = mediaMarkers.value;
    if (index != -1 && list) {
        map?.setZoom(18);
        map?.panTo(new LatLng(media.latitude, media.longitude));
        list[index].leafletObject.openPopup();
    }
}

defineExpose({
    fitToInitial, flyTo, fitToPage, focusToMediaMarker
})
</script>

<style>
.map {
    width: 100%;
    height: 100%;
}
</style>