<template>
  <v-card>
    <v-responsive :aspect-ratio="17 / 9" max-height="500">
      <l-map ref="map" :zoom="14" :options="leafletMapOptions" @ready="readyLeaflet">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
          name="OpenStreetMap"></l-tile-layer>
        <l-geo-json :geojson="geojson" :options="geoJsonLayerOptions"></l-geo-json>
        <l-control :position="'bottomleft'" class="map-watermark">
          {{ props.page?.location }}
        </l-control>
      </l-map>
    </v-responsive>
    <v-row class="mt-2 ms-2 me-2">
      <v-col xs="6" sm="6"  md="2">
        <v-btn color="info" block @click="fitToCenter()">Fit to center</v-btn>
      </v-col>
      <v-col xs="6" sm="6" md="10">
        <v-select v-model='selectPlace' :items='placeList' item-title="name" solo flat density="compact"
          placeholder="Select place" clearable return-object item-value="name">
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle>
                {{ item.value.address }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import "leaflet/dist/leaflet.css";
import { LGeoJson, LMap, LTileLayer, LControl } from "@vue-leaflet/vue-leaflet";
import { getGeoJson } from "@/store/api"
import { bbox } from '@turf/turf';
import { GeoJSONOptions, LatLng, LatLngBounds, Map, MapOptions, marker } from "leaflet";
import { GeoJsonRoot, Properties } from "@/model/geojson";
import { distinctByReverse } from "@/utils/array";
import { Ref, ref, watch } from "vue";
import { PropType } from 'vue'
import { Page } from "@/model/page";

const props = defineProps({
  page: {
    type: Object as PropType<Page>
  }
})

const leafletMapOptions: MapOptions = {
  scrollWheelZoom: false,
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

let map: Map | null = null;
const selectPlace: Ref<Properties | undefined> = ref(undefined);

const geojson = await getGeoJson(props.page!.geojson);
const originalGeoPointList = (geojson as GeoJsonRoot).features
  .filter((item) => item.geometry.type == "Point");

const geoPointList = distinctByReverse(originalGeoPointList, (item) => item.properties.name);
const placeList = geoPointList.map((item) => item.properties);

function readyLeaflet(mapObject: Map) {
  map = mapObject;
  fitToCenter();
}

function fitToCenter() {
  // bbox extent in minX, minY, maxX, maxY order
  // [ 126.44069569999999, 37.4423662, 141.67868869999998, 43.2015095 ]
  const box = bbox(geojson)
  const southWest = new LatLng(box[1], box[0])
  const northEast = new LatLng(box[3], box[2])
  const bounds = new LatLngBounds(southWest, northEast)
  map?.fitBounds(bounds)
  selectPlace.value = undefined;
}

watch(selectPlace, (value) => {
  if (!value) {
    fitToCenter()
    return;
  }

  const point = geoPointList.find((item) => item.properties.name == value!.name)
  console.log(selectPlace.value)
  console.log(point)
  if (!point) return
  const coordinates = point.geometry.coordinates;
  const latLng = new LatLng(coordinates[1], coordinates[0]);
  map?.flyTo(latLng, 16, {
    animate: true,
    duration: 0.3
  })
})
</script>

<style>
.map-watermark {
  font-size: 150%;
  font-weight: bolder;
  color: #2e3440;
  text-shadow: #555;
}
</style>