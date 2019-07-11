<template>
    <div id="base-info__container" class="specLists">
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="specList">
            <el-table-column prop="attribute_str" label="规格"></el-table-column>
            <el-table-column  label="平台价">
                <template slot-scope="scope">
                    <el-input size="mini" :value="scope.row.price" v-model="scope.row.price" @input="valueChangeWp" @change="qunSet(2,scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column  label="市场价">
                <template slot-scope="scope">
                    <el-input size="mini" :value="scope.row.wholesale_price" v-model="scope.row.wholesale_price" @input="valueChangePrice" @change="qunSet(2,scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-select :class="{'fontColor':scope.row.visible==1}" v-model="scope.row.visible" placeholder="状态" size="mini" @change='qunSet(1,scope.row)'>
                        <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="虚拟库存">
                <template slot-scope="scope">
                    <el-input size="mini" :value="scope.row.quantity" v-model="scope.row.quantity" @input="valueChangeQu" @change="qunSet(2,scope.row)"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
    props: [
        'userData',
        'productId',
        'combination',
        'reSpec'
    ],

    data() {
        return {
            styleObj: {
                "text-align": "center",
            },
            specList: [],
            onlineStatus: [
                { value: 1, label: "上线" },
                { value: 0, label: "下线" }
            ],
            price:'',
            wholesale_price:'',
            quantity:''
        }
    },

    created() {
        this.getAttrlist()
    },
    mounted() {
        this.$root.eventBus.$on('updateSku', (res)=>{
            this.getAttrlist()
        })
    },
    watch: {
        reSpec(val) {
            // console.log(val)
            if(val == true) {
                this.getAttrlist()
                this.$emit('updateFormdate', 'specStatus')
            }
        }
    },
    methods: {
        updateAttr() {
            
        },
        getAttrlist() {
            let data = {
                id_product: this.productId,
                is_combination: this.combination
            };
            data = Object.assign({}, data, this.userData)
            this.$api.specList(data).then((res) => {
                let _list = res.data.data;
                this.specList = _list
                if (this.specList.length == 0) return
                let flag = this.specList.some(v => {
                    return v.visible == 1
                })
                // console.log(flag)
                if (flag) {
                    this.$emit('updateFormdate', 'pricetrue')
                } else {
                    this.$emit('updateFormdate', 'pricefalse')
                }
            })
        },
        qunSet(type, scope) {
            // console.log(scope)
            let _this = this
            if(scope.price==''){
                this.$message.error('请输入平台价格 ')
                return
            }
            if(scope.wholesale_price==''){
                this.$message.error('请输入市场价格')
                return
            }
            if(scope.quantity===''){
                this.$message.error('请输入虚拟库存')
                return
            }
            // let regfloat = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)|0/;
            let regfloat = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
            let price = Number(scope.price)
            console.log(price)
            if(!regfloat.test(price)){
                this.getAttrlist()
                this.$message.error('平台价格请输入大于0数字');
                return;
            }
            let w_price = Number(scope.wholesale_price)
            if(!regfloat.test(w_price)){
                this.getAttrlist()
                this.$message.error('市场价格请输入大于0的数字');
                return;
            }
            let data = {
                id_product_attribute: scope.id_product_attribute,                       // id
                type: type,
                visible:scope.visible,
                price:scope.price,
                wholesale_price:scope.wholesale_price,
                quantity:scope.quantity
            };
            data = Object.assign({}, data, this.userData)

            this.$api.setVisible(data).then((res) => {
                if (res.data.status == 200) {
                    this.getAttrlist()
                    this.$message.success('修改成功')
                    if(_this.combination){
                        // _this.$root.eventBus.$emit('updateCombination', 'combination') // 保存后更新规格模块数据
                        _this.$emit('updateFormdate', 'combination')
                    }else{
                        _this.$emit('updateFormdate', 'basicInfo') // 保存后更新规格模块数据
                    }
                    
                } else {

                    this.$message.error(res.data.msg)
                }
            })
        },
        //库存
        valueChangeQu(value) {
            this.quantity = value
        },
        valueChangePrice(value) {
            this.wholesale_price = value
        },
        valueChangeWp(value) {
            this.price = value
        },
    },
    computed: {

    },
    destroyed() {
        this.$root.eventBus.$off('updateSku', 1)
        this.$root.eventBus.$off('updateFormdate', 1)
        // this.$root.eventBus.$off('updateCombination', 'combination')
        
    }

}
</script>

<style>
.specLists .categoryList li {
	display: inline-block;
	padding: 5px 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-sizing: border-box;
	line-height: 20px;
	margin-right: 10px;
}
.specLists .categoryList li i {
	cursor: pointer;
}

.specLists .categoryList li:hover {
	border-color: #20a0ff;
	background-color: #eaf6ff;
}
.specLists .typeselect{
    color:#409EFF;
    font-size:24px;
}
.specLists .fontColor .el-input--mini .el-input__inner {
  color: #20a0ff;
}
</style>
