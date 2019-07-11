/**
 * 进销存管理
 */
import * as types from '../types'
const state = {
  pageSize: 20,
  currentPage: 1,
  inputVal: '', //搜索关键字
  formData1: {
    id_supplier: '', // 供应商id
    name: '', // 供应商地址
    address: '', // 产地
    contact_name: '', // 对接人姓名
    mobile_phone: '', // 对接人电话
    email: '', // 邮箱
    bank_account_number: '', // 银行打款账号
    user_name:'',//户名
    bank_name:'',//打款银行名称
    business_license:[],//营业执照
    licence:[],//许可证
    authorization:[],//授权书
    remark:'',//备注
    manufacturer: [],//品牌列表
  },
  manufacturer_list: [], // 选择的品牌
 

  supplierList:[], //供应商列表
  supListTotal: 0, // 组合商品总数
  manufacturer_list: [], // 选择的商品分类

  buessImg: [],
  licence: [],
  authorization: [],
}

const getters = {
  // pageSize: state => Number(state.pageSize),
  // currentPage: state => Number(state.currentPage),
  inputVal: state => state.inputVal,

  formData1: state => state.formData1,
  buessImg: state => state.buessImg,
  licence: state => state.licence,
  authorization: state => state.authorization,
  supplierList: state => state.supplierList,
  manufacturer_list: state => state.manufacturer_list,
  supListTotal: state => state.supListTotal,
}

const actions = {
  SUPPLIERLIST:({commit})=>{
    commit('SUPPLIERLIST')
  },
  SUPLISTTOTAL:({commit})=>{
    commit('SUPLISTTOTAL')
  },



  GETTAGSLIST: ({ commit }) => {
    commit('GETTAGSLIST')
  },

  TOGGLESHOWTAGS: ({ commit }) => {
    commit('TOGGLESHOWTAGS')
  },

  CHANGEPAGE: ({ commit }, data) => {
    commit('CHANGEPAGE', data)
  },

  SUPINPUTVALUE: ({ commit }, data) => {
    commit('SUPINPUTVALUE', data) //supplier
  }
}

const mutations = {

  [types.TOGGLESHOWTAGS]: (state, payload) => {
    state.tagsList.forEach((item, index, arr) => {
      if (item.id == payload.id) {
        if (item.active == '1') {
          item.active = '0'
        } else if (item.active == '0') {
          item.active = '1'
        }
      }
    })
  },

  [types.GETBASELIST]: (state, payload) => {
    if (payload.type.includes('search')) {
      state.currentPage = 1
    }
  },

  [types.CHANGEPAGE]: (state, payload) => {
    state.currentPage = payload.currentPage
  },

  
  [types.FORMDATA1]: (state, payload) => {
    state.formData1 = payload.data
  },
  [types.SUPPLIERLIST]: (state, payload) => {
    state.supplierList = payload.list
  },
  [types.SUPLISTTOTAL]: (state, payload) => {
    state.supListTotal = payload.total
  },
  [types.SUPINPUTVALUE]: (state, payload) => {
    console.info(`CHANGEBASICINPUTVALUE ${JSON.stringify(payload)}`)
    state.inputVal = payload.inputVal //supplier input
  },
  [types.CATEGORYICONS1]: (state, payload) => {
    state.manufacturer_list = payload.icons
  },


  [types.BUESSIMG]: (state, payload) => {
    state.buessImg = payload.imgs
  },
  [types.LICENCE]: (state, payload) => {
    state.licence = payload.imgs
  },
  [types.AUTHORIZATION]: (state, payload) => {
    state.authorization = payload.imgs
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
