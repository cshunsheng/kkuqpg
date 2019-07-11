<template>
    <div class="page_sysNotice">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>系统通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="noticeWrap">
            <div class="noticeFuns">
                <el-button @click="editNotice" type="primary" size="small">新增通知</el-button>
                <span>当前共计：{{total}}条通知</span>
            </div>
            <el-table border ref="multipleTable" :data="noticelist">
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column prop="msg_id" label="ID"></el-table-column>
                <el-table-column prop="title" label="标题">
                    <template slot-scope="scope">
                        <p class="content_wrap">{{scope.row.title}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="内容">
                    <template slot-scope="scope">
                        <pre class="content_wrap pre_wrap">{{scope.row.content}}</pre>
                    </template>
                </el-table-column>
                <el-table-column prop="link" label="链接"></el-table-column>
                <el-table-column prop="send_state" label="发送状态">
                    <template slot-scope="scope">
                        {{scope.row.send_state==0?'仅保存':(scope.row.send_state==1?'立即发送':'定时发送')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" class="on-status" @click='editNotice(scope.$index, scope.row)'>编辑</el-button>
                        <el-button type="text" class="on-status" @click='recordsList(scope.row.msg_id)'>操作记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :page-size="pagesize" :total="total" @current-change="changePage">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="操作记录" :visible.sync="showFuns">
            <el-table :data="recordsData">
                <el-table-column property="msg_id" label="ID" width="50"></el-table-column>
                <el-table-column property="operator" label="操作用户" width="100"></el-table-column>
                <el-table-column property="text_log" label="操作内容" width="250">
                    <template slot-scope="scope">
                        <p class="textLog">{{scope.row.text_log}}</p>
                    </template>
                </el-table-column>
                <el-table-column property="created_at" label="操作时间" width="160"></el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :page-size="recordSize" :total="recordtotal" @current-change="recordchangePage">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: '',
            access_token:'',
            noticelist:[],
            pagesize: 20,
            pageNum: 1,
            total: 0,
            showFuns:false,
            recordsData: [],
            recordSize: 10,
            recordtotal:0,
            recodePage: 1,
            msg_id: ''
        }
    },
    created () {
        this.access_token = localStorage.getItem('g_accessToken')
        this.username = localStorage.getItem('g_username')
        this.getNoticeList()
    },
    methods: {
        // 翻页
        changePage(e) {
            this.pageNum = e;
            this.getNoticeList();
        },
        recordchangePage(e){
            this.recodePage = e;
            this.recordsList(this.msg_id)
        },
        getNoticeList() {
            let _data = {
                username: this.username,
                access_token: this.access_token,
                page_size: this.pagesize,
                page_num: this.pageNum
            }
            this.$api.getSysNotice(_data)
                .then(res=>{
                    this.noticelist = res.data.data.msg_list
                    this.total = res.data.data.total_num
                })
        },
        async recordsList(msgid){
            this.msg_id = msgid
            let _data = {
                username: this.username,
                access_token: this.access_token,
                msg_id: msgid,
                page_num: this.recodePage,
                page_size: this.recordSize
            }
            let _resData = await this.$api.getNoticeRecords(_data)
            this.recordtotal = _resData.data.data.total_num
            this.recordsData = _resData.data.data.log_list
            this.showFuns = true
        },
        editNotice(index,item) {
            if(item){
                let _noticeId = item.msg_id
                this.$router.push({path:'editNotice',query:{noticeId:_noticeId}})
            }else{
                this.$router.push({path:'editNotice'})
            }
        }
    }
}
</script>
<style>
.noticeFuns{
    margin-bottom: 20px;
}
.content_wrap{
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
}
.pre_wrap{
    white-space: pre-wrap;
}
.textLog{
    word-wrap:break-word;
    word-break: break-all;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
}
</style>