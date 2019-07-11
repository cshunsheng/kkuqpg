<template>
    <div class="product-manage">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="20" class="box">
            <el-col :span="3">
                <el-button class="full-btn" type="primary" icon="el-icon-plus" @click.stop="createdPro(1)" size="mini" v-if="auth_info.action_product == 1">新增商品</el-button>
            </el-col>
            <el-col :span="4">
                <el-select v-model="type" placeholder="条件搜索" size="mini" @change="stockList(1,20)">
                    <el-option v-for="item in search_types" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7">
                <div class="input-wrap full-box">
                    <el-input :value="ProInputVal" placeholder="输入商品名称或品牌名或sku号" @input="valueChange" size="mini"></el-input>
                </div>
            </el-col>
            <el-col :span="2">
                <el-button class="full-btn" type="primary" @click.stop="stockList(1)" size="mini">搜索</el-button>
            </el-col>
            <el-col :span="3">
                <el-button class="full-btn" type="primary" @click.stop="getAttrlist(1)" size="mini">待确认入库</el-button>
            </el-col>
            <el-col :span="3" v-if="auth_info.cost_info == 1">
                <p>库存总金额：¥{{total_price}}</p>
            </el-col>
            <el-col :span="2" v-if="auth_info.action_product == 1" class="upload">
                <el-upload
                    class="upload-demo"
                    :show-file-list="false"
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleError"
                    ref="upload"
                    action="http://admin-api.test.kangkanghui.com/upload/file"
                    multiple
                    method:="post"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                    <el-button size="mini" type="primary">导入</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <div class="table-list">
            <el-table v-loading="tableLoading" border :span-method="objectSpanMethod" :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="ProList">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column label="规格">
                    <template slot-scope="scope">
                        <p v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                            {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="sku号" prop="sku" width="100"></el-table-column>
                <el-table-column label="品牌名称">
                    <template slot-scope="scope">
                        <!-- <p v-for="(item,index) in scope.row.supplier_info" :key="index">{{item.manufacturer_name}}</p> -->
                        {{scope.row.manufacturer_name}}
                    </template>
                </el-table-column>
                <el-table-column olumn label="入库单价" prop="">
                    <template slot-scope="scope">
                        <el-popover
                        placement="top"
                        width="60"
                        trigger="hover"
                        :disabled="scope.row.stock_in_history.length == 0"
                        popper-class="pop">
                            <div style="width:60px" v-for="(item,index) in scope.row.stock_in_history" :key="index" >{{item.price}}</div>
                            <div slot="reference">{{scope.row.price}}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="当前库存量" prop="physical_quantity"></el-table-column>
                <el-table-column label="库存总金额" prop="">
                    <template slot-scope="scope"><p v-if="auth_info.cost_info == 1">{{scope.row.total_price}}</p></template>
                </el-table-column>
                <el-table-column label="供应商">
                    <template slot-scope="scope">
                        <p  v-for="(item,index) in scope.row.supplier_info" :key="index">{{item.name}}<span v-if="item.code">({{item.code}})</span></p>
                    </template>
                </el-table-column>
                <el-table-column label="预警库存" v-if="auth_info.stock_action == 1">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.usable_quantity" :value="scope.row.usable_quantity" @input="valueChangeQu" @blur="qunSet(scope.$index, scope.row)" @focus="oldVal" :disabled="scope.row.disabled==0"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="260" v-if="auth_info.stock_action == 1">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="toIn(scope.$index, scope.row,scope.row.disabled,scope.row.supplier_info[0].id_supplier)" >入库</el-button>
                        <el-button size="mini" type="success" @click="toOut(scope.$index, scope.row,scope.row.disabled)" >出库</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                <el-table-column prop="" label="商品操作" width="100" v-if="auth_info.action_product == 1">
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="mini" type="primary" @click="createdPro(2,scope.row)" :disabled="scope.row.have_attribute == 0">新增规格</el-button>
                        <el-button class="ation-btn" size="mini" type="success" @click="createdPro(3,scope.row)" :disabled="scope.row.disabled!=0">编辑</el-button>
                        <el-button class="ation-btn" size="mini" type="danger" @click="ProDelete(scope)" :disabled="scope.row.disabled!=0">删除</el-button>
                        <el-button class="ation-btn" size="mini" type="info" @click="toOperation(scope.row)">操作记录</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="remark" width="120" >
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
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="ProTotal">
            </el-pagination>
        </div>
        <!-- 查看供应商 -->
        <el-dialog title="待确认入库" :visible.sync="showRecords">
            <ShowInList :userData="userData" :styleObj="styleObj"></ShowInList>
        </el-dialog>
        <!-- 出入库操作 -->
        <el-dialog title="入库显示" :visible.sync="showStockIn">
            <ShowIn :userData="userData" :styleObj="styleObj" :checkPrice="checkPrice" :formData="formData" @cancel="cancel"></ShowIn>
        </el-dialog>
        <el-dialog title="出库显示" :visible.sync="showStockOut">
            <ShowOut :userData="userData" :styleObj="styleObj" :formData="formData" @cancel="cancel"></ShowOut>
        </el-dialog>
        <!--新增商品-->
        <!-- <el-dialog :title="title" :visible.sync="showAddPro" @close="initDialoAttr" @open="openInitDialoAttr"> v-if="showAddPro"-->
        <el-dialog :title="title" :visible.sync="showAddPro" >
            <AddPro :userData="userData"  :styleObj="styleObj" :attrList.sync='attrList' :formDataAdd="formDataAdd" @cancel="cancel"></AddPro>
        </el-dialog>
        <!-- 操作记录模块 -->
        <el-dialog title="操作记录" :visible.sync="showOperation">
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="operationList">
                    <el-table-column prop="id_stock_product" label="序号" width="60"></el-table-column>
                    <el-table-column prop="name" label="商品名称"></el-table-column>
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
    </div>
</template>
<script>
import ShowInList from '@/components/pssm/ShowInList.vue'
import ShowIn from '@/components/pssm/ShowIn.vue'
import ShowOut from '@/components/pssm/ShowOut.vue'
import AddPro from '@/components/pssm/AddPro.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            userData: null,
            total_price: 0,
            type: '',
            ProInputVal: '',
            usable_quantity: '',
            old_usable_quantity: '',
            formData: {},
            formDataAdd: {
                type: '',
                id_stock_product: ''
            },
            search_types: [
                { value: 2, label: "库存不为0" },
                { value: 1, label: "全部" },
            ],
            checkList:[
                { value: 0, label: "待审核" },
                { value: 1, label: "审核通过" },
                { value: -1, label: "审核失败" },
            ],
            styleObj: {
                "text-align": "center",
            },
            currentPage: 1,
            pageSize: 20,
            showRecords: false,
            showStockIn: false,
            showStockOut: false,
            showAddPro: false,
            imgs: [],     //图片查看
            idStock: '',
            value3: true,
            value4: true,
            title:'',
            attrList: [],//属性列表
            server_list: [], // 二级属性列表
            checkPrice: '',
            auth_info: '',
            tableLoading: false,
            loadingStatus: false,
            showOperation: false,
            operationList: [],
            currentLogPageNum: 1,
            logPageSize: 10,
            logTotal: 0,
            id_stock_product: ''
        }
    },
    mounted() {
        this.stockList()
    },
    created() {
        this.init();
    },
    watch: {
        showAddPro: {
            handler: function(val) {
                if(val) {
                    this.$root.eventBus.$emit('openInitDialogData',1)
                }else {
                    this.$root.eventBus.$emit('initDialogData',2)
                }
            }
        }
    },
    methods: {
        createdPro(type,scope) {
            if(type == 2) {
                this.title='新增规格'
                this.idStock = scope.id
                this.formDataAdd.type = 2,
                this.formDataAdd.id_stock_product = scope.id_stock_product
                this.formDataAdd.product_name = scope.name
                this.formDataAdd.id_stock = scope.id_stock
                this.formDataAdd.manufacturer_name = scope.manufacturer_name
                this.formDataAdd.product_attribute_list = scope.product_attribute_list
                this.formDataAdd.remark = scope.remark
                // console.log(this.formDataAdd)
                this.getProAttrOne(scope.id_stock_product)
                
            }else if(type == 3) {
                this.title='编辑商品'
                this.idStock = scope.id
                this.formDataAdd.type = 3,
                this.formDataAdd.id_stock_product = scope.id_stock_product
                this.getProAttr()
                // this.getProAttrOne(scope.id_stock_product) 
            }else if(type == 1) {
                this.formDataAdd.type = 1,
                this.formDataAdd.id_stock_product = ''
                this.formDataAdd.product_name = ''
                this.formDataAdd.id_stock = ''
                this.formDataAdd.manufacturer_name = ''
                this.formDataAdd.product_attribute_list = ''
                this.formDataAdd.remark = ''
                this.attrList = []
                this.title='新增商品';
                this.getProAttr()
            }
            this.showAddPro = true
        },
        ProDelete(scope) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id_stock_product: scope.row.id_stock_product
                };
                data = Object.assign({}, data, this.userData)
                this.$api.delstockproduct(data).then((res) => {
                    if (res.data.status == 200) {
                        this.stockList(this.currentPage, this.pageSize)
                        this.$message.success('删除成功!')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        cancel(value) {
            this.showStockIn = value
            this.showStockOut = value
            this.showAddPro = value
            this.stockList(this.currentPage, this.pageSize)
        },
        qunSet(index, scope) {  
            if (this.old_usable_quantity == scope.usable_quantity) return false
            let data = {
                id_stock: scope.id_stock,                       // id
                usable_quantity: scope.usable_quantity
            };
            data = Object.assign({}, data, this.userData)
            this.$api.setWarnStock(data).then((res) => {
                if (res.data.status == 200) {
                    this.$message.success('预警库存修改成功')
                    this.stockList(this.currentPage, this.pageSize)
                } else {
                    this.$message.error(res.data.msg)
                    this.stockList(this.currentPage, this.pageSize)
                }
            })
        },
        //预警库存
        valueChangeQu(value,val) {
            // console.info(value)
            this.usable_quantity = value
        },
        oldVal(e) {
            this.old_usable_quantity = e.path[0].value
        },
        //待确认
        getAttrlist() {
            this.showRecords = true
        },
        valueChange(value) {
            this.ProInputVal = value
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //console.info(rowIndex, row.start)
            if(this.auth_info.stock_action == 1){
                if (columnIndex == 0 || columnIndex == 1 || columnIndex == 11 || columnIndex == 12 || columnIndex == 13) {
                    if (row.start) {
                        return {
                            rowspan: row.total,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }else if(this.auth_info.stock_action == 0){
                if (columnIndex == 0 || columnIndex == 1 || columnIndex == 9) {
                    if (row.start) {
                        return {
                            rowspan: row.total,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
            
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
        updatePage(value) {
            this.currentPage = value
        },
        changePage(e) {
            this.currentPage = e
            this.stockList(this.currentPage, this.pageSize)
        },
        toIn(index, scope, flag,id_supplier) {
            if(flag == 0) {
                this.$message.error("未绑定基础商品前，不能进行操作")
                return
            }
            this.showStockIn = true
            this.idStock = scope.id
            this.formData = {
                type: 1, //1 商品库管理模块  2采购清单入库模块
                name: scope.name,
                id_stock: scope.id_stock,
                id_supplier: id_supplier,
                fixed_price: scope.fixed_price,
                product_attribute_list: scope.product_attribute_list,
            }
            this.checkPrice = scope.fixed_price

            // console.log(this.formData)
        },
        toOut(index, scope,  flag) {
            if(flag == 0) {
                this.$message.error("未绑定基础商品前，不能进行操作")
                return
            }
            this.showStockOut = true
            this.idStock = scope.id
            this.formData = {
                name: scope.name,
                id_stock: scope.id_stock,
                ex_price: scope.stock_ex_price,
                product_attribute_list: scope.product_attribute_list
            }
        },
        toOperation(scope){
            this.id_stock_product = scope.id_stock_product
            this.showOperation = true
            this.getStockproductlog()
        },
        toEdit(index, scope) {
            this.$router.push({ path: 'edit', query: { id_supplier: scope.id_supplier } })
        },
        delSup(index, scope) {
            let data = {
                id_supplier: scope.id_supplier                       // id
            };
            data = Object.assign({}, data, this.userData)
            this.$api.delSup(data).then((res) => {
                this.stockList()
            })
        },
        stockList(page_num = 1, page_size = 20) {
            let _data = {
                access_token: this.access_token,
                username: this.username,
                keywords: this.ProInputVal || '', // 关键字. 为空表示搜索所有
                page_num: page_num,                              // 几页
                page_size: page_size,                             // 每页数量
                type: this.type
            };
            this.$api.getStockList(_data)
                .then(res => {
                    let _list = res.data.data.product_list;
                    this.total_price = res.data.data.total_price
                    this.$store.commit('PROLIST', { list: _list })
                    this.$store.commit('PROTOTAL', { total: Number(res.data.data.total_num) })
                    if(this.loadingStatus) {
                        this.loadingStatus = false
                        this.tableLoading = false
                    }
                    
                })
        },
        //获取所有规格信息
        getProAttr() {
            let data = {
                type: 1
            }
            Object.assign(data, this.userData)
            this.$api.attributeList(data).then((res) => {
                this.attrList = res.data.data.attribute_info
            })
        },
        //添加规格获取某一商品的规格
        getProAttrOne(id) {
            let data = {
                id_stock_product: id
            }
            Object.assign(data, this.userData)
            this.$api.getProAttr(data).then((res) => {
                this.attrList = res.data.data.group_attribute_list
            })
        },
        initDialoAttr() {
            this.$root.eventBus.$emit('initDialogData',1)
        },
        openInitDialoAttr() {
            this.$root.eventBus.$emit('openInitDialogData',1)
        },
        handlePreview(file) {
            console.log(file)
        },
        beforeAvatarUpload(file) {
            let isfile = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/vnd.ms-excel') ? true: false
            if (!isfile) {
                this.$message.error('上传文件只能是excel表格文件!')
            }
            return isfile;  
        },
        handleAvatarSuccess(res, file) {
            this.tableLoading = true
            let fileUrl = res.data.image_url
            let data = {
                filepath: fileUrl,
                type: 1
            }
            Object.assign(data, this.userData)
            this.$api.uploadStockProduct(data).then((res) => {
                console.log(res)
                if(res.data.status == 200) {
                    this.loadingStatus = true
                    this.stockList()
                    this.$message.success(`${res.data.msg}`)
                }else {
                    this.tableLoading = false
                    this.$message.error(`${res.data.msg}`)
                }
            })
            
        },
        handleError(err, file, fileLis) {
            if(err) {
                this.$message.error('文件上传失败，请重新上传')
            }
        },
        //操作记录分页
        changeLogPage(e){
            this.currentLogPageNum = e
            this.getStockproductlog()
        },
        getStockproductlog() {
            let data = {
                id_stock_product: this.id_stock_product,
                page_size: this.logPageSize,
                page_num: this.currentLogPageNum
            }
            Object.assign(data,this.userData)
            this.$api.getStockproductlog(data).then((res) => {
                if(res.data.status == 200) {
                    this.operationList = res.data.data.log_list
                    this.logTotal = res.data.data.total_num
                }
            })
        },
        updateCheckState(scope){
            // console.log(scope)
            let data = {
                id_stock_product: scope.id_stock_product,
                check_state: scope.check_state
            }   
            data = Object.assign({},data,this.userData)
            this.$api.updateCheckState(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.stockList(this.currentPage, this.pageSize)
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
            'ProList',
            'ProTotal',
        ])
    },
    components: {
        ShowInList,
        ShowIn,
        ShowOut,
        AddPro    //新增商品
    },
}
</script>
<style lang="scss">
.product-manage {
    .ation-btn:not(:last-child) {
        margin-bottom: 10px;
    }

    .ation-btn {
        display: block;
        margin: 0 auto;
    } 
    .el-button--danger:focus {
        background: #f56c6c;
    }
    .table-list {
        margin-top: 20px;
        .ser-line {
            width: 100%;
            border-bottom: 1px solid #ccc;
        }
    }
    .head_pic {
        width: 50px;
        height: 50px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .el-upload--text {
        border: 0 solid #fff;
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
}
// .el-popover {
//     min-width: 60px;
//     text-align: center;
// }
.pop.el-popover {
    min-width: 60px;
    text-align: center;
}



</style>
