<template>
    <div id="home-article-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>新增文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="edit-wrap">
            <div class="part-wrap select-article-wrap">
                <span class="label-txt">文章</span>
                <el-select
                        v-model="selectAid"
                        size="medium"
                        clearable
                        filterable
                        class="el-input-text"
                        placeholder="请选择文章">
                    <el-option
                            v-for="(item, index) in allArticleList"
                            :key="index"
                            :label="item.title"
                            :value="item.aid">
                        <span>{{item.title}}</span>
                    </el-option>
                </el-select>
            </div>
            <div class="part-wrap sequence-wrap">
                <span class="label-txt">显示顺序</span>
                <el-input class="el-input-text" v-model="position"></el-input>
            </div>
            <div class="part-wrap action-wrap">
                <el-button class="ation-btn" size="small" type="primary" @click="saveArticle">保存</el-button>
                <el-button class="ation-btn" size="small" @click="cancel">取消</el-button>
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
                selectAid: '',              //当前选中的文章id
                position: '1',               //显示顺序
                headline: '',
                subhead: '',
                hid: ''
            }
        },

        computed: {
            ...mapGetters([
                'allArticleList',                                     //所有文章列表
            ])
        },

        created() {
            this.init()
            this.getArticleList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.subhead = this.$route.query.subhead?this.$route.query.subhead:''
                this.headline = this.$route.query.headline?this.$route.query.headline:''
                this.hid = this.$route.query.hid?this.$route.query.hid:''
            },

            getArticleList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'view'
                }
                this.$api.article_headlinelist(params).then((res)=>{
                    this.$store.commit('GETALLARTICLELIST', {
                        data: res.data.data.article_list
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            saveArticle() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    aid: this.selectAid,
                    position: this.position,
                    hid: this.hid,
                    headline: this.headline,
                    subhead: this.subhead,
                    action: 'add'
                }
                this.$api.article_headlistadd(params).then((res)=>{
                    this.$message({
                        message: '新增文章成功',
                        type: 'success',
                        showClose: true,
                    });
                    this.$router.push({path: 'list'})
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            cancel() {
                this.$router.push({path: 'list'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    #home-article-edit__container {
        .part-wrap{
            margin-bottom: 20px;
            .el-input-text {
                width: 200px;
            }
            .label-txt{
                display: inline-block;
                width: 80px;
                text-align: end;
                margin-right: 20px;
            }
        }
    }

</style>
