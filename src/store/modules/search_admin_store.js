/**
 * 搜索运营
 */

import * as types from '../types'

const state = {
    //关键字列表
    keywordList: [],

    //销量列表
    salesList: [],
    //下拉商品列表
    productList: []

}

const getters = {
    keywordList: state => state.keywordList,

    salesList: state => state.salesList,

    productList: state => state.productList,
}

const actions = {
    GETKEYWORDLIST: ({commit})=>{
        commit(types.GETKEYWORDLIST)
    },

    DELETEKEYWORD: ({commit})=> {
        commit(types.DELETEKEYWORD)
    },

    GETSALESLIST: ({commit})=> {
        commit(types.GETSALESLIST)
    },

    DELETESALES: ({commit})=> {
        commit(types.DELETESALES)
    },

    GETPRODUCTLIST: ({commit})=> {
        commit(types.GETPRODUCTLIST)
    }
}

const mutations = {
    [types.GETKEYWORDLIST]: (state, payload)=>{
        state.keywordList = payload.data
    },

    [types.DELETEKEYWORD]: (state, payload)=>{
        const newList = state.keywordList
        newList.splice(newList.findIndex((item)=>{
            return item.id == payload.id
        }), 1)
        state.keywordList = newList
    },

    [types.GETSALESLIST]: (state, payload)=>{
        state.salesList = payload.data.rank_list
    },

    [types.DELETESALES]: (state, payload)=> {
        const newList = state.salesList
        newList.splice(newList.findIndex((item)=>{
            return item.id == payload.id
        }), 1)
        state.salesList = newList
    },

    [types.GETPRODUCTLIST]: (state, payload)=> {
        state.productList = payload.data
    }

}

export default {
  state,
  getters,
  actions,
  mutations
}
