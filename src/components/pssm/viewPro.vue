<template>
    <div class="table-list">
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="infoList">
            <el-table-column prop="id" label="序号" width="60"></el-table-column>
            <el-table-column prop="product_name" label="商品名称"></el-table-column>
            <el-table-column prop="attribute_name" label="规格"></el-table-column>
            <el-table-column prop="last_time" label="上次进货日期" width="120"></el-table-column>
            <el-table-column prop="all_num" label="上次进货量" width="120"></el-table-column>
            <el-table-column prop="mobile_phone" label="总进货量" width="120"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="ProTotal">
            </el-pagination>
        </div>
        <!-- <div>data:{{supplierInfoList}}</div> -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            supInfo: [],
            currentPage: 1,
            pageSize: 20,
            ProTotal: 0,
            infoList: []
        }
    },
    props: ['userData', 'styleObj', 'idSupplier'],
    computed: {
        supplierInfoList() {
            let _supinfo = []
            let _id = this.idSupplier
            let _pageNum = this.currentPage
            let data = {
                id_supplier: this.idSupplier,
                page_num:_pageNum,
                page_size:this.pageSize
            };
            Object.assign(data, this.userData)
            this.$api.getSupplier(data)
                .then(res => {
                    this.infoList = [].concat(res.data.data.list)
                    this.ProTotal = res.data.data.total_num
                })
            return _supinfo
        }
    },

    created() {
        // this.getStok()
    },

    methods: {
        changePage(e) {
            this.currentPage = e
        },
    }
}
</script>
<style>
.pssm-search {
	height: 40px;
	margin-bottom: 20px;
}
</style>

