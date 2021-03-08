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
} from '@/api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locationTreeList: [],
    chosenItem: {},
    locationTable: [],
    selectedLocation: [],
  },
  actions: {
    async queryLocationTreeList({ commit }) {
      try {
        const { data = [] } = await axios.get(queryLocationTreeUrl)
        commit('SET_LOCATION_TREE', data)
      } catch {
        console.log('err location tree')
      }
    },

    async addLocationTreeService({ commit }, payload) {
      try {
        const res = await axios.post(addLocationTreeUrl, payload)
        return res
      } catch {
        console.log('err add locatoin tree')
      }
    },

    async deleteLocationTreeService({ commit }, id) {
      try {
        const res = await axios.get(deleteLocationTreeUrl + id)
        return res
      } catch {
        console.log('err delete location tree')
      }
    },

    async queryLocationTableList({ commit }, params) {
      try {
        const { data = [] } = await axios({ method: 'get', url: queryLocationTableUrl, params })
        commit('SET_LOCATION_TABLE', data)
      } catch {
        console.log('err location table')
      }
    },

    async addLocationService({ commit }, payload) {
      try {
        const res = await axios.post(addLocationUrl, payload)
        return res
      } catch {
        console.log('err add locatoin')
      }
    },

    async deleteLocationService({ commit }, id) {
      try {
        const res = await axios.post(deleteLocationUrl, id)
        return res
      } catch {
        console.log('err delete locatoin')
      }
    },

    async searchLocationService({ commit }, params) {
      try {
        const res = await axios.post(searchLocationUrl, params)
        return res
      } catch {
        console.log('err search locatoin')
      }
    },

    async queryGoodsService({ commit }, params) {
      try {
        const { data = [] } = await axios({ method: 'get', url: queryGoodsUrl, params })
        return data
      } catch {
        console.log('err err table')
      }
    },

    async searchGoodsService({ commit }, params) {
      try {
        const res = await axios.post(searchGoodsUrl, params)
        return res
      } catch {
        console.log('err search locatoin')
      }
    },

    async updateLocationService({ commit }, params) {
      try {
        const res = await axios.post(locationUpdateUrl, params)
        return res
      } catch {
        console.log('err update locatoin')
      }
    },
  },
  mutations: {
    SET_LOCATION_TREE: (state, payload) => {
      const res = [{ name: '<<当前仓库>>', kqList: payload, id: 0, isf: 1, type: 'head' }]
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
  },
})
