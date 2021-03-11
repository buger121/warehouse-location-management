import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import {
  queryLocationTreeUrl,
  addLocationTreeUrl,
  deleteLocationTreeUrl,
  queryLocationTableUrl,
  addLocationUrl,
  deleteLocationUrl,
  searchLocationUrl,
  queryGoodsUrl,
  searchGoodsUrl,
  locationUpdateUrl,
  setGoodsUrl,
} from '@/api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locationTreeList: [],
    chosenItem: {},
    locationTable: [],
    selectedLocation: [],
    chooseGoods: [],
    locationPageInfo: {
      total: 0,
      pageSize: 10,
      currentPage: 1,
    },
    LOADING: false,
  },
  actions: {
    async queryLocationTreeList({ commit }) {
      try {
        commit('SHOW_LOADING')
        const { data = [] } = await axios.get(queryLocationTreeUrl)
        commit('HIDE_LOADING')
        commit('SET_LOCATION_TREE', data)
      } catch {
        console.log('err location tree')
      }
    },

    async addLocationTreeService({ commit }, payload) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(addLocationTreeUrl, payload)
        commit('HIDE_LOADING')
        return res
      } catch {
        console.log('err add locatoin tree')
      }
    },

    async deleteLocationTreeService({ commit }, id) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.get(deleteLocationTreeUrl + id)
        commit('HIDE_LOADING')
        return res
      } catch {
        console.log('err delete location tree')
      }
    },

    async queryLocationTableList({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const res = await axios({ method: 'get', url: queryLocationTableUrl, params })
        commit('HIDE_LOADING')
        commit('SET_LOCATION_TABLE', res.data.list)
        return res.data
      } catch {
        console.log('err location table')
      }
    },

    async addLocationService({ commit }, payload) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(addLocationUrl, payload)
        commit('HIDE_LOADING')
        return res
      } catch {
        console.log('err add locatoin')
      }
    },

    async deleteLocationService({ commit }, id) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(deleteLocationUrl, id)
        commit('HIDE_LOADING')
        return res
      } catch {
        console.log('err delete locatoin')
      }
    },

    async searchLocationService({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(searchLocationUrl, params)
        commit('HIDE_LOADING')
        return res.data
      } catch {
        console.log('err search locatoin')
      }
    },

    async queryGoodsService({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const res = await axios({ method: 'get', url: queryGoodsUrl, params })
        commit('HIDE_LOADING')
        return res.data
      } catch {
        console.log('err err table')
      }
    },

    async searchGoodsService({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(searchGoodsUrl, params)
        commit('HIDE_LOADING')
        return res.data
      } catch {
        console.log('err search locatoin')
      }
    },

    async updateLocationService({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const res = await axios.post(locationUpdateUrl, params)
        commit('HIDE_LOADING')
        return res
      } catch {
        console.log('err update locatoin')
      }
    },

    async setGoodsService({ commit }, params) {
      try {
        commit('SHOW_LOADING')
        const { data = [] } = await axios.post(setGoodsUrl, params)
        commit('HIDE_LOADING')
        return data
      } catch {
        console.log('err err table')
      }
    },
  },
  mutations: {
    SET_LOCATION_TREE: (state, payload) => {
      const res = [{ name: '<<当前仓库>>', kqList: payload, id: 0, isf: 2, type: 'head' }]
      state.locationTreeList = res
    },
    SET_CHOSEN_ITEM: (state, data) => {
      state.chosenItem = data
    },
    SET_LOCATION_TABLE: (state, data) => {
      state.locationTable = data
    },
    SET_SELECTED_LOCATION: (state, data) => {
      state.selectedLocation = data
    },
    SHOW_LOADING: (state) => {
      state.LOADING = true
    },
    HIDE_LOADING: (state) => {
      state.LOADING = false
    },
    SET_LOCATION_PAGE: (state, pageInfo) => {
      state.locationPageInfo = pageInfo
    },
    SET_CHOOSE_GOODS: (state, goods) => {
      state.chooseGoods = goods
    },
  },
})
