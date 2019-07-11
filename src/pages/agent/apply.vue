<template>
    <div class="generalizeApply">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>提现记录</el-breadcrumb-item>
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
                        <div>
                            <el-form :model="form" :rules="rules" ref="form" label-width="120px" status-icon> 
                                <el-form-item label="可提现系数：" prop="num">
                                    <el-input class="el-input-text"  v-model="form.num"><template slot="append">元</template></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div><el-button class="ation-btn" type="primary" @click="eddConfig">应用</el-button></div>
                    </div>
                </div>  
            </div>
            <div class="applyFuns">
                <div class="applyNums">
                    <span>当前月提出申请：{{total?total:0}}条</span>
                    <span>金额累计：￥{{totalCash?parseFloat(totalCash).toFixed(1) :0}}元</span>
                </div>
                <div class="applyDown">
                    <el-button type="primary" @click.stop="exportApplys"><i class="el-icon-download"></i>导出</el-button>
                </div>
            </div>
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="applyList">
                    <el-table-column prop="created_at" label="申请时间" width="160" sortable></el-table-column>
                    <el-table-column prop="uid" label="用户ID"></el-table-column>
                    <el-table-column prop="nick_name" label="名字"></el-table-column>
                    <el-table-column prop="mobile_number" label="电话">
                    </el-table-column>
                    <el-table-column label="支付宝/银行卡" prop="alipay_account">
                    </el-table-column>
                    <el-table-column label="真实姓名" prop="real_name">
                    </el-table-column>
                    <el-table-column label="提现金额" sortable>
                        <template slot-scope="scope">
                            <span>{{scope.row.cash | price}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
            num: 0,
            type: '',
            id: '',
            styleObj: {
                "text-align": "center"
            },
            rules:{
                num:[{ required: true, message: '请填写可提现系数', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                            if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                                callback()
                            } else {
                                callback(new Error('请输入大于等于0的整数'))
                            }
                            },
                            trigger: 'blur'
                        }
                    ]
                },
            form:{
                num:0
            }
            
        }
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getApplyList(2);
        },
        // 可提现系数
        getConfig(){
            this.$api.getAgencyConfig(this.accessToken, this.userName)
                .then(res => {
                    this.form.num=res.data.data.num
                    this.num=res.data.data.num
                    this.type=res.data.data.type
                    this.id=res.data.data.id
                    this.$refs.form.validate((valid) => {
                        if (!valid) return false
                        this.$refs.form.clearValidate(function(num){})
                    })
                })
        },
        eddConfig(){
            // let reg=/^[1-9]\d*(\.\d+)?$/
            // if(this.num){
            //     if (new RegExp(reg).test(this.num) == false) {
            //         this.$message.error('请输入正确的提现系数')
            //         return false
            //     }
            // }
            this.$refs.form.validate((valid) => {
                if (!valid) return false
                this.$confirm(`原可提现金额为${this.num}元，是否修改为${this.form.num}元`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
                    .then(() => {
                        this.$api.editAgencyConfig(this.accessToken, this.userName,this.type,this.id,this.form.num)
                            .then(res => {
                                if(res.data.status==200){
                                    this.$message.success('可提现系数修改成功')
                                    this.getConfig()
                                }
                            })
                    })
                    .catch(() => {
                        this.$message.info('已取消可提现系数修改')
                        this.form.num = this.num
                        this.$refs.form.validate((valid) => {
                            if (!valid) return false
                            this.$refs.form.clearValidate(function(num){})
                        })         
                    });
            })
        },
        // 获取提现记录列表
        getApplyList(type) {
            //console.log(`type:${type}`)
            if (type == 1) {
                this.month = this.initDate();
            }
            this.$api.agenWithdraw(this.userName,this.accessToken,this.month, this.page)
                .then(res => {
                    let resData = res.data.data;
                    this.applyList = resData.withdraw_list
                    this.totalCash = resData.total_cash
                    this.total = resData.total_num
                })
        },
        // 筛选月份
        changeMonth(e) {
            let dateHandler=e.substring(0,4)+'-'+e.substring(4,6)
            this.month = dateHandler
            this.getApplyList(2);
        },
        // 初始页面日期
        initDate() {
            let _date = new Date();
            let _year = String(_date.getFullYear());
            let _month = String(_date.getMonth() + 1)
            _month = (_month - 0) < 9 ? '0' + _month : _month
            return _year +'-'+ _month
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
            this.$api.exportWithdraw( this.accessToken, this.userName,this.month)
                .then((res) => { // 处理返回的文件流
                    loading.close(); // 隐藏loading
                    if (res.data) {
                        util.download(res.data, '名医代理提现申请记录') // 开始下载
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
.applyDate {
	margin-bottom: 10px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
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
.title-set {
    /* padding-top:10px;  */
	margin-left: 50px;
    line-height: 40px;
    
}
.title-set div {
    float: left;
}
.title-set .el-input-text {
	width: 260px;
}
.generalizeApply .el-form-item {
    margin-bottom: 0;
}
</style>