import * as types from '../types'

const state = {
    generalizeProductList: [], // 商品管理 - 商品列表
    generalizeAccountList:[],  // 用户管理 - 用户列表
    generalizeFodderList: [], // 推广素材 - 列表
}
const mutations = {
    [types.GENERALIZEPRODUCTLIST](state,payload){
        state.generalizeProductList = payload.list
    },
    [types.GENERALIZEACCOUNTLIST](state,payload){
        state.generalizeAccountList = payload.list
    },
    [types.GENERALIZEFODDERLIST](state,payload){
        state.generalizeFodderList = payload.list
    }
}
const getters = {
    generalizeProductList(state){
        return state.generalizeProductList
    },
    generalizeAccountList(state){
        return state.generalizeAccountList
    },
    generalizeFodderList(state){
        return state.generalizeFodderList
    }
}
export default {
    state,
    getters,
    mutations
  }