// Utilities
import { ListIndex } from '@/model/listindex'
import { Page } from '@/model/page'
import { defineStore } from 'pinia'
import { getListIndex, getPage } from './api'

interface State {
  date: string,
  list: ListIndex[]
  page: Page | undefined
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    date: '',
    list: [],
    page: undefined
  }),

  actions: {
    async getListIndex() {
      this.list = await getListIndex()
    },

    async loadPage(date: string) {
      this.date = date
      this.page = await getPage(date)
    }
  }
})
