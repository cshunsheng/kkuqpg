<template>
    <div class="supplier">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <Search :userData="this.userData" @updatePage="updatePage" :authinfo="auth_info" :inputVal="stock_inputVal" :importLoading.sync="importLoading" :importLoadingStatus.sync="importLoadingStatus"
        :suplist="supList"
        @updatestatus="updatestatus"></Search>
        <div class="table-list">
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="supplierList" v-loading="importLoading" >
                <el-table-column prop="id_supplier" label="序号" width="60" fixed></el-table-column>
                <el-table-column prop="supplier_code" label="供应商编码" fixed></el-table-column>
                <el-table-column prop="name" label="供应商名称" fixed></el-table-column>
                <el-table-column prop="manufacturer_str" label="品牌" width="120"></el-table-column>
                <el-table-column label="对接人姓名" prop="contact_name" width="120"></el-table-column>
                <el-table-column label="对接人电话" prop="mobile_phone" width="120"></el-table-column>
                <el-table-column label="邮箱" prop="email" width="120"></el-table-column>
                <el-table-column label="打款账号" prop="bank_account_number" width="120"></el-table-column>
                <el-table-column label="地址" prop="address" width="120"></el-table-column>
                <el-table-column label="户名" prop="user_name" width="120"></el-table-column>
                <el-table-column label="打款银行" prop="bank_name" width="120"></el-table-column>
                <el-table-column label="营业执照" prop="business_license" width="120">
                    <template slot-scope="scope">
                        <div class="head_pic" v-if="scope.row.business_license" @click="viewImg(scope.$index, scope.row,type='bus_license')">
                            <img :src="scope.row.business_license">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="许可证" prop="licence" width="120">
                    <template slot-scope="scope">
                        <div class="head_pic" v-if="scope.row.licence" @click="viewImg(scope.$index, scope.row, type='lin')">
                            <img :src="scope.row.licence">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="authorization" label="授权书" width="120">
                    <template slot-scope="scope">
                        <div class="head_pic" v-if="scope.row.authorization" @click="viewImg(scope.$index, scope.row,type='authorization')">
                            <img :src="scope.row.authorization">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column prop="" label="操作" fixed="right" width="220" v-if="auth_info.action_supplier == 1">
                    <template slot-scope="scope">
                        <div class="btn-style">
                            <el-button size="mini" @click="toLook(scope.row)" type="primary">查看
                            </el-button>
                            <el-button size="mini" type="success" @click="toEdit(scope.$index, scope.row,2)">编辑
                            </el-button>
                        </div>
                        <div class="btn-style2">
                            <el-button size="mini" type="info" @click="goOperation(scope.row)">操作记录</el-button>
                            <el-button size="mini" type="danger" @click="delSup(scope.$index, scope.row)">隐藏
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="" fixed="right" width="120">
                    <template slot-scope="scope" >
                        <el-select v-model="scope.row.check_state" size="mini" placeholder="" v-if="auth_info.check_state == 1" @change="updateCheckState(scope.row)" :class="{font_size_blue:scope.row.check_state==0,font_size_black:scope.row.check_state==1,font_size_red:scope.row.check_state==-1}">
                            <el-option v-for="(item, index) in checkList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <span class="font_size_blue"  v-if="auth_info.check_state == 0&&scope.row.check_state == 0">待审核</span>
                        <span class="font_size_black" v-if="auth_info.check_state == 0&&scope.row.check_state == 1">审核通过</span>
                        <span class="font_size_red"   v-if="auth_info.check_state == 0&&scope.row.check_state == -1">审核失败</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="supListTotal">
            </el-pagination>
        </div>
        <!-- 查看供应商 -->
        <el-dialog title="供应商信息" :visible.sync="showRecords" @close="closeSupplierList">
            <!-- <Showpro :userData="userData" :styleObj="styleObj" :idSupplier="idSupplier"></Showpro> -->
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="infoList">
                    <el-table-column prop="id_stock_product" label="商品序号" width="120"></el-table-column>
                    <el-table-column prop="product_name" label="商品名称"></el-table-column>
                    <el-table-column prop="attribute_str" label="规格"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="changeListPage" background layout="prev, pager, next" :current-page="currentListPageNum" :page-size="pageSize" :total="infoListTotal" v-if="infoListTotal!=0">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 操作记录模块 -->
        <el-dialog title="操作记录" :visible.sync="showOperation" @close="closeOperationList">
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="operationList">
                    <el-table-column prop="id_supplier" label="序号" width="60"></el-table-column>
                    <el-table-column prop="operator" label="操作用户"></el-table-column>
                    <el-table-column prop="text_log" label="操作内容"></el-table-column>
                    <el-table-column prop="created_at" label="操作时间"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="changeLogPage" background layout="prev, pager, next" :current-page="currentLogPageNum" :page-size="logPageSize" :total="logTotal" v-if="logTotal!=0">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 图片显示器 -->
        <el-dialog title="图片显示" :visible.sync="showImgs">
            <ViewImgs :imgs="imgs"></ViewImgs>
        </el-dialog>
    </div>
