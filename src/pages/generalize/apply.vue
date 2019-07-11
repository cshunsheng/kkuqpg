<template>
    <div class="generalizeApply">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/generalize/accounts'}">
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item>提现申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="applyWrap">
            <div class="applyDate">
                <div>
                    <el-date-picker v-model="month" type="month" size="small" placeholder="选择月" start-placeholder="开始日期" value-format="yyyyMM" @change="changeMonth">
                    </el-date-picker>
                </div>
                 <div>
                    <div class="title-set">
                        可提现系数
                        <el-input class="el-input-text"  v-model="num"><template slot="append">元</template></el-input>
                    </div>
                </div> 
                <div class="save-title">
                    <el-button class="ation-btn" type="primary" @click="eddConfig">应用</el-button>
                </div> 
            </div>
            <div class="applyFuns">
                <div class="applyNums">
                    <span>当前月提出申请：{{total?total:0}}条</span>
                    <span>金额累计：￥{{totalCash?totalCash:0}}元</span>
                </div>
                <div class="applyDown">
                    <el-button @click.stop="exportApplys">导出</el-button>
                </div>
            </div>
            <ul class="productsList tableList">
                <li>
                    <span>申请时间</span>
                    <span>用户ID</span>
                    <span>名字</span>
                    <span>电话</span>
                    <span>支付宝/银行卡</span>
                    <span>真实姓名</span>
                    <span>提现金额</span>
                </li>
                <li class="listLine" v-for="(item,index) in applyList">
                    <span>{{item.created_at}}</span>
                    <span>{{item.user_info.user_id}}</span>
                    <span>{{item.user_info.user_name}}</span>
                    <span>{{item.user_info.mobile_number}}</span>
                    <span>{{item.alipay_account=='' ? '无':item.alipay_account}}</span>
                    <!-- <span>{{item.alipay_account}}</span> -->
                    <span>{{item.user_info.real_name}}</span>
                    <span>{{item.cash.toFixed(1)}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import util from '../../utils/util.js'
export default {
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getApplyList(1)
        this.getConfig()
    },
    data() {
        return {
            page: 1,
            size: 10,
            month: '',
            applyList: [],
            totalCash: 0,
            total: 0,
            num:'',
            type:'',
            id:''
        }
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getApplyList(2);
        },
        //可提现系数
        getConfig(){
             this.$api.getConfig(this.accessToken, this.userName)
                .then(res => {
                    this.num=res.data.data.num
                    this.type=res.data.data.type
                    this.id=res.data.data.id
                })
        },
        eddConfig(){
            let reg=/^[1-9]\d*(\.\d+)?$/
            if(this.num){
                if (new RegExp(reg).test(this.num) == false) {
                    this.$message.error('请输入正确的提现系数')
                    return false
                }
            }
            this.$api.editConfig(this.accessToken, this.userName,this.type,this.id,this.num)
                .then(res => {
                    if(res.data.status==200){
                        this.$message.success(res.data.msg)
                        this.getConfig()
                    }
                })
        },
        // 获取提现记录列表
        getApplyList(type) {
            if (type == 1) {
                this.month = this.initDate();
            }
            this.$api.applyList(this.accessToken, this.userName, this.month, this.page)
                .then(res => {
                    let resData = res.data.data;
                    this.applyList = resData.withdraw_list
                    this.totalCash = resData.total_cash
                    this.total = resData.total
                })
        },
        // 筛选月份
        changeMonth(e) {
            this.month = e
            this.getApplyList(2);
        },
        // 初始页面日期
        initDate() {
            let _date = new Date();
            let _year = String(_date.getFullYear());
            let _month = String(_date.getMonth() + 1)
            _month = (_month - 0) < 9 ? '0' + _month : _month

            return _year + _month
        },
        // 导出excel
        exportApplys() {
            // 接口请求时间过长，显示loading，提高用户体验
            let loading = this.$loading({
                lock: true,
                text: '下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$api.exportApply(this.accessToken, this.userName, this.month)
                .then((res) => { // 处理返回的文件流
                    loading.close(); // 隐藏loading
                    if (res.data) {
                        util.download(res.data, '申请记录') // 开始下载
                    } else {
                        this.$message.error('没有可导出的数据')
                    }
                })
                .catch(err => console.log(err))
        },
    }
}
</script>
<style scoped>
@import url('../../../static/css/tableStyle.css');
.applyDate {
	margin-bottom: 10px;
	display: flex;
	justify-content: flex-start;
	align-items:center;
}
.applyFuns {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	font-size: 14px;
	color: #666;
}
.applyFuns .applyNums span {
	vertical-align: bottom;
	line-height: 40px;
	margin-right: 40px;
}
.title-set{
    margin-left: 50px;
}
.title-set .el-input-text{
    width: 260px;
}
</style>