<template>
    <div id="science-article-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 科普文章</el-breadcrumb-item>
                <el-breadcrumb-item>科普文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="table">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewArticle">新增文章
                </el-button>
                <el-input v-model="keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="articleTableList" border style="width: 100%" ref="multipleTable"
                      @selection-change="">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="created_at" label="日期" sortable width="100">
                </el-table-column>
                <el-table-column prop="name" label="预览网址" width="120">
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column label="相关商品" width="220">
                    <template slot-scope="scope">
                        <a class="product-item" v-for="(item, index) in scope.row.product_list" :href="'http://touch.shop.kangkanghui.com/detail/'+item.id_product">{{index}}.{{item.id_product}}-{{item.name | stringTen}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="viewed" label="阅读数">
                </el-table-column>
                <el-table-column prop="shared" label="转发量">
                </el-table-column>
                <el-table-column prop="updated_by" label="操作人">
                </el-table-column>
                <el-table-column label="操作">
                    <!-- scope.$index, scope.row -->
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="small"
                                   @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button class="ation-btn" size="small" type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button type="primary" v-if="scope.row.active == '1'" class="ation-btn" size="small"
                                   @click="handleToggleShow(0, scope.row)">隐藏
                        </el-button>
                        <el-button type="primary" v-else-if="scope.row.active == '0'" class="ation-btn" size="small"
                                   @click="handleToggleShow(1, scope.row)">显示
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :page-size="articleTablePageSize"
                        :page-count="articleTableTotalPage"
                        :total="articleTableTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: '',
                keyword: '',             //关键词
            }
        },

        computed: {
            ...mapGetters([
                'articleTableList',                                     //文章列表
                'articleTableCurrentPage',                              //当前页码
                'articleTableTotal',                                    //列表总数量
                'articleTableTotalPage',
                'articleTablePageSize'
            ])
        },

        created() {
            this.init()
            this.getAtricleList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            search() {
                this.getAtricleList()
            },

            handleEdit(index, row) {
                this.$router.push({path: 'edit', query: {aid: row.aid}})
            },

            handleDelete(index, row) {
                const params = {
                    username: this.username,
                    access_token: this.access_token,
                    aid: row.aid,
                    active: -1
                }
                this.$api.article_delete(params).then((res) => {
                    this.$store.commit('DELETEARTICLELISTITEM', {
                        data: row
                    });
                }, (err) => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            handleToggleShow(index, row) {
              const params = {
                    username: this.username,
                    access_token: this.access_token,
                    aid: row.aid,
                    active: index
                }
                this.$api.article_delete(params).then((res) => {
                    this.$store.commit('TOGGLEARTICLELISTITEM', {
                        data: row
                    });
                }, (err) => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            handleCurrentChange(e) {
                this.getAtricleList(e)
            },

            getAtricleList(page=1) {
                const params = {
                    username: this.username,
                    access_token: this.access_token,
                    keyword: this.keyword,
                    page: page
                }
                this.$api.article_search(params).then((res) => {
                    this.$store.commit('GETARTICLELIST', {
                        data: res.data.data
                    });
                }, (err) => {
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addNewArticle() {
                this.$router.push({path: 'edit'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    #science-article-list__container {
        .ation-btn:not(:last-child) {
          margin-bottom: 10px;
        }

        .ation-btn {
          display: block;
          margin: 0;
        }
        .product-item {
            display: block;
            font-size: 14px;
        }
        .breadcrumb {
            margin-bottom: 40px;
        }

        .handle-box {
            margin-bottom: 20px;
        }

        .handle-select {
            width: 120px;
        }

        .handle-input {
            width: 300px;
            display: inline-block;
        }
    }
</style>
