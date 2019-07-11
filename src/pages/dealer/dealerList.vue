<template>
    <div class="dealer_list">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/dealer'}">
                    <i class="el-icon-menu"></i>经销商
                </el-breadcrumb-item>
                <el-breadcrumb-item>经销商</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="margin-bottom: 20px; display: flex;">
            <el-button type="primary" @click="showAddEdit=true">新增</el-button>
            <el-input v-model="keywords" placeholder="请输入经销商名称或者ID" style="width:300px;margin: 0 20px"></el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="dealerList">
                <el-table-column prop="id_dealer" label="ID" width="80"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="order_email" label="实时订单邮箱"></el-table-column>
                <el-table-column prop="report_email" label="日、月报邮箱"></el-table-column>
                <el-table-column prop="contact_name" label="联系人姓名"></el-table-column>
                <el-table-column prop="mobile_phone" label="联系人手机号"></el-table-column>
                <el-table-column label="操作" prop="in_black_list">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small" @click="look(scope.row)">查看</el-button>
                        <!-- <el-button type="primary" size="small" @click="lookDoctor(scope.row)">查看医生</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="新增/编辑" :visible.sync="showAddEdit"  @close="closeAddEdit">
            <el-form :model="formAddEdit" >
                <el-form-item label="名称：" label-width="120px" required>
                    <el-input v-model="formAddEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="实时订单邮箱：" label-width="120px" required>
                    <el-input v-model="formAddEdit.order_email"></el-input>
                </el-form-item>
                <el-form-item label="日、月报邮箱：" label-width="120px" required>
                    <el-input v-model="formAddEdit.report_email"></el-input>
                </el-form-item>
                <el-form-item label="联系人姓名：" label-width="120px">
                    <el-input v-model="formAddEdit.contact_name"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号：" label-width="120px">
                    <el-input v-model="formAddEdit.mobile_phone"></el-input>
                </el-form-item>
                <el-form-item label="关联商品：" label-width="120px">
                    <el-select v-model="formAddEdit.product_id" placeholder="请输入商品名称" clearable filterable>
                        <el-option v-for="item in productList" :key="item.id_product" :label="'(ID='+ item.id_product + ')' + item.name" :value="item.id_product"></el-option>
                    </el-select>
                    <el-button type="primary" style="float: right" @click="save">添 加</el-button>
                </el-form-item>
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="productData">
                    <el-table-column property="id_product" label="商品ID" width="80"></el-table-column>
                    <el-table-column property="name" label="名称"></el-table-column>
                    <el-table-column property="active" label="上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.active == 1">上线</span>
                            <span v-if="scope.row.active == 0">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="doctor_visible" label="医生端上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.doctor_visible == 1">上线</span>
                            <span v-if="scope.row.doctor_visible == 0">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="patient_visible" label="患者端上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.patient_visible == 1">上线</span>
                            <span v-if="scope.row.patient_visible == 0">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="delProduct(scope.row)" size="mini">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddEdit = false">取 消</el-button>
                <el-button type="primary" @click="toSave">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="lookDealerInfo" @close="closeInfo">
            <div style="margin:10px 0;">商品信息：</div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="productData">
                    <el-table-column property="id_product" label="商品ID" width="80"></el-table-column>
                    <el-table-column property="name" label="名称"></el-table-column>
                    <el-table-column property="active" label="上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.active == 1">上线</span>
                            <span v-if="scope.row.active == 0">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="doctor_visible" label="医生端上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.doctor_visible == 1">上线</span>
                            <span v-if="scope.row.doctor_visible == 0">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="patient_visible" label="患者端上下线状态">
                        <template slot-scope="scope">
                            <span class="font_color" v-if="scope.row.patient_visible == 1">上线</span>
                            <span v-if="scope.row.patient_visible == 0">下线</span>
                        </template>
                    </el-table-column>
                </el-table>
            <div style="margin:10px 0;">销售信息：</div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="saleData">
                <el-table-column property="id_sale" label="ID"></el-table-column>
                <el-table-column property="name" label="姓名"></el-table-column>
                <el-table-column property="mobile_phone" label="手机号"></el-table-column>
            </el-table>
            <div style="margin:10px 0;">医生信息：</div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="doctorData">
                <el-table-column prop="doctor_id" label="ID"></el-table-column>
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="phone_num" label="手机号"></el-table-column>
                <el-table-column prop="hospital_name" label="医院"></el-table-column>
                <el-table-column prop="department_name" label="科室"></el-table-column>
                <!-- <el-table-column prop="title_name" label="职位"></el-table-column> -->
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userData: {},
            auth_info: {},
            styleObj: {
                "text-align": "center",
            },
            total: 0, //列表总数量
            currentPage: 1, //当前页数
            pageSize: 20, //分页条数
            dealerList: [],  //列表数组
            showAddEdit: false, // 新增编辑模态框
            lookDealerInfo: false, //查看模态框
            keywords: '',  //搜索关键词
            formAddEdit: {  //新增编辑表单数据
                name: '',
                order_email: '',
                report_email: '',
                contact_name: '',
                mobile_phone: '',
                product_id: '',
                product_info: [],
            },
            productData: [], //商品列表数组
            saleData: [],//销售列表数组
            doctorData: [],//医生列表数组
            id_dealer: '', //经销商ID,
            productList: [],//商品数据
        }
    },
    created() {
        this.init()
        this.getDealerList()
        this.getProductList()
    },
    methods: {
        //翻页
        changePage(e) {
            this.currentPage = e
            this.getDealerList(this.currentPage)
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
        //获取经销商数据
        async getDealerList(page_num=1,page_size=20) {
            let data = {
                page_num: page_num,
                page_size:  page_size,
                keywords: this.keywords
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:{dealer_list,total_num}}} = await this.$api.getDealerList(data)
            // console.log(res)
            if (status == 200) {
                this.dealerList = dealer_list
                this.total = total_num
            }
        },
        // toAdd(){
        //     this.
        //     this.getProductList()
        // },
        //编辑按钮
        toEdit(scope) {
            this.showAddEdit=true
            this.id_dealer = scope.id_dealer
            this.getDealerInfo(scope.id_dealer)
            this.getProductList()
        },
        //获取经销商详细信息
        async getDealerInfo(id) {
            let data = {
                id_dealer: id
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:resData}}= await this.$api.getDealerInfo(data)
                if (status == 200) {
                    this.formAddEdit.name = resData.name
                    this.formAddEdit.order_email = resData.order_email
                    this.formAddEdit.report_email = resData.report_email
                    this.formAddEdit.contact_name = resData.contact_name
                    this.formAddEdit.mobile_phone = resData.mobile_phone
                    this.formAddEdit.product_info = resData.product_list.map(v => v.id_product)
                    this.productData = resData.product_list
                }
        },
        //初始化模态框书数据
        closeAddEdit(){
            this.formAddEdit.name = ''
            this.formAddEdit.order_email = ''
            this.formAddEdit.report_email = ''
            this.formAddEdit.contact_name = ''
            this.formAddEdit.mobile_phone = ''
            this.formAddEdit.product_id = ''
            this.productData = [];
            this.formAddEdit.product_info = [];
            this.id_dealer = ''
        },
        //关闭查看模块
        closeInfo() {
            this.productData = [];
            this.saleData = [];
            this.doctorData = [];
        },
        //查看按钮
        async look(scope){
            let data = {
                id_dealer: scope.id_dealer
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:resData}}= await this.$api.getDealerInfo(data)
                if (status == 200) {
                    this.lookDealerInfo = true
                    this.productData = resData.product_list
                    this.saleData = resData.sale_list
                    this.doctorData = resData.doctor_list
                }
        },
        //搜索按钮
        search() {
            this.getDealerList()
        },
        //添加按钮
        save() {
            if (this.formAddEdit.product_id == '') return false
            let item = this.productList.find(v => v.id_product == this.formAddEdit.product_id)
            if(this.formAddEdit.product_info.some(v => v == item.id_product)) return false
            this.formAddEdit.product_info.push(item.id_product)
            this.productData.push(item)
        },
        //保存按钮
        async toSave() {
            if (this.formAddEdit.name == '') {
                this.$message.error("请输入经销商名称")
                return false;
            }
            if (this.formAddEdit.order_email == '') {
                this.$message.error("请输入实时订单邮箱")
                return false;
            }
            if (this.formAddEdit.report_email == '') {
                this.$message.error("请输入日、月报邮箱")
                return false;
            }
            let reg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/

            if (!reg.test(this.formAddEdit.order_email)) {
                this.$message.error("请输入正确格式的实时订单邮箱")
                return false;
            }
            if (!reg.test(this.formAddEdit.report_email)) {
                this.$message.error("请输入正确格式日、月报邮箱")
                return false;
            }
            let data = {}
            this.formAddEdit.product_info=JSON.stringify(this.formAddEdit.product_info)
            data = Object.assign({},this.formAddEdit,this.userData)
            // data.product_info = 
            if (this.id_dealer){
                data.id_dealer = this.id_dealer
                let res = await this.$api.editDealer(data)
                console.log(res)
                this.getDealerList(this.currentPage)
                this.showAddEdit = false
                this.$message.success('编辑成功')
                this.getProductList()
            }else {
                let res = await this.$api.addDealer(data)
                console.log(res)
                this.getDealerList(this.currentPage)
                this.showAddEdit = false
                this.$message.success('新增成功')
                this.getProductList()
            }
            

        },
        //删除商品
        delProduct(scope) {
            let index1 = this.formAddEdit.product_info.findIndex(v => v == scope.id_product)
            let index2 = this.productData.findIndex(v => v.id_product == scope.id_product)
            this.formAddEdit.product_info.splice(index1,1)
            this.productData.splice(index2,1)
        },
        //获取商品数据
        async getProductList() {
            let data = {
                is_doc: 2,
                type: 1
            }
            let res = await this.$api.com_pro_list(data)
            this.productList = res.data.data 
        }
    }
}
</script>
<style>
    .dealer_list .font_color {
        color: #20a0ff;  
    }

</style>