</template>
<script>
import Search from '@/components/pssm/search.vue'
import Showpro from '@/components/pssm/viewPro.vue'
import ViewImgs from '@/components/pssm/viewImgs.vue'
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
            showRecords: false,
            showImgs: false,
            keywords: '',
            imgs: [],     //图片查看
            idSupplier:'',
            currentListPageNum: 1,
            infoListPageSize: 10,
            infoListTotal: 0,
            infoList: [],
            auth_info:'',
            importLoading: false,
            importLoadingStatus: false,
            showOperation: false,
            idSupplierLog: '',
            currentLogPageNum: 1,
            logPageSize: 10,
            logTotal: 0,
            operationList: [],
            checkList:[
                { value: '0', label: "待审核" },
                { value: '1', label: "审核通过" },
                { value: '-1', label: "审核失败" }
            ],
        }
    },
    mounted() {
        this.currentPage = this.$store.state.stock.supListNum
        this.supList(this.$store.state.stock.supListNum)
    },
    //进入edit
    beforeRouteLeave(to, from, next) {
        if (!to.path.endsWith('edit')) {
            this.$store.dispatch('SUPINPUTVALUE', {
                inputVal: ""
            })
        }
        next()
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
            this.auth_info = JSON.parse(localStorage.getItem('auth_info'))
        },
        updatePage(value) {
            this.currentPage = value
        },
        changePage(e) {
            this.currentPage = e
            this.supList(this.currentPage, this.pageSize)
        },
        changeListPage(e){
            this.currentListPageNum = e
            this.getSupplierInfoList()
        },
        changeLogPage(e) {
            this.currentLogPageNum = e
            this.getOperationList()
        },
        viewImg(index, scope, type) {
            this.showImgs = true
            let _this = this
            let _data = {
                id_supplier: scope.id_supplier,
            }
            _data = Object.assign({}, _data, this.userData)
            this.$api.getSup(_data)
                .then(res => {
                    let _business_license = res.data.data.business_license      //营业执照
                    let _licence = res.data.data.licence                        //许可证
                    let _authorization = res.data.data.authorization            //授权书
                    if (type == 'bus_license') {
                        _this.imgs = _business_license;
                    } else if (type == 'lin') {
                        _this.imgs = _licence;
                    } else if (type == 'authorization') {
                        _this.imgs = _authorization;
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        toLook(scope) {
            this.idSupplier=scope.id_supplier
            this.showRecords = true
            this.getSupplierInfoList()
        },
        goOperation(scope) {
            this.idSupplierLog = scope.id_supplier
            this.showOperation = true
            this.getOperationList()
        },
        toEdit(index, scope,type) {
            this.$store.commit('SUPLISTNUM', { num: this.currentPage })
            this.$router.push({ path: 'edit', query: { id_supplier: scope.id_supplier } })
        },
        delSup(index, scope) {
            let data = {
                id_supplier: scope.id_supplier                       // id
            };
            data = Object.assign({}, data, this.userData)
            this.$api.delSup(data).then((res) => {
                this.supList(this.currentPage, this.pageSize)
            })
        },
        supList(page_num = 1, page_size = 20) {
            let data = {
                access_token: this.access_token,
                username: this.username,
                keywords: this.$store.state.inventory.inputVal || '', // 关键字. 为空表示搜索所有
                page_num: page_num,                              // 几页
                page_size: page_size                             // 每页数量
            };
            this.$api.supplierList(data).then((res) => {
                let _list = res.data.data.supplier_list;
                this.$store.commit('SUPPLIERLIST', { list: _list })
                this.$store.commit('SUPLISTTOTAL', { total: Number(res.data.data.total_num) })
                if(this.importLoading) {
                    this.importLoading = false
                    this.importLoadingStatus= false
                }
            })
        },
        closeSupplierList() {
            this.idSupplier = ''
            this.currentListPageNum = 1
        },
        closeOperationList() {
            this.idSupplierLog = ''
            this.currentLogPageNum = 1
        },
        getSupplierInfoList() {
            let _id = this.idSupplier
            let _pageNum = this.currentListPageNum
            let data = {
                id_supplier: this.idSupplier,
                page_num:_pageNum,
                page_size:this.infoListPageSize
            };
            Object.assign(data, this.userData)
            this.$api.getSupplier(data)
                .then(res => {
                    if(res.data.status == 200) {
                        this.infoList = [].concat(res.data.data.list)
                        this.infoListTotal = res.data.data.total_num
                    }else {
                        console.log(res.data.res)
                    }
                })
        },
        getOperationList() {
            let data = {
                id_supplier: this.idSupplierLog,
                page_num:this.currentLogPageNum,
                page_size:this.logPageSize
            };
            Object.assign(data, this.userData)
            this.$api.getSupplierlog(data)
                .then(res => {
                    if (res.data.status == 200) {
                        this.operationList = [].concat(res.data.data.log_list)
                        this.logTotal = Number(res.data.data.total_num)
                    }else {
                        console.log(res.data.res)
                    }
                }) 
        },
        updatestatus(val) {
            val.val1 != undefined ? this.importLoading = val.val1 : ''
            val.val2 != undefined ? this.importLoadingStatus = val.val2 : ''
        },
        updateCheckState(scope){
            console.log(scope)
            let data = {
                id_supplier: scope.id_supplier,
                check_state: scope.check_state
            }   
            data = Object.assign({},data,this.userData)
            this.$api.supplierCheckState(data)
                .then(res => {
                    console.log(res)
                    if(res.data.status == 200) {
                        this.supList(this.currentPage, this.pageSize)
                        this.$message.success(`${res.data.msg}`)
                    }else {
                        this.$message.error(`${res.data.msg}`)
                    }
                })
        }
    },
    destroyed() {
    },
    computed: {
        ...mapGetters([
            'supplierList',
            'stock_inputVal',
            'supListTotal',
            'supListNum'
        ])
    },
    components: {
        Search,
        Showpro,
        ViewImgs    //大图显示
    },
    
}
</script>
<style lang="scss">
.supplier {
    .head_pic {
        width: 50px;
        height: 50px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .font_size_blue,
    .font_size_blue .el-input__inner{
        color: #20a0ff
    }
    .font_size_black,
    .font_size_black .el-input__inner{
        color: #606266
    }
    .font_size_red,
    .font_size_red .el-input__inner{
        color: #f56c6c
    }
    .btn-style {
        margin-bottom: 10px;
    }
}

</style>
