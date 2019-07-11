<template>
    <div id="home-article-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>文章运营</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="table">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewArticle">新增文章
                </el-button>
                <div class="title-wrap">
                    <span>标题</span>
                    <el-input class="el-input-text" v-model="title"></el-input>
                </div>
                <div class="title-wrap">
                    <span>副标题</span>
                    <el-input class="el-input-text" v-model="subtitle"></el-input>
                </div>
                <div class="save-title">
                    <el-button class="ation-btn" size="small" type="primary" @click="saveTitle">保存</el-button>
                </div>
            </div>

            <el-table :data="homeArticleList" border style="width: 100%" ref="multipleTable"
                      @selection-change="">
                <el-table-column prop="created_at" width="100" label="日期"></el-table-column>
                <el-table-column prop="title" width="255" label="文章"></el-table-column>
                <el-table-column prop="position" width="100" label="显示顺序"></el-table-column>
                <el-table-column label="操作">
                    <!-- scope.$index, scope.row -->
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="small" type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change=""
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="homeArticleList.length">
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
                title: '',
                subtitle: '',
                hid: ''
            }
        },
        computed: {
            ...mapGetters([
                'homeArticleList',
            ])
        },

        created() {
            this.init()
            this.getHomeArticleList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getHomeArticleList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'view'
                }
                this.$api.article_headlinelist(params).then((res)=>{
                    this.title = res.data.data.headline_list.headline
                    this.subtitle = res.data.data.headline_list.subhead
                    this.hid = res.data.data.headline_list.hid
                    this.$store.commit('GETHOMEARTICLELIST', {
                        data: res.data.data.headline_list.headline_list
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addNewArticle() {
                this.$router.push({path: 'edit', query: {hid: this.hid, headline: this.title, subhead:this.subtitle}})
            },

            saveTitle() {
                if(!this.title || !this.subtitle){
                    this.$message({
                        showClose: true,
                        message: '请正确填写标题',
                        type: 'error'
                    });
                    return
                }

                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    aid: '',
                    position: '',
                    hid: this.hid,
                    headline: this.title,
                    subhead: this.subtitle,
                    action: 'edithead'
                }
                this.$api.article_headlistadd(params).then((res)=>{
                    this.$message({
                        showClose: true,
                        message: '保存成功！',
                        type: 'success'
                    });
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            handleDelete(index, row) {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    aid: row.aid,
                    hid: row.hid,
                    action: 'del'
                }
                this.$api.article_headlistdel(params).then((res)=>{
                    this.$store.commit('DELETEHOMEARTICLE', {
                        aid: row.aid
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
    #home-article-list__container {
        .handle-del {
            display: block;
            margin-bottom: 30px;
        }
        .title-wrap{
            display: inline-block;
            width: 300px;
            font-size: 14px;
            margin-bottom: 20px;
            .el-input-text {
                width: 200px;
            }
        }
        .save-title{
            display: inline-block;
        }
    }
</style>
