export class Spot {
    title: string;
    date: string;
    desc: string;
    link: string;
    thumb: string;
    latitude: number;
    longitude: number;

    constructor(title: string, date: string, desc: string, link: string, thumb: string, latitude: number, longitude: number) {
        this.title = title;
        this.date = date;
        this.desc = desc;
        this.link = link;
        this.thumb = thumb;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}