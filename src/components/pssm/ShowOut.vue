<template>
  <div id="base-info__container">
    <el-row :gutter="26">
      <el-col :span="20">
        <el-card>
          <el-form ref="leftForm" :label-position="labelPosition" label-width="100px" :model="formData">
            <el-form-item label="商品名称：">
              <p>{{formData.name}}</p>
            </el-form-item>
            <el-form-item label="规格：">
              <p v-for="(itemAttr,index) in formData.product_attribute_list" :key="index">
                {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
              </p>
            </el-form-item>
            <el-form-item label="出库数量：">
              <el-input v-model="formData.ex_num" placeholder="请输入出库数量"></el-input>
            </el-form-item>
            <el-form-item label="出库售价：">
              <el-input v-model="formData.ex_price" placeholder="请输入出库售价"></el-input>
            </el-form-item>
            <el-form-item label="买家地址：">
              <el-input v-model="formData.buyer_address" placeholder="请输入买家地址"></el-input>
            </el-form-item>
            <el-form-item label="买家姓名：">
              <el-input v-model="formData.buyer_name" placeholder="请输入买家姓名"></el-input>
            </el-form-item>
            <el-form-item label="买家电话：">
              <el-input v-model="formData.buyer_phone" placeholder="请输入买家电话" maxlength="11"></el-input>
            </el-form-item>
            <!-- invoice able -->
            <el-form-item label="开具发票">
              <el-select v-model="formData.invoice" clearable placeholder="请选择">
                <el-option v-for="s in invoiceStatus" :key="s.value" :label="s.label" :value="s.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- product feature -->
            <el-form-item label="备注">
              <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>
            <el-button type="primary" @click="toSubmit">出库
            </el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      id_supplier: '',
      labelPosition: 'left',
      // 是否开发票
      invoiceStatus: [
        { value: 1, label: "是" },
        { value: 0, label: "否" }
      ],
    }
  },
  props: ['userData', 'styleObj', 'formData'],
  computed: {
    ...mapGetters([

    ])
  },

  created() {
  },

  methods: {
    //出库
    toSubmit() {
      let data = {
        ex_num:this.formData.ex_num,
        buyer_name:this.formData.buyer_name,
        buyer_address:this.formData.buyer_address,
        buyer_phone:this.formData.buyer_phone,
        ex_price: this.formData.ex_price,
        id_stock: this.formData.id_stock,
        invoice: this.formData.invoice,
        remark: this.formData.remark,
        code: this.formData.code
      }
      data = Object.assign({}, data, this.userData)
      this.$api.addstockex(data).then((res) => {
        if (res.data.status == 200) {
          this.$message.success(res.data.msg)
          this.$emit('cancel', false)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
  },
  computed: {
  }
}
</script>
<style>
</style>

