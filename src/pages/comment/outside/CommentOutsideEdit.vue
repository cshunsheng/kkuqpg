<template>
    <div id="comment-outside-addurl__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 外部评论</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: 'list'}">外部评论列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{product_name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-checkbox v-model="only_display" @change="radioChangeOnlyDisplay">只看显示</el-checkbox>
            <el-checkbox v-model="have_picture" @change="radioChangeHavePicture">只看有图</el-checkbox>
            <el-select v-model="id_source" placeholder="请选择">
                <el-option
                        v-for="item in sourceArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click.stop="search">搜索</el-button>
        </div>

        <div class="table">
            <el-table :data="commentExternalList" border style="width: 100%" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="comment_ts" label="日期" sortable width="100">
                </el-table-column>
                <el-table-column prop="id_source" label="来源">
                </el-table-column>
                <el-table-column prop="content" label="评论内容" width="420">
                </el-table-column>
                <el-table-column prop="address" label="评论图片" width="220">
                  <template slot-scope="scope">
                        <a target="view_window" class="product-item" v-for="(item, index) in scope.row.picture" :href="item">
                          <img :src= "item">
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
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: '',
                product_name: '',                          //商品名称
                id_product: null,                          //商品id
                only_display: false,                       //只看显示
                have_picture: false,                       //只看有图
                id_source: '',                             //来源（京东or天猫）
                sourceArr: [{
                    value: '',
                    label: '全部'
                },{
                    value: '2',
                    label: '天猫'
                }, {
                    value: '1',
                    label: '京东'
                }],
            }
        },

        created() {
          this.init()
          this.getExternal()
        },

        computed: {
          ...mapGetters([
            'commentExternalList',                                  //列表
            'commentTableCurrentPage',                              //当前页码
            'commentTableTotal',                                    //列表总数量
            'commentTableTotalPage',                                //总页码
            'commentTablePageSize'                                  //每页数量
          ])
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.id_product = this.$route.query.id_product
            },

            getExternal(page_num=1, page_size=20) {
              const params = {
                page_num,
                page_size,
                id_source: this.id_source,
                id_product: this.id_product,
                only_display: this.only_display,
                have_picture: this.have_picture
              }
              this.$api.comment_getexternal(params).then((res) => {
                this.$store.commit('GETCOMMENTEXTERNAL', {
                  data: res.data.data
                })
                this.product_name = res.data.data.list[0].product_name
              }, (err) => {
                this.$message({
                  message: err,
                  type: 'error'
                });
              })
            },

            radioChangeOnlyDisplay(e) {
              this.only_display = e
              this.getExternal()
            },

            radioChangeHavePicture(e) {
              this.have_picture = e
              this.getExternal()
            },

            search() {
                this.getExternal()
            },

            handleCurrentChange(e) {
                this.getExternal(e)
            },

            handleToggleShow(display, row) {
              const id_comment = row.id_comment
              const operator = this.username
              const params = {
                  id_comment,
                  display,
                  operator
              }
              this.$api.comment_display(params).then((res)=>{
                this.$store.commit('TOGGLECOMMENT', {
                  data: {
                      id_comment: res.data.data.id_comment,
                      from_type: 'external',
                      operator: this.username
                  }
                })
              }, (err)=>{
                this.$message({
                  message: err,
                  type: 'error'
                });
              })
            },
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

    }

</style>
