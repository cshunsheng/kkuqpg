<template>
  <div class="addCoupon">
    <div style="padding-bottom:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/couponList/moreCoupon' }">
          <i class="el-icon-menu"></i>套餐券
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加单券</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form" style="width:50%">
      <el-form :model="addCouponFrom" :rules="rules" ref="add_editfrom">
        <el-form-item label="套餐ID" label-width="100px" style="width:275px">
          <el-input size="small" v-model="addCouponFrom.id_coupon" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="套餐名称" label-width="100px" style="width:275px">
          <el-input size="small" v-model="addCouponFrom.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单券" label-width="100px">
          <el-button @click="show = !show" style="width:175px">
            请选择添加单券
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-button
            type="primary"
            style="float:right"
            @click="addMoreCoupons"
            :disabled="isDisabled"
          >添加</el-button>
          <div class="couponSelsct" v-show="show">
            <!-- <el-form :model="CouponFrom"> -->
            <div class="tianjia" v-for="(item , index) in couponList" :key="index">
              <div class="items-right">
                <el-input-number
                  :min="0"
                  size="mini"
                  v-model="numList[item.id]"
                  style="width:100px"
                  :placeholder="0"
                ></el-input-number>
              </div>
              <div class="items">
                <div class="items_span">{{item.coupon_name}}</div>
              </div>
            </div>
            <!-- </el-form> -->
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableList">
      <el-table :data="tableData" border="" style="width: 100%">
        <el-table-column prop="id" label="单券ID" width="180"></el-table-column>
        <el-table-column prop="coupon_name" label="单券名称" width="180"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="coupon_value" label="价值（元）"></el-table-column>
        <el-table-column prop="min_use_value" label="满减金额（元）"></el-table-column>
        <el-table-column prop="expired_days" label="使用期限（天）"></el-table-column>
        <el-table-column prop="is_putout" label="是否可发放"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      access_token: '',
      username: '',
      addCouponFrom: {
        id_coupon: '',
        name: '',
        type: 3,

        id_singles: '' //{"13":"4"}单券-数量，如单券id为13，数量是4个
      },
      numList: {},
      rules: {},
      couponList: [],
      CouponFrom: {},
      show: false,
      tableData: [],
      flag: false
      // isDisabled: true
    }
  },
  created() {
    this.dataInit()
    this.getCouponList()
    // console.log(this)
  },
  computed: {
    isDisabled: function() {
      var f = false
      console.log(f)
      for (var key in this.numList) {
        if (this.numList[key] > 0) {
          f = true
          this.flag = false
        }
      }
      console.log(f)

      if (f) {
        this.flag = false
      } else {
        this.flag = true
      }
      return this.flag
    }
  },
  // watch: {
  //   numList: function() {
  //     for (var key in this.numList) {
  //       if (this.numList[key] > 0) {
  //         this.flag = true
  //       }
  //       isDisabled = !flag
  //     }
  //   }
  // },
  methods: {
    // 数据初始化
    dataInit() {
      this.addCouponFrom.id_coupon = this.$route.params.id
      this.addCouponFrom.name = this.$route.params.name
      this.access_token = localStorage.getItem('g_accessToken')
      this.username = localStorage.getItem('g_username')
      this.oneCouponList(() => {
        this.couponList.forEach(v => {
          this.$set(this.numList, `${v.id}`, 0)
          // console.log(this.numList[v.id])
        })
      })
    },
    //------ 列表渲染 ------
    oneCouponList(callback) {
      this.$api.oneCouponList(1, 10, 1, 2, 0).then(res => {
        // console.log(res)
        let {
          data: {
            status,
            data: { total, list }
          }
        } = res
        if (status === 400) {
          this.couponList = list
          this.count = total
          callback()
        }
      })
    },
    //获取套餐券下的详情信息
    getCouponList() {
      this.$api.getCouponList(this.addCouponFrom.id_coupon, 3).then(res => {
        // console.log(res)
        if (res.data.status === 200) {
          this.tableData = res.data.data.list
        }
        this.tableData.forEach(v => {
          v.is_putout = v.is_putout ? '是' : '否'
        })
      })
    },
    //给套餐券添加单券
    addMoreCoupons(id) {
      let id_singles = JSON.stringify(this.numList)
      if (this.flag) {
        this.$message.error('请输入要添加的单券数量')
        return false
      }
      this.$api
        .addMoreCoupons(
          this.access_token,
          this.addCouponFrom.id_coupon,
          id_singles,
          this.username,
          id
        )
        .then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            this.$message.success('添加单券操作成功')
            this.getCouponList()
            this.show = false
            for (var key in this.numList) {
              this.numList[key] = 0
            }
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.couponSelsct {
  margin-top: 20px;
  border: 1px solid #cccccc;
  .tianjia {
    .items {
      overflow: hidden;
      height: 40px;
      text-align: center;
    }
    .items-right {
      float: right;
    }
  }
}
</style>
  

