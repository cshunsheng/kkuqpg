<template>
  <div id="base-pic__container">
    <el-row :gutter="15">
      <el-col class="box-card" :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>橱窗头图</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <UploadPic :picList="baseInfoData.images"
                     type="images"
                     @updatePicList="updatePicList">
          </UploadPic>
          
        </el-card>
      </el-col>

      <el-col class="box-card" :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>详情图</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <UploadPic :picList="baseInfoData.images_detail"

                     type="images_detail"
                     @updatePicList="updatePicList">
          </UploadPic>
        </el-card>
      </el-col>

      <el-col class="box-card" :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>医疗证书</span>
            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
          </div>
          <UploadPic :picList="baseInfoData.diploma"
                     type="medical_pic"

                     @updatePicList="updatePicList">
          </UploadPic>
        </el-card>
      </el-col>
      <!-- <el-col class="box-card" :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>医生推荐分享图</span>

            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>

          </div>
          <UploadPic :picList="baseInfoData.docrem_pic"
                     type="docrem_pic"
                     @updatePicList="updatePicList">
          </UploadPic>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import UploadPic from './UploadPic.vue'
  export default {
    data() {
      return {
        baseInfoData: this.formData,
      }
    },

    props: ['formData'],

    components: {
      'UploadPic': UploadPic
    },

    watch: {
      baseInfoData: {
        handler(val, oldVal){
          this.$emit('updateFromData', val)
        },
        deep: true
      }
    },

    created() {

    },

    methods: {
      updatePicList(type, value){
        console.log(type, value);
        switch (type) {

          case 'images':
            this.baseInfoData.images = value;
            break;
          case 'images_detail':
            this.baseInfoData.images_detail = value;
            break;
          case 'diploma':
            this.baseInfoData.diploma = value;
            break;
        //   case 'docrem_pic':
        //     this.baseInfoData.docrem_pic = value;
        //     break;
        }

      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  #base-pic__container {
    .box-card:not(:last-child) {
      margin-bottom: 15px;
    }
  }

</style>
