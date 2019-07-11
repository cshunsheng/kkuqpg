<template>
    <div class="index_operation">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/indexOperation'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>首页运营</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs type="border-card">
                <el-tab-pane label="明星医生服务">
                    <div class="top">
                        <div class="top_items"><el-button type="primary" @click="showAdd=true">新增</el-button></div>
                        <div class="top_items"><el-input placeholder="请输入医生姓名" size="medium" v-model="doctor_name"></el-input></div>   
                        <div class="top_items"><el-button type="primary" @click="search">搜索</el-button></div>    
                    </div>
                    <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="operationList">
                        <el-table-column prop="created_at" label="创建时间"></el-table-column>
                        <el-table-column prop="doctor_id" label="医生ID" width="80"></el-table-column>
                        <el-table-column prop="doctor_name" label="医生姓名"></el-table-column>
                        <el-table-column prop="server_name" label="服务名称" width="100"></el-table-column>
                        <el-table-column prop="server_status" label="是否提供服务">
                            <template slot-scope="scope">
                                <span class="service_black" v-if="scope.row.server_status == 1">是</span>
                                <span class="service_gray" v-if="scope.row.server_status == 0">否</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="医生状态" width="120">
                            <template slot-scope="scope">
                                <span class="status" v-if="scope.row.doctor_status == 1">上线</span>
                                <span v-if="scope.row.doctor_status == 0">下线</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <span class="import" @click="img(scope.row)">导入图片</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="新增明星医生服务" :visible.sync="showAdd" @close="closeAdd">
                <el-form label-width="120px" :rules="rules" ref="addform" :model="addform">
                    <el-form-item label="医生ID:" prop="doctorId">
                        <el-select v-model="addform.doctorId" size="medium" placeholder="请输入ID/名字关键词" clearable filterable :filter-method="filterList" @change="selectDoctor" @visible-change="selectClear">
                            <el-option v-for="item in filterProducts" :key="item.doctor_id" :label="'(ID=' + item.doctor_id + ')' + item.doctor_name" :value="item.doctor_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择服务:" prop="serverList">
                        <el-select v-model="addform.serverList" multiple placeholder="请选择" clearable>
                            <el-option v-for="item in docSerList" :key="item.server_id" :label="'(ID=' + item.server_id + ')' + item.name" :value="item.server_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </div>
        </el-dialog>
        <el-dialog title="明星医生/配置图片" :visible.sync="showImg">
            一键导入商品图：  <div class="top_items"><el-input placeholder="输入精确商品ID"></el-input></div>
                            <div class="top_items"><el-button type="primary">确 定</el-button></div>
        </el-dialog>
    </div>
</template>
<script>
import pruductImg from '../../components/shop/productImg.vue'
export default {
    data() {
        return {
            operationList: [{}],
            styleObj: {
                "text-align": "center",
            },
            userData:{},
            doctor_name: '',
            currentPage: 1,
            pageSize: 20,
            total: 0,
            showAdd: false,
            showImg: false,
            addform: {
                doctorId: '',
                serverList: [],
            },
            filterProducts: [],
            docSerList: [],
            rules: {
                doctorId:[{ required: true, message: '请输入ID/名字', trigger: 'change' }],
                serverList:[{ required: true, message: '请选择服务', trigger: 'change' }]
            }
        }
    },
    created() {
        this.userData.username = localStorage.getItem('g_username');
        this.userData.access_token = localStorage.getItem('g_accessToken');
        this.getBannerlist('')
    },
    methods:{
        getBannerlist(key) {
            let data = {
                doctor_name: key,
                page: this.currentPage,
                page_size: this.pageSize
            }
            // data = Object.assign({},data,this.userData)
            this.$api.getBannerlist(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.operationList = res.data.data.list
                        this.total = res.data.data.total
                    }
                })
                .catch(res => {

                })
        },
        search() {
            let data = {
                doctor_name: this.doctor_name,
                page: 1,
                page_size: 20,
            }
            this.$api.getBannerlist(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.operationList = res.data.data.list
                        this.total = res.data.data.total
                    }
                })
                .catch(res => {

                })
        },
        img(scope) {
            // this.showImg = true
            this.$router.push({path:'showImg',query:{id:scope.id,product_id: scope.product_id}})
        },
        changePage(e) {
            this.currentPage = e
            this.getBannerlist()
        },
        closeAdd() {
            this.addform.doctorId = ''
            this.docSerList = [];
            this.addform.serverList = [];
            this.filterProducts = [];
            this.$refs.addform.resetFields();
            // this.filterList('') 
        },
        selectClear(e) {
            if (e) return false;
            if (this.addform.doctorId != '') return false;
            this.filterProducts = [];
        },
        // openAdd() {
        //     this.filterList('')
        // },
        cancelAdd() {
            this.showAdd = false
            this.$message.info('已取消操作')
        },
        saveAdd() {
            this.$refs.addform.validate((valid) => {
                if (!valid) return false;
                let data = {
                    doctor_id: this.addform.doctorId,
                    servers: this.addform.serverList
                }
                data = Object.assign({},data,this.userData)
                this.$api.addBanner(data)
                    .then(res => {
                        // console.log(res)
                        if(res.data.status == 200) {
                            this.$message.success('新增成功')
                            this.currentPage = 1
                            this.getBannerlist()
                            this.showAdd = false
                        }
                    })
                    .catch(res => {
                        this.$message.error(res.data.msg)
                    })
            })
            
        },
        filterList(keyword) {
            if (keyword == '') {
                this.filterProducts = [];
                return false
            }
            let data = {
                keyword: keyword 
            }
            this.$api.getDoctorList(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.filterProducts = res.data.data
                    }
                })
                .catch(res => {
                    this.$message.error(res.data.msg)
                })

        },
        selectDoctor() {
            this.addform.serverList = [];
            if(this.addform.doctorId == '') {
                this.docSerList = [];
                return false
            }
            let data = {
                doctor_id: this.addform.doctorId
            }
            this.$api.unbindServers(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.docSerList = res.data.data.list
                    } 
                })
                .catch(res => {
                    console.log(res.data.msg)
                })
        }
    },
    components: {},
}
</script>
<style>
.index_operation .top {
    margin-bottom: 20px;
}
.index_operation .top_items {
    display: inline-block;
}
.index_operation .top_items:nth-child(2) {
    margin-left: 20px;
    width: 30%;
}
.index_operation .service_black {
    color: black;
}
.index_operation .service_gray {
    color: #606266;
}
.index_operation .import {
    color: #20a0ff;
    text-decoration: underline;
}
.index_operation .status {
    color: #20a0ff;
}
</style>
