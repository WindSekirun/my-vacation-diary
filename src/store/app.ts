// Utilities
import { ListIndex } from '@/model/listindex'
import { Media, Page } from '@/model/page'
import { defineStore } from 'pinia'
import { getGeoJson, getListIndex, getPage, getSpot, getStat } from './api'
import { Stat } from '@/model/stat'
import dayjs from 'dayjs'
import { Spot } from '@/model/spot'

interface State {
  date: string,
  indexList: ListIndex[]
  page: Page | undefined,
  stat: Stat | undefined,
  spot: Spot[] | undefined,
  geojson: any,
  detailMedia: Media | undefined,
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    date: '',
    indexList: [],
    page: undefined,
    stat: undefined,
    spot: undefined,
    geojson: undefined,
    detailMedia: undefined,
  }),

  actions: {
    async getListIndex() {
      this.indexList = await getListIndex();
      this.stat = await getStat();
      this.spot = await getSpot();
    },

    async loadPage(date: string) {
      this.date = date;
      this.page = await getPage(date);
      this.geojson = await getGeoJson(this.page!.geojson || "")
    },

    removePage() {
      this.date = "";
      this.page = undefined;
      this.geojson = undefined;
    },

    async previousPage() {
      const newDate = dayjs(this.date, "YYYYMMDD").add(-1, 'day').format("YYYYMMDD");
      if (newDate != '20230428') {
        this.loadPage(newDate)
      }
    },

    async nextPage() {
      const newDate = dayjs(this.date, "YYYYMMDD").add(1, 'day').format("YYYYMMDD");
      if (newDate != '20230531') {
        this.loadPage(newDate)
      }
    },

    setDetailMedia(media: Media) {
      this.detailMedia = media
    },

    removeDetailMedia() {
      this.detailMedia = undefined;
    },

  }
})
