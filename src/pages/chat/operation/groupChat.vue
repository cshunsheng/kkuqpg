<template>
    <div class="group_chat">
        <div style="padding-bottom: 20px">
            <el-input placeholder="输入群聊名称" style="width: 300px" v-model="keyword"></el-input> 
            <el-button type="primary" style="margin-left: 10px" @click="search">搜索</el-button>
            <el-button type="primary" @click="dialogGroupSendMsg = true">群发消息/商品</el-button>
        </div>
        <div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="usersList">
                <el-table-column prop="created_at" label="日期"></el-table-column>
                <el-table-column prop="id" label="群聊ID" width="80"></el-table-column>
                <el-table-column prop="doctor_name" label="群聊名称"></el-table-column>
                <el-table-column prop="doctor_id" label="医生ID"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <span :class="{color_blue:scope.row.active == 1?true:false,color_gray:scope.row.active == 0?true:false}" @click="toMsg(scope.row)">发消息</span> | 
                        <span :class="{color_blue:scope.row.active == 1?true:false,color_gray:scope.row.active == 0?true:false}" @click="toProduct(scope.row)">发商品</span> |
                        <span class="color_blue" v-if="scope.row.active == 1" @click="closeChat(scope.row)">关闭群</span>
                        <span v-if="scope.row.active == 0">已关闭群</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="群发消息/商品" :visible.sync="dialogGroupSendMsg" @close="closeDialog(1)">
            <el-form :model="formSend" >
                <el-form-item label="类型：" label-width="120px">
                    <el-select v-model="formSend.msg_type" placeholder="请选择群发类型" @change="changeMsgType">
                        <el-option  key="text" label="群发消息" value="text"></el-option>
                        <el-option  key="p_link" label="群发商品" value="p_link"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" label-width="67px">
                    <el-radio-group v-model="formSend.group_type" @change="changeRadio">
                        <el-radio :label="1">所有群聊</el-radio>
                        <el-radio :label="2">部分群聊</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="科室：" label-width="120px" v-if="formSend.group_type == 2">
                    <el-select v-model="formSend.department_list" placeholder="请选择科室" clearable filterable multiple @change="filterGroup">
                        <el-option v-for="item in departmentList" :key="item.id" :label="'(ID='+ item.id + ')' + item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择群聊：" label-width="120px" v-if="formSend.group_type == 2" >
                    <!-- style="margin-bottom: 10px" -->
                    <el-checkbox v-model="formSend.all_department_groups" @change="changeDepartment">科室下全部群聊</el-checkbox>
                </el-form-item>
                <el-form-item label="" label-width="120px" v-if="formSend.all_department_groups == false&&formSend.group_type == 2">
                    <el-select v-model="formSend.group_list" placeholder="请输入群聊名称" clearable  multiple filterable>
                        <el-option v-for="item in groupList" :key="item.id" :label="'(ID='+ item.id + ')' + item.doctor_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="消息内容：" label-width="120px" v-if="formSend.msg_type == 'text'">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="formSend.msg_content"></el-input>
                    <span class="color_blue">（注：按“回车”即为内容分段）</span>
                </el-form-item>
                <el-form-item label="商品：" label-width="120px" v-if="formSend.msg_type == 'p_link'">
                    <el-select v-model="formSend.product_list" placeholder="请输入商品名称/商品ID" clearable filterable multiple :filter-method="filterProduct" @visible-change="clearSelect">
                        <el-option v-for="item in productList" :key="item.id_product" :label="'(ID='+ item.id_product + ')' + item.name" :value="item.id_product"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogGroupSendMsg = false">取 消</el-button>
                <el-button type="primary" @click="sendFn(3)">发 送</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发消息" :visible.sync="dialogSendMsg" @close="closeDialog(2)">
            <el-form>
                <el-form-item label="消息内容：" label-width="90px">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="msg_content"></el-input>
                    <span class="color_blue">（注：按“回车”即为内容分段）</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSendMsg = false">取 消</el-button>
                <el-button type="primary"  @click="sendFn(1)">发 送</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发商品" :visible.sync="dialogSendProduct" @close="closeDialog(3)">
            <el-form>
                <el-form-item label="商品：" label-width="90px">
                    <el-select v-model="product_list" placeholder="请输入商品名称/商品ID" clearable filterable multiple :filter-method="filterProduct" @visible-change="clearSelect">
                        <el-option v-for="item in productList" :key="item.id_product" :label="'(ID='+ item.id_product + ')' + item.name" :value="item.id_product"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSendProduct = false">取 消</el-button>
                <el-button type="primary" @click="sendFn(2)">发 送</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            currentPage: 1,
            pageSize: 20,
            usersList: [1],
            keyword: '',
            dialogGroupSendMsg: false,
            dialogSendMsg: false,
            dialogSendProduct: false,
            product_list: [],
            productList: [],
            departmentList: [],
            groupList: [],
            msg_content: '',
            id: '',
            formSend:{
                msg_type: "text", 
                all_department_groups: true,
                group_type: 1,
                department_list: [],
                group_list: [],
                msg_content: '',
                product_list: []
            }
        }
    },
    created() {
        this.getChatGroupList()
        this.filterProduct('')
        this.getChatDepartmentList()
    },
    props:[
        'userData',
        'styleObj'
    ],
    methods: {
        //翻页
        changePage(e) {
            this.currentPage = e
            this.getChatGroupList(e)
        },
        //群搜索
        search() {
            this.getChatGroupList()
        },
        //发消息
        toMsg(scope){
            if (scope.active == 0) return false
            this.dialogSendMsg = true
            this.id = scope.id
        },
        //发商品
        toProduct(scope) {
            if (scope.active == 0) return false
            this.dialogSendProduct = true
            this.id = scope.id
        },
        //列表数据
        async getChatGroupList(page=1,page_size=20) {
            let data = {
                page: page,
                page_size: page_size,
                keyword: this.keyword
            }
            let {data:{status,data:{total,group_list}}} = await this.$api.getChatGroupList(data)
            if(status == 200) {
                this.usersList = group_list
                this.total = Number(total)
            }
        },
        //科室数据
        async getChatDepartmentList() { 
            let res = await this.$api.getChatDepartmentList()
            // console.log(res)
            if(res.data.status == 200) {
                this.departmentList = res.data.data
            }
        },
        //商品关键字匹配
        async filterProduct(keyword){
            let _data = {
                keyword: keyword
            }
            let {data} = await this.$api.getChatProductList(_data)
            // console.log(res)
            if(data.status == 200) {
                this.productList = data.data
            } else {
                this.$message.error(data.msg)
            }
            
        },
        //群聊名称关键子匹配
        async filterGroup(){
            if(this.formSend.department_list.length == 0) {
                this.groupList = [];
                return false
            }
            this.formSend.group_list = [];
            let _data = {
                department_list: this.formSend.department_list
            }
            let {data} = await this.$api.getDepChatGroupList(_data)
            if(data.status == 200) {
                this.groupList = data.data
            } else {
                this.$message.error(data.msg)
            }
            
        },
        //关闭模态框
        closeDialog(type){
            if (type == 1) {
                this.formSend.msg_type = "text"
                this.formSend.all_department_groups = true
                this.formSend.group_type = 1
                this.formSend.department_list = []
                this.formSend.group_list = []
                this.formSend.msg_content = ''
                this.formSend.product_list = []
            }else if (type == 2) {
                this.id = ''
                this.msg_content = ''
            }else if (type == 3) {
                this.product_list = [];
                this.id = ''
            }
        },

        clearSelect(e) {
            if (e) return false
            this.filterProduct()
        },
        changeRadio() {
            this.formSend.all_department_groups = true
            this.formSend.department_list = []
            this.formSend.group_list = []
        },
        //发送
        async sendFn(type){
            let arr = [this.id]
            let data = {
                all_department_groups: 0,
                department_list: [],
                group_type: 2,
                group_list: arr,
            }
            if (type == 1) {
                if (this.msg_content == '') {
                    this.$message.error('请输入内容')
                    return false
                }
                data.msg_content = this.msg_content;
                data.msg_type = 'text';
                data.product_list = [];
            }else if (type == 2) {
                if (this.product_list.length <= 0) {
                    this.$message.error('请选择商品')
                    return false
                }
                data.msg_content = '';
                data.msg_type = 'p_link';
                data.product_list = this.product_list;
            } else if (type ==3) {
                if(this.formSend.group_type == 2 && this.formSend.department_list.length <= 0) {
                    this.$message.error('请选择科室')
                    return false
                }
                if(this.formSend.group_type == 2 && this.formSend.department_list.length > 0 && this.formSend.all_department_groups == false && this.formSend.group_list.length <= 0 ) {
                    this.$message.error('请输入群聊')
                    return false
                }
                data = Object.assign({},data,this.formSend)
                data.all_department_groups = data.all_department_groups?1:0
            }
            let res = await this.$api.chatSendMsg(data)
            if (res.data.status == 200) {
                this.$message.success("发送成功")
                this.dialogSendMsg = false
                this.dialogSendProduct = false
                this.dialogGroupSendMsg = false
            }else {
                this.$message.error(res.data.msg)
            }    
        },
        changeDepartment() {
            this.formSend.group_list = [];
            this.filterGroup()
        },
        changeMsgType() {
            this.formSend.msg_content = ''
            this.formSend.product_list = [];
        },
        //关闭群
        async closeChat(scope) {
            let flag = await this.$confirm(`确定关闭群聊吗？关闭后该群聊将不再显示。`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
            let data = {
                group_id: scope.id,
                status: scope.active == 1 ? 0 : 1
            }
            data = Object.assign({},data,this.userData)
            let {data:{status}} = await this.$api.groupActive(data)
            if(status == 200) {
                this.getChatGroupList(this.currentPage)
            }
        }
    }
}
</script>
<style>
.group_chat .color_blue{
    color: #20a0ff;
    cursor: pointer;
}
.group_chat .color_gray{
    color: gray;
    cursor: pointer;
}
/*  */
</style>