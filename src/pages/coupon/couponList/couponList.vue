<template>
  <div class="coupon">
    <div style="padding-bottom:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          :to="{ path: `/admin/couponList/${fontColor1?'oneCoupon':'moreCoupon'}` }"
        >
          <i class="el-icon-menu"></i>优惠券列表
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="fontColor1">单券列表</el-breadcrumb-item>
        <el-breadcrumb-item v-if="fontColor2">套餐券列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="coupon_header">
      <el-button :class="fontColor1" @click="tabClick(1)">单券</el-button>
      <el-button :class="fontColor2" @click="tabClick(2)">套餐券</el-button>
    </div>
    <div class="coupon_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fontColor1: '',
      fontColor2: ''
    }
  },
  created() {
    this.tabClick(0)
  },
  methods: {
    tabClick(type) {
      if (type === 1) {
        this.fontColor1 = 'fontColor'
        this.fontColor2 = ''
        this.$router.push({ path: 'oneCoupon' })
      } else if (type === 2) {
        ;(this.fontColor1 = ''),
          (this.fontColor2 = 'fontColor'),
          this.$router.push({ path: 'moreCoupon' })
      }
      if (type === 0) {
        // console.log(location.hash)
        if (location.hash.includes('oneCoupon')) {
          this.fontColor1 = 'fontColor'
          this.fontColor2 = ''
        }
        if (location.hash.includes('moreCoupon')) {
          this.fontColor1 = ''
          this.fontColor2 = 'fontColor'
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.coupon {
  .fontColor {
    color: #409eff;
  }
  .coupon_header {
    .el-button {
      width: 85px;
    }
  }
  .coupon_content {
    padding: 25px 0 0;
  }
}
</style>
