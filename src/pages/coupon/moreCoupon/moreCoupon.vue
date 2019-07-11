<template>
  <div class="moreCoupon">
    <div class="content_top">
      <el-button type="primary" @click="add_edit=true">新增套餐券</el-button>
      <span class="count">共计{{count}}条结果</span>
    </div>
    <div class="mc_main">
      <el-table :data="couponList" border="" style="width: 100%">
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="coupon_name" label="套餐名称"></el-table-column>
        <el-table-column label="是否可发放" width="100px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.is_putout" @change="isPutout(scope.row)" :class="{fontColor:scope.row.is_putout}">
              <el-option
                v-for="item in putoutList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="addCouponClick(scope.row)" type="text" size="small">添加单券</el-button>
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="showLog(scope.row)" type="text" size="small">操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content_bottom">
        <el-pagination
          @prev-click="prev"
          @next-click="next"
          @current-change="current"
          background=""
          :page-size="page_size"
          layout="prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
    <!-- 新增/编辑套餐券 -->
    <el-dialog title="新增/编辑套餐券" :visible.sync="add_edit">
      <el-form :model="add_editfrom" :rules="rules" ref="add_editfrom" status-icon>
        <el-form-item label="套餐名称" prop="name" label-width="100px">
          <el-input v-model="add_editfrom.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add_editubmit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 套餐券操作纪录 -->
    <el-dialog title="套餐券操作纪录" :visible.sync="dialogMore" width="50%">
      <el-table :data="moreData" border="">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="operator" label="操作用户"></el-table-column>
        <el-table-column property="content" label="操作内容"></el-table-column>
        <el-table-column property="created_at" label="时间"></el-table-column>
      </el-table>
      <!-- <div class="bottom">
        <div class="dialog_bottom">
          <el-pagination
            @prev-click="log_prev"
            @next-click="log_next"
            @current-change="log_current"
            background=""
            :page-size="log_page_size"
            layout="prev, pager, next"
            :total="log_count"
          ></el-pagination>
        </div>
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求的参数
      page: 1,
      page_size: 20,
      type: 3,
      type_id: 0,
      count: 0,
      couponList: [],
      putoutList: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
      add_editfrom: {
        name: '',
        coupon_id: 0
      },
      add_edit: false,
      rules: {
        name: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '名称长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      access_token: '',
      username: '',
      dialogMore: false,
      moreData: [],
      row: {}
      // log_page: 1,
      // log_page_size: 5,
      // log_count: 50
    }
  },
  created() {
    this.oneCouponList()
    this.access_token = localStorage.getItem('g_accessToken')
    this.username = localStorage.getItem('g_username')
  },
  methods: {
    //------ 列表渲染 ------
    oneCouponList() {
      this.$api
        .oneCouponList(this.page, this.page_size, 0, this.type, this.type_id)
        .then(res => {
          console.log(res)
          let {
            data: {
              status,
              data: { total, list }
            }
          } = res
          if (status === 400) {
            this.couponList = list
            this.count = total
          }
        })
    },
    // 获取记录
    getShowLog: function(row) {
      this.$api
        .showLog(row.id, 'coupon', this.log_page, this.log_page_size)
        .then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            this.moreData = res.data.data
            this.log_count = res.data.data.length
          }
        })
    },
    // 修改发放
    isPutout(row) {
      // console.log(row)
      // console.log(this.access_token, row.id, row.is_putout, this.username)
      this.$api
        .putout(this.access_token, row.id, row.is_putout, this.username)
        .then(res => {
          // console.log(res)
          if (res.data.status === 400) {
            this.$message.error(`${res.data.msg}`)
            this.oneCouponList()
            return
          }
          if (res.data.status === 200) {
            this.$message.success(
              // `${row.coupon_name}${row.is_putout ? '发放成功' : '禁用成功'}`
              `${row.coupon_name}发放状态修改成功`
            )
          }
        })
    },
    // 操作记录
    showLog(row) {
      this.dialogMore = true
      this.row = row
      this.getShowLog(this.row)
      // console.log(this.row)
    },
    // 新增单券
    addCouponClick(row) {
      // console.log(row)
      this.$router.push(`/admin/addCoupon/${row.id}/${row.coupon_name}`)
    },
    // 编辑
    edit(row) {
      this.add_edit = true
      // console.log(row)
      this.add_editfrom.name = row.coupon_name
      this.add_editfrom.coupon_id = row.id
    },
    // 提交
    add_editubmit() {
      this.$refs.add_editfrom.validate(valid => {
        if (!valid) return false
        this.$api
          .addCoupon(
            this.access_token,
            this.add_editfrom.name,
            this.type,
            this.username,
            this.add_editfrom.coupon_id
          )
          .then(res => {
            // console.log(res)
            if (res.data.status === 200) {
              this.$message.success(
                `${this.add_editfrom.name}${
                  this.add_editfrom.coupon_id === 0 ? '添加' : '修改'
                }成功`
              )
              this.oneCouponList()
              this.add_edit = false
              this.$refs.add_editfrom.resetFields()
              this.add_editfrom.name = ''
              this.add_editfrom.coupon_id = 0
            }
          })
      })
    },
    // 取消
    cancel() {
      this.add_edit = false
      this.add_editfrom.coupon_id = ''
      this.add_editfrom.name = ''
    },
    // ------分页------
    prev() {
      this.page--
      this.oneCouponList()
    },
    current(val) {
      this.page = val
      this.oneCouponList()
    },
    next() {
      this.page++
      this.oneCouponList()
    }
    // ------log分页------
    //   log_prev() {
    //     this.log_page--
    //     console.log(this.row)
    //     this.getShowLog(this.row)
    //   },
    //   log_current(val) {
    //     this.log_page = val
    //     this.getShowLog(this.row)
    //   },
    //   log_next() {
    //     this.log_page++
    //     this.getShowLog(this.row)
    //   }
  },
  watch: {
    add_edit: function() {
      if (!this.add_edit) {
        this.add_editfrom.coupon_id = ''
        this.add_editfrom.name = ''
        this.$refs.add_editfrom.resetFields()
      }
    }
  }
}
</script>
<style lang='scss'>
.moreCoupon .content_top {
  padding: 0 0 20px;
  .el-select {
    margin-left: 50px;
  }
  .count {
    margin-left: 50px;
    display: inline-block;
    height: 40px;
  }
}
.moreCoupon .content_bottom {
  float: right;
}
.moreCoupon .bottom {
  padding: 20px 0;
  .dialog_bottom {
    float: right;
  }
}
.moreCoupon .fontColor .el-input--suffix .el-input__inner {
  color: #20a0ff;
}
</style>