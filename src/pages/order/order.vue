<template>
    <div class="order">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'order'}">
                    <i class="el-icon-menu"></i>订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    <span @click="reload()" style="cursor: pointer;">订单列表</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="orderSearch" v-if="showSearch">
            <div class="searchBox">
                <el-select v-model="cSearch.type" placeholder="条件搜索" size="small">
                    <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="searchBox searchVal">
                <el-input v-model="cSearch.value" placeholder="请输入内容" size="small"></el-input>
            </div>
            <div class="searchBox clearSearch" @click="clearSearchValues">
                <i class="el-icon-error"></i>
            </div>
            <div class="searchBox searchBtn" @click="searchOrders">
                <el-button type="primary">搜索</el-button>
            </div>
        </div>
        <div class="listFilter" v-if="showCondition">
            <div class="conditionFilter dateFilter">
                <div class="dataTit">创建时间: </div>
                <div>
                    <el-date-picker v-model="chConditions.chaDate" type="daterange" size="small" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @editable="false" @clearable="false">
                    </el-date-picker>
                </div>
            </div>

            <div class="conditionFilter">
                <div class="conditionBox conditionStatus">
                    <el-select v-model="chConditions.chStatus" multiple placeholder="订单状态" size="small">
                        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="conditionBox conditionSource">
                    <el-select v-model="chConditions.chSource" multiple placeholder="订单来源" size="small">
                        <el-option v-for="item in orderSources" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="conditionBox conditionType">
                    <el-select v-model="chConditions.chType" multiple placeholder="订单类型" size="small">
                        <el-option v-for="item in orderTypes" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="conditionBox ">
                    <el-select v-model="chConditions.chShopVirtual" clearable placeholder="订单属性" size="small">
                        <el-option v-for="item in orderShopVirtual" :key="item.id" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="orderConditions">
                <el-button type="primary" @click="filterConditions">筛选</el-button>
            </div>
        </div>
        <div class="exportBtn">
            <div class="orderBtns">
                <el-button type="success" @click="showSearchBox">{{searchTip}}</el-button>
                <el-button type="success" @click="showConditionBox">{{conditionTip}}</el-button>
                <span>共 {{orderTotal}} 条结果</span>
            </div>
            <div class="orderBtns">
                <el-checkbox class="checkTest" v-model="testChecked" @change="changeTest">忽略测试订单</el-checkbox>
                <el-button type="primary" @click="exportExcel()">导出Excel</el-button>
            </div>

        </div>
        <div class="orderList">
            <ul class="listWrap">
                <li class="listTit">
                    <span style="flex: 1.5">订单号</span>
                    <span style="flex: 2">创建时间</span>
                    <span class="onehalf">客户姓名</span>
                    <span class="onehalf">手机号</span>
                    <span style="flex: 1.2">总金额</span>
                    <span style="flex: 2">推荐医生</span>
                    <!-- <span style="flex: 2">推广大使ID</span> -->
                    <span>状态</span>
                    <span class="onehalf">来源</span>
                    <span class="onehalf">类型</span>
                    <span class="onehalf">订单属性</span>
                    <span class="half" style="flex: 2">操作</span>
                </li>
                <li class="listLine" v-for="(item,index) in orderList" :key="index">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ item.product_list }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="small">
                                <span style="flex: 1.5">{{item.reference}}</span>
                            </el-tag>
                        </div>
                    </el-popover>
                    <span style="flex: 2">{{item.create_ts}}</span>
                    <span class="onehalf">{{item.buyer_name}}</span>
                    <span class="onehalf">{{item.phone_number}}</span>
                    <span style="flex: 1.2">￥{{item.final_price}}</span>
                    <span style="flex: 2">{{item.doctor_info!='0-'?item.doctor_info:item.recommender_info}}</span>
                    <!-- <span style="flex: 2">{{item.recommender_info}}</span> -->
                    <span>{{item.order_status}}</span>
                    <span class="onehalf">{{item.order_source}}</span>
                    <span class="onehalf">{{item.order_type}}</span>
                    <span class="onehalf">{{item.is_virtual?'虚拟':'实物'}}</span>
                    <span class="showDetail half" style="flex: 2">
                        <i @click="goDetaile(item.id_order)">查看</i>
                        <i @click="refundHandle(item.id_order,item.reference)" v-if="allowed&&item.order_status!=='已退款'&&item.order_status!=='已取消'&&item.order_status!=='待付款'">退货</i>
                        <i class="print" @click="showSheet(item.id_order)" :class="{activeClass: item.printed=='1'}" v-if="!item.is_virtual">打印</i>
                    </span>
                    <!-- <span class="showDetail half" @click="goDetaile(item.id_order)">查看</span>
                    <span class="showDetail half" @click="refundHandle(item.id_order,item.reference)">
                        <span v-if="item.order_status!='已退款'||item.order_status!='已取消'">退货</span>
                    </span>
                    <span class="showDetail half print" @click="showSheet(item.id_order)" :class="{activeClass: item.printed=='1'}">打印</span> -->
                </li>
            </ul>
            <el-dialog title="退货" :visible.sync="refundToast">
                <refund :orderInfo="this.orderInfo" :userName="username" @uploadClose='uploadClose' ref="refund" @getOrderList='getOrderList'></refund>
            </el-dialog>
            <!--打印电子面单-->
            <el-dialog title="电子面单" :visible.sync="ewaybill">
                <Sheet v-loading="loading" :orderId="orderId" :sheetForm="sheetForm" :Name="name"></Sheet>
            </el-dialog>
        </div>
        
        <!-- 翻页 -->
        <div class="pagin">
            <el-pagination background layout="prev, pager, next" :current-page="orderListQuerys.num" :page-size="orderListQuerys.size" :total="orderTotal" @current-change="changePage">
            </el-pagination>
        </div>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import refund from '@/components/stock/refundToast.vue'
