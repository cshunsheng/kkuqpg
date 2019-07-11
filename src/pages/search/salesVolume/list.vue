<template>
    <div id="salerank-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i>搜索管理</el-breadcrumb-item>
                <el-breadcrumb-item>销量排行</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="add-module-item">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addSalerank">新增排行</el-button>
        </div>

        <div class="table">
            <el-table :data="salesList" border style="width: 80%" ref="multipleTable"
                        @selection-change="">
                  <el-table-column width="455" label="商品">
                      <template slot-scope="scope">
                          <a :href="'http://touch.shop.kangkanghui.com/detail/' + scope.row.p_info.id_product">{{scope.row.p_info.name}}</a>
                      </template>
                  </el-table-column>
                  <el-table-column prop="pos" width="100" label="显示顺序"></el-table-column>
                  <el-table-column label="操作" width="100">
                      <!-- scope.$index, scope.row -->
                      <template slot-scope="scope">
                          <el-button class="ation-btn" size="small" type="danger"
                                     @click="deleteSale(scope.$index, scope.row)">删除
                          </el-button>
                      </template>
                  </el-table-column>
              </el-table>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: ''
            }
        },

        computed: {
            ...mapGetters([
                'salesList'
            ])
        },

        created() {
            this.init()
            this.getSalerankList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getSalerankList() {
                const params = {
                    username: this.username,
                    access_token: this.access_token
                }
                this.$api.salerank_list(params).then((res)=>{
                    this.$store.commit('GETSALESLIST', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addSalerank() {
                this.$router.push({path: 'edit'})
            },

            deleteSale(index, row) {
                const params = {
                    username: this.username,
                    access_token: this.access_token,
                    id: row.id
                }
                this.$api.salerank_del(params).then((res)=>{
                    this.$store.commit('DELETESALES', {
                        id: row.id
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    #salerank-list__container {
        .table {
            width: 80%;
        }
        .add-module-item{
            margin-bottom: 20px;
        }
    }
</style>
