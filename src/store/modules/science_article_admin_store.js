/**
 * 科普文章管理store
 */


import * as types from '../types'


const state = {
    articleList: [],
    cur_page: 1,
    total: 0,
    page_size: 20,
    total_page: 1,
}

const getters = {
    articleTableList: (state) => state.articleList,

    articleTableCurrentPage: (state) => state.cur_page,

    articleTableTotal: (state) => state.total,

    articleTableTotalPage: (state) => state.total_page,

    articleTablePageSize: (state) => state.page_size
}

const actions = {
    GETARTICLELIST: ({commit}) => {
        commit(types.GETARTICLELIST)
    },

    DELETEARTICLELISTITEM: ({commit}) => {
        commit(types.DELETEARTICLELISTITEM)
    },

    TOGGLEARTICLELISTITEM: ({commit}) => {
      commit(types.TOGGLEARTICLELISTITEM)
    }

}

const mutations = {
    [types.GETARTICLELIST](state, payload) {
        state.articleList = payload.data.article_list
        state.cur_page = payload.data.current_page
        state.total = payload.data.total
        state.total_page = payload.data.total_page
        state.page_size = payload.data.page_size
    },

    [types.DELETEARTICLELISTITEM](state, payload) {
        const oldArticleList = state.articleList
        oldArticleList.splice(oldArticleList.findIndex((item)=>{
            return item.aid == payload.data.aid
        }), 1)
        state.total = oldArticleList.length
        state.articleList = oldArticleList
    },

    [types.TOGGLEARTICLELISTITEM](state, payload) {
        state.articleList.forEach((item, index, arr)=>{
            if(item.aid == payload.data.aid){
                if(item.active == '1'){
                  item.active = '0'
                }else if(item.active =='0') {
                  item.active = '1'
                }
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
