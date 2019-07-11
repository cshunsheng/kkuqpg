import * as types from '../types'

const state = {
  groupProductList: [], // 拼团商品列表
  groupSort:[]          //拼团商品排序
}
const mutations = {
  [types.GROUPPRODUCTLIST](state,payload){
    state.groupProductList = payload.list
  },
  [types.GROUPSORT](state,payload){
    state.groupSort=payload.list
  }
}
const getters = {
  groupProductList(state){
    return state.groupProductList
  },
  groupSort(state){
    return state.groupSort
  }
}
export default {
  state,
  getters,
  mutations
}
