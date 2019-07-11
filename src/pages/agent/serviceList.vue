<template>
    <div class="generalizeProducts">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>服务订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="productsWrap">
            <div class="prosNum">当前共计：{{total}}条结果</div>
            <el-row :gutter="20" class="box">
                <el-col :span="4">
                    <div class="add-wrap">
                        <slot name="add-btn">
                            <el-select v-model="current_status" placeholder="订单状态" size="small" @change="getorderList">
                                <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </slot>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="search_type" placeholder="条件搜索" size="small" @change="valueChangeInput">
                        <el-option v-for="item in search_types" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-input v-model="keywords" placeholder="请输入内容" @input="valueChange"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button class="full-btn" type="primary" @click.stop="getorderList">搜索</el-button>
                </el-col>
            </el-row>
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="docOrderList">
                    <el-table-column prop="reference" label="订单号" width="160" sortable></el-table-column>
                    <el-table-column prop="created_at" label="创建时间"></el-table-column>
                    <el-table-column prop="patient_name" label="患者姓名"></el-table-column>
                    <el-table-column prop="contacts_phone" label="手机号"></el-table-column>
                    <el-table-column prop="service_name" label="服务项目">
                    </el-table-column>
                    <el-table-column label="服务费">
                        <template slot-scope="scope">
                            <span>{{scope.row.amount | price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="医生姓名" prop="doctor_name">
                    </el-table-column>
                    <el-table-column label="代理人" prop="agency_name">
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.current_status==0">未付款</span>
                            <span v-if="scope.row.current_status==1">已付款</span>
                            <span v-if="scope.row.current_status==2">已完成</span>
                            <span v-if="scope.row.current_status==3">退款失败</span>
                            <span v-if="scope.row.current_status==7">已退款</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <span class="on-status" @click='edit(scope.$index, scope.row)'>查看</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div>
            <!-- 订单详情 -->
            <el-dialog title="服务订单详情" :visible.sync="showAdd">
                <agentDetail :orderId="orderId" :userData="userData" :styleObj="styleObj" @initInfo="initInfo" @initInfo1="initInfo1"></agentDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import agentDetail from '@/components/agentDetail.vue'
export default {
    data() {
        return {
            current_status: '',
            search_type: '',
            keywords: '',
            page: 1,
            size: 0,
            total: 0,
            showAdd: false,  // 显示编辑添加商品框
            styleObj: {
                "text-align": "center"
            },
            searchTypes: [
                { value: 1, label: "已付款" },
                { value: 2, label: "已完成" },
                { value: 7, label: "已退款" }
            ],
            search_types: [
                { value: 1, label: "医生姓名" },
                { value: 2, label: "代理人" },
                { value: 3, label: "患者姓名" },
            ],
            orderId: '',
            userData: null,
        }
    },
    created() {
        this.init()
        this.getorderList()
    },
    methods: {
        init() {
            this.userName = localStorage.getItem('g_username')
            this.accessToken = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.accessToken,
                username: this.userName
            }
        },
        // 翻页
        changePage(e) {
            this.page = e;
            this.getorderList();
        },
        // 获取订单列表
        getorderList() {
            console.log(`1${this.current_status}, 2${this.search_type}, 3${this.keywords}`)
            this.$api.orderList(this.accessToken, this.userName, this.page, this.page_size, this.current_status, this.search_type, this.keywords)
                .then(res => {
                    let resData = res.data.data
                    this.$store.commit('DOCORDERLIST', { list: resData.order_list })
                    this.total = resData.total_num
                    this.size = res.data.data.page_size
                    this.page = res.data.data.page
                })
        },
        //change 实时改变value值
        valueChange(value) {
            this.keywords = value
        },
        //编辑
        edit(index, scope) {
            this.showAdd = true
            this.orderId = scope.id
            console.log(`this.orderId:${this.orderId}`)
        },
        initInfo(value) {
            console.log(`value:${value}`)
        },
        initInfo1(value) {
            console.log(`value2:${value}`)
            this.getorderList()
        },
        valueChangeInput(value) {
            console.log(value)
            this.keywords = ''
        }
    },
    computed: {
        ...mapGetters([
            'docOrderList'
        ])
    },
    components: {
        'agentDetail': agentDetail
    }
}
</script>
<style lang="scss" scoped>
.table-list {
	margin-top: 20px;
}
.prosNum {
	margin-bottom: 10px;
}
</style>
