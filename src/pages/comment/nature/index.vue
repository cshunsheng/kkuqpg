<template>
    <div id="comment-outside-addurl__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 自然评论</el-breadcrumb-item>
                <el-breadcrumb-item>自然评论列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-input v-model="keyword" placeholder="请输入商品名称" class="handle-input mr10"></el-input>
            <el-checkbox v-model="only_negative" @change="radioChangeOnlyNegative">只看差评</el-checkbox>
            <el-checkbox v-model="have_picture" @change="radioChangeHavePicture">只看有图</el-checkbox>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>

        <div class="table">
            <el-table :data="commentNatureList" border style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="comment_ts" label="日期" sortable width="100">
                </el-table-column>
                <el-table-column prop="product_name" label="商品名称" width="120">
                </el-table-column>
                <el-table-column prop="content" label="评论内容">
                </el-table-column>
                <el-table-column label="评论图片" width="220">
                  <template slot-scope="scope">
                    <a target="view_window" class="product-item" v-for="(item, index) in scope.row.picture" :href="item">
                      <img :src="item">
                    </a>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="用户名">
                </el-table-column>
                <el-table-column prop="operator" label="操作人">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.display == false" size="small"
                                   @click="handleToggleShow(true, scope.row)">展示
                        </el-button>
                        <el-button v-else size="small" type="danger"
                                   @click="handleToggleShow(false, scope.row)">隐藏
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
                radio2: 3,
                keyword: '',
                only_negative: false,
                have_picture: false,
            }
        },

        computed: {
          ...mapGetters([
            'commentNatureList',                                    //自然评论列表
            'commentTableCurrentPage',                              //当前页码
            'commentTableTotal',                                    //列表总数量
            'commentTableTotalPage',                                //总页码
            'commentTablePageSize'                                  //每页数量
          ])
        },

        created() {
          this.init()
          this.getNatureComment()
        },

        methods: {
          init(){
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
          },

          radioChangeOnlyNegative(e) {
            this.only_negative = e
            this.getNatureComment()
          },

          radioChangeHavePicture(e) {
            this.have_picture = e
            this.getNatureComment()
          },

          getNatureComment(page_num = 1, page_size = 20) {
            const params = {
              page_num,
              page_size,
              keyword: this.keyword,
              only_negative: this.only_negative,
              have_picture: this.have_picture
            }
            this.$api.comment_getnature(params).then((res) => {
              this.$store.commit('GETCOMMENTNATURE', {
                data: res.data.data
              });
            }, (err) => {
              this.$message({
                message: err,
                type: 'error'
              });
            })
          },

          search() {
            this.getNatureComment()
          },

          handleCurrentChange(e) {
            this.getNatureComment(e)
          },

          handleToggleShow(display, row) {
            const id_comment = row.id_comment
            const operator = this.username
            const params = {
              id_comment,
              operator,
              display
            }
            this.$api.comment_display(params).then((res) => {
              this.$store.commit('TOGGLECOMMENT', {
                  data: {
                      id_comment: res.data.data.id_comment,
                      from_type: 'nature',
                      operator: this.username
                  }
              })
            }, (err) => {
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
    #comment-outside-addurl__container {
        .product-item {
          width: 50px;
          height: 50px;
          display: inline-block;
          margin-right: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .el-input-text {
            width: 400px;
        }

        .handle-box {
            margin-bottom: 30px;
        }

        .handle-input {
            width: 300px;
            display: inline-block;
        }
    }

</style>
