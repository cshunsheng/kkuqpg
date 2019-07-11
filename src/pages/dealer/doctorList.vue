<template>
    <div class="dealer_list">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/dealer'}">
                    <i class="el-icon-menu"></i>经销商
                </el-breadcrumb-item>
                <el-breadcrumb-item>医生列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="margin-bottom: 20px; display: flex;">
            <el-button type="primary" @click="showAddEdit=true">新增</el-button>
            <el-button type="primary" @click="showMoreAdd=true">批量新增医生</el-button>
            <el-input v-model="keywords" placeholder="请输入医生姓名或者ID" style="width:300px;margin: 0 20px"></el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="doctorList">
                <el-table-column prop="doctor_id" label="ID"></el-table-column>
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="phone_num" label="手机号"></el-table-column>
                <el-table-column prop="hospital_name" label="医院"></el-table-column>
                <el-table-column prop="department_name" label="科室"></el-table-column>
                <el-table-column prop="title_name" label="职位"></el-table-column>
                <el-table-column prop="dealer_name" label="经销商"></el-table-column>
                <el-table-column prop="sale_info[0].sale_name" label="销售"></el-table-column>
                <el-table-column prop="internal_remark" label="备注"></el-table-column>
                <el-table-column label="操作" width="180" prop="in_black_list">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="toEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small" @click="toCode(scope.row)" :disabled="codeFlag">葵花码</el-button>
                        <!-- <el-button type="primary" size="small" >同步</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
            <div class="wrap">
                <div id="code-wrap" class="code-wrap">
                    <div><img src="https://static.kangkanghui.com/wap/img/focus_doctor_collections/qrcode_step.png" alt=""></div>
                    <div class="code_img"><img :src="QRCodeUrl" alt=""></div>
                    <div><img src="https://static.kangkanghui.com/wap/img/focus_doctor_collections/qrcode_step2.png" alt=""></div> 
                    <div class="no_num">NO.{{no_code}}</div>
                    <div><img src="https://static.kangkanghui.com/wap/img/focus_doctor_collections/qrcode_step3.png" alt=""></div>
                    
                </div>
            </div>
        </div>
        <el-dialog title="新增/编辑" :visible.sync="showAddEdit" width="560px" @close="closeAddEdit">
            <el-form :model="formAddEdit" style="width:520px">
                <el-form-item label="名称：" label-width="120px" required>
                    <el-input v-model="formAddEdit.real_name"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" label-width="120px" required>
                    <el-input v-model="formAddEdit.phone_num"></el-input>
                </el-form-item>
                <el-form-item label="医院：" label-width="120px">
                    <el-select v-model="formAddEdit.hospital_id" placeholder="请选择医院"  size="medium" @change="getDepartment" filterable :filter-method="getHospital" @clear="clearSelect(3)" clearable>
                        <el-option v-for="item in hospitalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科室：" label-width="120px">
                    <el-select v-model="formAddEdit.department_id" placeholder="请输入医生所在科室" size="medium" clearable>
                        <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位：" label-width="120px">
                    <el-select v-model="formAddEdit.title_med" placeholder="请输入医生职位" size="medium">
                        <el-option v-for="item in titleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联经销商：" label-width="120px">
                    <el-select v-model="formAddEdit.id_dealer" placeholder="请输入经销商商名" size="medium" clearable filterable :filter-method="filterMethod" @clear="clearSelect(1)" @change="getSale(2)" @blur="initList(2)">
                        <el-option v-for="item in dealerList" :key="item.id_dealer" :label="'(ID='+ item.id_dealer + ')' + item.name" :value="item.id_dealer"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="关联销售：" label-width="120px">
                    <el-select v-model="formAddEdit.id_sale" placeholder="请输入销售名称" size="medium" clearable filterable>
                        <el-option v-for="item in saleList" :key="item.id_sale" :label="'(ID='+ item.id_sale + ')' + item.name" :value="item.id_sale"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" label-width="120px">
                    <el-input v-model="formAddEdit.internal_remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddEdit = false">取 消</el-button>
                <el-button type="primary" @click="toSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量新增" :visible.sync="showMoreAdd" width="560px" @close="closeAddEdit">
            <el-form :model="formMoreAdd" style="width:520px">
                <el-form-item label="关联经销商：" label-width="120px" required>
                    <el-select v-model="formMoreAdd.id_dealer" placeholder="请选择经销商" size="medium" clearable filterable :filter-method="filterMethod" @clear="clearSelect(2)" @blur="initList(2)">
                        <el-option v-for="item in dealerList" :key="item.id_dealer" :label="'(ID='+ item.id_dealer + ')' + item.name" :value="item.id_dealer"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="医生数量：" label-width="120px" required>
                    <el-input v-model="formMoreAdd.num"></el-input>
                </el-form-item>
                <el-form-item label="备注：" label-width="120px">
                    <el-input v-model="formMoreAdd.internal_remark"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="saveMore">保 存</el-button>
        </el-dialog>
        <el-dialog title="查看葵花码" :visible.sync="showCode" width="790px" @open="openCanvas">
            <div id="img_code" class="img_code"></div>
            <div class="look_num">已浏览次数：{{look_num}}次</div>
            <!-- <el-button type="primary" size="small" @click="codeCanvas">葵花码</el-button> -->
        </el-dialog>
    </div>
