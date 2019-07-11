<template>
    <div class="page_editSys">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/sysNotice'}">
                    <i class="el-icon-menu"></i>系统通知
                </el-breadcrumb-item>
                <el-breadcrumb-item>编辑系统通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="editForm">
            <el-col :span="12">
            <el-form :model="noticeData" :rules="rules" size="small" ref="noticeData" label-width="100px" class="w-form">
                <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="noticeData.title" maxlength=50 size="medium">
                    </el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model.trim="noticeData.content" rows=10 size="medium">
                    </el-input>
                    <span class="tip entertip">(注：按“回车”即为内容分段)</span>
                </el-form-item>
                <el-form-item label="链接" size="medium">
                    <el-input v-model="noticeData.link">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" size="medium">
                    <el-input v-model="noticeData.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="封面图" size="small">
                    <el-upload 
                        class="avatar-uploader" 
                        action="http://admin-api.test.kangkanghui.com/upload/file" 
                        :show-file-list="false" 
                        :on-success="handleIndexImg">
                        <img v-if="noticeData.imgurl" :src="noticeData.imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="tip">(注：点击编辑图片，图片大小为100*100)</span>
                </el-form-item>
                <el-form-item label="分享标题">
                    <el-input v-model="noticeData.share_title"></el-input>
                </el-form-item>
                <el-form-item label="分享图片" size="small">
                    <el-upload 
                        class="avatar-uploader" 
                        action="http://admin-api.test.kangkanghui.com/upload/file" 
                        :show-file-list="false" 
                        :on-success="handleShareImg">
                        <img v-if="noticeData.share_img" :src="noticeData.share_img" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="tip">(注：点击编辑图片，图片大小为520*416，大小不超过32k)</span>
                </el-form-item>
                <el-form-item label="发送状态" prop="state">
                    <el-select v-model="noticeData.send_state">
                        <el-option v-for="item in sendStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定时发送" v-if="noticeData.send_state == 2">
                    <el-date-picker
                        v-model="noticeData.send_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="formBtns">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </div>
            </el-col>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: '',
            access_token:'',
            noticeData:{
                title: '',
                content: '',
                link:'',
                remark:'',
                imgurl:'',
                share_title:'',
                share_img:'',
                send_state: '',
                send_time:'',
                msg_id: '',
                type: 1 // 1:添加 2：编辑
            },
            time: '',
            noticeId: '',
            rules:{
                title: { required: true, message: '请输入标题', trigger: 'blur' },
                content: { required: true, message: '请输入内容', trigger: 'blur' },
                state: {required: true, message: '请选择发送状态', trigger: 'blur' }
            },
            sendStatus: [
                {
                    value: 0,
                    label: '仅保存'
                },
                {
                    value: 1,
                    label: '立即发送'
                },
                {
                    value: 2,
                    label: '定时发送'
                }
            ]
        }
    },
    created() {
        this.access_token = localStorage.getItem('g_accessToken')
        this.username = localStorage.getItem('g_username')
        this.noticeId = this.$route.query.noticeId
        if(this.noticeId){
            this.noticeData.msg_id = this.noticeId
            this.noticeData.type = 2
            this.getNoticeInfo()
        }
    },
    methods: {
        getNoticeInfo() {
            let _data = {
                username:this.username,
                access_token:this.access_token,
                msg_id:this.noticeId
            }
            this.$api.getNoticeInfo(_data)
                .then(res=>{
                    let _obj = res.data.data
                    this.noticeData = Object.assign({},this.noticeData,_obj)
                })
        },
        //上传图片
        handleIndexImg(res, file) {
            this.noticeData.imgurl = res.data.image_url;
        },
        handleShareImg(res, file) {
            this.noticeData.share_img = res.data.image_url;
        },
        beforeAvatarUpload(file) {
            return true;
        },
        cancel() {
            this.$message("已取消")
            this.$router.go(-1)
        },
        submitForm() {
            if(!this.checkForm()){
                return ;
            }
            let _data = this.noticeData
            let _userData = {
                username:this.username,
                access_token: this.access_token
            }
            Object.assign(_data,_userData)
            this.$api.saveNotice(_data)
                .then(res=>{
                    if(res.data.status == 200){
                        this.$message.success('保存成功')
                        this.$router.go(-1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
        },
        checkForm() {
            let _title = this.noticeData.title
            let _content = this.noticeData.content
            let _state = this.noticeData.send_state
            if(this.noticeData.send_state == 2){
                let _date = Date.parse(new Date())
                let _cDate = Date.parse(this.noticeData.send_time)
                if(_cDate - _date < 120){
                    this.$message.error("已过时，请重新选择时间")
                    return false;
                }
            }
            
            if(!_title){
                this.$message.error("请输入标题")
                return false;
            }
            if(!_content){
                this.$message.error("请输入内容")
                return false;
            }
            if(_state===''){
                this.$message.error('请选择发送状态')
                return false;
            }
            return true
        }
    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .entertip{
      color:#40abfc;
  }
</style>