<template>
  <div class="pssm-search">
    <el-row :gutter="15" class="box">
      <el-col :span="3">
        <el-button class="full-btn" type="primary" icon="el-icon-plus" @click.stop="createdSupplier(1)" v-if="authinfo.action_supplier == 1">新增供应商</el-button>
      </el-col>
      <el-col :span="4">
        <div class="add-wrap">
          <slot name="add-btn"></slot>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="input-wrap full-box">
          <el-input :value="inputVal" placeholder="输入供应商名或对接人或对接人电话或邮箱帐号或品牌名" @input="valueChange"></el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button class="full-btn" type="primary" @click.stop="search">搜索</el-button>
      </el-col>
      <el-col :span="3" v-if="authinfo.action_supplier == 1">
        <el-upload
            class="upload-demo"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-error="handleError"
            ref="upload"
            action="http://admin-api.test.kangkanghui.com/upload/file"
            multiple
            method:="post"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            <el-button type="primary">导入</el-button>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
  props: ['userData', 'inputVal', 'authinfo','importLoading','importLoadingStatus','suplist','updatestatus'],
  computed: {
    ...mapGetters([
    ])
  },

  created() {
  },
  methods: {
    createdSupplier(type) {
      let _formData1 = {
        id_supplier: '', // 供应商id
        name: '', // 供应商地址
        address: '', // 产地
        contact_name: '', // 对接人姓名
        mobile_phone: '', // 对接人电话
        email: '', // 邮箱
        bank_account_number: '', // 银行打款账号
        user_name: '',//户名
        bank_name: '',//打款银行名称
        business_license: [],//营业执照
        licence: [],//许可证
        authorization: [],//授权书
        remark: '',//备注
        manufacturer: [],//品牌列表
      }
      this.$store.commit('FORMDATA1', { data: _formData1 })
      this.$router.push({ path: 'edit' })
    },
    search() {
      let data = {                                                   //进销存管理
        keywords: this.$store.state.inventory.inputVal || '', // 关键字. 为空表示搜索所有
        page_num: 1,
        page_size: 20
      };
      data = Object.assign({}, data, this.userData)
      this.$api.supplierList(data).then(res => {
        this.$store.commit('SUPPLIERLIST', {
          list: res.data.data.supplier_list
        });
        this.$store.commit('SUPLISTTOTAL', { total: Number(res.data.data.total_num) })
      })
    },
    valueChange(value) {
      this.$store.dispatch('SUPINPUTVALUE', {
        ['inputVal']: value
      })
    },
    beforeAvatarUpload(file) {
            let isfile = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/vnd.ms-excel') ? true: false
            if (!isfile) {
                this.$message.error('上传文件只能是excel表格文件!')
            }
            return isfile;  
        },
    handleAvatarSuccess(res, file) {
        this.$emit('updatestatus',{val1: true})
        let fileUrl = res.data.image_url
        let data = {
            filepath: fileUrl,
            type: 2
        }
        Object.assign(data, this.userData)
        this.$api.uploadStockProduct(data).then((res) => {
            if(res.data.status == 200) {
                this.$emit('updatestatus',{val2: true})
                this.suplist()
                this.$message.success(`${res.data.msg}`)
            }else {
                this.$emit('updatestatus',{val1: false})
                this.$message.error(`${res.data.msg}`)
            }
        })
        
    },
    handleError(err, file, fileLis) {
        if(err) {
            this.$message.error('文件上传失败，请重新上传')
        }
    }
  }, 
}
</script>
<style>
.pssm-search {
	height: 40px;
	margin-bottom: 20px;
}
.pssm-search .el-upload--text {
    border: 0 solid #fff;
}
</style>

