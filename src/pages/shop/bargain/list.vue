<template>
    <div class="bargainList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>心跳团列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="listWrap">
            <el-button @click="toEdit" type="primary">新增心跳团</el-button><el-button @click="toSort" type="primary">置顶排序</el-button>
            <el-table :data="bargainlist" border style="width: 100%" class="listTable" :row-style="rowStyle">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="id_group" label="心跳团ID"></el-table-column>
                <el-table-column prop="id_product" label="商品ID"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="from_date" label="开始时间"></el-table-column>
                <el-table-column prop="to_date" label="结束时间"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.is_online" placeholder="状态" size="mini" @change='editOnline(scope.$index, scope.row)'>
                            <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button class="" size="small" @click="toEdit(scope.$index, scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :current-page.sync="currentPage" :page-size="pageSize" :total="total" @current-change="changePage">
            </el-pagination>
        </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            access_token: '',
            username: '',
            // bargainlist: [],
            total: 0,
            page: 1,
            pageSize: 30,
            currentPage: 1,
            onlineStatus: [
                {value: 1, label: "上线"},
                {value: 0, label: "下线"}
            ],
        }
    },
    created () {
        this.username = localStorage.getItem('g_username')
        this.access_token = localStorage.getItem('g_accessToken')
        this.getList(0, this.bargainlistpagenum, this.pageSize)
    },
    methods:{
        rowStyle({ row, rowIndex}) {
            if (row.is_online === 0) {
                return 'background:#ddd'
            }
        },
        // 翻页
        changePage(e) {
            this.currentPage = e
            this.$store.commit('BARGAINLISTPAGENUM',{num:e})
            this.getList(0, this.currentPage, this.pageSize)
        },
        // 获取列表
        getList(type, page, size, keywords) {
            let _type = type, 
                _page = page,
                _size = size,
                _keywords = keywords
            this.$api.bargainList(_type, _page, _size, _keywords)
                .then(res=>{
                    let resData = res.data.data
                    this.total = resData.total;
                    this.pageSize = resData.page_size;
                    this.currentPage = resData.page_num
                    this.$store.commit('BARGAINLIST',{arr:resData.groupon_list})
                })
        },
        //编辑、新增
        toEdit(index, item) {
            if(item){
                this.$router.push({path: '/admin/shop/bargain/edit', query: {id_group:item.id_group}})
            }else{
                this.$router.push({path: '/admin/shop/bargain/edit'})
            }
            
        },
        toSort() {
            this.$router.push('sort')
        },
        // 列表中上下线编辑
        editOnline(index, item) {
            let _is_online = item.is_online,
                _id_group = item.id_group
            this.$api.onlineEidt(this.access_token, this.username, _is_online, _id_group)
                .then(res=>{
                    if(res.data.status != 200){
                        this.$message.error(res.data.msg)
                    }else{
                        this.getList(0, this.bargainlistpagenum, this.pageSize)
                    }
                })
        }
    },
    computed:{
        ...mapGetters(['bargainlist','bargainlistpagenum'])
    }
}
</script>
<style>
.listWrap .listTable{
    margin: 20px 0;
}
</style>