<template>
    <div class="purchasing_list">
        <!-- 采购清单
            -->
        <div class="search">
            <el-form ref="searchForm" :model="searchForm" >
                <div class="form_item">
                    <el-form-item>
                        <el-date-picker
                            @change="changeTime"
                            format="yyyy-MM-dd HH:mm:ss" 
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="small"
                            v-model="searchForm.s_time"
                            type="datetime"
                            placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                            @change="changeTime"
                            format="yyyy-MM-dd HH:mm:ss" 
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="small"
                            v-model="searchForm.e_time"
                            type="datetime"
                            placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item> 
                </div>
                <div class="form_item">
                    <el-form-item label="供应商：" label-width="120px">
                        <el-select v-model="searchForm.id_supplier" placeholder="所有" clearable size="mini" @change="changeSelect">
                            <el-option
                            v-for="item in supplierList"
                            :key="item.id_supplier"
                            :label="'(ID='+ item.id_supplier + ')' + item.name"
                            :value="item.id_supplier">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form_item">
                    <el-form-item label="打款状态：" label-width="90px">
                        <el-select v-model="searchForm.payment_status" placeholder="全部" clearable  size="mini" @change="changeSelect">
                            <el-option
                            v-for="item in paymentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form_item">
                    <el-form-item label="商品名称/ID：" size="mini" style="width:300px;" label-width="120px">
                        <el-input v-model="searchForm.keywords" placeholder="请输入商品名称或商品ID"></el-input>
                    </el-form-item>
                </div>
                <div class="form_item" style="padding-left:20px">
                    <el-button type="primary" size="mini" class="btn" @click="search">搜索</el-button>
                    共计：{{total}}条结果
                </div>
            </el-form>
        </div>
        <div class="list">
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="shoppinglist">
                <el-table-column prop="created_at" label="时间" width="120"></el-table-column>
                <el-table-column prop="id_stock_product" label="商品ID"></el-table-column>
                <el-table-column prop="product_name" label="商品名称"></el-table-column>
                <el-table-column prop="attribute_name" label="规格">
                    <!-- <template slot-scope="scope">
                        <p class="ser-line" v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                        {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                        </p>
                    </template> -->
                </el-table-column>
                <el-table-column prop="supplier_name" label="供应商"></el-table-column>
                <el-table-column prop="total_num" label="采购数量"></el-table-column>
                <el-table-column prop="price" label="采购单价（元）"></el-table-column>
                <el-table-column prop="total_amount" label="采购金额（元）"></el-table-column>
                <el-table-column prop="al_stock_in_num" label="已入库数量"></el-table-column>
                <el-table-column label="是否已打款">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.payment_status" placeholder="全部" size="mini"  @change="changePayment(scope.row)" :class="{fontColor:scope.row.payment_status == 2}">
                            <el-option v-for="item in paymentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="remark" v-if="auth_info.purchase_stock_in == 1" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" :disabled="scope.row.payment_status == 1 || scope.row.total_num - scope.row.al_stock_in_num - scope.row.wait_stock_in_num <= 0" @click="toIn(scope.row)">入库</el-button>
                        <el-button size="mini" type="primary" @click="toLog(scope.row)">操作记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </div>
        <!-- 入库操作 -->
        <el-dialog title="入库显示" :visible.sync="showStockIn">
            <ShowIn :userData="userData" :styleObj="styleObj" :checkPrice="checkPrice" :formData="formData" :purchasing="purchasing" :total_num="total_num" @cancel="cancel"></ShowIn>
        </el-dialog>
        <el-dialog title="操作记录" :visible.sync="dialogLog" width="50%" @close="colseLog">
            <el-table  border :header-cell-style="styleObj" :cell-style="styleObj" :data="dataLog">
                <el-table-column property="id_stock_product" label="商品ID"></el-table-column>
                <el-table-column property="product_name" label="商品名称"></el-table-column>
                <el-table-column property="attribute_name" label="规格"></el-table-column>
                <el-table-column property="text_log" label="操作内容"></el-table-column>
                <el-table-column property="operator" label="操作人"></el-table-column>
                <el-table-column property="created_at" label="操作时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changePageLog" background layout="prev, pager, next" :current-page="currentPageLog" :page-size="pageSizeLog" :total="totalLog">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ShowIn from '@/components/pssm/ShowIn.vue'
export default {
    data() {
        return {
            userData: {},
            auth_info: {},
            paymentOptions: [
                {value: 1, label: "未打款"},
                {value: 2, label: "已打款"}
            ],
            paymentList: [
                {label: "是",value: 2},
                {label: "否",value: 1}
            ],
            searchForm: {
                s_time: '',
                e_time: '',
                id_supplier: '',
                payment_status: '',
                keywords: ''
            },
            total: 0,
            shoppinglist:[],
            currentPage: 1,
            pageSize: 20,
            showStockIn: false,
            purchasing: true,
            checkPrice: '',
            formData: {},
            idStock: '',
            total_num: '',
            dialogLog: false,
            currentPageLog: 1,
            pageSizeLog: 20,
            totalLog: 0,
            dataLog: [],
            logHid: ''
        }
    },
    created() {
        this.init()
        this.getShoppinglist()
    },
    mounted() {
        this.$root.eventBus.$on('updateList', (res)=>{
            this.getShoppinglist()
        })
    },
    methods: {
        getShoppinglist() {
            let data = {
                page_num: this.currentPage,
                page_size: this.pageSize ,
            }
            data = Object.assign({},data,this.searchForm, this.userData)
            this.$api.getShoppinglist(data)
                .then(res => {
                    if(res.data.status == 200) {
                        this.shoppinglist = res.data.data.shopping_list
                        this.total = res.data.data.total_num
                    }
                })
        },
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
            this.auth_info = JSON.parse(localStorage.getItem('auth_info'))
        },
        toIn(scope) {
            console.log(scope)
            this.showStockIn = true
            this.idStock = scope.id
            this.total_num = scope.total_num - scope.al_stock_in_num - scope.wait_stock_in_num;
            this.formData = {
                type: 2,
                name: scope.product_name,
                id_stock: scope.id_stock,
                id_supplier: scope.id_supplier,
                fixed_price: scope.price,
                product_attribute_list: scope.attribute_name,
                hid: scope.hid,
                total_num: scope.total_num - scope.al_stock_in_num - scope.wait_stock_in_num,
                supplier_name: scope.supplier_name
            }
            this.checkPrice = scope.price

            // console.log(this.formData)
        },
        changePage(e) {
            this.currentPage = e
            this.getShoppinglist()
        },
        changePayment(scope) {
            this.$confirm(`确定要修改打款状态吗？请谨慎操作`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
                .then(res => {
                    let data = {
                        payment_status: scope.payment_status,
                        hid: scope.hid
                    }
                    data = Object.assign({},data,this.userData)
                    this.$api.updatePaymentStatus(data)
                        .then(res => {
                            if (res.data.status == 200) {
                                this.$root.eventBus.$emit('updateStatisticList', 1)
                                this.$message.success(res.data.msg)
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                })
                .catch(res => {
                    scope.payment_status = scope.payment_status == 1?2:1;
                })
            // let data = {
            //     payment_status: scope.payment_status,
            //     hid: scope.hid
            // }
            // data = Object.assign({},data,this.userData)
            // this.$api.updatePaymentStatus(data)
            //     .then(res => {
            //         if (res.data.status == 200) {
            //             this.$root.eventBus.$emit('updateStatisticList', 1)
            //             this.$message.success(res.data.msg)
            //         } else {
            //             this.$message.error(res.data.msg)
            //         }
            //     })
        },
        cancel(value) {
            this.showStockIn = value
        },
        changeTime() {
            let s_time = Date.parse(this.searchForm.s_time)
            let e_time = Date.parse(this.searchForm.e_time)
            if (s_time > e_time) {
                this.$message.error('结束时间应该大于开始时间')
                this.searchForm.e_time = ""
                return false;
            }
            this.getShoppinglist()
        },
        changeSelect() {
            this.currentPage = 1
            this.getShoppinglist()
        },
        search(){
            this.currentPage = 1
            this.getShoppinglist()
        },
        toLog(scope) {
            this.dialogLog = true
            this.logHid = scope.hid
            this.getShoplistlogs()
        },
        async getShoplistlogs() {
            let data ={
                page_size: this.pageSizeLog,
                page_num: this.currentPageLog,
                hid: this.logHid
            }
            data = Object.assign({},data,this.userData)
            let res = await this.$api.getShoplistlogs(data)
            console.log(res)
            this.dataLog = res.data.data.log_list
            this.totalLog = res.data.data.total_num
        },
        changePageLog(e) {
            this.currentPageLog = e
            this.getShoplistlogs()
        },
        colseLog() {
            this.currentPageLog = 1
            this.pageSizeLog = 20
            this.totalLog = 0
            this.dataLog = []
            this.logHid = ''
        }

    },
    props: ['styleObj','supplierList'],
    computed: {

    },
    components: {
        ShowIn,
    }
}
</script>
<style>
.purchasing_list .form_item {
    display: inline-block;
}
.purchasing_list .search .btn {
    margin-right: 20px;
}
.purchasing_list .fontColor .el-input--suffix .el-input__inner {
    color: #20a0ff;
}
</style>

