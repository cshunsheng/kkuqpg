/**
 * 进销存管理
 */
import * as types from '../types'
const state = {
  pageSize: 20,
  currentPage: 1,
  stock_inputVal: '', //搜索关键字
  stockList:[], //入库列表
  stockTotal: 0, //入库总数
  stockOutList:[], //出库列表
  stockOutTotal: 0, //出库总数

  attrList:[],
  attrTotal:0,


  //商品库列表
  ProList:[],
  ProTotal:0,
  ProInputVal:'',
  stockList_searchVal: '',
  outsearchval:'',
  supListNum: 1 //记录供应商翻页记录
}

const getters = {
  stockList: state => state.stockList,
  stockTotal: state => state.stockTotal,
  stock_inputVal: state => state.stock_inputVal,
  stockList_searchVal: state => state.stockList_searchVal,
  stockOutList: state => state.stockOutList,
  stockOutTotal: state => state.stockOutTotal,
  outsearchval: state => state.outsearchval,


  attrList: state => state.attrList,
  attrTotal: state => state.attrTotal,

  supListNum: state => state.supListNum,
  //商品库列表
  //ProList: state => state.ProList,

  ProList: state => {
    let flattedList = []
    for (let i = 0; i < state.ProList.length; i++) {
      for (let j = 0; j < state.ProList[i].stock_info.length; j++) {
        let title = state.ProList[i].stock_info[j]
        /* console.info(title) */
        let isStart = (j == 0)
        let total = state.ProList[i].stock_info.length
        flattedList.push(
          Object.assign({total:total, start:isStart}, title, state.ProList[i], {
           /*  recommend_amount: title.recommend_amount,
            cost_amount:title.cost_amount */
          })
        )
      }
    }
    //console.info(flattedList)
    return flattedList
  },
  ProTotal: state => state.ProTotal,
  ProInputVal: state => state.ProInputVal,
}

const actions = {
  STOCKLIST:({commit})=>{
    commit('STOCKLIST')
  },
  STOCKTOTAL:({commit})=>{
    commit('STOCKTOTAL')
  },
  STOCKINPUTVALUE: ({ commit }, data) => {
    commit('STOCKINPUTVALUE', data) //stock
  },
  STOCKOUTLIST:({commit})=>{
    commit('STOCKOUTLIST')
  },
  STOCKOUTTOTAL:({commit})=>{
    commit('STOCKOUTTOTAL')
  },
  STOCKLISTSEARCHVAL: ({ commit }, data) => {
    commit('STOCKLISTSEARCHVAL', data) //stock
  },
  OUTSERACHVAL:({ commit }, data) => {
    commit('OUTSERACHVAL', data) //stock
  },

  ATTRLIST:({commit})=>{
    commit('ATTRLIST')
  },
  ATTRTOTAL:({commit})=>{
    commit('ATTRTOTAL')
  },


  //商品库列表
  PROLIST:({commit})=>{
    commit('PROLIST')
  },
  PROTOTAL:({commit})=>{
    commit('PROTOTAL')
  },
  PROINPUTVALUE: ({ commit }, data) => {
    commit('PROINPUTVALUE', data) //pro
  },
}

const mutations = {
  [types.GETBASELIST]: (state, payload) => {
    if (payload.type.includes('search')) {
      state.currentPage = 1
    }
  },
  [types.CHANGEPAGE]: (state, payload) => {
    state.currentPage = payload.currentPage
  },
  [types.STOCKLIST]: (state, payload) => {
    state.stockList = payload.list
  },
  [types.STOCKTOTAL]: (state, payload) => {
    state.stockTotal = payload.total
  },
  [types.STOCKINPUTVALUE]: (state, payload) => {
    console.info(`STOCKINPUTVALUE ${JSON.stringify(payload)}`)
    state.stock_inputVal = payload.inputVal //supplier input
  },
  [types.STOCKOUTLIST]: (state, payload) => {
    state.stockOutList = payload.list
  },
  [types.STOCKOUTTOTAL]: (state, payload) => {
    state.stockOutTotal = payload.total
  },
  [types.STOCKLISTSEARCHVAL]: (state, payload) => {
    state.stockList_searchVal = payload.inputVal //supplier input
  },
  [types.OUTSERACHVAL]: (state, payload) => {
    state.outsearchval = payload.inputVal //supplier input
  },

  [types.ATTRLIST]: (state, payload) => {
    state.attrList = payload.list
  },
  [types.ATTRTOTAL]: (state, payload) => {
    state.attrTotal = payload.total
  },
  [types.SUPLISTNUM]: (state, payload) => {
    state.supListNum = payload.num
  },

  //商品管理
  [types.PROLIST]: (state, payload) => {
    state.ProList = payload.list
  },
  [types.PROTOTAL]: (state, payload) => {
    state.ProTotal = payload.total
  },
  [types.PROINPUTVALUE]: (state, payload) => {
    console.info(`STOCKINPUTVALUE ${JSON.stringify(payload)}`)
    state.ProInputVal = payload.ProInputVal //pro input
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
