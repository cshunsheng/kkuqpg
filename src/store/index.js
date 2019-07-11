import Vue from 'vue'
import Vuex from 'vuex'


//引入模块
import commentAdmin from './modules/comment_admin_store'
import scienceArticleAdmin from './modules/science_article_admin_store'
import homeConfigAdmin from './modules/home_config_admin_store'
import searchAdmin from './modules/search_admin_store'
import shopAdmin from './modules/shop_admin_store'
import order from './modules/order'
import generalize from './modules/generalize'
import groupProduct from './modules/group_product'
import sortProduct from './modules/sort_product'
import departmentList from './modules/department'
import inventory from './modules/inventory'
import stock from './modules/stock'
import refund from './modules/refund'

import agent from './modules/agent'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    // 模块
    modules: {
        commentAdmin,                     //评论管理（内部评论、外部评论）
        scienceArticleAdmin,              //科普文章管理
        homeConfigAdmin,                  //首页运营（首页模块运营(拼团、模块商品)、banner运营、文章运营）
        searchAdmin,                      //搜索管理（关键字、销量排行）
        shopAdmin,                        //商品管理（角标）
        order,                            // 订单模块
        generalize,                       // 推广大使
        groupProduct,                     //拼团商品
        sortProduct,                      //分类商品
        departmentList,                   //科室管理
        inventory,                        //进销存管理
        stock,                            //出入库管理
        refund,                           //退货管理
        agent,                            //名医代理
    },
    strict: false,
})
