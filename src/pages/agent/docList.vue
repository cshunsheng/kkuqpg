<template>
    <div class="whiteList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/accounts'}">
                    <i class="el-icon-menu"></i>名医代理
                </el-breadcrumb-item>
                <el-breadcrumb-item>医生列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="whiteWrap">
            <el-row :gutter="15" class="box">
                <el-col :span="4">
                    <div class="add-wrap">
                        <slot name="add-btn">
                            <el-button type="primary" @click="saveDoc">
                                <i class="el-icon-plus"></i>新增医生</el-button>
                        </slot>
                    </div>
                </el-col>
                <el-col :span="7">
                    <el-input v-model="keywords" placeholder="请输入医生姓名" @input="valueChange"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button class="full-btn" type="primary" @click.stop="searchDoc">搜索</el-button>
                </el-col>
            </el-row>
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="docList">
                    <!-- :data="docList" -->
                    <el-table-column prop="created_at" label="创建时间" width="160" sortable></el-table-column>
                    <el-table-column prop="doctor_id" label="医生ID" width="110" sortable></el-table-column>
                    <el-table-column prop="doctor_name" label="医生姓名"></el-table-column>
                    <el-table-column prop="phone" label="手机号"></el-table-column>
                    <el-table-column prop="hospital" label="医院">
                    </el-table-column>
                    <el-table-column label="科室" prop="department">
                    </el-table-column>
                    <el-table-column label="职称" prop="title">
                    </el-table-column>
                    <el-table-column label="服务">
                        <template slot-scope="scope">
                            <p class="ser-line" v-for="(item,index) in scope.row.service_list">{{item.name}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" class="on-status" @click='edit(scope.$index, scope.row)'>编辑</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.active" placeholder="状态" size="mini" @change='editOnline(scope.$index, scope.row)'>
                                <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" prop="position">
                    </el-table-column>
                </el-table>
            </div>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div>
            <!-- 编辑 -->
            <el-dialog title="新增/编辑" :visible.sync="showEdit">
                <el-form label-width="120px">
                    <el-form-item label="医生:" v-if="showDocName">
                        <el-select v-model="doctor_id" @change="changeDocid" size="medium" clearable filterable remote reserve-keyword class="el-input-text" placeholder="请输入医生ID" :loading="loading" :remote-method="valueChangeDoc">
                            <el-option v-for="(item, index) in filterProducts" :key="index" :label="item.doctor_name" :value="item.doctor_id">
                                <!-- <span>{{item.doctor_name}}</span> -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="医生:" v-if="!showDocName">
                        <p>{{doctor_name}}</p>
                    </el-form-item>
                    <el-form-item label="服务:">
                        <el-select v-model="server_list" multiple placeholder="请选择">
                            <el-option v-for="item in docSerList" :key="item.server_id" :label="item.name" :value="item.server_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序:" style="width: 300px">
                        <el-input v-model="sort" placeholder="数字越大越靠前"></el-input>
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
    data() {
        return {
            server_list: [],
            docSerList: [],
            doctor_id: '',
            keywords: '',
            docList: [],
            page: 1,
            size: 20,
            total: 0,
            doctor_name: '',
            showEdit: false,
            showDocName: false,
            styleObj: {
                "text-align": "center"
            },
            onlineStatus: [
                { value: 1, label: "上线" },
                { value: 0, label: "下线" }
            ],
            //添加医生
            addProductId: null, // 添加商品id
            filterProducts: [], // 过滤搜索商品列表结果
            keyword: '',
            doctor_pk: '',
            loading: false,         // 加载可选医生loading
            sort: 0,
        }
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.userData = {
            username: this.userName,
            user_token: this.accessToken
        }
        this.getDoclist();
        this.getPmBasesectionlist()

    },
    methods: {
        changeDocid() {
            this.getPmBasesectionlist()
        },
        //新增医生
        saveDoc() {
            this.showEdit = true
            this.showDocName = true
            this.addProductId = null
            this.sort = 0
            this.server_list = []
            this.filterProducts = []
            this.doctor_id = ''
        },
        //编辑服务 获取服务
        async edit(index, row) {
            this.showEdit = true
            this.showDocName = false
            this.doctor_id = row.doctor_id
            this.doctor_name = row.doctor_name
            this.sort = row.position

            await this.getPmBasesectionlist()
            //获取服务
            this.$api.docInfo(this.accessToken, this.userName, this.doctor_id)
                .then(res => {
                    let _resList = res.data.data.server_list
                    this.server_list = _resList.map(item => {
                        return item.server_id
                    })
                })
        },
        //医生上下线
        editOnline(index, row) {
            this.$api.docStatus(this.accessToken, this.userName, row.doctor_id, row.active)
                .then(res => {
                    if (res.data.status == 200) {
                        this.$message.success(res.data.msg)
                        this.getDoclist();
                    }
                })
        },
        // 翻页
        changePage(e) {
            this.page = e;
            this.getDoclist();
        },
        // 获取医生列表
        getDoclist() {
            // console.log(`this.keywords${this.keywords}`)
            this.$api.doctorList(this.accessToken, this.userName, this.page, this.size, this.keywords)
                .then(res => {
                    let _resData = res.data.data
                    this.docList = _resData.doctor_list;
                    this.total = _resData.total_num;
                    this.page = _resData.page_num;
                    this.size = _resData.page_size
                })
        },
        searchDoc() {
            this.page = 1;
            this.getDoclist()
        },
        //change 实时改变value值
        valueChange(value) {
            this.keywords = value
        },
        // 服务列表
        getPmBasesectionlist() {
            this.$api.docSerList(this.accessToken, this.userName, this.doctor_id)
                .then(res => {
                    if (res.data.status == 200) {
                        this.docSerList = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        valueChangeDoc(query) {
            if (query !== '') {
                setTimeout(() => {
                    this.loading = true;
                    this.$api.docs(this.accessToken, this.userName, query)
                        .then(res => {
                            if (res.data.data) {
                                let _list = [res.data.data];
                                console.log(_list[0])
                                this.filterProducts = _list[0]
                                this.loading = false
                            } else {
                                this.filterProducts = [];
                            }
                        })
                }, 1000);
            } else {
                this.filterProducts = [];
            }
        },
        //查询医生列表
        getTotalProduct() {
            this.loading = true;
            console.log(`this.addProductId:${this.doctor_id}`)
            this.$api.docs(this.accessToken, this.userName, this.doctor_id).then((res) => {
                this.filterProducts = res.data.data
                this.loading = false;
            }, (err) => {
                this.$message.error(res.data.msg)
            })
        },
        // 保存添加服务
        saveAdd() {
            if (!this.validateFn()) {
                return
            }
            let data = {
                access_token: this.accessToken,
                username: this.userName,
                doctor_id: this.doctor_id,
                service: [],
                position: this.sort
            }
            let _department = [].concat(this.server_list)
            data.service = data.service.concat(_department)
            // 数组类型to json
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }
            
            //新增
            if (this.showDocName) {
                data.doctor_id = this.doctor_id
                this.$api.addDoc(data)
                    .then(res => {
                        if (res.data.status == 200) {
                            this.showEdit = false
                            this.$message.success(res.data.msg)
                            this.getDoclist()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else if (!this.showDocName) {
                data.doctor_id = this.doctor_id
                this.$api.editDoc(data)
                    .then(res => {
                        if (res.data.status == 200) {
                            this.showEdit = false
                            this.$message.success(res.data.msg)
                            this.getDoclist()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        cancelAdd() {
            this.showEdit = false;
            this.$message('cancel')
        },
        validateFn() {
            if (this.server_list.length==0) {
                this.$message.error('服务不能为空')
                return
            }
            return true
        },
        
    }
}
</script>
<style scoped>
.whiteAccounts .listLine span:last-child {
	cursor: pointer;
}
.table-list {
	margin-top: 20px;
}
.ser-line{
    padding:5px 0;
    border-bottom:1px solid #E6A23C;
}
</style>