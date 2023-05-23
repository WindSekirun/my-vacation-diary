import { ListIndex } from "@/model/listindex";
import { center, points } from "@turf/turf"
import { LatLng } from "leaflet";

export function getCenterOfIndexList(list: ListIndex[]): LatLng {
    const latLngList = list.map(item => [item.latitude, item.longitude]);
    const features = points(latLngList);
    const centerPoint = center(features).geometry.coordinates;
    return new LatLng(centerPoint[0], centerPoint[1]);
}