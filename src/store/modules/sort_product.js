import * as types from '../types'

const state = {
  sortProduct: [], // 父分类列表
  sortSubList:[],  //子分类列表
}
const mutations = {
  [types.SORTPSRLIST](state,payload){
    state.sortProduct = payload.list
  },
  [types.SORTSUBLIST](state,payload){
    state.sortSubList=payload.list
  }
}
const getters = {
  sortProduct(state){
    return state.sortProduct
  },
  sortSubList(state){
    return state.sortSubList
  }
}
export default {
  state,
  getters,
  mutations
}
