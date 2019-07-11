/**
 * 首页运营store
 */


import * as types from '../types'


const state = {
    //banner列表
    bannerList: [],

    //首页文章列表
    homeArticleList: [],
    //所有文章
    allArticleList: [],

    //商品模块列表
    middleImgList: [],
    //模块商品列表
    shopList: [],

    //拼团商品列表
    wholesaleList: []
}

const getters = {
    bannerList: state => state.bannerList,

    homeArticleList: state => state.homeArticleList,
    allArticleList: state => state.allArticleList,

    middleImgList: state => state.middleImgList,

    shopList: state => state.shopList,

    wholesaleList: state => state.wholesaleList,
}

const actions = {
    GETBANNERLIST: ({commit})=>{
        commit(types.GETARTICLELIST)
    },

    DELETEBANNER: ({commit})=>{
        commit(types.DELETEBANNER)
    },

    GETHOMEARTICLELIST: ({commit})=>{
        commit(types.GETHOMEARTICLELIST)
    },

    GETALLARTICLELIST: ({commit})=>{
        commit(types.GETALLARTICLELIST)
    },

    DELETEHOMEARTICLE: ({commit})=>{
        commit(types.DELETEHOMEARTICLE)
    },

    GETMIDDLEIMGLIST: ({commit})=>{
        commit(types.GETMIDDLEIMGLIST)
    },

    GETSHOPLIST: ({commit})=>{
        commit(types.GETSHOPLIST)
    },

    DELETESHOPITEM: ({commit})=>{
        commit(types.DELETESHOPITEM)
    },

    GETWHOLESALELIST: ({commit})=> {
        commit(types.GETWHOLESALELIST)
    }
}

const mutations = {
    [types.GETBANNERLIST]: (state, payload)=>{
        state.bannerList = payload.data
    },

    [types.DELETEBANNER]: (state, payload)=>{
        const oldBannerList = state.bannerList
        oldBannerList.splice(oldBannerList.findIndex((item)=>{
            return item.id == payload.id
        }), 1)
        state.bannerList = oldBannerList
    },

    [types.GETHOMEARTICLELIST]: (state, payload)=>{
        state.homeArticleList = payload.data
    },

    [types.GETALLARTICLELIST]: (state, payload)=>{
        state. allArticleList = payload.data
    },

    [types.DELETEHOMEARTICLE]: (state, payload)=>{
        const oldHomeArticleList = state.homeArticleList
        oldHomeArticleList.splice(oldHomeArticleList.findIndex((item)=>{
            return item.aid == payload.aid
        }), 1)
        state.homeArticleList = oldHomeArticleList
    },

    [types.GETMIDDLEIMGLIST]: (state, payload)=>{
        state.middleImgList = payload.data.map((item, index, arr)=>{
            item.type = String(item.type)
            return item
        })
    },

    [types.GETSHOPLIST]: (state, payload)=> {
        state.shopList = payload.data
    },

    [types.DELETESHOPITEM]: (state, payload)=>{
        const newList = state.shopList
        newList.splice(state.shopList.findIndex((item)=>{
            return item.id == payload.id
        }), 1)
        state.shopList = newList
    },

    [types.GETWHOLESALELIST]: (state, payload)=>{
        state.wholesaleList = payload.data
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
