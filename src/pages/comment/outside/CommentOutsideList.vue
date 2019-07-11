<template>
    <div id="comment-outside-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 外部评论</el-breadcrumb-item>
                <el-breadcrumb-item>外部评论列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="table">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewCommentLink">新增链接
                </el-button>
                <el-input v-model="keyword" placeholder="请输入商品名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="commentExternalinfo" border style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="created_at" label="日期" sortable width="100">
                </el-table-column>
                <el-table-column prop="product_name" label="商品名称" width="120">
                </el-table-column>
                <el-table-column prop="url_jd" label="京东链接">
                </el-table-column>
                <el-table-column prop="num_jd" label="京东评论展示数">
                </el-table-column>
                <el-table-column prop="url_tm" label="天猫链接">
                </el-table-column>
                <el-table-column prop="num_tm" label="天猫评论展示数">
                </el-table-column>
                <el-table-column prop="operator" label="操作人">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="small" type="primary"
                                   @click="urlEdit(scope.$index, scope.row)">修改链接
                        </el-button>
                        <el-button class="ation-btn" size="small" type="primary"
                                   @click="commentEdit(scope.$index, scope.row)">评论编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next"
                        :page-size="commentTablePageSize"
                        :total="commentTableTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapActions} from 'vuex'

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
                'commentExternalinfo',                                  //列表
                'commentTableCurrentPage',                              //当前页码
                'commentTableTotal',                                    //列表总数量
                'commentTableTotalPage',                                //总页码
                'commentTablePageSize'                                  //每页数量
            ])
        },

        created() {
          this.init()
          this.getCommentExternalinfo()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            search() {
                this.getCommentExternalinfo()
            },

            handleCurrentChange(e){
                this.getCommentExternalinfo(e)
            },

            getCommentExternalinfo(page_num=1, page_size=20) {
                const params = {
                    page_num,
                    page_size,
                    keyword: this.keyword
                }
                this.$api.comment_externalinfo(params).then((res)=>{
                    this.$store.commit('GETCOMMENTEXTERNALINFO', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            urlEdit(index, row) {
              this.$router.push({path: 'add_url', query: {
                  id_product: row.id_product,
                  product_name: row.product_name,
                  url_tm: row.url_tm,
                  url_jd: row.url_jd,
                  operator: row.operator
              }})
            },

            commentEdit(index, row) {
              this.$router.push({path: 'edit', query: {id_product: row.id_product}})
            },

            addNewCommentLink() {
                this.$router.push({path: 'add_url'})
            }
        }
    }
</script>

<style lang="scss" scoped>
  #comment-outside-list__container {
    .ation-btn:not(:last-child) {
      margin-bottom: 10px;
    }

    .ation-btn {
      display: block;
      margin: 0;
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