</template>
<script>
import html2canvas from 'html2canvas';
export default {
    data() {
        return {
            userData: {},
            auth_info: {},
            styleObj: {"text-align": "center",},
            total: 0,  //列表数据条数
            currentPage: 1,  //当前页数
            pageSize: 20,  //分页条数
            keywords: '',   //搜索关键词
            formAddEdit: {  //新增编辑表单数据
                real_name: '',
                phone_num: '',
                title_med: '',
                department_id: '',
                department_name: '',
                hospital_id: '',
                hospital_name: '',
                internal_remark: '',
                id_dealer: '',
                id_sale: '',
            },
            formMoreAdd: { //批量新增
                num: '',
                id_dealer: '',
                internal_remark: ''
            },
            dealerList: [], //经销商列表
            saleList: [],  //销售列表
            showAddEdit: false,  //新增模态框
            showMoreAdd: false,  //批量模态框
            showCode: false,  //查看葵花码
            doctorList: [], //医生列表数据
            titleList: [],//医生职位信息
            id: '', //医院id
            hospitalList: [{id: -1,name: '请输入医院名称关键词'}],//医院下拉框默认数据
            departmentList: [], //科室数据
            codeFlag: false, //按钮禁用
            QRCodeUrl: "", //二维码URl
            look_num: '',  //浏览次数
            no_code: ''  //识别code
        }
    },
    created() {
        this.init()
        this.getDealerDoctorList()
        this.filterMethod()
    },
    methods: {
        //翻页
        changePage(e) {
            this.currentPage = e
            this.getDealerDoctorList(this.currentPage)
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
        //搜索
        search() {
            this.getDealerDoctorList()
        },
        //初始化模态框
        closeAddEdit() {
            this.formAddEdit.real_name = ''
            this.formAddEdit.phone_num =  ''
            this.formAddEdit.title_med = ''
            this.formAddEdit.department_id = ''
            this.formAddEdit.department_name = ''
            this.formAddEdit.hospital_id = ''
            this.formAddEdit.hospital_name = ''
            this.formAddEdit.internal_remark = ''
            this.formAddEdit.id_dealer = ''
            this.formAddEdit.id_sale = ''
            this.id = ''
            this.departmentList = [];
            this.hospitalList = [{id: -1,name: '请输入医院名称关键词'}];
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
        //选择销售
        async getSale(type) {
            console.log(type)
            if(type == 2) {
                this.formAddEdit.id_sale = ''
            }
            let data = {
                id_dealer: this.formAddEdit.id_dealer
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:{sale_list,total_num}}} = await this.$api.getDealerInfo(data)
            if (status == 200) {
                this.saleList = sale_list
            }
        },
        //select框初始化
        clearSelect(type) {
            if(type == 1){
                this.filterMethod()
                this.saleList = [];
            }else if (type == 2) {
                this.filterMethod()
            }else if (type == 3) {
                this.hospitalList = [{id: -1,name: '请输入医院名称关键词'}];
                this.departmentList = [];
                this.formAddEdit.department_id = ''
            }
        },
        initList(type) {
            // if(type == 1){
            //     if (this.formAddEdit.hospital_id) return false;
                // this.hospitalList = [{id: -1,name: '请输入医院名称关键词'}];
            // }else if (type == 2) {
            this.filterMethod()
            // }
        },
        //获取医生列表数据
        async getDealerDoctorList(page_num=1,page_size=20) {
            let data = {
                page_num: page_num,
                page_size:  page_size,
                keywords: this.keywords
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:{doctor_list,total_num,title_list}}} = await this.$api.getDealerDoctorList(data)
            // console.log(res)
            if (status == 200) {
                this.doctorList = doctor_list
                this.total = total_num
                let titleList = []; 
                for(let key in title_list) {
                    titleList.push({value:key,label:title_list[key]})
                }
                this.titleList = titleList
            }
        },
        //获取医生信息
        async getDoctorInfo(id) {
            let data = {
                id: id
            }
            data = Object.assign({},data,this.userData)
            let {data:{status,data:resData}}= await this.$api.getDoctorInfo(data)
                if (status == 200) {
                    this.formAddEdit.real_name = resData.real_name
                    this.formAddEdit.phone_num = resData.phone_num
                    this.formAddEdit.title_med = resData.title_med
                    this.formAddEdit.department_id = resData.department_id
                    this.formAddEdit.hospital_id = resData.hospital_id
                    this.formAddEdit.department_name = resData.department_name
                    this.formAddEdit.hospital_name = resData.hospital_name
                    this.formAddEdit.internal_remark = resData.internal_remark
                    this.formAddEdit.id_dealer = resData.id_dealer
                    this.formAddEdit.id_sale = resData.sale_info.length == 0?'':resData.sale_info[0].id_sale 
                    this.getDepartment(this.formAddEdit.hospital_id)
                    this.hospitalList = [{id:this.formAddEdit.hospital_id,name:this.formAddEdit.hospital_name}]
                    this.getSale(1)
                }
        },
         //编辑
        toEdit(scope){
            this.showAddEdit=true
            this.id = scope.id
            this.getDoctorInfo(scope.id)
        },
        async toCode(scope) {
            this.QRCodeUrl = await `https://mx.kangkanghui.com/tools/xqrcode?path=pages/shop/classifyResult?doctor_id=${scope.doctor_id}&size=360`
            this.look_num = await scope.view_count
            this.no_code =  await scope.code
            this.codeFlag = await 1==1
            this.showCode = await 1==1
            html2canvas(document.getElementById('code-wrap'),{allowTaint: true,width: 750,height: 1109,scale: 1}).then(canvas => {
                document.getElementById('img_code').appendChild(canvas)
                this.codeFlag = false
            }) 
        },
        openCanvas(){
            if(document.getElementsByTagName('canvas').length == 0) return false;
            // console.log(document.getElementsByTagName('canvas'))
            while(document.getElementById('img_code').firstElementChild) {
                document.getElementById('img_code').removeChild(document.getElementById('img_code').firstElementChild)
            }
            // document.getElementById('img_code').removeChild(document.getElementsByTagName('canvas')[0])
        },
        //提交数据
        async toSave() {
            if (this.formAddEdit.phone_num == '') {
                this.$message.error("请输入医生的手机号")
                return false;
            }
            if (this.formAddEdit.hospital_id == '') {
                this.$message.error("请输入医生所在医院")
                return false;
            }
            if (this.formAddEdit.department_id == '') {
                this.$message.error("请输入医生所在科室")
                return false;
            }
            // let reg_phone = /^1[345789]\d{9}$/
            // if (!reg_phone.test(this.formAddEdit.phone_num)) {
            //     this.$message.error("请正确的手机号")
            //     return false;
            // }
            let data = Object.assign({},this.formAddEdit,this.userData)
            if (this.id) {
                data.id = this.id
                let res = await this.$api.editDealerDoctor(data)
                this.getDealerDoctorList(this.currentPage)
                if (res.data.status == 200) {
                    this.showAddEdit = false
                    this.$message.success('编辑成功')
                } else {
                    this.$message.error(res.data.msg)
                }  
            }else {
                let res = await this.$api.addDealerDoctor(data)
                this.getDealerDoctorList(this.currentPage)
                if (res.data.status == 200) {
                    this.showAddEdit = false
                    this.$message.success('新增成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            }
        },
        //获取医生数据
        async getHospital(e) {
            if (e == '') {
                this.hospitalList = [{id: -1,name: '请输入医院名称关键词'}]; 
                return false
            }
            let data = {
                type: 1,
                // keywords:this.formAddEdit.keywords
                keywords: e
            }
            data = Object.assign({},data,this.userData)
            let res = await this.$api.searchHospital(data)
            if (res.data.status == 200) {
                this.hospitalList = res.data.data
            }
        },
        //获取科室数据
        async getDepartment(id){
            let data = {
                type: 2,
                // keywords:this.formAddEdit.keywords
                hospital_id: id ? id : this.formAddEdit.hospital_id
            }
            data = Object.assign({},data,this.userData)
            let res = await this.$api.searchHospital(data)
            if (res.data.status == 200) {
                this.departmentList = res.data.data
            }
        },
        //批量新增按钮
        async saveMore() {
            let regNum = /^[1-9]\d*$/
            if (this.formMoreAdd.id_dealer == '') {
                this.$message.error("请输入经销商ID")
                return false;
            }
            if (this.formMoreAdd.num == '') {
                this.$message.error("请输入新增医生账号的数量")
                return false;
            }
            if (!regNum.test(this.formMoreAdd.num)) {
                this.$message.error("数量请输入正整数")
                return false;
            }
            let data = Object.assign({},this.formMoreAdd,this.userData)
            let res = await this.$api.docmulAdd(data)
            this.getDealerDoctorList(this.currentPage)
            this.showMoreAdd = false
            this.$message.success('新增成功')
        },
    }
}
</script>
<style>
    .dealer_list .wrap {
        opacity: 0;
        width: 752px;
        border: 1px solid #20a0ff;
        position: absolute;
        top:0;
        left: 0;
        z-index: -1;
    }
    .dealer_list .code-wrap {
        width: 750px;
    }
    .dealer_list .code-wrap .code_img {
        width: 360px;
        height: 360px;
        margin: 64px auto;
    }
    .dealer_list .code-wrap .no_num {
        margin: 50px 0 30px;
        font-size: 30px;
        line-height: 30px;
        height: 30px;
        text-align: center;
        color: #000;
    }
    .dealer_list .look_num {
        margin: 50px 0 30px;
        font-size: 30px;
        line-height: 30px;
        height: 30px;
        text-align: center;
        color: #000;
    }
    .dealer_list .img_code {
        width: 375px;
        height: 1115px;
        /* margin: 0 auto; */
    }   
        

</style>