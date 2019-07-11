<template>
    <div id="banner-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>新增banner</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="显示顺序" size="small" prop="pos">
                <el-input class="el-input-text" v-model="form.pos"></el-input>
                <span class="tip">（注：数字越大越前面）</span>
            </el-form-item>
            <el-form-item label="备注" size="small" prop="description">
                <el-input placeholder="可以输入专题活动名称" class="el-input-text" v-model="form.description"></el-input>
            </el-form-item>

            <el-form-item label="链接/商品id" size="small" prop="act_url">
                <el-input class="el-input-text" v-model="form.act_url"></el-input>
            </el-form-item>

            <el-form-item label="是否上线" size="small" prop="title">
                <el-select v-model="form.active" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="upload-img-box" label="banner图片" size="small" prop="title">
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
                  <div slot="tip" class="el-upload__tip">支持jpg/png文件，大小为680*370比例</div>
                </el-upload>
            </el-form-item>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>分享配置</span>
              </div>
              <el-form-item label="分享标题" size="small" prop="share_title">
                  <el-input placeholder="可以输入专题活动名称" class="el-input-text" v-model="form.share_title"></el-input>
              </el-form-item>

              <el-form-item class="upload-img-box" label="分享图片" size="small" prop="title">
                  <el-upload
                    class="upload-demo"
                    action="http://admin-api.test.kangkanghui.com/upload/file"
                    :on-success="handleShareImgSuccess"
                    :on-remove="handleShareImgRemove"
                    :on-exceed="handleShareImgExceed"
                    :file-list="uploadShareImgList"
                    :limit="1"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">支持jpg/png文件，大小为520*416比例，大小不超过32k</div>
                  </el-upload>
              </el-form-item>
            </el-card>
        </el-form>

        <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
        <el-button @click="cancel" type="info">取消</el-button>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                banner_id: '',
                username: '',
                access_token: '',
                has_act_url: '',
                has_id: '',
                form: {
                    imgurl: '',                           //图片url
                    act_url: '',                          //链接
                    id: '',                               //商品id
                    pos: '',                              //顺序
                    active: '',                           //是否上线
                    description: '',                      //备注
                    share_title: '',                      //分享标题
                    share_img: '',                        //分享图片
                },
                rules: {
                    description: [
                        {required: true, message: '请输入备注', trigger: 'blur change'},
                    ],
                    pos: [
                        {required: true, message: '请输入显示顺序', trigger: 'blur change'},
                    ],
                    act_url: [
                        {required: true, message: '请输入链接', trigger: 'blur change'},
                    ],
                    share_title: [
                        {required: true, message: '请输入分享标题', trigger: 'blur change'},
                    ]
                },
                options: [{
                    value: '1',
                    label: '上线'
                }, {
                    value: '0',
                    label: '下线'
                }],
                uploadImgList: [],
                uploadShareImgList: [],
            }
        },

        created() {
            this.init()
            this.getBannerView()
        },

        methods: {
            init() {
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.banner_id = this.$route.query.banner_id ? this.$route.query.banner_id : ''
            },

            getBannerView(){
                if(this.banner_id){
                    const params = {
                        access_token: this.access_token,
                        username: this.username,
                        action: 'view',
                        id: this.banner_id
                    }
                    this.$api.apost_view(params).then((res)=>{
                        const imgObj = {
                            name: 'pic',
                            url: res.data.data.imgurl
                        }
                        const shareImgObj = {
                            name: 'pic',
                            url: res.data.data.share_img
                        }
                        this.form = res.data.data
                        if(this.form.act_url){
                            this.has_act_url = true
                            this.form.act_url = this.form.act_url
                        } else if(this.form.id_product) {
                            this.has_id = true
                            this.form.act_url = this.form.id_product
                        }
                        this.form.active = this.form.active.toString()
                        this.uploadImgList.push(imgObj)
                        this.uploadShareImgList.push(shareImgObj)
                    }, (err)=>{
                        this.$message({
                            message: '请选择是否上线',
                            type: 'error'
                        });
                    })
                }
            },

            //banner显示图片成功
            handleSuccess(res, file, fileList) {
                this.form.imgurl = res.data.image_url
            },

            handleRemove(file, fileList) {
                this.form.imgurl = ''
            },

            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
            },


            //banner分享图片上传成功
            handleShareImgSuccess(res, file, fileList) {
                this.form.share_img = res.data.image_url
            },

            handleShareImgRemove(file, fileList) {
                this.form.share_img = ''
            },

            handleShareImgExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
            },

            validateOthers() {
                if (!this.form.imgurl) {
                    this.$message({
                        message: '请选择显示图片',
                        type: 'error'
                    });
                    return false
                }
                if (!this.form.share_img) {
                    this.$message({
                        message: '请选择分享图片',
                        type: 'error'
                    });
                    return false
                }
                if (!this.form.active) {
                    this.$message({
                        message: '请选择是否上线',
                        type: 'error'
                    });
                    return false
                }
                return true
            },
            submit(formName){
                const {imgurl, act_url, id, pos, active, description, share_title, share_img} = this.form
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'add',
                    imgurl,
                    act_url,
                    id,
                    pos,
                    active,
                    description,
                    share_title,
                    share_img
                }

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(!this.validateOthers()){
                            return
                        }
                        //如果有banner_id，则为编辑接口
                        if(!this.banner_id){
                            this.$api.apost_add(params).then((res)=>{
                                this.$router.push({path: 'list'})
                            }, (err)=>{
                                this.$message({
                                    message: '请输入描述内容',
                                    type: 'error'
                                });
                            })
                        } else {
                            //否则为添加接口
                            params.action = 'edit'
                            params.id = this.banner_id
                            this.$api.apost_edit(params).then((res)=>{
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

<style lang="scss" scoped>
    #banner-edit__container{
        .upload-img-box{
          width: 400px;
        }
        .box-card {
          margin-bottom: 20px;
        }
    }
</style>
