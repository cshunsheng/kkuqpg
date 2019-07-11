<template>
    <div id="science-article-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 科普文章</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: 'list'}">科普文章列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
            <el-form-item label="标题" size="small" prop="title">
                <el-input class="el-input-text" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="相关商品" size="small" prop="belong">
                <el-input class="el-input-text" v-model="form.belong"></el-input>
                <span class="tip">(注：商品id之间用||字符来分隔)</span>
            </el-form-item>
            <el-form-item label="阅读数" size="small">
                <el-input class="el-input-text" v-model="form.viewed"></el-input>
            </el-form-item>
            <el-form-item label="选择图片" size="small">
                <el-upload
                        class="avatar-uploader"
                        action="http://admin-api.test.kangkanghui.com/upload/file"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span class="tip">(注：点击编辑图片，图片大小为520*416，大小不超过32k)</span>
            </el-form-item>
            <!-- 富文本编辑 -->
            <quill-editor ref="myTextEditor" v-model="form.content" :config="editorOption">
                <!-- :action="apiurl" :before-upload='newEditorbeforeupload' :on-success='newEditorSuccess'-->
              <el-upload style="display:none" :show-file-list="false"
                           ref="uniqueId" id="uniqueId">
                           </el-upload >
            </quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit('ruleForm')">提交</el-button>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                aid: '',
                username: '',
                accessToken: '',
                editorOption: {},
                form: {
                    title: '',                          //标题
                    belong: '',                         //相关商品
                    content: '<p>Hello BBK</p>',        //富文本
                    imageUrl: ''                        //分享图片
                    ,viewed: 0
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur change'},
                    ],
                    belong: [
                        {required: true, message: '请输入相关商品', trigger: 'blur change'},
                    ]
                }
            }
        },

        created() {
            this.init()
            this.getDefaultArcMsg()
        },

        methods: {
            init() {
                this.username = localStorage.getItem('g_username')
                this.accessToken = localStorage.getItem('g_accessToken')
                this.aid = this.$route.query.aid ? this.$route.query.aid : ''
            },
            getDefaultArcMsg() {
                console.info(this.aid)
                if (this.aid) {
                    const params = {
                        access_token: this.accessToken,
                        username: this.username,
                        aid: this.aid
                    }
                    this.$api.article_view(params).then((res) => {
                        this.form = {
                            title: res.data.data.title,
                            belong: res.data.data.belong,
                            content: res.data.data.content,
                            imageUrl: res.data.data.share_image,
                            viewed: res.data.data.viewed
                        }
                    }, (err) => {
                        this.$message({
                            message: err,
                            type: 'error'
                        });
                    })
                }
            },
            handleAvatarSuccess(res, file) {
                //this.form.imageUrl = URL.createObjectURL(file.raw);
                this.form.imageUrl = res.data.image_url;
            },

            beforeAvatarUpload(file) {
                return true;
            },

            validateOthers() {
                if (!this.form.imageUrl) {
                    this.$message({
                        message: '请选择图片',
                        type: 'error'
                    });
                    return false
                }
                if (!this.form.content) {
                    this.$message({
                        message: '请输入描述内容',
                        type: 'error'
                    });
                    return false
                }
                return true
            },

            submit(formName) {
                let _this = this
                const params = {
                    access_token: this.accessToken,
                    author: 1,
                    share_image: this.form.imageUrl,
                    belong: this.form.belong,
                    content: this.form.content,
                    show_type: 0,
                    title: this.form.title,
                    username: this.username,
                    viewed: this.form.viewed
                }
                if(!this.validateOthers()){
                    return
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        //如果url有aid是编辑操作
                        if(_this.aid){
                          const newParams = Object.assign(params, {aid: _this.aid, active: 1})
                          _this.$api.article_edit(newParams).then((res) => {
                            _this.$router.push({path: '/admin/scienceArticle/list'})
                          }, (err) => {
                            _this.$message({
                              message: err,
                              type: 'error'
                            });
                          })
                        } else {
                          _this.$api.article_add(params).then((res) => {
                            _this.$router.push({path: '/admin/scienceArticle/list'})
                          }, (err) => {
                            _this.$message({
                              message: err,
                              type: 'error'
                            });
                          })
                        }
                    } else {
                        _this.$message({
                            message: '请填写正确的信息！',
                            type: 'error'
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    #science-article-edit__container {

    }
</style>
