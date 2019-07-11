<template>
  <div id="upload-pic__container">
    <el-upload
      action="http://admin-api.test.kangkanghui.com/upload/file"
      list-type="picture-card"
      :file-list="currentPicList"
      :on-preview="handlePictureCardPreview"
      :on-success="handlePictureSuccess"
      :on-error="handlePictureError"
      :on-remove="handlePictureRemove">
      <i class="el-icon-plus"></i> 
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="dialogImageTitle">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        currentPicList: [],
        dialogImageTitle: '',
        dialogImageUrl: '',
        dialogVisible: false
      }
    },

    props: ['picList', 'type'],

    created() {
      this.currentPicList = Array.from(this.picList);
    },

    methods: {
      // 点击文件列表中已上传的文件时的钩子
      handlePictureCardPreview(file) {
        this.dialogImageTitle = file.name;
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      // 文件上传成功时的钩子
      handlePictureSuccess(res, file, fileList) {
        const picArr = [{
          name: file.name,
          url: res.data.image_url
        }];
        this.currentPicList = [...this.currentPicList, ...picArr];
        this.$emit('updatePicList', this.type, Array.from(this.currentPicList))
      },

      // 文件上传失败时的钩子
      handlePictureError(err, file, fileList) {

      },

      // 文件列表移除文件时的钩子
      handlePictureRemove(file, fileList) {
        //console.info(file, fileList)
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  #upload-pic__container {

  }
</style>
