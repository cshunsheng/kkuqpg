<template>
    <div id="keyword-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i>搜索管理</el-breadcrumb-item>
                <el-breadcrumb-item>关键字</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="add-module-item">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addKeyword">新增关键字</el-button>
        </div>

        <div class="table">
            <el-table :data="keywordList" border style="width: 100%" ref="multipleTable"
                        @selection-change="">
                  <el-table-column prop="keyword" width="155" label="关键字"></el-table-column>
                  <el-table-column prop="id_category" width="455" label="ID"></el-table-column>
                  <el-table-column prop="pos" width="100" label="显示顺序"></el-table-column>
                  <el-table-column label="操作">
                      <!-- scope.$index, scope.row -->
                      <template slot-scope="scope">
                          <el-button class="ation-btn" size="small" type="danger"
                                     @click="deleteKeyword(scope.$index, scope.row)">删除
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
                'keywordList'
            ])
        },

        created() {
            this.init()
            this.getKeywordList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getKeywordList() {
                const params = {
                    username: this.username,
                    access_token: this.access_token
                }
                this.$api.search_listkwd(params).then((res)=>{
                    this.$store.commit('GETKEYWORDLIST', {
                        data: res.data.data.keyword_list
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addKeyword() {
                this.$router.push({path: 'edit'})
            },

            deleteKeyword(index, row) {
                const params = {
                    username: this.username,
                    access_token: this.access_token,
                    id: row.id
                }
                this.$api.search_delkwd(params).then((res)=>{
                    this.$store.commit('DELETEKEYWORD', {
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

<style lang="scss", scoped>
    #keyword-list__container{
        .add-module-item{
            margin-bottom: 20px;
        }
    }
</style>