import util from '../../utils/util.js'
import Sheet from '@/components/Sheet.vue'
export default {
    data() {
        return {
            userName: "",  // 登陆用户
            accessToken:'',
            orderTotal: 0, // 订单总数
            orderStatus: [            // 所有订单状态
                { value: 1, label: "待付款" },
                { value: 2, label: "已付款" },
                { value: 4, label: "已发货" },
                { value: 6, label: "已取消" },
                { value: 7, label: "已退款" },
                { value: 13, label: "已完成" }
            ],
            searchType: "",    // 搜索类型
            searchTypes: [
                { value: 1, label: "电话" },
                { value: 3, label: "推荐医生ID" },
                { value: 2, label: "客户姓名" },
                { value: 4, label: "订单号" },
                { value: 5, label: "金额" }
            ],
            orderShopVirtual: [
                { value: 0, label: "实物" },
                { value: 1, label: "虚拟" }
            ],
            searchValue: "",    // 搜索值
            orderSources: [], // 来源列表（接口获取）
            orderTypes: [], // 类型列表（接口获取）
            testChecked: true,  // true: 忽略测试订单
            showSearch: false,
            showCondition: false,
            searchTip: "展开搜索",
            conditionTip: "展开筛选",
            refundToast: false,    //退货
            orderInfo: {},          //退货信息
            //print
            ewaybill: false,
            name: '',
            sheetForm: {},
            loading: false,
            orderId:'',
            g_accessToken: '',
            g_username: '',
            allowed: ''
        }
    },
    created() {
        this.g_accessToken = localStorage.getItem('g_accessToken')
        this.g_username = localStorage.getItem('g_username')
        this.testChecked = this.filterTest;
        this.initOrder();
        this.getST();
    },
    methods: {
        // 获取订单所有来源及类型
        getST() {
            let _this = this
            this.$api.sourceType()
                .then(res => {
                    _this.orderSources = res.data.data.order_source
                    _this.orderTypes = res.data.data.order_type
                })
        },
        // 获取订单列表
        getOrderList() {
            let loading = this.$loading({
                lock: true,
                text: '数据加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let data = {
                        username:this.g_username,
                        access_token:this.g_accessToken,
                        ...this.orderListQuerys
            }
            console.log(data)
            this.$api.getOrderList(data)
                .then((res) => {
                    // this.orderList = res.data.data.list
                    this.$store.commit('ORDERLIST', { val: res.data.data.list })
                    this.orderTotal = res.data.data.total_num
                    this.allowed = res.data.data.allowed
                    loading.close(); // 隐藏loading
                })
                .catch(err => { console.log(err) })
        },
        // 翻页
        changePage(e) {
            this.orderListQuerys.num = e;
            this.getOrderList();
        },
        goDetaile(id) {
            this.$router.push({ path: 'detail', query: { orderId: id } })
        },
        filterConditions() {
            // 重置搜索条件
            this.orderListQuerys.key_word_type = this.cSearch.type = "";
            this.orderListQuerys.key_word = this.cSearch.value = "";
            this.$store.commit('CSEARCH', { type: this.cSearch.type, val: this.cSearch.value })
            // 获取并存储筛选条件
            let _conditions = this.chConditions
            this.orderListQuerys.status = _conditions.chStatus;
            this.orderListQuerys.source = _conditions.chSource;
            this.orderListQuerys.type = _conditions.chType;
            this.orderListQuerys.virtual = _conditions.chShopVirtual === ''? -1 : _conditions.chShopVirtual;
            this.orderListQuerys.beginDate = _conditions.chaDate.length > 0 ? _conditions.chaDate[0] : "" // 开始时间 
            this.orderListQuerys.endDate = _conditions.chaDate.length > 0 ? _conditions.chaDate[1] : ""   // 结束时间
            this.$store.commit('CCONDITIONS', { status: _conditions.chStatus, source: _conditions.chSource, type: _conditions.chType, date: _conditions.chaDate,virtual:  _conditions.chShopVirtual})

            // 存储接口参数
            this.$store.commit('ORDERLISTQUERYS', { val: this.orderListQuerys })
            this.getOrderList();

        },
        searchOrders() {
            // 重置筛选条件
            this.orderListQuerys.status = [];
            this.orderListQuerys.source = [];
            this.orderListQuerys.type = [];
            this.orderListQuerys.beginDate = "";
            this.orderListQuerys.endDate = "";
            this.orderListQuerys.virtual = -1;
            this.$store.commit('CCONDITIONS', { status: [], source: [], type: [], date: [], virtual: ''})
            // 重置日期

            // 存储搜索条件
            this.orderListQuerys.key_word_type = this.cSearch.type;
            this.orderListQuerys.key_word = this.cSearch.value;
            this.$store.commit('CSEARCH', { type: this.cSearch.type, val: this.cSearch.value })

            this.$store.commit('ORDERLISTQUERYS', { val: this.orderListQuerys })
            this.getOrderList();
        },
        initOrder() {
            let _storageConditions = localStorage.getItem('cconditions')
            let _storageSearch = localStorage.getItem('csearch')
            // 初始化订单参数
            let _conditions = this.chConditions
            
            // 打印电子面单清空sotre,从localsotrage里获取
            if (_storageConditions) {
                _conditions = JSON.parse(_storageConditions)
                this.$store.commit('CCONDITIONS', { status: _conditions.chStatus, source: _conditions.chSource, type: _conditions.chType, date: _conditions.chaDate, virtual: _conditions.chShopVirtual})
                localStorage.removeItem("cconditions")
            }
            if (_storageSearch) {
                let searchJson = JSON.parse(_storageSearch)
                this.$store.commit('CSEARCH', { type: searchJson.type, val: searchJson.value })
                localStorage.removeItem("csearch")
            }
            this.orderListQuerys.status = _conditions.chStatus;
            this.orderListQuerys.source = _conditions.chSource;
            this.orderListQuerys.type = _conditions.chType;
            this.orderListQuerys.virtual = _conditions.chShopVirtual===''?-1:_conditions.chShopVirtual;
            console.log( _conditions,_conditions.chShopVirtual)
            this.orderListQuerys.key_word_type = this.cSearch.type;
            this.orderListQuerys.key_word = this.cSearch.value;
            this.orderListQuerys.beginDate = _conditions.chaDate.length > 0 ? _conditions.chaDate[0] : "" // 开始时间 
            this.orderListQuerys.endDate = _conditions.chaDate.length > 0 ? _conditions.chaDate[1] : ""   // 结束时间
            this.getOrderList();
        },
        clearSearchValues() {
            if (this.cSearch.type || this.cSearch.value) {
                this.cSearch.type = "";
                this.cSearch.value = "";
            } else {
                return;
            }
        },
        // 导出excel
        exportExcel() {
            // 接口请求时间过长，显示loading，提高用户体验
            let loading = this.$loading({
                lock: true,
                text: '下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let _beginDate = this.orderListQuerys.beginDate;  // 开始时间 可传空
            let _endDate = this.orderListQuerys.endDate;     // 结束时间 可传空
            let _ignore_test = this.orderListQuerys.ignore_test;  // 是否过滤测试订单 1:忽略, 0:不忽略
            let _status = this.orderListQuerys.status;  // 状态
            let _source = this.orderListQuerys.source;  // 来源
            let _type = this.orderListQuerys.type;      // 类型
            let _key = this.orderListQuerys.key_word_type;
            let _value = this.orderListQuerys.key_word;
            let _virtual = this.orderListQuerys.virtual
            this.$api.exportList(_beginDate, _endDate, _ignore_test, _status, _source, _type, _key, _value, _virtual)
                .then((res) => { // 处理返回的文件流
                    loading.close(); // 隐藏loading
                    if (res.data) {
                        util.download(res.data, '订单列表') // 开始下载
                    } else {
                        this.$message.error('没有可导出的数据')
                    }

                })
                .catch(err => console.log(err))
        },
        showSearchBox() {
            this.showSearch = !this.showSearch
            if (this.showSearch) {
                this.searchTip = "隐藏搜索"
            } else {
                this.searchTip = "展开搜索"
            }
        },
        showConditionBox() {
            this.showCondition = !this.showCondition
            if (this.showCondition) {
                this.conditionTip = "隐藏筛选"
            } else {
                this.conditionTip = "展开筛选"
            }
        },
        changeTest() {
            let _checked = this.testChecked;
            this.orderListQuerys.ignore_test = _checked ? 1 : 0;
            this.$store.commit('FILTERTEST', _checked)
            this.initOrder();
        },
        reload() {
            // 重置筛选条件
            this.orderListQuerys.status = [];
            this.orderListQuerys.source = [];
            this.orderListQuerys.type = [];
            this.orderListQuerys.virtual = '';
            this.orderListQuerys.beginDate = "";
            this.orderListQuerys.endDate = "";
            this.$store.commit('CCONDITIONS', { status: [], source: [], type: [], date: [], virtual: '' })
            // 重置搜索条件
            this.orderListQuerys.key_word_type = this.cSearch.type = "";
            this.orderListQuerys.key_word = this.cSearch.value = "";
            this.$store.commit('CSEARCH', { type: this.cSearch.type, val: this.cSearch.value })
            this.showSearch = false;
            this.showCondition = false;
            this.getOrderList();
            // this.$router.go(0)
        },
        refundHandle(id, reference) {
            this.orderInfo = {
                id: id,
                reference: reference
            }
            this.refundToast = true
            if (this.$refs.refund) {
                this.$refs.refund.reason = ''
            }
        },
        uploadClose(value) {
            this.refundToast = false
        },
        printSheet(id_order) {
            this.loading = true;
            let data = {
                username: this.username,
                access_token: this.accessToken,
                id_order: id_order
            };
            this.$api.ewaybill(data).then(res => {
                if (res.data.status == 200) {
                    this.loading = false;
                    this.sheetForm = res.data.data
                    this.name = this.sheetForm.product_list
                    this.getOrderList()
                }
            })
        },
        showSheet(id_order) {
            this.orderId=id_order
            console.log(`this.orderId:${id_order}`)
            this.printSheet(id_order)
            this.ewaybill = true;
        }
    },
    computed: {
        ...mapGetters([
            'orderList',
            'orderListQuerys',
            'cSearch',
            'chConditions',
            'filterTest'
        ]),
        // 登陆用户

       	username() {
			let username = localStorage.getItem('g_username');
			this.accessToken = localStorage.getItem('g_accessToken');
			return username ? username : this.userName;
		}
    },
    components: {
        Sheet,
        refund
    }
}
</script>
<style scoped>
.el-tag {
	color: #333;
	background: #fff;
	border: 0;
}
.print {
	color: #67c23a;
	font-weight: bold;
}
.activeClass {
	color: red;
	font-weight: bold;
}

/* * {
    margin: 0;
    padding: 0;
    border: 0;
} */
.clearfix {
	overflow: auto;
	_height: 1%;
}
/* filter conditions */
.orderSearch {
	width: 100%;
	margin-top: 20px;
	padding: 10px;
	border: 1px solid #ededed;
	display: flex;
	box-sizing: border-box;
	margin-bottom: 5px;
	position: relative;
	justify-content: flex-start;
}
.orderSearch .searchBox {
	margin-right: 10px;
}
.orderSearch .searchBox.clearSearch {
	line-height: 35px;
	margin-right: 5px;
	cursor: pointer;
}
.orderSearch .searchBox.searchVal {
	width: 500px;
}
.orderSearch .searchBox.searchBtn {
	position: absolute;
	right: 40px;
	top: 5px;
}
.listFilter {
	padding: 10px;
	border: 1px solid #ededed;
	position: relative;
	box-sizing: border-box;
}
.conditionFilter {
	display: flex;
}
.conditionBox {
	margin-right: 10px;
}
.conditionFilter.dateFilter {
	margin-bottom: 10px;
}
.conditionFilter .dataTit {
	font-size: 14px;
	color: #666;
	line-height: 30px;
	margin-right: 10px;
}
.orderConditions {
	position: absolute;
	right: 20px;
	top: 20px;
	width: 100px;
	height: 40px;
}
/* list warp */
.order ul,
.order ul li {
	list-style: none;
	font-size: 12px;
	color: #333;
}
.orderList {
	width: 100%;
	position: relative;
}
.orderList button,
.orderList .el-button {
	padding: 0;
}
.orderList > ul {
	margin-top: 10px;
}
.orderList > ul > li {
	display: flex;
	min-height: 30px;
	line-height: 30px;
	border: 1px solid #ccc;
	border-top: none;
	text-align: center;
}
.orderList > ul > li:first-child {
	border: none;
	height: 30px;
	line-height: 30px;
}
.orderList > ul > li > span {
	flex: 1;
	word-break: break-all;
}
.orderList > ul > li > span.half {
	flex: 0.5;
}
.orderList > ul > li > span.onehalf {
	flex: 1.5;
}
.orderList ul li.listLine:hover {
	background: #efefef;
}
.orderList ul li.listLine span.showDetail {
	
	
}
.orderList ul li.listLine span.showDetail i{
    cursor: pointer;
    font-style: normal;
    margin: 0 2px;
    text-decoration: underline;
}
.orderList ul li.listTit {
	background: rgb(78, 132, 233);
	color: #fff;
	font-weight: 600;
	border-top: none;
	border-left: none;
	border-right: none;
}
.pagin {
	margin-top: 20px;
	text-align: right;
}
.exportBtn {
	/* text-align: right; */
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}
.exportBtn .checkTest {
	margin-right: 50px;
}
</style>