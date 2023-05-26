import { ListIndex } from "@/model/listindex";
import { Feature, Point, Properties, center, destination, point, points } from "@turf/turf"
import { LatLng, LatLngBounds } from "leaflet";

export function getCenterOfIndexList(list: ListIndex[]): LatLng {
    const latLngList = list.map(item => [item.latitude, item.longitude]);
    const features = points(latLngList);
    const centerPoint = center(features);
    return pointToLatLng(centerPoint);
}

export function pointToLatLng<P = Properties>(feature: Feature<Point, P>): LatLng {
    const coordinates = feature.geometry.coordinates;
    return new LatLng(coordinates[0], coordinates[1]);
}

export function findCenterBound(latLng: LatLng): LatLngBounds {
    const southWest = findDestination(latLng, 240, 0.5);
    const northEast = findDestination(latLng, 60, 0.5);
    console.log(`${latLng.lat}, ${latLng.lng}`);
    console.log(`${southWest.lat}, ${southWest.lng}`)
    console.log(`${northEast.lat}, ${northEast.lng}`)
    return new LatLngBounds(southWest, northEast);
}

export function findDestination(latLng: LatLng, bearing: number, distance: number) {
    const radLatitude = toRadian(latLng.lat);
    const radLongitude = toRadian(latLng.lng);
    const radAngle = toRadian(bearing);
    const distRadius = distance / 6371.01;

    // φ2 = asin( sin φ1 ⋅ cos δ + cos φ1 ⋅ sin δ ⋅ cos θ )
    // λ2 = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos φ1, cos δ − sin φ1 ⋅ sin φ2 )
    // φ is lat, λ is lng, θ is the bearing (clockwise from N),
    // δ is the angular dist d/R; d being the dist travelled, R the earth’s radius
    const latitude = Math.asin(Math.sin(radLatitude) * Math.cos(distRadius) +
        Math.cos(radLatitude) * Math.sin(distRadius) * Math.cos(radAngle));
    let longitude = radLongitude + Math.atan2(Math.sin(radAngle) * Math.sin(distRadius) * Math.cos(radLatitude),
        Math.cos(distRadius) - Math.sin(radLatitude) * Math.sin(latitude));

    // normalize
    longitude = (longitude + 540) % 360 - 180;
    return new LatLng(toDegree(latitude), toDegree(longitude))
}

export function toRadian(number: number) {
    return number * Math.PI / 180.0
}

export function toDegree(number: number) {
    return number * 180.0 / Math.PI
}