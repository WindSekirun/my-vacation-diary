export class ListIndex {
    date: string;
    title: string;
    latitude: number;
    longitude: number;

    constructor(date: string, title: string, latitude: number, longitude: number) {
        this.date = date;
        this.title = title;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}