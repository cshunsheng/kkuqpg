/**
 * 评论管理store
 */


import * as types from '../types'

const state = {
    cur_page: 1,
    total: 0,
    page_size: 20,
    total_page: 0,

    /*
    * 外部评论链接配置信息
     */
    commentExternalinfo: [],

    /*
    * 外部评论
     */
    commentExternalList: [],


    /*
    * 自然评论
     */
    commentNatureList: []



}

const getters = {
    //外部评论链接配置列表
    commentExternalinfo: state => state.commentExternalinfo,

    //外部评论列表
    commentExternalList: state => state.commentExternalList,

    //自然评论列表
    commentNatureList: state => state.commentNatureList,

    commentTableCurrentPage: (state) => state.cur_page,

    commentTableTotal: (state) => state.total,

    commentTableTotalPage: (state) => state.total_page,

    commentTablePageSize: (state) => state.page_size
}

const actions = {

    GETCOMMENTEXTERNALINFO: ({commit})=>{
        commit(types.GETCOMMENTEXTERNALINFO)
    },

    GETCOMMENTEXTERNAL: ({commit})=> {
      commit(types.GETCOMMENTEXTERNAL)
    },

    GETCOMMENTNATURE: ({commit})=> {
      commit(types.GETCOMMENTNATURE)
    },

    TOGGLECOMMENT: ({commit})=> {
      commit(types.TOGGLECOMMENT)
    }
}

const mutations = {

    [types.GETCOMMENTEXTERNALINFO](state, payload){
        state.commentExternalinfo = payload.data.list
        state.total = payload.data.total
        state.cur_page = payload.data.page_num
    },

    [types.GETCOMMENTEXTERNAL](state, payload){
        state.commentExternalList = payload.data.list
        state.total = payload.data.total
        state.cur_page = payload.data.page_num
    },

    [types.GETCOMMENTNATURE](state, payload){
        state.commentNatureList = payload.data.list
        state.total = payload.data.total
        state.cur_page = payload.data.page_num
    },

    [types.TOGGLECOMMENT](state, paload){
      let oldArr
      const id_comment = paload.data.id_comment
      const from_type = paload.data.from_type

      if(from_type == 'external'){
        oldArr = state.commentExternalList
      } else if(from_type == 'nature') {
        oldArr = state.commentNatureList
      }

      oldArr.forEach((item, index, arr)=>{
        if(item.id_comment == id_comment){
          item.display = !item.display
          item.operator = paload.data.operator
          console.info(item)
        }
      })
    }

}

export default {
  state,
  getters,
  actions,
  mutations
}
