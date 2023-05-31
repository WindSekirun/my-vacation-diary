import { Media } from "./media";

export class Data {
    date?: string;
    geojson?: string;
    movement?: Movement;
    medias: Media[];
}

export class Movement {
    walking?: number;
    bus?: number;
    train?: number;
    airplane?: number;
    subway?: number;
    taxi?: number;
    drive?: number;
}

export type LatLng = number[];

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

export class Stat {
    movement?: Movement
    sum?: number;
    average?: number;
    coordinates?: Coordinate[];
    imageCount?: number;
    imageCountAverage?: number;
}