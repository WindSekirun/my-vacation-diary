import { LatLng } from "leaflet";
import { Movement } from "./page";

export class Stat {
    movement?: Movement
    sum?: number;
    average?: number;
    coordinates?: Coordinate[];
    imageCountAverage?: number;
    imageCount?: number;
}

export class Coordinate {
    date: string = "";
    walking: LatLng[][] = [];
    bus: LatLng[][] = [];
    train: LatLng[][] = [];
    airplane: LatLng[][] = [];
    subway: LatLng[][] = [];
    taxi: LatLng[][] = [];
    drive: LatLng[][] = [];
}