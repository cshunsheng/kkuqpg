<template>
    <div class="sortBargain">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 心跳团列表</el-breadcrumb-item>
                <el-breadcrumb-item>置顶设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="sortList">
             <el-table :data="sortList" border style="width: 100%" class="listTable">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="id_group" label="心跳团ID"></el-table-column>
                <el-table-column prop="id_product" label="商品ID"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="from_date" label="开始时间"></el-table-column>
                <el-table-column prop="to_date" label="结束时间"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button class="" size="small" @click="toTop(scope.$index, scope.row)">置顶
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            access_token:'',
            username:'',
            sortList: []
        }
    },
    created() {
        this.username = localStorage.getItem('g_username')
        this.access_token = localStorage.getItem('g_accessToken')
        this.getSortList();
    },
    methods: {
        getSortList() {
            let v = 1
            this.$api.bargainSortList(v)
                .then(res=>{
                    this.sortList = res.data.data.groupon_list
                })
        },
        toTop(index,item) {
            let _id = item.id
            this.$api.bargainTop(this.access_token, this.username, _id)
                .then(res=>{
                    if(res.status === 200){
                        this.getSortList()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
        }
    }
}
</script>