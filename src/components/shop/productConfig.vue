<template>
    <div class="productConfigs">
        <el-button @click="showDialog" class="addBtn" :disabled='showClick'>+基础商品模块</el-button>
        <el-table :data="configList" border style="width: 100%">
            <el-table-column prop="name" label="基础商品名称"></el-table-column>
            <el-table-column prop="short_name" label="商品别称"  size="12"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
             <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="delConfig(scope.$index, scope.row)" :disabled='showClick'>删除
                            </el-button>
                        </template>
                    </el-table-column>
            <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
        </el-table>
         <el-button class="sure-btn" type="primary" @click="sureConfig" :disabled='showClick'>保存</el-button>

        <el-dialog title="基础商品模块" :visible.sync="configBox">
            <el-form>
                <el-form-item label="商品名称" label-width="120">
                    <!-- <el-input v-model="productId" auto-complete="off"></el-input> -->
                    <el-autocomplete style="width:100%;" class="block-input" v-model="productName" value-key="product_name" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="数量" label-width="120">
                    <el-input v-model="productNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品别称" label-width="120">
                    <el-input v-model="short_name" maxlength="6" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="configBox = false">取 消</el-button>
                <el-button type="primary" @click="saveConfig">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: ['configData','basicProductList','productId','userData','pkkid','showClick'],
    data () {
        return {
            baseProductId: null,
            productName: null,
            productNum: null,
            configBox: false,
            configList: null,
            short_name:null,
            // showClick:false
        }
    },
    created () {
        this.configList = this.configData;
    },
    watch: {
        configData: {
            handler(val, oldVal){
                this.configList = [].concat(this.configData)
            },
            deep: true
        }
    },
    methods: {
        // 保存后更新规格模块数据
        updateSku() {
            this.$root.eventBus.$emit('updateSku', 1)
        },
        //保存配置
        sureConfig(){
             let data = {
                combination_id_product:this.productId
            }
            data = Object.assign({}, data, this.userData)
            this.$api.setAttr(data)
                .then(res=>{
                    if(res.data.status==200){
                        this.showClick=true
                        this.$root.eventBus.$emit('updateSku', 1) // 保存后更新规格模块数据
                        this.$message.success(res.data.msg)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
        },
        //删除基础商品模块
        delConfig(index, scope){
            let data = {
                id:scope.id,
            }
            data = Object.assign({}, data, this.userData)
            this.$api.delCom(data)
                .then(res=>{
                    if(res.data.status==200){
                        this.$message.success(res.data.msg)
                        this.configList.splice(index,1)
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
        },
        querySearch(queryString, cb) {
            const basicProductList = this.basicProductList
            const results = queryString ? basicProductList.filter(this.createFilter(queryString)) : basicProductList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.product_name.toLowerCase().includes(queryString.toLowerCase()));
            }
        },
        // 获取选择基础商品ID
        handleSelect(e) {
            console.log(e)
            this.baseProductId = e.id_product
        },
        showDialog() {
            this.configBox = true;
            this.productName = null;
            this.productNum = null;
            this.short_name = null;
        },
        // 保存配置
        saveConfig() {
            if(!this.short_name){
                this.$message.error('请输入商品别称')
                return 
            }
            if(this.short_name && this.short_name.length>6){
                this.$message.error('商品别称长度不能超过6个字符')
                return 
            }
            let _this = this
            let data = {
                combination_id_product:this.productId, // 组合商品ID，父组件传递
                id_product: this.baseProductId, // 选择的基础商品ID
                quantity: this.productNum,  // 数量
                short_name:this.short_name
            }
            data = Object.assign({}, data, this.userData)
            this.$api.addCombination(data)
                .then(res=>{
                    if(res.data.data[0].is_active==1){
                        this.showClick=true
                    }
                    this.configList = this.configList.concat(res.data.data)
                    this.productName = null;
                    this.productNum = null;
                    this.short_name = null;

                    // 更新商品信息 - 图片信息
                    let _data = {
                        id_product: _this.productId,
                        p_kkid: _this.pkkid
                    }
                    _data = Object.assign({},_data,this.userData)
                    this.$api.pmBasicView(_data)
                        .then(res=>{
                            let _imgs = res.data.data.product_image
                            _this.$store.commit('PROIMGS', {imgs: _imgs})
                        })
                    // this.$emit('updateConfig', Array.from(this.configList))
                })
            this.configBox = false;
        }
    },
}
</script>
<style>
.addBtn{
    margin-bottom: 10px;
}
.sure-btn{
     margin-top: 20px;
}
</style>