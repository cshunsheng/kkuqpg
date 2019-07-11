<template>
  <div class="oneCoupon">
    <div class="content_top">
      <el-button type="primary" @click="dialogFormCoupon = true">新增单券</el-button>
      <el-select v-model="type_id" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="count">共计{{count}}条结果</span>
    </div>
    <div class="content_main">
      <el-table :data="couponList" border="" style="width: 100%">
        <el-table-column prop="created_at" label="创建日期"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="type_name" label="类型"></el-table-column>
        <el-table-column prop="coupon_name" label="名称"></el-table-column>
        <el-table-column prop="coupon_value" label="价值（元）"></el-table-column>
        <el-table-column prop="min_use_value" label="满减金额（元）"></el-table-column>
        <el-table-column prop="expired_days" label="使用期限（天）"></el-table-column>
        <el-table-column label="是否可发放" width="100px">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.is_putout"
              @change="isPutout(scope.row)"
              :class="{fontColor:scope.row.is_putout}"
            >
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
            <el-button
              @click="edit(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.is_editable?false:true"
            >编辑</el-button>
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
    <!-- 单券操作记录 -->
    <el-dialog title="单券操作记录" :visible.sync="dialogTableVisible" width="50%">
      <el-table :data="logData" border="">
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
    <!-- 编辑单券 -->
    <el-dialog title="优惠券管理/编辑单券" :visible.sync="dialogFormCoupon">
      <el-form :model="couponForm" :rules="rules" ref="couponForm" status-icon>
        <el-form-item label="类型" label-width="100px" prop="channel" style="width:450px">
          <div class="level1" v-for="item in typeList" :key="item.type_id">
            <div @click="showLevel2(item.type_id)">
              <i class="el-icon-arrow-down el-icon--right"></i>
              {{item.type_name}}
            </div>
            <div class="level2" v-show="isShow[`isShow${item.type_id}`]">
              <div v-for="item2 in item.list" :key="item2.id">
                <el-radio
                  v-model="couponForm.channel"
                  :label="item2.id | label(item.type_id)"
                >{{item2.name}}</el-radio>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="名称" prop="name" label-width="100px" style="width:450px">
          <el-input v-model="couponForm.name" placeholder="限制20个字"></el-input>
        </el-form-item>
        <el-form-item label="价值" prop="coupon_value" label-width="100px" style="width:450px">
          <el-input v-model="couponForm.coupon_value">
            <template slot="append">元</template>
          </el-input>
          <!-- <span>单位：元</span> -->
        </el-form-item>
        <el-form-item label="满减金额" prop="min_use_value" label-width="100px" style="width:450px">
          <el-input v-model="couponForm.min_use_value">
            <template slot="append">元</template>
          </el-input>
          <!-- <span>单位：元</span> -->
        </el-form-item>
        <el-form-item label="使用期限" prop="expired_days" label-width="100px" style="width:450px">
          <el-input v-model="couponForm.expired_days">
            <template slot="append">天</template>
          </el-input>
          <!-- <span>单位：天</span> -->
        </el-form-item>
        <el-form-item label="使用详情" prop="coupon_desc" label-width="100px" class="items-textarea">
          <el-input type="textarea" :rows="3" resize="none" v-model="couponForm.coupon_desc">
            <!-- <template>多条详情用“||”隔开</template> -->
          </el-input>
          <span>多条详情用“||”隔开</span>
        </el-form-item>
        <el-form-item label="备注" prop="cs_note" label-width="100px">
          <el-input type="textarea" :rows="3" resize="none" v-model="couponForm.cs_note"></el-input>
        </el-form-item>
        <el-form-item label="是否可发放" prop="is_putout" label-width="100px" style="width:220px">
          <el-select v-model="couponForm.is_putout" placeholder="请选择状态">
            <el-option
              v-for="item in putoutList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCoupon = false">取 消</el-button>
        <el-button type="primary" @click="addtoback">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 筛选的option数组
      options: [
        {
          value: 0,
          label: '所有券'
        },
        {
          value: 1,
          label: '通用券'
        },
        {
          value: 2,
          label: '特定券'
        },
        {
          value: 3,
          label: '场景券'
        }
      ],
      // 请求的参数
      page: 1,
      page_size: 20,
      type: 2,
      type_id: 0,
      count: 0,
      couponList: [],
      // ------ 发放下拉框 ------
      putoutList: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
      logData: [],
      dialogTableVisible: false,
      couponForm: {
        coupon_id: '',
        access_token: '', //后台用户token
        channel: '', //属性json_str，{type_id : id}, 如选择场景券下的商城，则为 {"3":"1"}
        coupon_desc: '', //描述
        coupon_value: '', //券面额
        cs_note: '', //备注
        expired_days: '', //过期天数
        is_putout: '', //是否可发放，0-不可，1-可以
        min_use_value: '', //最低使用条件
        name: '', //券名
        type: 2, //1-特定券，2-单券，3-套餐券
        username: '' //后台用户名
      },
      rules: {
        channel: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [
          { required: true, message: '请填写名称', trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'change'
          }
        ],
        coupon_value: [
          { required: true, message: '请填写价值', trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0) {
                callback()
              } else {
                callback(new Error('价值必须是正整数'))
              }
            },
            trigger: 'change'
          }
        ],
        min_use_value: [
          { required: true, message: '请填写满减金额', trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) >= 0) {
                callback()
              } else {
                callback(new Error('只能输入大于等于0的整数'))
              }
            },
            trigger: 'change'
          }
        ],
        expired_days: [
          { required: true, message: '请填写使用期限', trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0) {
                callback()
              } else {
                callback(new Error('使用期限必须是正整数'))
              }
            },
            trigger: 'change'
          }
        ],
        coupon_desc: [
          { required: true, message: '请填写使用详情', trigger: 'change' }
        ],
        is_putout: [
          { required: true, message: '请选择是否可发放', trigger: 'change' }
        ]
      },
      dialogFormCoupon: false,
      typeList: [],
      isShow: {
        isShow1: false,
        isShow2: false,
        isShow3: false
      },
      access_token: '',
      username: ''
      // log_page: 1,
      // log_page_size: 5,
      // log_count: 50
    }
  },
  created() {
    // 页面初始化
    this.oneCouponList()
    this.access_token = localStorage.getItem('g_accessToken')
    this.username = localStorage.getItem('g_username')
    this.typeData()
  },
  methods: {
    //------ 列表渲染 ------
    oneCouponList() {
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
    //------下拉框列表筛选 ------
    selectChange() {
      this.page = 1
      this.oneCouponList()
    },
    // 获取优惠券类型
    typeData() {
      this.$api.typeList().then(res => {
        // console.log(res)
        if (res.data.status === 200) {
          this.typeList = res.data.data
        }
      })
    },
    // ------ 是否发放 ------
    isPutout(row) {
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
    // ------ 展示操作记录 ------
    showLog(row) {
      // console.log(row)
      // console.log(row.id)
      this.dialogTableVisible = true
      this.$api
        .showLog(row.id, 'coupon', this.log_page, this.log_page_size)
        .then(res => {
          if (res.data.status === 200) {
            this.logData = res.data.data
            // this.log_count = res.data.total
          }
        })
    },
    // 点击编辑按钮
    edit(row) {
      console.log(row)
      // console.log(row.type_name)
      this.dialogFormCoupon = true
      let id = row.id
      this.$api.getCouponList(id, 2).then(res => {
        console.log(res)
        let {
          data: {
            data,
            data: { channel, channel_id }
          }
        } = res
        if (res.data.status === 200) {
          this.showLevel2(channel)
          let obj = {}
          obj[channel] = channel_id
          this.couponForm.coupon_id = data.id
          this.couponForm.channel = JSON.stringify(obj)
          this.couponForm.coupon_desc = data.coupon_desc + ''
          this.couponForm.cs_note = data.cs_note + ''
          this.couponForm.coupon_value = data.coupon_value
          this.couponForm.expired_days = data.expired_days
          this.couponForm.is_putout = data.is_putout
          this.couponForm.name = data.coupon_name + ''
          this.couponForm.min_use_value = data.min_use_value
          this.couponForm.type = 2
          this.couponForm.access_token = this.access_token
          this.couponForm.username = this.username
        }
      })
    },
    //对获取radio的值进行转化
    // getType(val) {
    //   // console.log(val)
    //   // this.couponForm.channel = JSON.stringify(this.couponForm.channel)
    // },
    //一级类型的显示与隐藏
    showLevel2(id) {
      this.isShow[`isShow${id}`] = !this.isShow[`isShow${id}`]
    },
    //点击按钮的提交
    addtoback() {
      this.$refs.couponForm.validate(valid => {
        if (!valid) return false
        // console.log(this.couponForm)
        this.couponForm.access_token = this.access_token
        this.couponForm.username = this.username
        this.$api.addOneCoupon(this.couponForm).then(res => {
          console.log(res)
          if (res.data.status === 200) {
            this.oneCouponList()
            this.$refs.couponForm.resetFields()
            this.$message.success(`数据保存成功`)
            this.dialogFormCoupon = false
          } else {
            this.$message.error(`${res.data.msg}`)
            this.dialogFormCoupon = false
          }
        })
      })
    },
    handleCheckChange() {},
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
    //   // ------log分页------
    //   log_prev() {
    //     this.log_page--
    //     this.oneCouponList()
    //   },
    //   log_current(val) {
    //     this.log_page = val
    //     this.oneCouponList()
    //   },
    //   log_next() {
    //     this.log_page++
    //     this.oneCouponList()
    //   }
  },
  watch: {
    dialogFormCoupon: function() {
      if (!this.dialogFormCoupon) {
        this.isShow[`isShow1`] = false
        this.isShow[`isShow2`] = false
        this.isShow[`isShow3`] = false
        this.couponForm.coupon_id = ''
        this.$refs.couponForm.resetFields()
      }
    }
  }
}
</script>
<style lang='scss' >
.oneCoupon .content_top {
  padding: 0 0 20px;
  .el-select {
    margin-left: 50px;
  }
  .count {
    margin-left: 50px;
  }
}
.oneCoupon .content_bottom {
  float: right;
}
.oneCoupon .bottom {
  padding: 20px 0;
  .dialog_bottom {
    float: right;
  }
}
.oneCoupon .level2 {
  padding-left: 20px;
}
.oneCoupon .items-textarea {
  margin-bottom: 0px;
}

.oneCoupon .fontColor .el-input--suffix .el-input__inner {
  color: #20a0ff;
}
</style>