<template>
  <div class="source">
    <div style="padding-bottom:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'source' }">
          <i class="el-icon-menu"></i>发放途径
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_top">
      <el-button type="primary" @click="add_edit=true">新增发放途径</el-button>
    </div>
    <div class="mc_main">
      <el-table :data="couponList" border="" style="width: 100%">
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="source_desc" label="发放途径"></el-table-column>
        <el-table-column prop="coupon_str" label="关联优惠券">
          <template slot-scope="scope">
            <el-button @click="details(scope.row)" type="text" size="small">{{scope.row.coupon_str}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="coupon_type" label="单券/套餐券"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="showLog(scope.row)" type="text" size="small">操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="content_bottom">
        <el-pagination
          @prev-click="prev"
          @next-click="next"
          @current-change="current"
          background=""
          :page-size="page_size"
          layout="prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>-->
    </div>
    <!-- 新增/编辑发放途径 -->
    <el-dialog title="新增/编辑发放途径" :visible.sync="add_edit" width="40%">
      <el-form :model="add_editform" :rules="rules" ref="add_editform" status-icon>
        <el-form-item label="发放途径" prop="source_desc" label-width="100px">
          <el-input type="textarea" :rows="3" resize="none" v-model="add_editform.source_desc"></el-input>
        </el-form-item>
        <el-form-item label="优惠券" prop="coupon_id" label-width="100px">
          <el-select v-model="add_editform.coupon_id" placeholder="请选择">
            <el-option
              v-for="(item,index) in optionList"
              :key="index"
              :label="item.coupon_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add_edit_submit">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 发放途径操作记录 -->
    <el-dialog title="发放途径操作记录" :visible.sync="logTable" width="50%">
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
    <!-- 详情模块 -->
    <el-dialog :title="title" :visible.sync="detailsDialog1" width="50%">
      <el-table :data="detailsList" border="">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="type_name" label="类型"></el-table-column>
        <el-table-column property="coupon_name" label="名称"></el-table-column>
        <el-table-column property="coupon_value" label="价值（元）"></el-table-column>
        <el-table-column property="min_use_value" label="满减金额（元）"></el-table-column>
        <el-table-column property="expired_days" label="使用期限（天）"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="detailsDialog2" width="50%">
      <el-table :data="detailsList" border="">
        <el-table-column property="id" label="单券ID"></el-table-column>
        <el-table-column property="type_name" label="类型"></el-table-column>
        <el-table-column property="coupon_name" label="单券名称"></el-table-column>
        <el-table-column property="coupon_value" label="价值（元)"></el-table-column>
        <el-table-column property="min_use_value" label="满减金额（元）"></el-table-column>
        <el-table-column property="expired_days" label="使用期限（天）"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      access_token: '',
      username: '',
      couponList: [],
      add_edit: false,
      add_editform: {
        source_desc: '',
        coupon_id: '',
        id: ''
      },
      rules: {
        source_desc: [
          { required: true, message: '请填写发放途径', trigger: 'blur' }
        ],
        coupon_id: [
          { required: true, message: '请选择优惠券', trigger: 'blur' }
        ]
      },
      optionList: [],
      logTable: false,
      logList: [],
      id_coupon: '',
      type: '',
      title: '',
      detailsDialog1: false,
      detailsDialog2: false,
      detailsList: []
    }
  },
  created() {
    this.access_token = localStorage.getItem('g_accessToken')
    this.username = localStorage.getItem('g_username')
    this.dataInit()
    this.getOptionList()
  },
  methods: {
    // 表格数据初始化
    dataInit() {
      this.$api.sourceList().then(res => {
        // console.log(res)
        let {
          data: { status, data }
        } = res
        if (status === 200) {
          this.couponList = data
        }
      })
    },
    //获取option数据
    getOptionList() {
      let list1
      let list2
      this.$api.oneCouponList(1, 5, 1, 2, 0).then(res => {
        // console.log(res)
        let {
          data: {
            status,
            data: { total, list }
          }
        } = res
        if (status === 400) {
          list1 = list
          // this.count = total
          this.$api.oneCouponList(1, 5, 1, 3, 0).then(res => {
            // console.log(res)
            let {
              data: {
                status,
                data: { total, list }
              }
            } = res
            if (status === 400) {
              list2 = list
              // this.count = total
              this.optionList = [...list1, ...list2]
              this.optionList = this.optionList.filter(v => {
                return v.is_putout
              })
            }
          })
        }
      })
    },
    // 编辑
    edit(row) {
      // console.log(row)
      this.add_editform.source_desc = row.source_desc
      this.add_editform.coupon_id = row.coupon_id
      this.add_editform.id = row.id
      this.add_edit = true
    },
    //操作记录
    showLog(row) {
      this.logTable = true
      this.$api.showLog(row.id, 'source').then(res => {
        // console.log(res)
        if (res.data.status === 200) {
          this.logList = res.data.data
        }
      })
    },
    //点击保存按钮
    add_edit_submit() {
      this.$refs.add_editform.validate(valid => {
        if (!valid) return false
        // console.log(this.couponForm)
        if (this.add_editform.id) {
          this.$api
            .editSource(
              this.access_token,
              this.add_editform.coupon_id,
              this.add_editform.source_desc,
              this.username,
              this.add_editform.id
            )
            .then(res => {
              console.log(res)
              if (res.data.status === 200) {
                this.dataInit()
                this.$refs.add_editform.resetFields()
                this.add_editform.id = ''
                this.$message.success(`数据编辑成功`)
                this.add_edit = false
              }
            })
        } else {
          this.$api
            .addSource(
              this.access_token,
              this.add_editform.coupon_id,
              this.add_editform.source_desc,
              this.username
            )
            .then(res => {
              console.log(res)
              if (res.data.status === 200) {
                this.dataInit()
                this.$refs.add_editform.resetFields()
                this.add_editform.id = ''
                this.$message.success(`数据添加成功`)
                this.add_edit = false
              }
            })
        }
      })
    },
    //
    cancel() {
      this.add_edit = false
      this.add_editform.coupon_id = ''
      this.add_editform.id = ''
      this.add_editform.source_desc = ''
    },
    //获取套餐券下的详情信息
    // getCouponList(id, type) {
    //   this.$api.getCouponList(id, type).then(res => {
    //     console.log(res)
    //     if (res.data.status === 200) {
    //     }
    //     // this.detailsList.forEach(v => {
    //     //   v.is_putout = v.is_putout ? '是' : '否'
    //     // })
    //   })
    // },
    details(row) {
      // console.log(row)
      // console.log(row.coupon_type)
      // console.log(row.coupon_type.includes('单券'))
      this.id_coupon = row.coupon_id
      this.title = row.coupon_str.replace(`(ID=${row.coupon_id})`, ' 详情')
      if (row.coupon_type.includes('单券')) {
        this.type = 2
        this.detailsDialog1 = true
        this.$api.getCouponList(this.id_coupon, this.type).then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.detailsList = [res.data.data]
          }
        })
      } else {
        this.type = 3
        this.detailsDialog2 = true
        this.$api.getCouponList(this.id_coupon, this.type).then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            this.detailsList = res.data.data.list
          }
        })
      }
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
        this.add_editform.id = ''
        this.add_editform.source_desc = ''
      }
    },
    detailsDialog1: function() {
      if (!this.detailsDialog1) {
        this.id_coupon = ''
        this.type = ''
        this.detailsList = []
      }
    },
    detailsDialog2: function() {
      if (!this.detailsDialog2) {
        this.id_coupon = ''
        this.type = ''
        this.detailsList = []
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
// .content_bottom {
//   float: right;
// }
// .bottom {
//   padding: 20px 0;
//   .dialog_bottom {
//     float: right;
//   }
// }
</style>