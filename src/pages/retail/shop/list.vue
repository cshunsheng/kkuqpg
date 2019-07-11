<template>
    <div id="retail-shop-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}"><i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="add-shop-item">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addShop">新增商品</el-button>
        </div>

         <div class="table">
            <el-table :data="shopList" border style="width: 100%" ref="multipleTable">
                <!--<el-table-column prop="comment_ts" label="日期" sortable width="100">-->
                <!--</el-table-column>-->
                <el-table-column prop="id_product" label="货号" width="80"></el-table-column>
                <el-table-column prop="product_name" label="商品名称"></el-table-column>
                <!--<el-table-column prop="price_in" label="进价／元"></el-table-column>-->
                <el-table-column prop="price_out" label="售价／元"></el-table-column>
                <el-table-column prop="product_num" label="库存"></el-table-column>
                <el-table-column prop="amount" label="库存金额"></el-table-column>
                <el-table-column prop="product_status" label="商品状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.product_status == '1'">在架</span>
                    <span v-else-if="scope.row.product_status == '2'">缺货</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="editShop(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="total_num">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                username: '',
                access_token: '',
                shopList: [],                                 //商品列表
                total_num: 0,                                 //总数
                page_size: 20,                                //每页显示数量
                page_num: 1                                   //当前页码
            }
        },

        created() {
            this.init()
            this.getShopList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getShopList(page_num = 1) {
                const params = {
                  page_size: this.page_size,
                  page_num: page_num
                }
                this.$api.cabinet_stockget(params).then((res)=>{
                    this.shopList = res.data.data.list
                    this.total_num = res.data.data.total_num
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addShop() {
                this.$router.push({path: 'edit'})
            },

            editShop(index, row) {
                this.$router.push({path: 'edit', query: {id_stock: row.id_stock,
                  id_product: row.id_product,
                  product_name: row.product_name,
                  price_out: row.price_out,
                  product_num: row.product_num
                }})
            },

            handleCurrentChange(e) {
                this.getShopList(e)
            }
        }
    }
</script>

<style lang="scss" scoped>
    #retail-shop-list__container {
        .add-shop-item{
            margin-bottom: 20px;
        }
    }
</style>
