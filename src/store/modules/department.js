import * as types from '../types'

const state = {
  departmentList: [], // 父分类列表
  departmentPro:[],  //子分类列表
}
const mutations = {
  [types.DEPARTMENTLIST](state,payload){
    state.departmentList = payload.list
  },
  [types.DEPARTMENTPRO](state,payload){
    state.departmentPro=payload.list
  }
}
const getters = {
  departmentList(state){
    return state.departmentList
  },
  departmentPro(state){
    return state.departmentPro
  }
}
export default {
  state,
  getters,
  mutations
}
