import { ListIndex } from "@/model/listindex";
import { Page } from "@/model/page";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD ? "https://jvd.kohaku.moe" : "http://localhost:9001"
});

export async function getListIndex(): Promise<ListIndex[]> {
    const response = await api.get("/contents/index.json")
    return response.data
}

export async function getPage(date: String): Promise<Page> {
    const response = await api.get(`/contents/${date}/index.json`)
    return response.data
}