export class Page {
    date: string;
    location: string;
    searchIndex: string;
    kml: string;
    thumbnail: string;
    original: string;
    movements: Movement;
    medias: Media[];

    constructor(date: string, location: string, searchIndex: string, kml: string, thumbnail: string, original: string, movement: Movement, medias: Media[]) {
        this.date = date;
        this.location = location;
        this.searchIndex = searchIndex;
        this.kml = kml;
        this.thumbnail = thumbnail;
        this.original = original;
        this.movements = movement;
        this.medias = medias;
    }
}

export class Movement {
    walking?: number;
    bus?: number;
    train?: number;
    airplane?: number;
}

export class Media {
    thumbnail: string;
    original: string;
    type: MediaType;
    desc: string;
    device: string;
    
    constructor(thumbnail: string, original: string, type: MediaType, desc: string, device: string) {
        this.thumbnail = thumbnail;
        this.original = original;
        this.type = type;
        this.desc = desc;
        this.device = device;
    }
}

export enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}