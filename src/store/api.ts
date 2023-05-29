import { ListIndex } from "@/model/listindex";
import { Page } from "@/model/page";
import { Spot } from "@/model/spot";
import { Stat } from "@/model/stat";
import axios from "axios";

const baseUrl = import.meta.env.PROD ? "https://jvd.kohaku.moe" : "http://localhost:9001"
export const baseWebUrl = import.meta.env.PROD ? "https://jvd.kohaku.moe" : "http://localhost:3000"

const api = axios.create({
    baseURL: baseUrl
});

export async function getListIndex(): Promise<ListIndex[]> {
    const response = await api.get("/contents/index.json")
    return response.data
}

export async function getStat(): Promise<Stat> {
    const response = await api.get("/contents/stat.json")
    return response.data
}

export async function getSpot(): Promise<Spot[]> {
    const response = await api.get("/contents/spot.json")
    return response.data
}

export async function getPage(date: string): Promise<Page> {
    const response = await api.get(`/contents/${date}/index.json`)
    return response.data
}

export function makeUrl(imageUrl: string | undefined) {
    if (!imageUrl) return ''
    return `${baseUrl}/${imageUrl}`
}

export async function getGeoJson(geoJsonUrl: string) {
    const response = await api.get(makeUrl(geoJsonUrl));
    return response.data;
}