export class Page {
    date?: string;
    geojson?: string;
    movement?: Movement;
    medias?: Media[];
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

export class Media {
    thumbnail: string;
    original: string;
    desc: string;
    latitude: number;
    longitude: number;
    model: string;
    make: string;
    time: string;

    constructor(thumbnail: string, original: string, desc: string, latitude: number, longitude: number, model: string, make: string, time: string) {
        this.thumbnail = thumbnail;
        this.original = original;
        this.desc = desc;
        this.latitude = latitude;
        this.longitude = longitude;
        this.model = model;
        this.make = make;
        this.time = time;
    }
}