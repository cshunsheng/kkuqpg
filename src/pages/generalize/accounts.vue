<template>
    <div class="generalizeList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/generalize/accounts'}">
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="accountsWrap">
            <div class="accountNumbers">
                <span>用户共计：{{total}}名</span>
                <span>正式：{{regular_num}}名</span>
                <span>预备：{{reserve_num}}名</span>
            </div>
            <ul class="accountList tableList">
                <li>
                    <span>日期</span>
                    <span>用户ID</span>
                    <span>姓名</span>
                    <span>电话</span>
                    <span style="flex: 1.2">头像</span>
                    <span style="flex: 3">支付宝/银行卡</span>
                    <span>推荐人ID</span>
                    <span>押金</span>
                    <span>押金金额</span>
                    <span>身份</span>
                    <span>粉丝</span>
                    <!-- <span>操作</span> -->
                </li>
                <li class="listLine" v-for="(item,index) in generalizeAccountList">
                    <span>{{item.create_ts}}</span>
                    <span>{{item.user_id}}</span>
                    <span>{{item.user_name}}</span>
                    <span>{{item.mobile_number}}</span>
                    <span style="flex: 1.2"><img :src="item.head_picture"></span>
                    <span style="flex: 3">
                        {{item.alipay==''?'无':item.alipay}}
                    </span>
                    <span>{{item.father_id}}</span>
                    <span>{{item.deposit_status==0?'未交':(item.deposit_status===1?'已交':'已退')}}</span>
                    <span>{{item.deposit.toFixed(1)}}</span>
                    <span>{{item.current_status==0?'预备':'正式'}}</span>
                    <span>{{item.fans_num}}</span>
                    <!-- <span><i @click.stop="editAccount(item.user_id)">编辑</i><i @click="deleteAccount(item.user_id)">删除</i></span> -->
                </li>
            </ul>
            <!-- 翻页 -->
            <div class="pagin">
                <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div>

            <!-- 编辑 -->
            <el-dialog title="编辑" :visible.sync="showEdit">
                <el-form label-width="120px" :model="editInfos">
                    <el-form-item label="ID">
                        <el-input :disabled="true" v-model="editInfos.user_id"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input v-model="editInfos.user_name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input type="tel" maxlength="11" v-model="editInfos.mobile_number"></el-input>
                    </el-form-item>
                    <el-form-item label="支付宝账号">
                        <el-input v-model="editInfos.alipay"></el-input>
                    </el-form-item>
                    <el-form-item label="推荐人ID">
                        <el-input required v-model="editInfos.father_id"></el-input>
                    </el-form-item>
                    <el-form-item label="头像">
                        <el-upload class="avatar-uploader-generalize" action="http://admin-api.test.kangkanghui.com/upload/file" :on-success="handleAvatarSuccess" :show-file-list="false">
                            <img v-if="editInfos.head_picture" :src="editInfos.head_picture" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEdit">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            userName: '',
            accessToken: '',
            page: 1,
            size: 10,
            total: 0, // 总人数
            regular_num: 0, // 正式人数
            reserve_num: 0, // 预备人数
            editInfos:{},
            showEdit: false,
        }
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getAccountList()
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getAccountList();
        },
        // 获取用户列表
        getAccountList() {
            this.$api.generalizeAccounts(this.accessToken, this.userName, this.page)
                .then(res=>{
                    let resData = res.data.data;
                    this.$store.commit('GENERALIZEACCOUNTLIST',{list:resData.user_list})

                    this.total = resData.total;
                    this.regular_num = resData.regular_num;
                    this.reserve_num = resData.reserve_num;
                    this.size = resData.page_size;
                })
        },
        // 编辑用户信息
        editAccount(uid) {
            this.showEdit = true;
            this.$api.accountInfo(this.accessToken,this.userName,uid)
                .then(res=>{
                    this.editInfos = res.data.data.user_info
                })
        },
        // 上传头像返回处理
        handleAvatarSuccess(res, file) {
            // this.editInfos.head_picture = URL.createObjectURL(file.raw);
            this.editInfos.head_picture = res.data.image_url;
        },
        // 退出编辑
        cancelEdit() {
            this.showEdit = false;
        },
        // 保存编辑
        saveEdit() {
            if(this.editInfos.user_name.length==0){
                this.$message.error('输入用户名');
            }else if(this.editInfos.mobile_number.length==0){
                this.$message.error('请输入电话');
            }else if(this.editInfos.alipay.length==0){
                this.$message.error('请输入支付宝账号');
            }else if(this.editInfos.father_id.length==0){
                this.$message.error('请输入推荐人ID');
            }else if(this.editInfos.head_picture.length==0){
                this.$message.error('请上传头像');
            }else{
                this.$api.accountEdit(this.editInfos,this.accessToken,this.userName,'edit')
                    .then(res=>{
                        if(res.status === 200){
                            this.showEdit = false;
                            this.getAccountList();
                        }
                    })
                    .catch(err=>{console.log(err)})
            }
        },
        // 删除用户
        deleteAccount(userId) {
            this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteAccount(this.accessToken,this.userName,userId,"delete")
                    .then(res=>{
                        if(res.status === 200){
                            this.getAccountList();
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

        }
    },
    computed: {
        ...mapGetters([
            'generalizeAccountList'
        ])
    }
}
</script>
<style scoped>
@import url('../../../static/css/tableStyle.css');
.accountNumbers {
    font-size: 14px;
    color: #333;
    margin: 15px 0;
}
.accountNumbers span {
    margin-right: 100px;
}

.avatar-uploader-generalize .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
.avatar-uploader-generalize .el-upload:hover {
    border-color: #409EFF;
  }

.avatar-uploader-generalize .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
.avatar-uploader-generalize .avatar {
    width: 98px;
    height: 98px;
    display: block;
  }

</style>