// Utilities
import { ListIndex } from '@/model/listindex'
import { Page } from '@/model/page'
import { defineStore } from 'pinia'
import { getGeoJson, getListIndex, getPage, getStat } from './api'
import { Stat } from '@/model/stat'
import dayjs from 'dayjs'

interface State {
  date: string,
  indexList: ListIndex[]
  page: Page | undefined,
  stat: Stat | undefined,
  geojson: any
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    date: '',
    indexList: [],
    page: undefined,
    stat: undefined,
    geojson: undefined
  }),

  actions: {
    async getListIndex() {
      this.indexList = await getListIndex();
      this.stat = await getStat();
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
    }
  }
})
