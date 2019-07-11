<template>
    <div id="base-info__container">
        <el-row :gutter="26">
            <el-col :span="20">
                <el-card>
                    <el-form ref="leftForm" :label-position="labelPosition" label-width="100px" :model="formData">
                        <el-form-item label="商品名称：">
                            <p>{{formData.name}}</p>
                        </el-form-item>
                        <!-- province -->
                        <el-form-item label="规格：">
                            <p v-for="(item,index) in formData.product_attribute_list" :key="index" v-if="formData.type == 1">{{item.group_name}}:{{item.attribute_name}}</p>
                            <p v-if="formData.type == 2">{{formData.product_attribute_list}}</p>
                        </el-form-item>
                        <!-- product spec -->
                        <el-form-item label="入库数量：">
                            <el-input v-model="formData.total_num" placeholder="请输入入库数量" @blur="checkNum"></el-input>
                        </el-form-item>
                        <el-form-item label="入库单价：">
                            <el-input v-model="formData.fixed_price" placeholder="请输入入库单价"></el-input>
                        </el-form-item>
                        <el-form-item label="进货总金额：">
                            <p>{{sum}}</p>
                        </el-form-item>
                        <!-- corner mark -->
                        <el-form-item label="供应商：">
                            <div v-if="purchasing">{{formData.supplier_name}}</div>
                            <el-select v-model="formData.id_supplier" size="small" filterable clearable placeholder="请选择" v-else>
                                <el-option v-for="item in supplierList" :key="item.id_supplier" :label="'(ID=' + item.id_supplier +')' + item.name" :value="item.id_supplier"></el-option>
                            </el-select>
                            <el-input style="width:210px;" size="small" v-model="formData.code" placeholder="请输入供应商商品编号"></el-input>
                        </el-form-item>
                        
                        <!-- invoice able -->
                        <el-form-item label="发票">
                            <el-select v-model="formData.invoice" clearable placeholder="请选择">
                                <el-option v-for="s in invoiceStatus" :key="s.value" :label="s.label" :value="s.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- product feature -->
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="formData.remark"></el-input>
                        </el-form-item>
                        <el-button type="primary" :disabled="!canSubmit" @click="confirmSubmit">提交</el-button>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
        title="提示"
        :visible.sync="showConfirmSubmit"
        @close="initStatus"
        :modal="false"
        width="30%">
            <span>{{submitMes}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showConfirmSubmit = false">取 消</el-button>
                <el-button type="primary" @click="toSubmit">确 定</el-button>
            </span>
        </el-dialog>
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
                { value: 1, label: "已开" },
                { value: 0, label: "未开" },
                { value: 2, label: "不开"}
            ],
            supplier_info: [],
            supplierList: [],
            showConfirmSubmit: false,
            submitMes: '编辑入库',
            canSubmit: true
        }
    },
    props: ['userData', 'styleObj', 'formData','checkPrice','purchasing','total_num'],


    created() {
        this.supList()
    },

    methods: {
        //入库
        toSubmit() {
            this.canSubmit = false
            let data = {
                total_num: this.formData.total_num,
                fixed_price: this.formData.fixed_price,
                id_stock: this.formData.id_stock,
                id_supplier: this.formData.id_supplier,
                invoice: this.formData.invoice,
                remark: this.formData.remark,
                code: this.formData.code,
                hid: this.formData.hid
            }
            data = Object.assign({}, data, this.userData)
            this.$api.store(data).then((res) => {
                if (res.data.status == 200) {
                    this.$message.success(res.data.msg)
                    this.$emit('cancel',false)
                    this.$root.eventBus.$emit('updateList', 1) // 保存后更新规格模块数据
                } else {
                    this.$message.error(res.data.msg)
                }
                this.canSubmit = true
            })
            
            this.showConfirmSubmit = false;
            this.submitMes = `编辑入库`
            
        },
        stockinlist() {
            let data = {}
            data = Object.assign({}, data, this.userData)
            this.$api.stockinlist(data).then((res) => {
                this.stockinList = res.data.data
            })
        },
        supList() {
            this.$api.getAllSup(this.userData).then((res) => {
                let _list = res.data.data;
                this.supplierList = _list
            })
        },
        confirmSubmit() {
            let _oldPrice = this.checkPrice;
            // check 入库数量是否为整数
            let _num = this.formData.total_num
            let reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
            if(!reg.test(_num)){
                this.$message.error('入库数量必须为整数');
                return;
            }
            if(this.formData.type == 2&&this.formData.total_num > this.total_num) {
                this.$message.error(`数量最多可输入${this.total_num}`);
                return;
            }
            // this.formData.total_num = this.formData.total_num > this.total_num&&this.formData.type == 2? this.total_num : this.formData.total_num
            // check 入库单价是否为1位小数
            let _price = Number(this.formData.fixed_price)
            let regfloat = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)|0/;
            if(!regfloat.test(_price)){
                this.$message.error('入库单价请输入大于等于0的数字');
                return;
            }
            if(_oldPrice != this.formData.fixed_price){
                this.submitMes = `与默认入库价格不一致`;
                this.showConfirmSubmit = true;
            }else{
                this.toSubmit()
            }
        },
        initStatus() {
            this.showConfirmSubmit = false;
            this.submitMes = `编辑入库`
        },
        checkNum() {
            let _num = this.formData.total_num
            let reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
            if(!reg.test(_num)){
                this.$message.error('入库数量必须为整数')
            }
            if(this.formData.type == 1) return
            if(this.formData.total_num > this.total_num) {
                this.$message.error(`数量最多可输入${this.total_num}`)
            }
        }
    },
    computed: {
        sum() {
            let baseNum = 0
            let _price = this.formData.fixed_price + ''
            let _num = Number(this.formData.total_num)
            baseNum = _price.split(".")[1]? _price.split(".")[1].length : 0
            return (Number(_price.replace(".", "")) * _num / Math.pow(10, baseNum)) || 0
        }
    },
}
</script>
<style>
</style>

