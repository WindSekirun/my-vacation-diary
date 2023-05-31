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
        <l-polyline v-for="(item, index) in initialWalkingCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.walking" />
        <l-polyline v-for="(item, index) in initialBusCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.bus" />
        <l-polyline v-for="(item, index) in initialTrainCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.train" />
        <l-polyline v-for="(item, index) in initialAirplaneCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.airplane" />
        <l-polyline v-for="(item, index) in initialSubwayCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.subway" />
        <l-polyline v-for="(item, index) in initialTaxiCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.taxi" />
        <l-polyline v-for="(item, index) in initialDriveCoordinates" :key="index" :lat-lngs="item"
            :visible="visibleIndexMarker && initialCoordinate.drive" />
        <l-marker v-for="(item, index) in spot" :key="index" :lat-lng="[item.latitude, item.longitude]"
            :visible="visibleIndexMarker || item.date == page?.date" :icon="spotMarkerIcon">
            <l-popup :options="{ minWidth: 400 }">
                <v-list-item class="pa-0">
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mb-2">
                        {{ formatDate(item.date) }}
                    </v-list-item-subtitle>
                    <span class="text-caption">{{ item.desc }}</span>
                    <v-img :src="makeUrl(item.thumb)" class="mt-2" cover :aspect-ratio="16 / 10" height="200" />
                    <v-divider />
                    <v-list-item-action>
                        <v-btn class="pa-0" block variant="text" @click="clickSpotLink(item)">링크 열기</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </l-popup>
        </l-marker>

        <!-- page -->
        <l-geo-json v-if="geojson" :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json>

        <l-marker v-for="(item, index) in page?.medias" :key="index" :lat-lng="[item.latitude, item.longitude]"
            ref="mediaMarkers" :icon="mediaMarkerIcon" :name="item.original">
            <l-popup :options="{ minWidth: 200 }">
                <v-list-item class="pa-0">
                    <v-img :src="makeUrl(item.thumbnail)" cover width="200" height="112.5" :aspect-ratio="16 / 9"></v-img>
                    <v-divider />
                    <v-list-item-action>
                        <v-btn class="pa-0" variant="text" @click="clickMediaMarker(item)" block>확대보기</v-btn>
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
import { Spot } from "@/model/spot";

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
}>()

const store = useAppStore();
const { indexList, page, geojson, stat, spot, initialCoordinate } = storeToRefs(store);
const mediaMarkers: Ref<typeof LMarker | undefined> = ref(undefined)
const visibleIndexMarker = computed(() => !page.value);
const initialWalkingCoordinates = computed(() => stat.value?.coordinates?.map(item => item.walking).flat());
const initialBusCoordinates = computed(() => stat.value?.coordinates?.map(item => item.bus).flat());
const initialTrainCoordinates = computed(() => stat.value?.coordinates?.map(item => item.train).flat());
const initialAirplaneCoordinates = computed(() => stat.value?.coordinates?.map(item => item.airplane).flat());
const initialSubwayCoordinates = computed(() => stat.value?.coordinates?.map(item => item.subway).flat());
const initialTaxiCoordinates = computed(() => stat.value?.coordinates?.map(item => item.taxi).flat());
const initialDriveCoordinates = computed(() => stat.value?.coordinates?.map(item => item.drive).flat());

const initialCenterPoint = computed(() => getCenterOfIndexList(indexList.value));
const mediaMarkerIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
});
const spotMarkerIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png"
});
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
    store.setDetailMedia(item);
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
    map?.fitBounds(bounds, {
        paddingTopLeft: [20, 20],
        paddingBottomRight: [20, 20]
    })
}

function flyTo(latLng: LatLng) {
    map?.flyTo(latLng, 16, {
        animate: true,
        duration: 0.3
    })
}

function clickSpotLink(item: Spot) {
    window.open(item.link, '_blank', 'noreferrer');
}

defineExpose({
    fitToInitial, flyTo, fitToPage
})
</script>

<style>
.map {
    width: 100%;
    height: 100%;
}
</style>