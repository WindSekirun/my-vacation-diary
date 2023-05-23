// Utilities
import { ListIndex } from '@/model/listindex'
import { Page } from '@/model/page'
import { defineStore } from 'pinia'
import { getListIndex, getPage, getStat } from './api'
import { Stat } from '@/model/stat'

interface State {
  date: string,
  indexList: ListIndex[]
  page: Page | undefined,
  stat: Stat | undefined,
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    date: '',
    indexList: [],
    page: undefined,
    stat: undefined,
  }),

  actions: {
    async getListIndex() {
      this.indexList = await getListIndex();
      this.stat = await getStat();
    },

    async loadPage(date: string) {
      this.date = date;
      this.page = await getPage(date);
    }
  }
})
