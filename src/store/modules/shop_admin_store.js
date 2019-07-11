/**
 * 商品管理
 */

import * as types from '../types'

const state = {
  pageSize: 20,
  currentPage: 1,
  tableTotal: 0,

  tagsList: [], //角标列表

  baseList: [], //基础商品列表
  selectType: 2, //关键字类型: 1商品id, 2商品名称
  inputBasicValue: '', //基础商品搜索关键字
  inputValue: '', //组合商品关键字. 为空表示搜索所有
  formData: {
    is_virtual: 0, //商品属性，实物or虚拟
    id_stock_product:'',
    p_kkid: '',
    type: '', // 操作类型: 1新增, 2编辑
    id_product: '', // 商品id - 操作类型为编辑时传0
    is_combination: 0,
    name: '', // 商品名称
    madein: '', // 产地
    cornertag: '', // 角标
    allowed_coupon: 1, // 优惠券
    guige: '', // 商品规格
    short_msg: '', // 商品特点
    id_category_arr: [],
    id_category: [], // 商品二级分类
    department: [], // 科室
    price: '', // 平台价
    wholesale_price: '', // 市场价
    doc_rewards: '', // 医生奖励
    ambassador_rewards: '', //推广大使奖励金
    active: '', //商品状态（上线，下线）
    doctor_visible: 0, // 商品状态（医生端）
    patient_visible: 0, // 商品状态（患者端）
    position: '', // 商品排序

    product_sku: [] // 商品sku
  },
  proImgs: {
    cover: [],
    images: [],
    images_detail: [],
    diploma: []
  }, // 头图，详情图，医疗证书
  createProductId: null, // 新建商品ID
  comboList: [], // 组合商品列表
  comboListTotal: 0, // 组合商品总数
  comboListNum: 1,//组合商品翻页记录
  basicComboListNum: 1,//基础商品翻页记录
  categoryIcons: [] // 选择的商品分类
  ,bargainlistpagenum: 1 //心跳团翻页记录
  ,bargainlist: []  // 心跳团列表数据
}

const getters = {
  pageSize: state => Number(state.pageSize),
  currentPage: state => Number(state.currentPage),
  tableTotal: state => Number(state.tableTotal),

  tagsList: state => state.tagsList,

  baseList: state => state.baseList,
  selectType: state => Number(state.selectType),
  inputValue: state => state.inputValue,

  inputBasicValue: state => state.inputBasicValue, //basis

  formData: state => state.formData,
  proImgs: state => state.proImgs,
  createProductId: state => state.createProductId,
  comboList: state => state.comboList,
  categoryIcons: state => state.categoryIcons,
  comboListTotal: state => state.comboListTotal,
  comboListNum: state => Number(state.comboListNum),
  basicComboListNum: state => Number(state.basicComboListNum),
  bargainlist: state=>state.bargainlist,
  bargainlistpagenum: state=>state.bargainlistpagenum
}

const actions = {
  GETTAGSLIST: ({ commit }) => {
    commit('GETTAGSLIST')
  },

  TOGGLESHOWTAGS: ({ commit }) => {
    commit('TOGGLESHOWTAGS')
  },

  CHANGEPAGE: ({ commit }, data) => {
    commit('CHANGEPAGE', data)
  },

  CHANGESELECTTYPE: ({ commit }, data) => {
    commit('CHANGESELECTTYPE', data)
  },

  CHANGEINPUTVALUE: ({ commit }, data) => {
    commit('CHANGEINPUTVALUE', data)
  },

  CHANGEBASICINPUTVALUE: ({ commit }, data) => {
    commit('CHANGEBASICINPUTVALUE', data) //basis
  }
}

const mutations = {
  [types.GETTAGSLIST]: (state, payload) => {
    state.tagsList = payload.data
  },

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
    state.baseList = payload.data.product_list
    state.tableTotal = payload.data.total_num
  },

  [types.CHANGEPAGE]: (state, payload) => {
    state.currentPage = payload.currentPage
  },

  [types.CHANGESELECTTYPE]: (state, payload) => {
    state.selectType = payload.selectType
    state.inputValue = ''
    state.inputBasicValue = ''
  },

  [types.CHANGEINPUTVALUE]: (state, payload) => {
    state.inputValue = payload.inputValue
  },

  [types.CHANGEBASICINPUTVALUE]: (state, payload) => {
    // console.info(`CHANGEBASICINPUTVALUE ${JSON.stringify(payload)}`)
    state.inputBasicValue = payload.inputBasicValue //basis input
  },

  [types.FORMDATA]: (state, payload) => {
    state.formData = payload.data
  },
  [types.PROIMGS]: (state, payload) => {
    state.proImgs = payload.imgs
  },
  [types.CREATEDPRUDUCTID]: (state, payload) => {
    state.createProductId = payload.id
  },
  [types.COMBOLIST]: (state, payload) => {
    state.comboList = payload.list
  },
  [types.COMBOLISTNUM]: (state, payload) => {
    state.comboListNum = payload.num
  },
  [types.BASICCOMBOLISTNUM]: (state, payload) => {
    state.basicComboListNum = payload.num
  },
  [types.COMBOLISTTOTAL]: (state, payload) => {
    state.comboListTotal = payload.total
  },
  [types.CATEGORYICONS]: (state, payload) => {
    state.categoryIcons = payload.icons
  },
  [types.BARGAINLIST]: (state, payload)=>{
      state.bargainlist = payload.arr
  },
  [types.BARGAINLISTPAGENUM]: (state,payload) =>{
      state.bargainlistpagenum = payload.num
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
