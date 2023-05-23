// Utilities
import { ListIndex } from '@/model/listindex'
import { Page } from '@/model/page'
import { defineStore } from 'pinia'
import { getGeoJson, getListIndex, getPage, getStat } from './api'
import { Stat } from '@/model/stat'

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
    }
  }
})
