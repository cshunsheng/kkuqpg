<template>
    <div class="sidebar">
        <div class="toggle-title" @click.stop="isCollapse = !isCollapse">{{toggleTitle}}</div>
        <el-menu
            router
            unique-opened
            :default-active="onRoutes"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            :collapse="isCollapse">
            <template v-for="item in sidebars">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            auth_info: '',
            isCollapse: false,
            items: [
                {
                    icon: 'el-icon-setting',
                    index: '/admin/readme',
                    title: '介绍'
                    },
                    // {
                    //   icon: 'el-icon-news',
                    //   index: '/admin/scienceArticle/list',
                    //   title: '科普文章管理'
                    // },
                    {
                    icon: 'el-icon-edit-outline',
                    index: '/admin/comment/outside',
                    title: '评论管理',
                    subs: [
                        {
                            index: '/admin/comment/outside/list',
                            title: '外部评论'
                        },
                        {
                            index: '/admin/comment/nature',
                            title: '自然评论'
                        }
                    ]
                },
                {
                    icon: 'el-icon-goods',
                    index: '/admin/shop/cornertags',
                    title: '商品管理',
                    subs: [
                        {
                            index: '/admin/shop/sort/list',
                            title: '商品分类'
                        },
                        {
                            index: '/admin/shop/basic_commodity/list',
                            title: '基础商品'
                        },
                        {
                            index: '/admin/shop/comboCommodity',
                            title: '组合商品'
                        },
                        {
                            index: '/admin/shop/wholesale/list',
                            title: '拼团商品'
                        },
                        {
                            index: '/admin/shop/bargain/list',
                            title: '心跳团'
                        },
                        {
                            index: '/admin/shop/department/list',
                            title: '科室管理'
                        },
                        {
                            index: '/admin/shop/postage',
                            title: '物流设置'
                        },
                        {
                            index: '/admin/shop/cornertags/list',
                            title: '角标管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-tickets',
                    index: '/admin/homeConfig',
                    title: '运营管理',
                    subs: [
                        {
                            index: '/admin/homeConfig/banner/list',
                            title: '首页Banner'
                        },
                        {
                            index: '/admin/homeConfig/shop/container',
                            title: '首页商品展示位'
                        },
                        {
                            index: '/admin/homeConfig/article/list',
                            title: '首页文章展示位'
                        },
                        {
                            index: '/admin/scienceArticle/list',
                            title: '科普文章'
                        },
                        {
                            index: '/admin/search/keyword/list',
                            title: '搜索关键字'
                        },
                        {
                            index: '/admin/search/sales_volume/list',
                            title: '销量排行'
                        }
                    ]
                },
                // {
                //   icon: 'el-icon-search',
                //   index: '/admin/search/keyword',
                //   title: '搜索运营',
                //   subs: [

                //   ]
                // },
                {
                    icon: 'el-icon-sold-out',
                    index: '/admin/order',
                    title: '订单管理'
                },
                // 优惠券管理模块
                {
                    icon: 'el-icon-document',
                    index: '/admin/couponList/oneCoupon',
                    title: '优惠券管理',
                    subs: [
                        {
                            index: '/admin/couponList/oneCoupon',
                            title: '优惠券列表'
                        },
                            {
                            index: '/admin/specificCoupon',
                            title: '特定券'
                        },
                        {
                            index: '/admin/source',
                            title: '发放途径'
                        }
                    ]
                },
                {
                    icon: 'el-icon-star-on',
                    index: '/admin/retail/vendingMachine',
                    title: '新零售',
                    subs: [
                        {
                            index: '/admin/retail/vendingMachine',
                            title: '货柜管理'
                        },
                        {
                            index: '/admin/retail/shop/list',
                            title: '商品管理'
                        },
                        {
                            index: '/admin/retail/track',
                            title: '货道管理'
                        },
                        {
                            index: '/admin/retail/performance/list',
                            title: '业绩管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-share',
                    index: '/admin/generalize',
                    title: '推广大使',
                    subs: [
                        {
                            index: '/admin/generalize/accounts',
                            title: '用户管理'
                        },
                        {
                            index: '/admin/generalize/product',
                            title: '商品选品'
                        },
                        {
                            index: '/admin/generalize/fodder',
                            title: '推广素材'
                        },
                        {
                            index: '/admin/generalize/apply',
                            title: '提现申请'
                        },
                            {
                            index: '/admin/generalize/whiteList',
                            title: '白名单'
                        }
                    ]
                },
                {
                    icon: 'el-icon-service',
                    index: '/admin/agent',
                    title: '名医代理',
                    subs: [
                        {
                            index: '/admin/agent/accounts',
                            title: '代理商管理'
                        },
                        {
                            index: '/admin/agent/apply',
                            title: '提现记录'
                        },
                        {
                            index: '/admin/agent/docService',
                            title: '医生服务'
                        },
                        {
                            index: '/admin/agent/docList',
                            title: '医生列表'
                        },
                        {
                            index: '/admin/agent/serviceList',
                            title: '服务订单'
                        },
                        {
                            index: '/admin/agent/indexOperation',
                            title: '首页运营'
                        },
                        {
                            index: '/admin/agent/sysNotice',
                            title: '系统通知'
                        }
                    ]
                },
                {
                    icon: 'el-icon-news',
                    index: '/admin/pssm',
                    title: '进销存',
                    subs: [
                        {
                            index: '/admin/pssm/supplier',
                            title: '供应商管理'
                        },
                        {
                            index: '/admin/pssm/productManagement',
                            title: '商品库管理'
                        },
                        {
                            index: '/admin/pssm/stock',
                            title: '采购'
                        },
                        {
                            index: '/admin/pssm/salesReturn',
                            title: '退货管理'
                        },
                        {
                            index: '/admin/pssm/outIn',
                            title: '出入库记录'
                        },
                        {
                            index: '/admin/pssm/settingSku',
                            title: '商品规格设置'
                        }
                    ]
                },
                {
                    icon: 'el-icon-mobile-phone',
                    index: '/admin/chat',
                    title: '患者交流群',
                    subs: [
                        {
                            index: '/admin/chat/index',
                            title: '群聊运营'
                        },
                    ]
                },
                {
                    icon: 'el-icon-phone-outline',
                    index: '/admin/dealer',
                    title: '经销商管理',
                    subs: [
                        {
                            index: '/admin/dealer/dealerList',
                            title: '经销商'
                        },
                        {
                            index: '/admin/dealer/sales',
                            title: '销售人员'
                        },
                        {
                            index: '/admin/dealer/doctorList',
                            title: '医生列表'
                        },
                    ]
                }
            ]
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path
        },
        toggleTitle() {
            return this.isCollapse ? '显示' : '隐藏'
        },
        sidebars() {
            let _auto_info = JSON.parse(localStorage.getItem('auth_info'))
            let statusArr = [];
            let _showSupper = _auto_info.show_suppiler == 1 || _auto_info.action_supplier == 1 ;//展示供应商管理
            let _showStock = _auto_info.stock_in_or_ex == 1; //展示出入库记录
            let _isShow = _auto_info.purchase_eamil == 0 && _auto_info.show_purchase == 0//展示采购
            let _sidebars = this.items
            if(!_showSupper){
                _sidebars.forEach(item=>{
                    if(item.title === '进销存'){
                        let index = item.subs.findIndex(v => v.title == '供应商管理')
                        item.subs.splice(index,1)
                    }
                })
            }
            if(_isShow){
                _sidebars.forEach(item=>{
                    if(item.title === '进销存'){
                        let index = item.subs.findIndex(v => v.title == '采购')
                        item.subs.splice(index,1)
                    }
                })
            }
            if(!_showStock){
                _sidebars.forEach(item=>{
                    if(item.title === '进销存'){
                        let index = item.subs.findIndex(v => v.title == '出入库记录')
                        item.subs.splice(index,1)
                    }
                })
            }
            return _sidebars
        }
    },
    methods: {
        handleOpen() {},
        handleClose() {}
    }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: relative;
}

.sidebar .toggle-title {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 12px;
  line-height: 14px;
  height: 14px;
  color: #fff;
  z-index: 99;
  cursor: pointer;
}

.sidebar > .el-menu-vertical-demo {
  width: 70px;
  height: 100%;
  overflow: scroll;
}

.sidebar .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
