<template>
    <div class="whiteList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/generalize/accounts'}">
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item>白名单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="whiteWrap">
            <div class="addWhiteBtn">
                <el-button @click="showEdit = true">新增</el-button>
            </div>
            <ul class="whiteAccounts tableList">
                <li>
                    <span>用户名</span>
                    <span>电话</span>
                    <span>身份</span>
                    <span>操作</span>
                </li>
                <li class="listLine" v-for="(item,index) in whiteList">
                    <span>{{item.user_name}}</span>
                    <span>{{item.phone}}</span>
                    <span>{{item.type===1?'员工':'其他'}}</span>
                    <span @click="deleteAccount(item.id)">删除</span>
                </li>
            </ul>
            <!-- 翻页 -->
            <div class="pagin">
                <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div>

            <!-- 编辑 -->
            <el-dialog title="新增" :visible.sync="showEdit">
                <el-form label-width="120px">
                    <el-form-item label="姓名">
                        <el-input v-model.trim="name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input type='tel' v-model.trim="telphone" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="身份">
                        <el-select v-model="identity" placeholder="身份">
                            <el-option v-for="i in cIdentitys" :key="i.value" :label="i.label" :value="i.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            whiteList: [],
            page: 1,
            size: 20,
            total: 0,
            name: '',
            telphone: '',
            showEdit: false,
            cIdentitys:[
                {value: 1, label: "雇员"},
                {value: 2, label: "其他"}
            ],
            identity: null
        }
    },
    created () {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getWhitelist();
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getWhitelist();
        },
        // 获取白名单用户列表
        getWhitelist() {
            this.$api.getWhiteList(this.accessToken,this.userName,this.page)
                .then(res=>{
                    let _resData = res.data.data
                    this.whiteList = _resData.white_list;
                    this.total = _resData.total;
                    this.page = _resData.page_num;
                    this.size = _resData.page_size
                })
        },
        // 保存添加白名单
        saveAdd() {
            let _name = this.name;
            let _tel = this.telphone;
            let _identity = this.identity
            if(_name.length <= 0){
                this.$message.warning('请输入姓名')
            }else if(!this.isPhone(_tel)){
                this.$message.warning('请正确填写11位手机号')
            }else if(!_identity){
                this.$message.warning('请选择身份')
            }else{
                this.$api.addWhiteList(this.accessToken,this.userName,this.name,this.identity,this.telphone)
                    .then(res=>{
                        if(res.status === 200){
                            this.name = '';
                            this.telphone = '';
                            this.identity = null
                            this.showEdit = false;
                            this.$message.success('success')
                            this.getWhitelist();
                        }else{
                            this.showEdit = false;
                            this.$message.error(res.msg)
                        }
                    })
            }
            
        },
        cancelAdd() {
            this.name = '';
            this.telphone = '';
            this.identity = null
            this.showEdit = false;
            this.$message('cancel')
        },
        // 删除用户
        deleteAccount(userId) {
            this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteWhiteList(this.accessToken,this.userName,userId)
                    .then(res=>{
                        if(res.status === 200){
                            this.getWhitelist();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },
        isPhone(phone) {
            return /^1[3|4|5|7|8]\d{9}$/.test(phone)
        }
    }
}
</script>
<style>
@import url('../../../static/css/tableStyle.css');
.addWhiteBtn {
    text-align: right;
    margin-bottom: 10px;
}
.whiteAccounts .listLine span:last-child{
    cursor: pointer;
}
</style>