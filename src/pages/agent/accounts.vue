<template>
    <div class="generalizeList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>代理商管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="accountsWrap">
            <div class="accountNumbers">
                <span>用户共计：{{agentAccountTotal}}名</span>
                <span>正式：{{regular_num}}名</span>
                <span>预备：{{reserve_num}}名</span>
            </div>
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="agentAccountList">
                    <el-table-column prop="create_ts" label="日期" width="160" sortable></el-table-column>
                    <el-table-column prop="uid" label="用户ID" sortable></el-table-column>
                    <el-table-column prop="nick_name" label="姓名"></el-table-column>
                    <el-table-column prop="mobile_number" label="电话">
                    </el-table-column>
                    <el-table-column label="头像">
                        <template slot-scope="scope">
                            <img class="head" :src="scope.row.avatar">
                        </template>
                    </el-table-column>
                    <el-table-column label="支付宝/银行卡" prop="alipay">
                    </el-table-column>
                    <el-table-column label="押金状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.deposit_status==1" >已交</span>
                            <span v-if="scope.row.deposit_status==0">未交</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deposit" label="押金金额" sortable>
                    </el-table-column>
                    <el-table-column label="身份">
                        <template slot-scope="scope">
                            <span v-if="scope.row.deposit_status==0" class="on-status">预备</span>
                            <span v-if="scope.row.deposit_status>0" class="down-status">正式</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="agentAccountTotal" @current-change="changePage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
            styleObj: {
                "text-align": "center",
            }
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
            this.$api.agentList(this.accessToken, this.userName, this.page,this.size)
                .then(res => {
                    let resData = res.data.data;
                    this.$store.commit('AGENTACCOUNTLIST', { list: resData.agency_list })
                    this.$store.commit('AGENTACCOUNTTOTAl', { total: resData.total_num })
                    this.regular_num = resData.real_num;
                    this.reserve_num = resData.ready_num;
                    // this.size = resData.page_size;
                })
        },
    },
    computed: {
        ...mapGetters([
            'agentAccountList',
            'agentAccountTotal'
        ])
    }
}
</script>
<style scoped>
.head{
    width:40px;
    height:40px;
    background-size: cover;
    border-radius:50%;
}
.on-status{
    color:#909399;
}
.down-status{
    color:#67C23A;
}
</style>