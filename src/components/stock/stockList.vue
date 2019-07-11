<template>
    <div class="table-list">
        <div class="condition">
            <el-row :gutter="10" class="box">
                <el-col :span="12">
                    <el-date-picker type="datetime" size="small" placeholder="开始时间" v-model="beginDate" @change="getStock(1)" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                    <el-date-picker type="datetime" size="small" placeholder="结束时间" v-model="endDate" @change="getStock(1)" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-col>
                <el-col :span="6" v-if="active==0">
                    <div class="input-wrap full-box">
                        <el-input :value="stockList_searchVal" size="small" :placeholder="serchPlaceholder" @input="valueChange" @updatePage="updatePage"></el-input>
                    </div>
                </el-col>
                <el-col :span="6" v-if="active==1">
                    <div class="input-wrap full-box">
                        <el-input :value="outsearchval" size="small" :placeholder="serchPlaceholder" @input="outChange" @updatePage="updatePage"></el-input>
                    </div>
                </el-col>
                <el-col :span="2">
                    <el-button class="full-btn" type="primary" size="small" @click.stop="getStock(1)">搜索</el-button>
                </el-col>
            
                <el-col :span="4">
                    <div class="add-wrap" v-if="active==0">当月入库总金额：¥{{month_money}}</div>
                    <div class="add-wrap">累计
                        <span v-if="active==0">入</span>
                        <span v-else>出</span>库总金额：¥{{total_price}}
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 入库 -->
        <div >
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="stockList" v-if="active==0">
            <el-table-column prop="id_stock_product" label="商品ID" width="120"></el-table-column>
            <el-table-column prop="sku" label="sku号" width="120"></el-table-column>
            <el-table-column prop="date_in" label="入库时间" width="120"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column label="规格">
            <template slot-scope="scope">
                <p class="ser-line" v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                </p>
            </template>
            </el-table-column>
            <el-table-column prop="total_num" label="入库数量"></el-table-column>
            <el-table-column label="单品进价" prop="price"></el-table-column>
            <el-table-column label="总金额" prop="total_amount"></el-table-column>
            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
            <el-table-column label="发票">
            <template slot-scope="scope">
                <span v-if="scope.row.invoice==2" class="down-status">不开</span>
                <span v-if="scope.row.invoice==1" class="on-status">已开</span>
                <span v-if="scope.row.invoice==0" class="down-status">未开</span>
            </template>
            </el-table-column>
            <el-table-column label="操作人" prop="username"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
        <div class="pagination" v-if="active==0">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="stockTotal">
            </el-pagination>
        </div>
        </div>

        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="stockOutList" v-if="active==1">
            <el-table-column prop="id_stock_product" label="商品ID" width="120"></el-table-column>
            <el-table-column prop="sku" label="sku号" width="120"></el-table-column>
            <el-table-column prop="date_ex" label="出库时间" width="120"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column label="规格">
                <template slot-scope="scope">
                    <p class="ser-line" v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                    {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="ex_num" label="商品数量"></el-table-column>
            <el-table-column label="售价" prop="ex_price"></el-table-column>
            <el-table-column label="总金额" prop="total_amount"></el-table-column>
            <el-table-column label="开具发票">
                <template slot-scope="scope">
                    <span v-if="scope.row.invoice==1" class="on-status">开发票</span>
                    <span v-if="scope.row.invoice==0" class="down-status">不开发票</span>
                </template>
            </el-table-column>
            <el-table-column label="操作人" prop="username"></el-table-column>
            <el-table-column label="买家地址" prop="buyer_address"></el-table-column>
            <el-table-column label="买家姓名" prop="buyer_name"></el-table-column>
            <el-table-column label="买家手机号" prop="buyer_phone"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column> 
            <el-table-column label="订单状态" prop="current_state"></el-table-column>
        </el-table>
        <div class="pagination" v-if="active==1">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="stockOutTotal">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            beginDate: '',
            endDate: '',
            currentPage: 1,
            pageSize: 20,
            keywords: '',
            month_money: 0,
            total_price: 0,
            serchPlaceholder:''
        }
    },
    props: ['userData', 'styleObj', 'active'],
    computed: {
        ...mapGetters([
            'stockList',
            'stockList_searchVal',
            'stockTotal',
            'stockOutList',
            'stockOutTotal',
            'outsearchval'
        ])
    },
    created() {
        this.getStock()
    },
    methods: {
        fromdateChange(val) {
        },
        todateChange(val) {
        },
        updatePage(value) {
            this.currentPage = value
        },
        changePage(e) {
            this.currentPage = e
            this.getStock(this.currentPage, this.pageSize)
        },
        getStock(page_num = 1, page_size = 20, time) {
            this.$emit('updatePage', '')
            let _searchVal
            if(this.active == 0){
                _searchVal = this.$store.state.stock.stockList_searchVal
            }else{
                _searchVal = this.$store.state.stock.outsearchval
            }
            
            let data = {
                keywords: _searchVal || '', // 关键字. 为空表示搜索所有
                s_time: this.beginDate,
                e_time: this.endDate,
                page_num: page_num || 1,                              // 几页
                page_size: page_size                             // 每页数量
            };
            if (this.active == 0) {
                data = Object.assign({}, data, this.userData, { active: 1 })
                this.$api.stockInList(data).then((res) => {
                    let _list = res.data.data.stock_in_list;
                    this.month_money = res.data.data.month_money
                    this.total_price = res.data.data.total_price
                    this.$store.commit('STOCKLIST', { list: _list })
                    this.$store.commit('STOCKTOTAL', { total: Number(res.data.data.total_num) })
                    this.serchPlaceholder = `请输入商品名称或供应商名称`
                })
            } else {
                data = Object.assign({}, data, this.userData)
                this.$api.stockOutList(data).then((res) => {
                    let _list = res.data.data.stock_ex_list;
                    this.total_price = res.data.data.total_price
                    this.$store.commit('STOCKOUTLIST', { list: _list })
                    this.$store.commit('STOCKOUTTOTAL', { total: Number(res.data.data.total_num) })
                    this.serchPlaceholder = `请输入商品名称`
                })
            }
        },
        valueChange(value) {
            this.$store.dispatch('STOCKLISTSEARCHVAL', {
                ['inputVal']: value
            })
        },
        outChange(val){
            this.$store.dispatch('OUTSERACHVAL', {
                ['inputVal']: val
            })
        }
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

