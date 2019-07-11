<template>
  <div class="specificCoupon">
    <div style="padding-bottom:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'specificCoupon' }">
          <i class="el-icon-menu"></i>特定券列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_top">
      <el-button type="primary" @click="add_edit=true">新增特定券</el-button>
      <span class="count">共计{{count}}条结果</span>
    </div>
    <div class="mc_main">
      <el-table :data="couponList" border="" style="width: 100%">
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="coupon_name" label="类型"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="couponProducts(scope.row)" type="text" size="small">关联商品</el-button>
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
    <!-- 新增/编辑特定券 -->
    <el-dialog title="新增/编辑特定券" :visible.sync="add_edit" width="30%">
      <el-form :model="add_editform" :rules="rules" ref="add_editform" status-icon>
        <el-form-item label="类型" prop="name" label-width="50px">
          <el-input v-model="add_editform.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add_edit_submit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 单券操作记录 -->
    <el-dialog title="特定券操作记录" :visible.sync="logTable" width="50%">
      <el-table :data="logList" border="">
        <el-table-column property="id" label="券ID"></el-table-column>
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
      access_token: '',
      username: '',
      page: 1,
      page_size: 20,
      type: 1,
      type_id: 0,
      count: 0,
      couponList: [],
      add_edit: false,
      add_editform: {
        name: '',
        coupon_id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入特定券类型', trigger: 'blur' },
          {
            min: 1,
            max: 5,
            message: '名称长度在 1 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },
      logTable: false,
      logList: []
      // log_page: 1,
      // log_page_size: 5,
      // log_count: 50
    }
  },
  created() {
    this.access_token = localStorage.getItem('g_accessToken')
    this.username = localStorage.getItem('g_username')
    this.dataInit()
  },
  methods: {
    // 表格数据初始化
    dataInit() {
      this.$api
        .oneCouponList(this.page, this.page_size, 0, this.type, this.type_id)
        .then(res => {
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
          }
        })
    },
    // 关联商品
    couponProducts(row) {
      this.$router.push(`/admin/couponProducts/${row.id}/${row.coupon_name}`)
    },
    // 编辑
    edit(row) {
      // console.log(row)
      this.add_editform.name = row.coupon_name
      this.add_editform.coupon_id = row.id
      this.add_edit = true
    },
    //操作记录
    showLog(row) {
      this.logTable = true
      this.$api
        .showLog(row.id, 'coupon', this.log_page, this.log_page_size)
        .then(res => {
          if (res.data.status === 200) {
            this.logList = res.data.data
            // this.log_count = res.data.total
          }
        })
    },
    //点击保存按钮
    add_edit_submit() {
      this.$refs.add_editform.validate(valid => {
        if (!valid) return false
        // console.log(this.couponForm)
        this.$api
          .addCoupon(
            this.access_token,
            this.add_editform.name,
            this.type,
            this.username,
            this.add_editform.coupon_id
          )
          .then(res => {
            // console.log(res)
            if (res.data.status === 200) {
              this.dataInit()
              this.$refs.add_editform.resetFields()
              this.add_editform.coupon_id = ''
              this.$message.success(`数据保存成功`)
              this.add_edit = false
            }
          })
      })
    },
    //
    cancel() {
      this.add_edit = false
      this.add_editform.coupon_id = ''
      this.add_editform.name = ''
    },
    // ------分页------
    prev() {
      this.page--
      this.dataInit()
    },
    current(val) {
      this.page = val
      this.dataInit()
    },
    next() {
      this.page++
      this.dataInit()
    }
    // // ------log分页------
    // log_prev() {
    //   this.log_page--
    //   console.log(this.row)
    //   // this.getShowLog(this.row)
    // },
    // log_current(val) {
    //   this.log_page = val
    //   // this.getShowLog(this.row)
    // },
    // log_next() {
    //   this.log_page++
    //   // this.getShowLog(this.row)
    // }
  },
  watch: {
    add_edit: function() {
      if (!this.add_edit) {
        this.$refs.add_editform.resetFields()
        this.add_editform.coupon_id = ''
        this.add_editform.name = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content_top {
  padding: 0 0 20px;
  .count {
    margin-left: 50px;
    display: inline-block;
    height: 40px;
  }
}
.content_bottom {
  float: right;
}
.bottom {
  padding: 20px 0;
  .dialog_bottom {
    float: right;
  }
}
</style>