<template>
    <div id="base-info__container">
        <el-row :gutter="26">
            <el-col :span="20">
                <el-card>
                <el-form ref="leftForm" :label-position="labelPosition" label-width="100px" :model="formData">
                    <el-form-item label="品牌名称：">
                        <!-- <el-input v-model.trim="formData.manufacturer_name" placeholder="请输入品牌名称" v-if="formDataAdd.type==2" :disabled="true"></el-input> -->
                        <el-input v-model.trim="formData.manufacturer_name" placeholder="请输入品牌名称" :disabled="formDataAdd.type==2"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称：">
                        <!-- <el-input v-model.trim="formData.product_name" placeholder="请输入商品名称" v-if="formDataAdd.type==2" :disabled="true"></el-input> -->
                        <el-input v-model.trim="formData.product_name" placeholder="请输入商品名称" :disabled="formDataAdd.type==2"></el-input>
                    </el-form-item>
                    <!-- 规格显示 -->
                    <el-form-item label="规格类型">
                        <ul class="categoryList">
                            <li v-for="(operate,index) in attribute_config" :key="index">
                                {{operate.attribute_name}}
                                <i class="el-icon-circle-close" @click.stop="deleteCategory(index)"></i>
                            </li>
                            <el-button size="small" type="warning" plain @click.stop="addClassify">{{buttonTit}}</el-button>
                        </ul>
                    </el-form-item>
                    <el-form-item label="供应商：">
                        <el-select v-model="formData.id_supplier" size="small" clearable placeholder="请选择">
                            <el-option v-for="item in supplierList" :key="item.id_supplier" :label="item.name" :value="item.id_supplier">
                            <span>{{item.name}}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入库单价：">
                        <el-input v-model.trim="formData.fixed_price" placeholder="请输入入库单价"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model.trim="formData.remark" placeholder="起订量、是否代发放等信息，采购将默认展示所填写的内容" :disabled="formDataAdd.type==2" class="beizhu"></el-input>
                    </el-form-item>
                        <el-button type="primary" @click="toSubmit">保存</el-button>
                </el-form>
                </el-card>
            </el-col>
        </el-row>
        <!-- 编辑 -->
        <el-dialog title="添加规格类型" :visible.sync="showClassify" :modal="false">

            <el-form label-width="120px">
                <el-form-item label="规格大类">
                    <el-select size="small" style="width: 100px" v-model="id_attribute_group" placeholder="请选择" @change="getProv(id_attribute_group)">
                        <el-option v-for="item in attrList" :label="item.name" :value="item.id_attribute_group" :key="item.id_attribute_group">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规格小类">
                    <el-select size="small" style="width: 100px" v-if="id_attribute_group!=''" v-model="server_list" placeholder="请选择" multiple @change="getCity(id_attribute)">
                        <el-option v-for="item in secondSkus" :label="item.name" :value="item.id_attribute" :key="item.id_attribute">
                        </el-option>
                    </el-select>
                </el-form-item>
            <!-- <el-button size="small" type="warning" @click.stop="addDomain">+</el-button> --> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="sureClassify">确 定</el-button>
            </div> 
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
            supplierList: [],
            // attrList: [],//属性列表
            citys: [],
            id_attribute_group: '',
            id_attribute: '',
            server_list: [],
            isAttr: false,
            proArrList: [],
            attribute_config: [],
            checkOne: true,
            showClassify: false,  // 显示选择商品分类popup
            showMask: false,

            infiledList: [],
            fildtps: [{ text: '字符', value: '1' }, { text: '数字', value: '2' }],

            attribute:{},
            hasDel: false,
            buttonTit: '添加',
            formData: {
                manufacturer_name: '',
                product_name: '',
                id_supplier: '',
                fixed_price: '',
                id_stock_product: '',
                remark: ''
            }
        }
    },
    props: ['userData', 'styleObj', 'formDataAdd', 'attrList'],
    computed: {
        secondSkus() {
            let _seconds = []
            let _idGroup = this.id_attribute_group
            let _attrList = this.attrList
            let _changeSku = _attrList.find(item=>{
                return item.id_attribute_group == _idGroup
            })
            _seconds = _changeSku?_changeSku.attribute_list:[]
            // debugger
            return _seconds
        }
        
    },
    watch: {
        attribute_config: {
            handler: function(val) {
                
            }
        }
    },
    mounted() {
        //新增规格
        if (this.formDataAdd.id_stock_product) {
        // this.getProAttrOne()
        } else {
        // this.getProAttr()
        }
        this.$root.eventBus.$on('initDialogData',(res)=>{
            this.attribute_config =[];
            this.id_supplier = '';
            this.hasDel = false;
            this.buttonTit = `添加`
            this.attribute = {}
            this.formData.manufacturer_name = ''
            this.formData.product_name = ''
            this.formData.id_supplier = ''
            this.formData.fixed_price = ''
            this.formData.id_stock_product = ''
            this.formData.remark = ''
        })
        this.$root.eventBus.$on('openInitDialogData',(res)=>{
            if (this.formDataAdd) {
                this.formData.id_stock_product = this.formDataAdd.id_stock_product || ''
                this.formData.product_name = this.formDataAdd.product_name || ''
                this.formData.manufacturer_name = this.formDataAdd.manufacturer_name || ''
                this.formData.remark = this.formDataAdd.remark || ''
                this.getStockproductinfo(this.formDataAdd.id_stock_product)
            }
        })
    },
    created() {
        this.init()
        this.supList()
        this.getStockproductinfo(this.formDataAdd.id_stock_product)
    },
    destroyed () {
        this.$root.eventBus.$off('initDialogData', 1)
        
    },
    methods: {
        deleteRow(index, rows) {//删除改行
            rows.splice(index, 1);
            
        },
        addRow(tableData, event) {
            tableData.push({citys: '', attrList: ''})
        },
        init() {
            this.id_supplier=''
            this.attribute_config = []
            this.supplierList=[]
            if (this.formDataAdd) {

                this.formData.id_stock_product = this.formDataAdd.id_stock_product || ''
                this.formData.product_name = this.formDataAdd.product_name || ''
                this.formData.manufacturer_name = this.formDataAdd.manufacturer_name || ''
            }
            // this.attrList=[]
        },
        cancelAdd() {
            this.showClassify = false
        },
        //新增大类规格
        addDomain() {
            this.attribute_config.push({
                operate: '',
                key: Date.now()
            });
        },
        //删除某一规格
        deleteCategory(index) {
            let _inx = index
            this.attribute_config.splice(_inx, 1)
            this.buttonTit = `重置`;
            this.hasDel = true
        },
        //确认规格
        sureClassify() {
            // console.info(this.attribute)
            // let _configs = this.attribute_config
            if(this.buttonTit == '重置'){
                this.attribute = {}
            }
            
            let data = {}
            let attribute = {}
            let list = this.id_attribute_group
            attribute[list] = this.server_list
            // Object.assign(this.attribute, attribute)
            for(let key in attribute){
                if (this.attribute[key]){
                    this.attribute[key].push(...attribute[key])
                    this.attribute[key]=[...new Set(this.attribute[key])]
                } else {
                    this.attribute[key] = attribute[key]
                }
            }
            
            data.attribute = JSON.stringify(this.attribute)
            data = Object.assign({}, data, this.userData)
            this.$api.proStock(data).then((res) => {
                this.showClassify = false
                this.attribute_config = [].concat(res.data.data)
                // this.attribute_config.push(...res.data.data)
                this.buttonTit = `添加`;
                this.hasDel = false
                //this.attribute_config.concat(res.data.data)
            })
        },
        //添加大类规格
        addClassify() {
            this.showClassify = true
            this.id_attribute_group = ''
        },
        //二级联动选择规格
        getProv(id_attribute_group) {
            this.server_list = []
            let tempCity = [];
            this.citys = [];
            this.id_attribute = '';
            this.attrList.forEach(item => {
                this.citys = item.attribute_list
                for (var val of this.citys) {
                    if (id_attribute_group == val.id_attribute_group) {
                        tempCity = this.citys
                    }
                }
                this.citys = tempCity;
            });
        },
        getCity(city) {},
        //获取所有规格信息
        getProAttr() {
            let data = {
                type: 1
            }
            data = Object.assign({}, data, this.userData)
            
            this.$api.attributeList(data).then((res) => {
                this.attrList = res.data.data.attribute_info
                this.server_list = this.attrList.map(item => {
                return item.id_attribute
                })
            })
        },
        //添加规格获取某一商品的规格
        getProAttrOne() {
            let data = {
                id_stock_product: this.formDataAdd.id_stock_product
            }
            data = Object.assign({}, data, this.userData)
            this.$api.getProAttr(data).then((res) => {
                this.attrList = res.data.data.group_attribute_list
                this.server_list = this.attrList.map(item => {
                return item.id_attribute
                })
            })
        },
        //添加商品
        toSubmit() {
            if(!this.checkoutSubmit()) return;
            let data = {}
            if (this.formDataAdd.type == 1) {
                data = {
                    product_name: this.formData.product_name,
                    fixed_price: this.formData.fixed_price,
                    id_supplier: this.formData.id_supplier,
                    manufacturer_name: this.formData.manufacturer_name
                }
            } else {
                data = {
                    id_stock_product: this.formData.id_stock_product,
                    fixed_price: this.formData.fixed_price,
                    id_supplier: this.formData.id_supplier,
                }
            }
            /* let attribute = {
            }
            let a = this.id_attribute_group
            attribute[a] = this.server_list
            data.attribute = JSON.stringify(attribute) */
            //console.log(this.attribute_config)
            let attribute = {}
            data.attribute = this.attribute_config.map((item) => {
                return item.attribute_config
            })
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }
            data = Object.assign({}, data, this.userData)
            if(this.formDataAdd.type == 3) {
                data.product_name = this.formData.product_name
                data.manufacturer_name = this.formData.manufacturer_name
                data.remark = this.formData.remark
                this.$api.editstockproduct(data).then((res) => {
                    if (res.data.status == 200) {
                        this.$message.success(res.data.msg)
                        this.$emit('cancel', false)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }else if(this.formDataAdd.type == 2){
                this.$api.addProperty(data).then((res) => {
                    if (res.data.status == 200) {
                        this.$message.success(res.data.msg)
                        this.$emit('cancel', false)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }else if (this.formDataAdd.type == 1) {
                data.remark = this.formData.remark
                this.$api.addStock(data).then((res) => {
                    if (res.data.status == 200) {
                        this.$message.success(res.data.msg)
                        this.$emit('cancel', false)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }  
        },
        //供应商列表
        supList() {
            this.$api.getAllSup(this.userData).then((res) => {
                let _list = res.data.data;
                this.supplierList = _list
            })
        },
        checkoutSubmit() {
            let _brand = this.formData.manufacturer_name
            let _name = this.formData.product_name
            let _supplier = this.formData.id_supplier
            let _price = this.formData.fixed_price
            let regfloat = /^\d*\.{0,1}\d{0,1}$/
            if(!_brand) {
                this.$message.error('请填写品牌名称');
                return false; 
            }
            if(!_name) {
                this.$message.error('请填写商品名称');
                return false;
            }
            if(!_supplier){
                this.$message.error('请选择供应商');
                return false;
            }
            if(!_price) {
                this.$message.error('请填写入库单价');
                return false;
            }
            if(!regfloat.test(_price)){
                this.$message.error('入库单价最多只能为1位小数的数字');
                return false;
            }
            return true;
        },
        getStockproductinfo(id){
            if (this.formDataAdd.type != 3) return 
            let data = {
                id_stock_product: id
            }
            Object.assign(data, this.userData)
            this.$api.stockproductinfo(data).then((res) => {
                if(res.data.status == 200) {
                    let attribute_config = []
                    let att = {}
                    let wuObj = {}
                    res.data.data.stock_product.forEach((v,i) => {
                        let temp = {
                            attribute_config: {},
                            attribute_name: ''
                        }
                        let vc = {}
                        let vn = []
                        let flag = false
                        v.product_attribute_list.forEach((item,index) => {
                            let str = ''
                            vc[item.id_attribute_group] = item.id_attribute + ''
                            str = `${item.group_name}：${item.attribute_name}`
                            vn.push(str)
                            if(item.group_name == "无" && item.attribute_name == "无") {
                                wuObj[item.id_attribute_group] = [].concat(item.id_attribute)
                            }
                            att[item.id_attribute_group]? att[item.id_attribute_group].push(item.id_attribute):att[item.id_attribute_group] = [].concat(item.id_attribute)
                            // if(!att[item.id_attribute_group]){
                            //     att[item.id_attribute_group] = [].concat(item.id_attribute)
                            // }else {
                                
                            //     flag = att[item.id_attribute_group].some((k,ii) => {
                            //         console.log(k)
                            //         console.log(item.id_attribute)
                            //         return k = item.id_attribute
                            //     })
                            //     console.log(flag)
                            //     flag?'':att[item.id_attribute_group].push(item.id_attribute)
                            // }
                        }) 
                        temp.attribute_config = vc
                        temp.attribute_name=vn.join(',')
                        attribute_config.push(temp)
                    })
                    for(var key in att){
                        att[key] = [...new Set(att[key])]
                    }
                    if(JSON.stringify(att) != JSON.stringify(wuObj)){
                        this.attribute = att
                    }
                    this.formData = {
                        id_stock_product: res.data.data.id,
                        product_name: res.data.data.name,
                        manufacturer_name: res.data.data.manufacturer_name,
                        id_supplier: res.data.data.stock_product[0].supplier_info[0].id_supplier,
                        fixed_price: res.data.data.fixed_price,
                        remark: res.data.data.remark
                    }
                    this.attribute_config = attribute_config
                }
            })
        },
    }

}
</script>
<style lang="scss">
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
.list{
  border:1px solid #ddd;
}
.list li{
  display:flex;
  align-items: center;
  justify-content: space-around;
  border-bottom:1px solid #ddd;
}
.beizhu .el-input__inner::-webkit-input-placeholder {
    font-size: 12px;
}
</style>


