<template>
    <div class="stockMail">
        <el-row :gutter="15" class="box">
            <el-col :span="12"> 
                <el-form label-width="80px" >
                    <div class="wrap">
                        <el-form-item label="供应商:">
                            <el-select v-model="formData.id_supplier" size="medium" clearable filterable class="el-input-text" placeholder="请选择供应商" :disabled="supplierStatus">
                                <el-option v-for="(item, index) in supplierList" :key="index" :label="'(ID='+ item.id_supplier + ')' + item.name" :value="item.id_supplier"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 规格添加 -->
                    <div style="border:1px solid #409EFF; padding: 20px;margin-bottom: 20px;" v-for="(item,index) in shopList" :key="index">
                        <el-form-item label="商品:">
                            <el-select v-model="item.id_stock_product" filterable placeholder="请选择商品"  @change="addProduct(item,index)">
                                <el-option v-for="(itemPro,i) in allShopList" :key="i" :label="'(ID='+ itemPro.id_stock_product + ')' + itemPro.name" :value="itemPro.id_stock_product">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="规格:">
                            <el-select v-model="item.specId" placeholder="请选择规格" clearable multiple @change="addSpec(item)">
                                <el-option v-for="itemPro in item.data.product_attribute_list" :key="itemPro.id_stock" :label="itemPro.attribute_str" :value="itemPro.id_product_attribute"></el-option>
                            </el-select>
                            <el-button type="primary" @click="add(index)" style="margin-left:50px">确定</el-button>
                        </el-form-item>


                        <!-- 表格 -->
                        <el-table border show-summary :header-cell-style="styleObj" :cell-style="styleObj" :data="item.attribute" :span-method="sumPrice" v-if="item.attribute.length">
                            <el-table-column prop="product_attribute" label="规格"></el-table-column>
                            <el-table-column label="采购数量" prop="total_num">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model="scope.row.total_num" @change="changeNum(index,scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="采购单价(元)" prop="price">
                                <template slot-scope="scope" >
                                    <el-input size="mini" v-model="scope.row.price"  @change="changePrice(index,scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price_sum" label="采购金额(元)" >
                                <!-- <template slot-scope="scope">
                                    <el-input size="mini" v-model="scope.row.price_sum" ></el-input>
                                </template> -->
                            </el-table-column>
                        </el-table>
                        <el-form-item label="备注:" style="margin-top:20px">
                            <el-input v-model="item.remark" placeholder="" @change="changeRemark(index)" ></el-input>
                        </el-form-item>
                    </div>
                    <el-button type="primary" @click="addShop" style="margin-bottom: 20px">添加商品</el-button>
                    <el-form-item label="开票名称:">
                        <el-input v-model="formData.invoice_name" placeholder="" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="税号:">
                        <el-input v-model="formData.tax_id" placeholder="" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址:">
                        <el-input v-model="formData.address" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="收件人:">
                        <el-input v-model="formData.receiver" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="手机号:">
                        <el-input v-model="formData.receiver_phone" placeholder=""></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="lookMail">预览</el-button>
                </el-form>
            </el-col>
        </el-row>
        <!-- 预览邮件 -->
        <el-dialog title="预览邮件" :visible.sync="showMail" lock-scroll>
            <div>
                <p>亲爱的，根据商城需要，现要订购</p>
                <!-- 表格 -->
                <div v-for="(item,index) in lookList" :key="index" v-if="lookList.length" style="border-bottom:1px solid #409EFF;margin-bottom:10px">
                    <p>商品{{index + 1 + ':'}}</p>
                    <el-table border show-summary :span-method="spanMethod" :header-cell-style="styleObj" :cell-style="styleObj" :data="item.attribute" >
                        <el-table-column prop="name" label="商品名称"></el-table-column>
                        <el-table-column prop="spec" label="规格"></el-table-column>
                        <el-table-column prop="total_num" label="采购数量"></el-table-column>
                        <el-table-column prop="price" label="采购单价(元)"></el-table-column>
                        <el-table-column prop="price_sum" label="采购金额(元)" ></el-table-column>
                    </el-table>
                    <p style="margin-top:10px;">备注：{{item.remark}}</p>
                </div>  
                <div>
                    <p>户名：【{{supInfo.user_name}}】</p>
                    <p>开户行：【{{supInfo.bank_name}}】</p>
                    <p>账号：【{{supInfo.bank_account_number}}】</p>
                </div>
                <p>如有任何变化，请第一时间通知</p>
                <p>我司开票信息如下：</p>
                <p>开票资料纳税人名称：{{formData.invoice_name}}</p>
                <p>纳税人税号：{{formData.tax_id}}</p>
                <p>邮寄地址如下：{{formData.address}}</p>
                <p>{{formData.receiver}} {{formData.receiver_phone}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureMail">发送</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            supplierStatus: false,
            // supplierList: [],
            allShopList: [],
            shopList: [],
            id_stock_product: '',
            formData: {
                id_supplier: '',
                invoice_name: '',
                tax_id: '',
                address: '',
                receiver: '',
                receiver_phone: '',
            },
            supInfo: {
                user_name: '',
                bank_name: '',
                bank_account_number: ''
            },
            showMail: false,
            lookList: [],
        } 
    },
    created() {
        this.getpqgInfo()
    },
    props: ['userData','styleObj','supplierList'],
    methods: {
        //选择供应商
        addShop() {
            if (this.formData.id_supplier == '') {
                this.$message.error("请先选择供应商")
                return false;
            }
            let data = {
                id_supplier: this.formData.id_supplier
            }
            data = Object.assign({},data,this.userData)
            this.$api.getSupplierInfo(data)
                .then( res => {
                    if (res.data.status == 200){
                        if (res.data.data.product_list.length == 0) {
                            this.$message.error('该供应商没有对应的商品，请先去【商品库管理】中进行核查')
                            this.formData.id_supplier = ''
                            return false
                        }
                        this.supInfo.user_name = res.data.data.user_name
                        this.supInfo.bank_name = res.data.data.bank_name
                        this.supInfo.bank_account_number = res.data.data.bank_account_number
                        this.supplierStatus = true
                        this.allShopList = res.data.data.product_list
                        this.shopList.push({
                            attribute: [],
                            id_stock_product: '', 
                            specId: '',
                            num: 0,
                            product_name: '',
                            attribute: [],
                            remark: '',
                            data:res.data.data.product_list
                        })
                    }
                })
        },
        //选择商品
        addProduct(item,index) {
            let num = this.allShopList.findIndex(v =>  v.id_stock_product == item.id_stock_product)
            item.num = num
            this.shopList[index].data = this.allShopList[num]
            this.shopList[index].product_name = this.allShopList[num].name
            this.shopList[index].remark = this.allShopList[num].remark
            this.shopList[index].specId = [];
            this.shopList[index].attribute = [];
        },
        //选择规格
        addSpec(item) {
        },
        changeNum(index,scope) {
            let reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
            if(!reg.test(scope.total_num)){
                this.$message.error('采购数量必须为整数');
                return;
            }
            this.$message.success('修改成功!')
        },
        changePrice(index,scope) {
            let regfloat = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
            let i = this.shopList[index].attribute.findIndex(v => v.id_product_attribute == scope.id_product_attribute)
            if(!regfloat.test(scope.price)) {
                this.shopList[index].attribute[i].price = this.shopList[index].attribute[i].old_price
                this.$message.error('采购单价请输入大于等于0的数字');
                return;
            }
            if (this.shopList[index].attribute[i].price == this.shopList[index].attribute[i].old_price) return false;
            this.$confirm('与默认采购价格不一致', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
                .then(() => {
                    this.$message({type: 'success',message: '修改成功!'})
                })
                .catch(() => {
                    this.shopList[index].attribute[i].price = this.shopList[index].attribute[i].old_price
                    this.$message({type: 'info',message: '已取消修改'})         
                })
            
        },
        changeRemark(index) {
            this.$message.success('修改成功!')    
        },
        add(index) {
            let arr = this.shopList[index]
            let arrAtt = [];
            if (arr.specId.length == 0) {
                this.shopList[index].attribute = [];
                return
            }
            arr.specId.forEach(v => {
                console.log(v)
                let name = arr.data.product_attribute_list.find(it => it.id_product_attribute == v)
                console.log(name)
                arrAtt.push({
                    total_num: 0,
                    price: Number(name.fixed_price),
                    id_product_attribute: v,
                    product_attribute: name.attribute_str,
                    price_sum: 0,
                    old_price: Number(name.fixed_price)
                })
            })
            this.shopList[index].attribute = arrAtt
        },
        sumPrice(e) {
            let baseNum = 0
            let _price = e.row.price + ''
            let _num = Number(e.row.total_num)
            baseNum = _price.split(".")[1]? _price.split(".")[1].length : 0
             e.row.price_sum = (Number(_price.replace(".", "")) * _num / Math.pow(10, baseNum)) || 0 
        },
        lookMail() {
            this.showMail = true
            this.lookList = [];
            this.shopList = this.shopList.filter(v =>  v.attribute.length > 0)
            // console.log(arr)
            this.shopList.forEach((v,ii)=> {
                let obj = {}
                obj.remark = v.remark
                obj.attribute = [];
                v.attribute.forEach((vi,i) => {
                    obj.attribute.push({
                        name: v.product_name,
                        spec: vi.product_attribute,
                        total_num: vi.total_num,
                        price: vi.price,
                        price_sum: vi.price_sum,
                        start: i===0?true:false,
                        total: v.attribute.length
                    })
                })
                this.lookList.push(obj)
            })
            // console.log(this.lookList)
        },
        sureMail() {
            let data = {}
            let product_list = [];
            data = Object.assign({},this.formData,this.userData)
            this.shopList.forEach(v => {
                let obj = {}
                obj.id_stock_product = v.id_stock_product
                obj.product_name = v.product_name
                obj.remark = v.remark
                obj.attribute = [];
                v.attribute.forEach((vi,i) => {
                    obj.attribute.push({
                        total_num: vi.total_num,
                        price: vi.price,
                        id_product_attribute: vi.id_product_attribute,
                    })
                })
                product_list.push(obj)
            })
            data.product_list = JSON.stringify(product_list) 
            // console.log(data)
            this.$api.sendMail(data).then((res) => {
                if (res.data.status == 200) {
                    this.$root.eventBus.$emit('updateList', 1)
                    this.$message.success(res.data.msg)
                    this.showMail = false
                    this.formData.id_supplier = ''
                    this.supplierStatus = false
                    this.allShopList = [];
                    this.shopList = [];
                }else {
                    this.$message.error(res.data.msg)
                }
            }, (err) => {
                this.$message.error(res.data.msg)
            })
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            // console.log(row, column, rowIndex, columnIndex)
            if (columnIndex === 0) {
                if (row.start === true) {
                    return {
                        rowspan: row.total,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        //青苹果信息
        getpqgInfo() {
            let data = {};
            data = Object.assign({}, data, this.userData)
            this.$api.getqpgInfo(data).then((res) => {
                let _list = res.data.data;
                this.formData.invoice_name = _list.invoice_name
                this.formData.tax_id = _list.tax_id
                this.formData.address = _list.address
                this.formData.receiver = _list.receiver
                this.formData.receiver_phone= _list.receiver_phone
                // this.formData = _list
                /*  this.$store.commit('ATTRLIST', { list: _list }) */
            })
        },
    }
}
</script>
<style lang="postcss" scoped>
.categoryList li {
	display: inline-block;
	padding: 5px 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-sizing: border-box;
	line-height: 20px;
	margin-right: 10px;
}
.categoryList li i {
	cursor: pointer;
}

.categoryList li:hover {
	border-color: #20a0ff;
	background-color: #eaf6ff;
}
.notice {
	color: red;
}
</style>
