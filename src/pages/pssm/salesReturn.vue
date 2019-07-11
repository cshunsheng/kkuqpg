<template>
    <div class="salesReturn">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: ''}">
                    <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>退货管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="condition">
            <el-row :gutter="15" class="box">
                <el-col :span="4">
                    <div class="add-wrap">
                        <slot name="add-btn">本月退货总次数：{{month_count}}</slot>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="refundList">
            <el-table-column prop="id" label="序号"></el-table-column>
            <el-table-column prop="reference" label="订单号"></el-table-column>
            <el-table-column prop="product_name" label="商品名称"></el-table-column>
            <el-table-column prop="product_attribute_str" label="规格"></el-table-column>
            <el-table-column prop="product_quantity" label="数量"></el-table-column>
            <el-table-column label="退货价格" prop="total_price">
                <template slot-scope="scope">
                    <span>{{scope.row.total_price | price}}</span>
                </template>
            </el-table-column>
            <el-table-column label="退货日期" prop="date_add"></el-table-column>
            <el-table-column label="退货原因" prop="refund_reason"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="refundTotal">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            userData: null,
            styleObj: {
                "text-align": "center",
            },
            currentPage: 1,
            pageSize: 20,
            month_count: 0,
        }
    },
    computed: {
        ...mapGetters([
            'refundList',
            'refundTotal'
        ])
    },
    created() {
        this.init()
        this.getRefundlist()
    },
    methods: {
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
        },
        updatePage(value) {
            this.currentPage = value
        },
        changePage(e) {
            this.currentPage = e
            this.getRefundlist(this.currentPage, this.pageSize)
        },
        getRefundlist(page_num = 1, page_size = 20) {
            let data = {
                page_num: page_num || 1,                             
                page_size: page_size                             
            };
            data = Object.assign({}, data, this.userData)
            this.$api.getRefundlist(data).then((res) => {
                let _list = res.data.data.refund_list;
                this.month_count = res.data.data.month_count
                this.$store.commit('REFUNDLIST', { list: _list })
                this.$store.commit('REFUNDTOTAL', { total: Number(res.data.data.total_num) })
            })
        },
    },
}
</script>
<style>
.pssm-search {
	height: 40px;
	margin-bottom: 20px;
}
.condition {
	margin-bottom: 15px;
}
</style>

