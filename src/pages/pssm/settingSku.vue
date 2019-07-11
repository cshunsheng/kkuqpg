<template>
    <div class="settingSku">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: ''}">
                <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品规格设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="condition">
            <el-row :gutter="15" class="box">
                <el-col :span="4">
                    <div class="add-wrap">
                        <slot name="add-btn">
                        <el-button type="primary" @click="addAttr(1)">
                            <i class="el-icon-plus"></i>新建规格</el-button>
                        </slot>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="input-wrap full-box">
                        <el-input :value="inputVal" placeholder="输入规格名" @input="valueChange"></el-input>
                    </div>
                </el-col>
                <el-col :span="3">
                    <el-button class="full-btn" type="primary" @click.stop="getAttrlist(1)">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="attrList">
            <el-table-column prop="id_attribute_group" label="序号"></el-table-column>
            <el-table-column prop="name" label="规格名"></el-table-column>
            <el-table-column label="规格类型">
                <template slot-scope="scope">
                    <p class="ser-line" v-for="(item,index) in scope.row.attribute_list" :key="index">{{item.name}}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="addAttr(2,scope.$index, scope.row)" type="success">编辑</el-button>
                    <el-button type="info" @click="toOperation(scope.row)">操作记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="attrTotal">
            </el-pagination>
        </div>
        <!-- 编辑 -->
        <el-dialog title="新增/编辑规格" :visible.sync="showEdit" @close="closeEdit">
            <el-form label-width="120px">
                <el-form-item label="规格名称:">
                    <p v-if="attrId">{{formData.name}}</p>
                    <el-input v-if="add" :value="inputValName" placeholder="" @input="changeName"></el-input>
                </el-form-item>
                <el-form-item label="规格类型:">
                    <ul class="categoryList">
                        <li v-for="(attItem,index) in formData.attribute_list" :key="index">{{attItem.name}}
                        <i class="el-icon-circle-close" @click.stop="deleteCategory(index,attItem.deleted)"></i>
                        </li>
                    </ul>
                    <!-- <ul class="categoryList" v-if="!attrId">
                        <li v-for="(attItem,index) in attribute_list" :key="index">{{attItem.name}}
                        <i class="el-icon-circle-close" @click.stop="deleteCategory(index)"></i>
                        </li>
                    </ul> -->
                    <el-input :value="inputVal1" v-model="inputVal1" placeholder="" @input="changeVal"></el-input>
                    <el-button size="small" @click.stop="addClassify">+</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAttr">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 操作记录模块 -->
        <el-dialog title="操作记录" :visible.sync="showOperation" @close="closeLog">
            <div class="table-list">
                <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="operationList">
                    <el-table-column prop="id_attribute_group" label="序号" width="60"></el-table-column>
                    <el-table-column prop="operator" label="操作用户"></el-table-column>
                    <el-table-column prop="text_log" label="操作内容"></el-table-column>
                    <el-table-column prop="created_at" label="操作时间"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="changeLogPage" background layout="prev, pager, next" :current-page="currentLogPageNum" :page-size="logPageSize" :total="logTotal" v-if="logTotal!=0">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            userData: null,
            styleObj: {
                "text-align": "center",
            },
            currentPage: 1,
            pageSize: 20,
            inputVal: '',
            showEdit: false,
            showClassify: false,
            formData: {
                attribute_list: []
            },
            inputVal1: '',
            inputValName: '',
            attrId: null,
            name: null,
            add: false,
            edit: false,
            showOperation: false,
            operationList: [],
            currentLogPageNum: 1,
            logPageSize: 10,
            logTotal: 0,
            idAttributeGroup: ''
        }
    },
    computed: {
        ...mapGetters([
            'attrList',
            'attrTotal'
        ])
    },
    created() {
        this.init()
        this.getAttrlist()
    },
    methods: {
        //编辑
        addAttr(type, index, scope) {
            this.showEdit = true
            if (type == 2) {
                this.attributeOne(scope.id_attribute_group)
                this.attrId = scope.id_attribute_group
                this.add = false
                this.edit = true
            } else {
                this.attrId = null
                this.edit = false
                this.add = true
                this.formData = {
                    attribute_list: []
                }
                this.initData()
            }
        },
        closeEdit(){
            this.inputVal1 = ''
        },
        toOperation(scope){
            console.log(scope)
            this.idAttributeGroup = scope.id_attribute_group
            this.showOperation = true
            this.getAttributelogs()
        },
        initData() {
            this.inputVal1 = ''
            this.inputValName = ''
        },
        cancelAdd() {
            this.showEdit = false
            this.inputVal1 = ''
            this.inputValName = ''
        },
        //修改规格
        saveAttr() {
        if (this.formData.attribute_list.length==0) {
            this.$message.error('规格类型为必填项')
            return
        }
        let data = {
            id_attribute_group: this.attrId,
        };
        data.attribute_name = this.formData.attribute_list.map(item => {
                return item.name
            })
        data.name = this.inputValName?this.inputValName:''

        for (let key in data) {
            if (data[key] instanceof Array) {
            data[key] = JSON.stringify(data[key])
            }
        }
        data = Object.assign({}, data, this.userData)
        if (!this.attrId) {
            // console.info(this.inputValName)
            data.name = this.inputValName
            this.$api.attributeAdd(data).then(res => {
                if (res.data.status == 200) {
                    this.showEdit = false
                    this.getAttrlist()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        } else {
            this.$api.attributeEdit(data).then(res => {
                if (res.data.status == 200) {
                    this.showEdit = false
                    this.getAttrlist()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }

        },
        //删除
        deleteCategory(index,deleted) {
            if(!deleted){
                this.$message.error("已有商品使用该规格类型，不能删除")
                return
            } 
            let _inx = index
            this.formData.attribute_list.splice(_inx, 1)
        },
        // 显示选择商品分类popup
        addClassify() {
            let hasSku = false
            let _len = this.formData.attribute_list.length
            if (this.inputVal1 == '') {
                this.$message.error('请输入内容')
                return
            }
            if(_len>0){
                this.formData.attribute_list.forEach(item=>{
                    if(item.name == this.inputVal1){
                        this.$message.error('该规格已存在')
                        hasSku = true
                    }
                })
            }
            
            if(hasSku) return ;

            this.formData.attribute_list.push({
                name: this.inputVal1,
                key: Date.now(),
                deleted: 1,
            });
            this.inputVal1 = ''
        },
        changeVal(value) {
            this.inputVal1 = value
        },
        changeName(value) {
            this.inputValName = value
        },
        attributeOne(group) {
            let data = {
                id_attribute_group: group,
            };
            data = Object.assign({}, data, this.userData)
            this.$api.attributeOne(data).then(res => {
                this.formData = res.data.data;
            })
        },
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
            this.inputVal1 = ''
        },
        updatePage(value) {
            this.currentPage = value
        },
        valueChange(value) {
            this.inputVal = value
        },
        changePage(e) {
            this.currentPage = e
            this.getAttrlist(this.currentPage, this.pageSize)
        },
        getAttrlist(page_num = 1, page_size = 20) {
            let data = {
                keywords: this.inputVal,
                page_num: page_num || 1,
                page_size: page_size,
            };
            data = Object.assign({}, data, this.userData)
            this.$api.attributeList(data).then(res => {
                let _list = res.data.data.attribute_info;
                this.$store.commit('ATTRLIST', { list: _list })
                this.$store.commit('ATTRTOTAL', { total: res.data.data.total_num })
            })
        },
        validateFn() {
            if (!String(this.formData.name).trim() && this.formData.attribute_list.length == 0) {
                this.$message.error('请输入内容');
                return
            }
            return true
        },
        getAttributelogs(){
            let data = {
                id_attribute_group: this.idAttributeGroup,
                page_num: this.currentLogPageNum,
                page_size: this.logPageSize
            }
            data = Object.assign({},data,this.userData)
            this.$api.getAttributelogs(data).then(res => {
                if(res.data.status == 200){
                    console.log(res)
                    this.operationList = res.data.data.log_list
                    this.logTotal = res.data.data.total_num
                }
            })
        },
        closeLog(){
            this.idAttributeGroup = ''
            this.currentLogPageNum = 1
        },
        changeLogPage(e) {
            this.currentLogPageNum = e
            this.getAttributelogs()
        }
    },
}
</script>
<style lang="scss" scoped>
.pssm-search {
	height: 40px;
	margin-bottom: 20px;
}
.condition {
	margin-bottom: 15px;
}
.categoryList li {
	display: inline-block;
	padding: 5px 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-sizing: border-box;
	line-height: 20px;
	margin-right: 10px;
}
.categoryList li i {
	cursor: pointer;
}

.categoryList li:hover {
	border-color: #20a0ff;
	background-color: #eaf6ff;
}
</style>

