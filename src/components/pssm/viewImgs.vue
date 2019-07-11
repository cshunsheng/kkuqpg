<template>
    <div class="view-img">
        <div class="block">
            <el-carousel :interval="5000" arrow="always">
                <el-carousel-item v-for="(item,index) in currentPicList" :key="index">
                    <img :src="item.img_url" class="img-bg">
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
    data() {
        return {
            currentPicList:[],
        }
    },

    props: ['imgs'],

    created() {
    },
    watch: {
        imgs: {
            handler(val, oldVal) {
                this.currentPicList = [].concat(this.imgs);
            },
            deep: true
        }
    },
    methods: {
    },
    computed: {
    }
}
</script>
<style>
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .img-bg{
      width:100%;
      height:100%;
      background-size: cover;
  }
</style>