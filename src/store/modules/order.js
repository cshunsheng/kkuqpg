import * as types from '../types'

const state = {
    orderList: []        // 订单列表
    ,productList: []      // 订单商品列表
    ,orderNote: {}        // 填写订单备注
    ,orderConditions: {}      // 筛选条件
    ,orderListQuerys: { // 订单列表所需参数
        beginDate: "",  // 开始时间 可传空
        endDate: "",    // 结束时间 可传空
        ignore_test: 1, // 忽略测试订单 - 1:忽略, 0:不忽略
        status: [],     // 状态
        source: [],     // 来源
        type: [],       // 类型
        num: 1,         // 页
        size: 30,        // 一页多少条
        key_word_type: "",
        key_word: "",
        virtual: ''
    },
    chaDate:[],
    cSearch: {
        type: "",
        value: ""
    },
    chConditions: {
        chStatus: [],
        chSource: [],
        chType: [],
        chaDate: [],
        chShopVirtual: ''
    },
    filterTest: true // true: 忽略测试订单
}

const mutations = {
    [types.ORDERLIST](state, payload){
        state.orderList = payload.val
    },
    [types.ORDERLISTQUERYS](state, payload){
        state.orderListQuerys = payload.val
    },
    [types.CHADATE](state, payload){
        state.chaDate = payload.val
    },
    [types.CSEARCH](state, payload){
        state.cSearch.type = payload.type;
        state.cSearch.value = payload.val;
    },
    [types.CCONDITIONS](state, payload){
        state.chConditions.chStatus = payload.status;
        state.chConditions.chSource = payload.source;
        state.chConditions.chType = payload.type;
        state.chConditions.chaDate = payload.date; 
        state.chConditions.chchShopVirtual = payload.virtual;
    },
    [types.FILTERTEST](state,payload){
        state.filterTest = payload
    }
}

const getters = {
    orderList(state) {
        return state.orderList;
    },
    orderConditions(state) {
        return state.orderConditions;
    },
    orderListQuerys(state) {
        return state.orderListQuerys;
    },
    chaDate(state) {
        return state.chaDate;
    },
    cSearch(state) {
        return state.cSearch;
    },
    chConditions(state) {
        return state.chConditions;
    },
    filterTest(state) {
        return state.filterTest
    }
}

export default {
    state,
    getters,
    mutations
  }