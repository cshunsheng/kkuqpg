<template>
    <div id="module-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'container'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>商品运营</el-breadcrumb-item>
                <el-breadcrumb-item>模块编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :model="params" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="模块名称" size="small" prop="name">
                  <el-input class="el-input-text" v-model="params.name"></el-input>
              </el-form-item>
              <el-form-item class="upload-img-box" label="模块图片" size="small">
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
                  <span class="tip">（图片大小：710*178）</span>
                </el-upload>
            </el-form-item>
            <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
            <el-button @click="cancel" type="info">取消</el-button>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                uploadImgList: [],
                params: {},
                rules: {
                    name: [
                        {required: true, message: '请输入模块名称', trigger: 'blur change'},
                    ]
                },
            }
        },

        created() {
            this.init()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.params = this.$route.query.params?JSON.parse(this.$route.query.params):''
                const imgObj = {
                    name: 'pic',
                    url: this.params.img_url
                }
                this.uploadImgList.push(imgObj)
            },

            //上传成功
            handleSuccess(res, file, fileList) {
                this.params.img_url = res.data.image_url
                console.log(this.params.img_url)
            },

            handleRemove(file, fileList) {
                this.params.img_url = ''
                console.log(this.params.img_url)
            },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
            },

            validateOthers() {
                if (!this.params.img_url) {
                    this.$message({
                        message: '请选择图片',
                        type: 'error'
                    });
                    return false
                }
                return true
            },

            submit(formName){
                const {id, type, name, img_url} = this.params
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'edit',
                    id,
                    type,
                    name,
                    img_url
                }

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(!this.validateOthers()){
                            return
                        }
                        this.$api.apost_middleimgedit(params).then((res)=>{
                            this.$router.push({path: 'container'})
                        }, (err)=>{
                            this.$message({
                                message: '请输入描述内容',
                                type: 'error'
                            });
                        })
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
                this.$router.push({path: 'container'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    #module-edit__container{
        .upload-demo {
          width: 400px;
        }
    }
</style>
