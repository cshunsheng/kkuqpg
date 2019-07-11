<template>
    <div class="generalizeProducts">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>医生服务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="productsWrap">
            <div class="productHeader">
                <div class="proAdd">
                    <el-button type="primary" @click="addSer">
                        <i class="el-icon-plus"></i>新增服务</el-button>
                </div>
                <div class="prosNum">当前共计：{{total}}个服务</div>
            </div>
            <div class="table-list">
                <el-table :span-method="objectSpanMethod" border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="docSerList">
                    <el-table-column prop="created_at" label="创建时间" width="160" sortable></el-table-column>
                    <el-table-column prop="server_id" label="ID" width="60" sortable></el-table-column>
                    <el-table-column prop="name" label="服务名称" width="120"></el-table-column>
                    <el-table-column prop="title" label="职称"></el-table-column>
                    <el-table-column prop="recommend_amount" width="80" label="服务费用">
                    </el-table-column>
                    <el-table-column prop="cost_amount" width="100" label="平台结算价">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="editSer(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button type="success" size="small" @click="opRecord(scope.$index, scope.row)">操作记录
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
            <!-- <div class="pagination">
                <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div> -->
            <!-- 操作记录 -->
            <el-dialog title="医生服务操作记录" :visible.sync="showRecords">
                <el-form label-width="100px" label-position="left">
                    <el-table :data="recordsList" :header-cell-style="styleObj" :cell-style="styleObj" border style="width: 100%" ref="multipleTable">
                        <el-table-column prop="name" label="服务名称"></el-table-column>
                        <el-table-column prop="operator" label="操作用户"></el-table-column>
                        <el-table-column prop="text_log" label="操作内容"></el-table-column>
                        <el-table-column prop="created_at" label="时间"></el-table-column>
                    </el-table>
                </el-form>
                <!-- 翻页 -->
                <div class="pagination">
                    <el-pagination background layout="prev, pager, next" :current-page="record_page_num" :page-size="record_size" :total="recordTotal" @current-change="changeRecordPage">
                    </el-pagination>
                </div>
            </el-dialog>
            <!-- 新增/编辑服务 -->
            <el-dialog title="新增/编辑服务" :visible.sync="show">
                <el-form label-width="80px" label-position="left" class="p-form">
                    <p>
                        <span style="color:red;">注：</span>服务名称、服务描述必填，其他不填默认为0，服务费用必须大于等于平台结算价</p>
                    <el-row :gutter="22" class="box">
                        <el-col :span="4">
                            <div class="add-wrap">
                                <slot name="add-btn">
                                    <span>
                                        <span style="color:red;">*</span>服务名称</span>
                                </slot>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="docTitleList.name" placeholder="服务名称"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="22" class="box">
                        <el-col :span="4">
                            <div class="add-wrap">
                                <slot name="add-btn">
                                    <span>
                                        <span style="color:red;">*</span>服务描述</span>
                                </slot>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="docTitleList.description" placeholder="服务描述"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="22" class="box">
                        <el-col :span="4">
                            <div class="add-wrap">
                                <slot name="add-btn">
                                    <span>
                                        <span style="color:red;">*</span>职称</span>
                                </slot>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <el-select v-model="titles" multiple>
                                <el-option 
                                    v-for="item in filterJobSels" 
                                    :key="item.title_id" 
                                    :label="item.title" 
                                    :value="item.title_id"
                                    :remove-tag="removeTag">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row :gutter="22" class="box" v-for="(item,index) in titList" :key="item.id">
                        <el-col :span="4">
                            <div class="add-wrap">
                                <slot name="add-btn">
                                    <span>{{item.title}}</span>
                                </slot>
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="item.cost_amount" placeholder="平台结算价" :disabled="item.disabled"></el-input>
                            <!-- <el-input v-model="item.cost_amount" placeholder="平台结算价" v-else></el-input> -->
                            <el-input v-model="item.recommend_amount" placeholder="服务费用"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <p style="padding-top:10px;">平台结算价</p>
                            <p style="padding-top:30px;color:#67C23A;">服务费用</p>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click.stop="saveAdd()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            server_id: '',
            showRecords: false,
            recordsList: [],
            record_page_num: 1,
            record_size: 5,
            recordTotal: 0,
            recordId: null,
            page: 1,
            size: 10,
            total: 0,
            showAdd: false,  // 显示添加
            showEdit: false,
            show: false,
            resData: [],
            styleObj: {
                "text-align": "center"
            },
            docTitleList: {} //职位列表
            ,titles:[]
            ,jobTitList: []
        }
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getSerList()
        this.titleList()

    },
    methods: {
        // 移除职称
        removeTag() {
            console.log('aaa')
        },
        //获取职位列表
        titleList() {
            this.$api.titleList(this.userName, this.accessToken)
                .then(res => {
                    if (res.data.status === 200) {
                        this.docTitleList = res.data.data
                        this.jobTitList = res.data.data.title_list
                    }
                })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //console.info(rowIndex, row.start)
            if (columnIndex == 0 || columnIndex == 1 || columnIndex == 2 || columnIndex == 6) {
                if (row.start) {
                    return {
                        rowspan: row.total,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        // 翻页
        changePage(e) {
            this.page = e;
            this.getSerList();
        },
        //操作记录
        changeRecordPage(e) {
            this.record_page_num = e
            this.getRecordList()
        },
        opRecord(index, scope) {
            this.showRecords = true;
            this.recordId = scope.server_id
            this.getRecordList();
        },
        getRecordList() {
            let data = {
                username: this.userName,
                access_token: this.accessToken,
                server_id: this.recordId,
                page_num: this.record_page_num,
                page_size: this.record_size
            }
            this.$api.docSerRecord(data)
                .then((res) => {
                    this.recordsList = res.data.data.log_list
                    this.recordTotal = Number(res.data.data.total_num)
                })
        },
        closeRecord() {
            this.showRecords = false;
        },
        //新增
        addSer() {
            this.titles = []
            this.show = true
            this.showAdd = true
            this.showEdit = false
            this.docTitleList = {}
            
        },
        //编辑
        editSer(index, scope) {
            this.docTitleList = {}
            this.show = true
            this.showEdit = true
            this.showAdd = false
            this.server_id = scope.server_id ? scope.server_id : ''
            this.getSerInfo(this.server_id)
        },
        cancelAdd() {
            this.docTitleList = {}
            this.show = false
        },
        //获取服务信息
        getSerInfo(server_id) {
            this.titles = []
            this.$api.getSerInfo(this.userName, this.accessToken, server_id)
                .then(res => {
                    if (res.data.status === 200) {
                        this.docTitleList = res.data.data
                        this.docTitleList.title_list.forEach(item=>{
                            item.disabled = true
                        })
                        // this.titles = res.data.data.title_list.map(item=>{
                        //     return item.title_id
                        // })
                    }
                })
        },
        // 新增编辑服务
        saveAdd() {
            if (!this.validateFn()) {
                return
            }
            let data = Object.assign({},this.docTitleList);
            // let data = this.titList
            if (this.showAdd) {
                data.type = 1; // 新增
            } else if (this.showEdit) {
                data.type = 2; // 编辑
            }
            let userData = {
                username: this.userName,
                access_token: this.accessToken,
                doc_title_price: []
            }
            data.username = this.userName
            data.access_token = this.accessToken
            let _department = this.titList.map(item => {
                return { title_id: item.title_id, recommend_amount: item.recommend_amount, cost_amount: item.cost_amount };
            })
            console.log(_department)
            data.doc_title_price =_department
            // 数组类型to json
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }
            this.$api.editDocSer(data)
                .then(res => {
                    if (res.data.status === 200) {
                        //data.doc_title_price=[]
                        this.$message.success(res.data.msg)
                        this.show = false;
                        this.getSerList();
                    } else {
                        this.$message.error(res.data.msg)
                        /* if (this.showEdit) {
                            this.getSerInfo(this.server_id)
                        } else if (this.showAdd) {
                            this.titleList()
                        } */
                    }
                })
        },
        validateFn() {
            if (!this.docTitleList.name) {
                this.$message.error('请填写服务名称')
                return
            }
            if (!this.docTitleList.description) {
                this.$message.error('请填写服务描述')
                return
            }
            let title_list = [].concat(this.titList)
            if(title_list.length<1){
                this.$message.error('请选择职称')
                return
            }
            for (let i = 0; i < title_list.length; i++) {
                // console.log(`recommend_amount：..${title_list[i].recommend_amount}`)
                // console.log(`cost_amount：${title_list[i].cost_amount}`)
                if (title_list[i].recommend_amount=='' && title_list[i].cost_amount!='') {
                    this.$message.error(`请输入${title_list[i].title}对应的服务费用`)
                    return
                }
               /*  if (title_list[i].cost_amount == '' && title_list[i].recommend_amount!='') {
                    this.$message.error(`请输入${title_list[i].title}对应的平台结算价`)
                    return
                } */
                if (Number(title_list[i].recommend_amount) < Number(title_list[i].cost_amount)) {
                    this.$message.error(`${title_list[i].title}不能低于${title_list[i].cost_amount}元`)
                    return
                }
                let reg = /^[0-9]\d*$/
                let value = title_list[i].cost_amount
                let limit_value = title_list[i].recommend_amount
                if (new RegExp(reg).test(value) == false || new RegExp(reg).test(limit_value) == false) {
                    this.$message.error('请输入正确的价格')
                    return
                }
            }
            return true
        },
        //服务列表
        getSerList() {
            this.$api.docSerList(this.accessToken, this.userName)
                .then(res => {
                    if (res.status == 200) {
                        let resData = res.data.data
                        this.$store.commit('DOCSERLIST', { list: resData })
                        this.total = resData.length/* resData.total_num */
                        this.size = resData.page_size
                        this.page = resData.page_num
                    }
                })
        },
    },
    computed: {
        ...mapGetters([
            'docSerList'
        ]),
        titList() {
            let _this = this
            let _titles = [].concat(this.titles)
            let _jobs = [].concat(this.jobTitList)
            let _filterList = []
            
            _titles.forEach(item=>{
                _jobs.forEach(tit=>{
                    if(tit.title_id == item) {
                        tit.recommend_amount = 0
                        tit.cost_amount = 0
                        _filterList.push(tit)
                    }
                })
            })
            
            if(this.server_id && _this.docTitleList.title_list){
                _filterList = [..._this.docTitleList.title_list,..._filterList]
            }

            return _filterList
        },
        filterJobSels() {
            let _this = this
            let _jobs = [].concat(_this.jobTitList)

            if(_this.server_id && _this.docTitleList.title_list){
                if(Object.prototype.toString.call(_this.docTitleList.title_list)=='[object String]'){
                    _this.docTitleList.title_list = JSON.parse(_this.docTitleList.title_list)
                }
                _this.docTitleList.title_list.forEach(tititem=>{
                    _jobs.forEach((jobitem,index)=>{
                        if(tititem.title_id == jobitem.title_id){
                            _jobs.splice(index,1)
                        }
                    })
                })
            }
            return _jobs
        }
    }
}
</script>
<style lang="scss" scoped>
.box {
	margin: 20px auto 0;
}
.productHeader {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	color: #666;
	margin-bottom: 10px;
}
.productHeader .prosNum {
	line-height: 40px;
}
.p-form .el-input--suffix .el-input__inne {
	width: 400px;
}
</style>
