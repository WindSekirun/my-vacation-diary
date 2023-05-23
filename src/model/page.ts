export class Page {
    date?: string;
    location?: string;
    geojson?: string;
    movements?: Movement;
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
    thumbnail?: string;
    original?: string;
    desc?: string;
    latitude?: number;
    longtitude?: number;
    model?: number;
    make?: number;
    time?: number;
}