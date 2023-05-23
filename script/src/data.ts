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