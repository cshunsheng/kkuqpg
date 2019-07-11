<template>
    <div class="sales">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/dealer'}">
                    <i class="el-icon-menu"></i>经销商
                </el-breadcrumb-item>
                <el-breadcrumb-item>销售人员</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="margin-bottom: 20px; display: flex;">
            <el-button type="primary" @click="showAddEdit=true">新增</el-button>
            <el-input v-model="keywords" placeholder="请输入销售姓名或者ID" style="width:300px;margin: 0 20px"></el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="saleList">
                <el-table-column prop="id_sale" label="销售ID" width="80"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="mobile_phone" label="手机号"></el-table-column>
                <el-table-column prop="dealer_name" label="经销商"></el-table-column>
                
                <el-table-column label="操作" width="200" prop="in_black_list">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="新增/编辑" :visible.sync="showAddEdit" width="560px" @close="closeAddEdit">
            <el-form :model="formAddEdit" style="width:520px">
                <el-form-item label="名称：" label-width="120px" required>
                    <el-input v-model="formAddEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" label-width="120px">
                    <el-input v-model="formAddEdit.mobile_phone"></el-input>
                </el-form-item>
                <el-form-item label="关联经销商：" label-width="120px">
                    <el-select v-model="formAddEdit.id_dealer" placeholder="请输入经销商商名" size="medium" clearable filterable :filter-method="filterMethod" class="el-input-text" @clear="clearSelect">
                        <el-option v-for="item in dealerList" :key="item.id_dealer" :label="'(ID='+ item.id_dealer + ')' + item.name" :value="item.id_dealer"></el-option>
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddEdit = false">取 消</el-button>
                <el-button type="primary" @click="toSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userData: {},
            auth_info: {},
            styleObj: {"text-align": "center",},
            total: 0, //数据条数
            currentPage: 1, //当前页数
            pageSize: 20, // 分页数量,
            saleList: [], //销售列表数组
            keywords: '',//搜索关键词
            showAddEdit: false, //新增编辑
            formAddEdit: {  //新增编辑表单数据
                name: '',
                mobile_phone: '',
                id_dealer: ''
            },
            dealerList: [],
            id_sale: ''
        }
    },
    created() {
        this.init()
        this.getSaleList()
        this.filterMethod()
    },
    methods: {
        //翻页
        changePage(e) {
            this.currentPage = e 
            this.getSaleList(this.currentPage) 
        },
        //数据初始化
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
            this.auth_info = JSON.parse(localStorage.getItem('auth_info'))
        },
        //选择经销商
        async filterMethod(keywords='') {
            let data = {
                type: 1,
                keywords: keywords
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:{dealer_list,total_num}}} = await this.$api.getDealerList(data)
            if (status == 200) {
                this.dealerList = dealer_list
            }
        },
        //select框初始化
        clearSelect() {
            this.filterMethod()
        },
        //获取销售列表数据
        async getSaleList(page_num=1,page_size=20) {
            let data = {
                page_num: page_num,
                page_size:  page_size,
                keywords: this.keywords
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:{sale_list,total_num}}} = await this.$api.getSaleList(data)
            // console.log(res)
            if (status == 200) {
                this.saleList = sale_list
                this.total = total_num
            }
        },
        async getSaleInfo(id) {
            let data = {
                id_sale: id
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:resData}}= await this.$api.getSaleInfo(data)
                if (status == 200) {
                    this.formAddEdit.name = resData.name
                    this.formAddEdit.mobile_phone = resData.mobile_phone
                    this.formAddEdit.id_dealer = resData.id_dealer
                }
        },
        //编辑
        toEdit(scope){
            this.showAddEdit=true
            this.id_sale = scope.id_sale
            this.getSaleInfo(scope.id_sale)
        },
        //搜索
        search() {
            this.getSaleList()
        },
        closeAddEdit() {
            this.formAddEdit.name = ''
            this.formAddEdit.mobile_phone = ''
            this.formAddEdit.id_dealer = ''
            this.id_sale = ''
        },
        //确定
        async toSave() {
            if (this.formAddEdit.name == '') {
                this.$message.error("请输入销售的姓名")
                return false;
            }
            // if (this.formAddEdit.mobile_phone == '') {
            //     this.$message.error("请输入销售的手机号")
            //     return false;
            // }
            // let reg_phone = /^1[345789]\d{9}$/
            // if (!reg_phone.test(this.formAddEdit.mobile_phone)) {
            //     this.$message.error("请正确的手机号")
            //     return false;
            // }
            let data = Object.assign({},this.formAddEdit,this.userData)
            if (this.id_sale) {
                data.id_sale = this.id_sale
                let res = await this.$api.editSale(data)
                this.getSaleList(this.currentPage)
                this.showAddEdit = false
                this.$message.success('编辑成功')
            }else {
                let res = await this.$api.addSale(data)
                this.getSaleList(this.currentPage)
                this.showAddEdit = false
                this.$message.success('新增成功')
            }
        }
    }
}
</script>
<style>
</style>