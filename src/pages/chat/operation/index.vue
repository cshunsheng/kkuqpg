<template>
    <div class="chat_operation">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/chat'}">
                    <i class="el-icon-menu"></i>患者交流群
                </el-breadcrumb-item>
                <el-breadcrumb-item>群聊运营</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs type="border-card" v-model="active">
                <el-tab-pane label="用户管理" name="users">
                    <div class="select_module">
                        <el-form :model="selectForm" :inline="true">
                            <el-form-item label="消息时间段：">
                                <el-date-picker
                                    @change="changeTime"
                                    format="yyyy-MM-dd HH:mm:ss" 
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    v-model="selectForm.start_date"
                                    type="datetime"
                                    placeholder="开始时间">
                                </el-date-picker>
                                <el-date-picker
                                    @change="changeTime"
                                    format="yyyy-MM-dd HH:mm:ss" 
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    v-model="selectForm.end_date"
                                    type="datetime"
                                    placeholder="结束时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item >
                                <el-select v-model="selectForm.type" placeholder="条件搜索" clearable size="small">
                                    <el-option v-for="item in termList" :key="item.value" :label="item.name" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item ><el-input v-model="selectForm.keyword" size="small" placeholder="请输入内容"></el-input></el-form-item>
                            <el-form-item><el-button type="primary" size="small" @click="changeSelect">搜索</el-button></el-form-item>
                        </el-form>
                    </div>
                    <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="usersList" v-loading="loading">
                        <el-table-column prop="created_at" label="创建时间"></el-table-column>
                        <el-table-column prop="uid" label="用户ID" width="80"></el-table-column>
                        <el-table-column prop="nick_name" label="昵称"></el-table-column>
                        <el-table-column prop="avatar" label="头像">
                            <template slot-scope="scope">
                                <img class="image_style" :src="scope.row.avatar" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200" prop="in_black_list">
                            <template slot-scope="scope">
                                <span class="in_black_list" v-if="scope.row.in_black_list == 0" @click="inBlack(scope.row,1)">拉黑</span>
                                <span v-if="scope.row.in_black_list == 1" @click="inBlack(scope.row,2)" style="cursor:pointer;">取消拉黑</span>
                                | <span class="in_black_list" @click="toLog(scope.row)">操作记录</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="群聊管理" name="groupChat">
                    <GroupChat :userData="this.userData" :styleObj="this.styleObj"></GroupChat>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="操作记录" :visible.sync="dialogLog" width="50%" @close="colseLog">
            <el-table  border :header-cell-style="styleObj" :cell-style="styleObj" :data="dataLog">
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
import GroupChat from './groupChat.vue'
export default {
    data() {
        return {
            userData: {},
            auth_info: {},
            styleObj: {
                "text-align": "center",
            },
            active: 'users',
            selectForm: {
                start_date: '',
                end_date: '',
                type: '',
                keyword: '',
            }
            ,termList:[
                {name:'用户昵称',value:1},
                {name:'群聊名称',value:2}
            ],
            total: 0,
            usersList:[],
            currentPage: 1,
            pageSize: 20,
            loading: false,
            dialogLog: false,
            currentPageLog: 1,
            pageSizeLog: 2,
            totalLog: 0,
            dataLog: [],
            logUid: ''
        }
    },
    created() {
        this.init()
        this.getChatUsers()
    },
    methods: {
        changePage(e) {
            this.currentPage = e
            this.getChatUsers(this.currentPage)
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
        changeTime() {
            let s_time = Date.parse(this.selectForm.start_date)
            let e_time = Date.parse(this.selectForm.end_date)
            if (s_time > e_time) {
                this.$message.error('结束时间应该大于开始时间')
                this.selectForm.e_time = ""
                return false;
            }
            this.getChatUsers()
        },
        changeSelect() {
            this.getChatUsers()
        },
        async getChatUsers(page=1,page_size=20) {
            this.loading = true
            let data = {
                page: page,
                page_size: page_size
            }
            data = Object.assign({},data,this.selectForm)
            let {data:{status,data:{total,user_list}}} = await this.$api.getChatUsers(data)
            this.loading = false
            if(status == 200) {
                this.usersList = user_list
                this.total = Number(total)
            }
        },
        async inBlack(scope,type) {
            let title
            if (type == 1) {
                title = '确定拉黑该用户吗？拉黑后用户将被踢出群聊。'
            } else if (type == 2) {
                title = '确认取消拉黑？取消后用户可正常在群内聊天。'
            }
            let flag = await this.$confirm(`${title}`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
            let {uid,in_black_list:in_balck} = scope
            let data = {
                uid: uid,
                status: in_balck == 0?1:0,
            }
            data = Object.assign({},data,this.userData)
            let {data:{status}} = await this.$api.joinBlackList(data)
            if(status == 200) {
                this.getChatUsers(this.getChatUsers)
            }
        },
        toLog(scope){
            this.dialogLog = true
            this.logUid = scope.uid
            this.getChatLog()
        },
        async getChatLog(){
            let data = {
                page: this.currentPageLog,
                page_size: this.pageSizeLog,
                oid: this.logUid,
                type: 1
            }
            let res = await this.$api.getChatLog(data)
            if(res.data.status == 200) {
                this.dataLog = res.data.data.list
                this.totalLog = Number(res.data.data.total)
            } else {
                this.$message.error(res.data.msg)
            }
        },
        changePageLog(e) {
            this.currentPageLog = e
            this.getChatLog()
        },
        colseLog() {
            this.logUid = ''
            this.currentPageLog = 1
            this.dataLog = [];
            this.totalLog = 0
        }
    },
    components: {
        GroupChat
    },
}
</script>
<style>
    .chat_operation .image_style {
        width: 40px;
        height: 40px;
    }
    .chat_operation .in_black_list {
        color: #20a0ff;
        cursor:pointer;
    }

</style>