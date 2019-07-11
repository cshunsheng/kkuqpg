/**
 * 进销存管理
 */
import * as types from '../types'
const state = {
  pageSize: 20,
  currentPage: 1,
  refundList:[], //入库列表
  refundTotal: 0, //入库总数
}

const getters = {
  refundList: state => state.refundList,
  refundTotal: state => state.refundTotal,
}

const actions = {
  REFUNDLIST:({commit})=>{
    commit('REFUNDLIST')
  },
  REFUNDTOTAL:({commit})=>{
    commit('REFUNDTOTAL')
  },
}
const mutations = {
  [types.REFUNDLIST]: (state, payload) => {
    state.refundList = payload.list
  },
  [types.REFUNDTOTAL]: (state, payload) => {
    state.refundTotal = payload.total
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
