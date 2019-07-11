import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: resolve => require(['../components/login.vue'], resolve)
  },
  // {
  //     path: '/register',
  //     component: resolve => require(['../components/register.vue'], resolve)
  // },
  {
    path: '/admin',
    name: 'index',
    component: resolve => require(['../pages/index.vue'], resolve),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        redirect: 'readme'
      },

      //1.介绍
      {
        path: 'readme',
        component: resolve => require(['../pages/about/Readme.vue'], resolve)
      },
      //2.科普文章管理
      {
        path: 'scienceArticle',
        component: resolve =>
          require(['../pages/scienceArticle/Index.vue'], resolve),
        children: [
          {
            path: '',
            redirect: 'list'
          },
          {
            path: 'list',
            component: resolve =>
              require(['../pages/scienceArticle/list.vue'], resolve)
          },
          {
            path: 'edit',
            component: resolve =>
              require(['../pages/scienceArticle/edit.vue'], resolve)
          }
        ]
      },

      //3.评论管理
      {
        path: 'comment',
        component: resolve => require(['../pages/comment/index.vue'], resolve),
        children: [
          //外部评论
          {
            path: 'outside',
            component: resolve =>
              require(['../pages/comment/outside/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require([
                    '../pages/comment/outside/CommentOutsideList.vue'
                  ], resolve)
              },
              {
                path: 'add_url',
                component: resolve =>
                  require([
                    '../pages/comment/outside/CommentOutsideAddUrl.vue'
                  ], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require([
                    '../pages/comment/outside/CommentOutsideEdit.vue'
                  ], resolve)
              }
            ]
          },
          //自然评论
          {
            path: 'nature',
            component: resolve =>
              require(['../pages/comment/nature/index.vue'], resolve)
          }
        ]
      },

      //4.首页运营管理
      {
        path: 'homeConfig',
        component: resolve =>
          require(['../pages/indexConfig/index.vue'], resolve),
        children: [
          //banner管理
          {
            path: 'banner',
            component: resolve =>
              require(['../pages/indexConfig/banner/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/indexConfig/banner/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/indexConfig/banner/edit.vue'], resolve)
              }
            ]
          },
          //商品展示位
          {
            path: 'shop',
            component: resolve =>
              require(['../pages/indexConfig/shop/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'container'
              },
              {
                path: 'container',
                component: resolve =>
                  require(['../pages/indexConfig/shop/container.vue'], resolve)
              },
              {
                path: 'addCom',
                component: resolve =>
                  require(['../pages/indexConfig/shop/addCom.vue'], resolve)
              },
              {
                path: 'moduleEdit',
                component: resolve =>
                  require(['../pages/indexConfig/shop/moduleEdit.vue'], resolve)
              }
            ]
          },
          //文章展示位
          {
            path: 'article',
            component: resolve =>
              require(['../pages/indexConfig/article/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/indexConfig/article/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/indexConfig/article/edit.vue'], resolve)
              }
            ]
          }
        ]
      },

      //5.搜索运营管理
      {
        path: 'search',
        component: resolve => require(['../pages/search/index.vue'], resolve),
        children: [
          {
            path: 'keyword',
            component: resolve =>
              require(['../pages/search/keyword/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/search/keyword/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/search/keyword/edit.vue'], resolve)
              }
            ]
          },
          {
            path: 'sales_volume',
            component: resolve =>
              require(['../pages/search/salesVolume/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/search/salesVolume/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/search/salesVolume/edit.vue'], resolve)
              }
            ]
          }
        ]
      },

      //6 商品管理
      {
        path: 'shop',
        component: resolve => require(['../pages/shop/index.vue'], resolve),
        children: [
          {
            path: 'cornertags',
            component: resolve =>
              require(['../pages/shop/cornertags/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/shop/cornertags/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/shop/cornertags/edit.vue'], resolve)
              }
            ]
          },

          {
            path: 'basic_commodity',
            component: resolve =>
              require(['../pages/shop/basicCommodity/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/shop/basicCommodity/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/shop/basicCommodity/edit.vue'], resolve)
              }
            ]
          },
          {
            path: 'comboCommodity',
            component: resolve =>
              require(['../pages/shop/comboCommodity/list.vue'], resolve)
          },
          {
            path: 'comboEdit',
            component: resolve =>
              require(['../pages/shop/comboCommodity/edit.vue'], resolve)
          },
          {
            path: 'postage',
            component: resolve =>
              require(['../pages/shop/postage/edit.vue'], resolve)
          },

          //拼团商品
          {
            path: 'wholesale',
            component: resolve =>
              require(['../pages/shop/wholesale/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/shop/wholesale/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/shop/wholesale/edit.vue'], resolve)
              },
              {
                path: 'sort',
                component: resolve =>
                  require(['../pages/shop/wholesale/sort.vue'], resolve)
              }
            ]
          },
          // 心跳团（砍价）
          {
            path: 'bargain/list',
            component: resolve =>
              require(['@/pages/shop/bargain/list.vue'], resolve)
          },
          {
            path: 'bargain/edit',
            component: resolve =>
              require(['@/pages/shop/bargain/edit.vue'], resolve)
          },
          {
            path: 'bargain/sort',
            component: resolve =>
              require(['@/pages/shop/bargain/sort.vue'], resolve)
          },
          {
            path: 'department',
            component: resolve =>
              require(['../pages/shop/department/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/shop/department/list.vue'], resolve)
              },
              {
                path: 'productlist',
                component: resolve =>
                  require(['../pages/shop/department/productlist.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/shop/department/edit.vue'], resolve)
              }
            ]
          },
          //分类商品
          {
            path: 'sort',
            component: resolve =>
              require(['../pages/shop/sort/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/shop/sort/list.vue'], resolve)
              },
              {
                path: 'sub',
                component: resolve =>
                  require(['../pages/shop/sort/sub.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/shop/sort/edit.vue'], resolve)
              }
            ]
          }
        ]
      },
      // 7 订单
      {
        path: 'order',
        component: resolve => require(['../pages/order/order.vue'], resolve)
      },
      {
        path: 'detail',
        component: resolve => require(['../pages/order/detail.vue'], resolve)
      },
      {
        path: 'solt',
        component: resolve => require(['../pages/order/soltPage.vue'], resolve)
      },
      //8 新零售系统
      {
        path: 'retail',
        component: resolve => require(['../pages/retail/index.vue'], resolve),
        children: [
          {
            path: 'vendingMachine',
            component: resolve =>
              require([
                '../pages/retail/vendingMachine/vendingMachine'
              ], resolve)
          },
          {
            path: 'addVending',
            component: resolve =>
              require(['../pages/retail/vendingMachine/addVending'], resolve)
          },
          {
            path: 'track',
            component: resolve =>
              require(['../pages/retail/track/track'], resolve)
          },
          {
            path: 'shop',
            component: resolve =>
              require(['../pages/retail/shop/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/retail/shop/list.vue'], resolve)
              },
              {
                path: 'edit',
                component: resolve =>
                  require(['../pages/retail/shop/edit.vue'], resolve)
              }
            ]
          },
          {
            path: 'performance',
            component: resolve =>
              require(['../pages/retail/performance/index.vue'], resolve),
            children: [
              {
                path: '',
                redirect: 'list'
              },
              {
                path: 'list',
                component: resolve =>
                  require(['../pages/retail/performance/list.vue'], resolve)
              },
              {
                path: 'detail',
                component: resolve =>
                  require(['../pages/retail/performance/detail.vue'], resolve)
              }
            ]
          }
        ]
      },
      // 9- 推广大使
      {
        path: 'generalize/accounts',
        component: resolve =>
          require(['../pages/generalize/accounts.vue'], resolve)
      },
      {
        path: 'generalize/apply',
        component: resolve =>
          require(['../pages/generalize/apply.vue'], resolve)
      },
      {
        path: 'generalize/product',
        component: resolve =>
          require(['../pages/generalize/product.vue'], resolve)
      },
      {
        path: 'generalize/whiteList',
        component: resolve =>
          require(['../pages/generalize/whiteList.vue'], resolve)
      },
      {
        path: 'generalize/fodder',
        component: resolve =>
          require(['../pages/generalize/fodder.vue'], resolve)
      },
      {
        path: 'generalize/fodderEdit',
        component: resolve =>
          require(['../pages/generalize/fodderEdit.vue'], resolve)
      },
      // 10- 名医代理
      {
        path: 'agent/accounts',
        component: resolve => require(['../pages/agent/accounts.vue'], resolve)
      },
      {
        path: 'agent/apply',
        component: resolve => require(['../pages/agent/apply.vue'], resolve)
      },
      {
        path: 'agent/docService',
        component: resolve =>
          require(['../pages/agent/docService.vue'], resolve)
      },
      {
        path: 'agent/docList',
        component: resolve => require(['../pages/agent/docList.vue'], resolve)
      },
      {
        path: 'agent/serviceList',
        component: resolve =>
          require(['../pages/agent/serviceList.vue'], resolve)
      },
      {
        path: 'agent/sysNotice',
        component: resolve =>
          require(['../pages/agent/sysNotice.vue'], resolve)
      },
      {
        path: 'agent/indexOperation',
        component: resolve =>
          require(['../pages/agent/indexOperation.vue'], resolve)
      },
      {
        path: 'agent/showImg',
        component: resolve =>
          require(['@/components/showImg.vue'], resolve)
      },
      {
        path: 'agent/editNotice',
        component: resolve =>
          require(['../pages/agent/editSysNotice.vue'], resolve)
      },
      // 进销存管理系统
      {
        path: 'pssm/supplier',
        component: resolve => require(['@/pages/pssm/supplier/supplier.vue'], resolve)
      },
      {
        path: 'pssm/edit',
        component: resolve => require(['@/pages/pssm/supplier/edit.vue'], resolve)
      },
      {
        path: 'pssm/productManagement',
        component: resolve =>
          require(['@/pages/pssm/productManagement.vue'], resolve)
      },
      {
        path: 'pssm/salesReturn',
        component: resolve => require(['@/pages/pssm/salesReturn.vue'], resolve)
      },
      {
        path: 'pssm/stock',
        component: resolve => require(['@/pages/pssm/stock.vue'], resolve)
      },
      {
        path: 'pssm/outIn',
        component: resolve => require(['@/pages/pssm/outIn.vue'], resolve)
      },
      {
        path: 'pssm/settingSku',
        component: resolve => require(['@/pages/pssm/settingSku.vue'], resolve)
      },
      //优惠券管理系统
      {
        path: 'couponList',
        component: resolve =>
          require(['@/pages/coupon/couponList/couponList.vue'], resolve),
        children: [
          {
            path: 'oneCoupon',
            component: resolve =>
              require(['@/pages/coupon/oneCoupon/oneCoupon.vue'], resolve)
          },
          {
            path: 'moreCoupon',
            component: resolve =>
              require(['@/pages/coupon/moreCoupon/moreCoupon.vue'], resolve)
          }
        ]
      },
      {
        path: 'addCoupon/:id/:name',
        component: resolve =>
          require(['@/pages/coupon/moreCoupon/addCoupon.vue'], resolve)
      },
      {
        path: 'specificCoupon',
        component: resolve =>
          require(['@/pages/coupon/specificCoupon/index.vue'], resolve)
      },
      {
        path: 'couponProducts/:id/:name',
        component: resolve =>
          require(['@/pages/coupon/specificCoupon/add.vue'], resolve)
      },
      {
        path: 'source',
        component: resolve =>
          require(['@/pages/coupon/putoutSource/index.vue'], resolve)
      },
      //患者交流群
      {
        path:'chat',
        component: resolve =>require(['@/pages/chat/operation/index.vue'],resolve)
      },
      {
        path:'chat/index',
        component: resolve => require(['@/pages/chat/operation/index.vue'],resolve)
      },
      //经销商管理
      {
        path:'dealer',
        component: resolve => require(['@/pages/dealer/dealerList.vue'],resolve)
      },
      {
        path:'dealer/dealerList',
        component: resolve => require(['@/pages/dealer/dealerList.vue'],resolve)
      },
      {
        path:'dealer/sales',
        component: resolve => require(['@/pages/dealer/sales.vue'],resolve)
      },
      {
        path:'dealer/doctorList',
        component: resolve => require(['@/pages/dealer/doctorList.vue'],resolve)
      }
    ]
  }
]

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  // store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

const router = new Router({
  routes
})

//进入每个页面之前，判定用户是否登录。
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    const username = localStorage.getItem('g_username')
    const access_token = localStorage.getItem('g_accessToken')
    const auth_info = JSON.parse(localStorage.getItem('auth_info'))
    if (username && access_token && auth_info) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
