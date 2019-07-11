<template>
    <div class="purchasing_statistics">
        <div class="search">
            <el-form ref="searchForm" :model="searchForm" >
                <div class="form_item">
                    <el-form-item>
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm:ss" 
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="small"
                            v-model="searchForm.s_time"
                            type="datetime"
                            placeholder="开始时间"
                            @change="changeTime">
                        </el-date-picker>
                        <el-date-picker
                            format="yyyy-MM-dd HH:mm:ss" 
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="small"
                            v-model="searchForm.e_time"
                            type="datetime"
                            placeholder="结束时间"
                            @change="changeTime">
                        </el-date-picker> 
                    </el-form-item>
                </div>            
                <div class="form_item" style="padding-left:20px">
                    <el-form-item label="商品名称/ID：" size="mini" style="width:300px;" label-width="120px">
                        <el-input v-model="searchForm.keywords" placeholder="请输入商品名称或商品ID"></el-input>
                    </el-form-item>
                </div>
                <div class="form_item" style="padding-left:20px">
                    <el-button type="primary" size="mini" class="btn" @click="search">搜索</el-button>
                </div>
            </el-form>
        </div> 
        <div class="list">
            <el-table border :span-method="spanMethod"  :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="statisticsList">
                <el-table-column label="商品ID" prop="id_stock_product" ></el-table-column>
                <el-table-column label="商品名称" prop="name" ></el-table-column>
                <el-table-column label="规格" prop="attribute_name">
                    <!-- <template slot-scope="scope">
                        <p class="ser-line" v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                            {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                        </p>
                    </template> -->
                </el-table-column>
                <el-table-column label="供应商" prop="supplier_name"></el-table-column>
                <el-table-column label="总采购数量" prop="total_num"></el-table-column>
                <el-table-column label="总已入库数量" prop="al_stock_in_num"></el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchForm: {
                s_time: '',
                endTime: '',
                e_time: ''
            },
            statisticsList: [],
            currentPage: 1,
            pageSize: 20,
            total: 100,

        }
    },
    created() {
        this.getShopStatistics()
    },
    mounted() {
        this.$root.eventBus.$on('updateStatisticList', (res)=>{
            this.getShopStatistics()
        })
    },
    methods: {
        getShopStatistics() {
            let data = {
                page_num: this.currentPage,
                page_size: this.pageSize ,
            }
            data = Object.assign({},data,this.searchForm, this.userData)
            this.$api.getShopStatistics(data)
                .then(res => {
                    if(res.data.status == 200) {
                        let list = [];
                        if(res.data.data.shopping_list.length == 0) {
                            this.statisticsList = []
                            return false;
                        }
                        res.data.data.shopping_list.forEach(v => {
                            v.stock_list.forEach((vi,i) => {
                                // console.log(i)
                                let obj = Object.assign({},vi)
                                obj.name = v.name
                                obj.id_stock_product = v.id_stock_product
                                obj.total = v.stock_list.length
                                obj.start = i == 0?true:false
                                list.push(obj)
                            })
                        })
                        this.statisticsList = list
                        this.total = res.data.data.total_num
                        // console.log(this.statisticsList)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        changePage(e) {
            this.currentPage = e
            this.getShopStatistics()
        },
        changeTime() {
            let s_time = Date.parse(this.searchForm.s_time)
            let e_time = Date.parse(this.searchForm.e_time)
            if (s_time > e_time) {
                this.$message.error('结束时间应该大于开始时间')
                this.searchForm.e_time = ""
                return false;
            }
            this.getShopStatistics()
        },
        search(){
            this.currentPage = 1
            this.getShopStatistics()
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            // console.log(row, column, rowIndex, columnIndex)
            if (columnIndex === 0 || columnIndex === 1) {
                if (row.start === true) {
                    return {
                        rowspan: row.total,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
    },
    props: ['userData','styleObj'],
    computed: {

    },
    components: {

    }
}
</script>
<style>
.purchasing_statistics .form_item {
    display: inline-block;
}
</style>