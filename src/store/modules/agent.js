import * as types from '../types'
const state = {
  agentAccountList: [], // 代理商列表
  agentAccountTotal: 0, // 代理商总数
  docSerList: [], // 医生服务列表
  docOrderList: [], // 医生服务订单
  orderPar: {},
  orderInfo: {},
  orderRemark: [],

  //医生列表
  filterDocs:[]
}
const actions = {}
const mutations = {
  [types.AGENTACCOUNTLIST](state, payload) {
    state.agentAccountList = payload.list
  },
  [types.AGENTACCOUNTTOTAl]: (state, payload) => {
    state.agentAccountTotal = payload.total
  },
  [types.DOCSERLIST](state, payload) {
    state.docSerList = payload.list
  },
  [types.DOCORDERLIST](state, payload) {
    state.docOrderList = payload.list
  },
  //服务订单
  [types.ORDERPAR]: (state, payload) => {
    state.orderPar = payload.total
  },
  [types.ORDERINFO](state, payload) {
    state.orderInfo = payload.list
  },
  [types.ORDERREARK](state, payload) {
    state.orderRemark = payload.list
  },
  //医生列表
  [types.FILTERDOCS](state, payload) {
    state.filterDocs = payload.list
  }
}
const getters = {
  agentAccountList: state => state.agentAccountList,
  agentAccountTotal: state => state.agentAccountTotal,
  docSerList: state => {
    let flattedList = []
    for (let i = 0; i < state.docSerList.length; i++) {
      for (let j = 0; j < state.docSerList[i].title_list.length; j++) {
        let title = state.docSerList[i].title_list[j]
        //console.info(title)
        let isStart = (j == 0)
        let total = state.docSerList[i].title_list.length
        flattedList.push(
          Object.assign({total:total, start:isStart}, title, state.docSerList[i], {
            recommend_amount: title.recommend_amount,
            cost_amount:title.cost_amount
          })
        )
      }
    }
    //console.info(flattedList)
    return flattedList
  },
  docOrderList: state => state.docOrderList,
  orderPar: state => state.orderPar,
  orderInfo: state => state.orderInfo,
  orderRemark: state => state.orderRemark,

  filterDocs: state => state.orderRemark,
}
export default {
  state,
  getters,
  actions,
  mutations
}
