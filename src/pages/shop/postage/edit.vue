<template>
  <div class="wholesale">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: ''}">
        <i class="el-icon-menu"></i>商品管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>物流设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--邮费管理-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="包邮费用设置" name="first">
        <div class="sub-set">
          <el-form :model="parForm" ref="parForm" label-width="100px" class="w-form">
            <el-form-item label="包邮费用设置:" size="medium">
              <el-input v-model="parForm.exempt_num" placeholder="">
                <template slot="prepend">≥</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="节假日配置" name="second">
        <holiday :username="userName" :accessToken="accessToken"></holiday>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="sub-set">
      <el-form :model="parForm" ref="parForm" label-width="100px" class="w-form">
        <el-form-item label="包邮费用设置:" size="medium">
          <el-input v-model="parForm.exempt_num" placeholder="">
            <template slot="prepend">≥</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
      </el-form>
    </div> -->
  </div>
</template>
<script>
import holiday from '../../../components/shop/Holiday.vue'
export default {
  data() {
    return {
      accessToken: '',
      userName: '',
      parForm: {},
      activeName: 'first',

    }
  },
  computed: {
    // 登陆用户
    username() {
      let username = localStorage.getItem('g_username')
      return username || this.userName
    },
  },
  created() {
    this.userName = localStorage.getItem('g_username');
    this.accessToken = localStorage.getItem('g_accessToken');
    this.getExpress()
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getExpress() {
      this.$api.getexpress(this.userName, this.accessToken)
        .then((res) => {
          if (res.data.status == 200) {
            this.parForm = res.data.data
          }
        })
    },
    submitForm() {
      if (!this.validateFn()) {
        return
      }
      this.submitServer()
    },
    //编辑
    submitServer() {
      this.$api.eidtExpress(this.userName, this.accessToken, this.parForm.id, this.parForm.exempt_num, this.parForm.ykg_money)
        .then((res) => {
          if (res.data.status == 200) {
            this.$message.success('修改成功')
            this.getExpress()
          } else {
            this.$message.error(res.data.msg)
            return false;
          }
        })
    },
    validateFn() {
      let posReg = /^[0-9]*[0-9][0-9]*$/
      let posValue = this.parForm.exempt_num
      if (posValue) {
        if (new RegExp(posReg).test(posValue) == false) {
          this.$message.error('请输入正确的邮费')
          return
        }
      }
      return true
    },
  },
  components: {
    holiday
  }
}
</script>
<style lang="scss">
.sub-set {
	background: rgba(240, 240, 240, 1);
	padding: 20px 0;
	margin: 30px auto 30px;
}
.w-form {
	width: 500px;
	margin-top: 20px;
}
.wholesale .el-tabs__nav-wrap::after {
    height: 0;
}
</style>
