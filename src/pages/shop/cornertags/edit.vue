<template>
    <div id="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增角标</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="标题" size="small" prop="title">
                    <el-input placeholder="请输入标签名称，不得超过4个字" class="el-input-text" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item class="upload-img-box" label="图片" size="small" prop="title">
                    <el-upload
                      class="upload-demo"
                      action="http://admin-api.test.kangkanghui.com/upload/file"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :on-exceed="handleExceed"
                      :file-list="uploadImgList"
                      :limit="1"
                      list-type="picture">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">支持jpg/png文件，且不超过500kb，大小为200*200比例</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
            <el-button @click="cancel" type="info">取消</el-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                username: '',
                access_token: '',
                id: '',
                uploadImgList: [],
                form: {
                    imgurl: '',                           //图片url
                    title: ''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur change'},
                        {max: 4, message: '不能超过4位', trigger: 'blur change'},
                    ]
                },
            }
        },

        created() {
            this.init()
            this.getCornertagsView()
        },

        methods: {
            init() {
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.id = this.$route.query.id ? this.$route.query.id : ''
            },

            getCornertagsView(){
                if(this.id){
                    const params = {
                        access_token: this.access_token,
                        username: this.username,
                        id: this.id
                    }
                    this.$api.cornertags_view(params).then((res)=>{
                        const imgObj = {
                            name: 'pic',
                            url: res.data.data.img_url
                        }
                        this.form.imgurl = res.data.data.img_url
                        this.form.title = res.data.data.title
                        this.uploadImgList.push(imgObj)
                    }, (err)=>{
                        this.$message({
                            message: '请选择是否上线',
                            type: 'error'
                        });
                    })
                }
            },

            //上传成功
            handleSuccess(res, file, fileList) {
                this.form.imgurl = res.data.image_url
            },

            handleRemove(file, fileList) {
                this.imgurl = ''
            },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
            },

            validateOthers() {
                if (!this.form.imgurl) {
                    this.$message({
                        message: '请选择图片',
                        type: 'error'
                    });
                    return false
                }
                return true
            },

            submit(formName){
                const {imgurl, title} = this.form
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    title: title,
                    img_url: imgurl,
                }

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(!this.validateOthers()){
                            return
                        }
                        //如果有banner_id，则为编辑接口
                        if(this.id){
                            params.id = this.id
                            this.$api.cornertags_edit(params).then((res)=>{
                                this.$router.push({path: 'list'})
                            }, (err)=>{
                                this.$message({
                                    message: '请输入描述内容',
                                    type: 'error'
                                });
                            })
                        } else {
                            //否则为添加接口
                            this.$api.cornertags_add(params).then((res)=>{
                                this.$router.push({path: 'list'})
                            }, (err)=>{
                                this.$message({
                                    message: '请输入描述内容',
                                    type: 'error'
                                });
                            })
                        }

                    } else {
                        this.$message({
                            message: '请填写正确的信息！',
                            type: 'error'
                        });
                        return false;
                    }
                })
            },

            cancel() {
              this.$router.push({path: 'list'})
            }
        }
    }
</script>

<style>

</style>
