<template>
    <div class="comboList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'comboCommodity'}">
                    <i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑组合商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tab-wrap">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="infos">
                    <pruductInfo 
                        :formData="formData" 
                        :rules="rules" 
                        :productList="productList" 
                        :provenanceList="provenanceList" 
                        :cornertagsList="cornertagsList" 
                        :classifyList="classifyList" 
                        :departmentList="departmentList"
                        :priceStatus="priceStatus" 
                        :combination='1'>
                    </pruductInfo>
                    <el-button class="submitBtn" type="primary" @click="submitForm" v-if="!productId">立即创建</el-button>
                    <el-button class="submitBtn" type="primary" @click="submitForm" v-if="productId">保存</el-button>
                </el-tab-pane>
                <el-tab-pane label="图片" name="picture" :disabled="!productId">
                    <!---->
                    <pruductImg :proImgs.sync="proImgs" :productId="productId" :userData="userData"></pruductImg>
                </el-tab-pane>
                <el-tab-pane label="配置" name="config" :disabled="!productId">
                    <!-- <productSku :formData.sync="formData"></productSku> -->
                    <productConfig :configData="configData" :userData="userData" :basicProductList="basicProductList" :productId="productId" :pkkid="p_kkid" :showClick="showClick"></productConfig>
                </el-tab-pane>
                <el-tab-pane label="规格" name="spec" :disabled="!productId">
                    <Spec :productId="productId" :userData="userData" :combination='1' @updateFormdate="updateFormdate" ></Spec>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import mixin from '../../../mixin/index.vue'
import pruductInfo from '../../../components/shop/productInfo.vue'
import pruductImg from '../../../components/shop/productImg.vue'
import productConfig from '../../../components/shop/productConfig.vue'
import Spec from '../../../components/shop/Spec.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            activeName: 'infos',
            userName: '',
            accessToken: '',
            productId: null,
            p_kkid: '',
            configData: [],
            priceStatus: false,
            showClick: false
        }
    },

    mounted () {
      this.$root.eventBus.$on('updateCombination', (res)=>{
            console.log('is updateCombination event bus')
            this.getProductInfo()
        })  
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.productId = this.$route.query.productId
        this.p_kkid = this.$route.query.p_kkid

        if (this.$route.query.productId) {
            this.getProductInfo()
        }
    },
    methods: {
        getProductInfo() {
            let _this = this
            let _data = {
                id_product: this.productId,
                p_kkid: this.p_kkid
            }
            _data = Object.assign({}, _data, this.userData)
            this.$api.pmBasicView(_data)
                .then(res => {
                    let _formData = res.data.data.product_info
                    let _imgs = res.data.data.product_image
                    let _icons = res.data.data.product_info.id_category_arr
                    _formData.madein = _formData.madein === 0 ? '' : _formData.madein
                    _formData.cornertag = _formData.cornertag === 0 ? '' : _formData.cornertag
                    _formData = Object.assign({}, _this.formData, _formData);
                    _imgs = Object.assign({}, _this.proImgs, _imgs)
                    // _this.formData = Object.assign({}, _this.formData, _formData);
                    _this.$store.commit('FORMDATA', { data: _formData })
                    _this.$store.commit('PROIMGS', { imgs: _imgs })
                    _this.$store.commit('CATEGORYICONS', { icons: _icons })
                    
                    _this.$root.eventBus.$off('updateCombination', 'combination')
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // updateFromData(newData) {
        //     debugger
        //     this.formData = Object.assign({}, this.formData, newData);
        //     console.log(newData, this.formData)
        // },
        submitForm() {
            if (!this.validateFn()) {
                return
            }
            this.submitServer()
        },
        submitServer() {
            let _this = this
            let data = this.formData;

            let _categorys = data.id_category_arr
            if (_categorys.length && _categorys.length > 0) {
                let _ids = _categorys.map(item => {
                    return item.id_child
                })
                data.id_category = [].concat(_ids)
            }

            let _department = [].concat(data.department_arr)
            data.department = data.department.concat(_department)

            // 数组类型to json
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }

            // 用户信息
            data = Object.assign({}, data, this.userData)
            if (this.productId) {
                data.type = 2; // 编辑商品
                data.is_combination = 1; // 1- 组合商品， 0- 基础商品
                data.p_kkid = this.p_kkid
                this.$api.pmBaseaddedit(data)
                    .then(res => {
                        console.log(res)
                        this.$router.back(-1)
                        // _this.$router.push('comboCommodity')
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                data.type = 1; // 新增商品
                data.is_combination = 1 // 1- 组合商品， 0- 基础商品
                this.$api.pmBaseaddedit(data)
                    .then((res) => {
                        this.productId = res.data.data.product_info.id_product
                        debugger
                        this.p_kkid = res.data.data.product_info.kkid
                        let _resData = res.data.data.product_info
                        let _formData = Object.assign({}, this.formData, _resData);
                        this.$store.commit('FORMDATA', { data: _formData })
                        // this.$router.push('comboCommodity')
                        this.$message.success('创建成功，可继续编辑或添加图片等信息')
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },

        validateFn() {
            let quantity = this.formData.quantity
            if (quantity) {
                if (isNaN(quantity)) {
                    this.$message.error('请输入正确的库存')
                    return false
                }
            }
            if (!this.formData.name || this.formData.name.length > 50) {
                this.$message.error('请正确输入商品名，限制50字');
                return
            }
            if (!this.formData.price) {
                this.$message.error('请输入平台价');
                return
            }
            if (!this.formData.wholesale_price) {
                this.$message.error('请输入市场价');
                return
            }
            if (!this.formData.madein) {
                this.$message.error('请选择产地');
                return
            }
            if (!this.formData.position) {
                this.$message.error('商品排序必须填写');
                return
            }
            if (!this.formData.id_category_arr.length >= 1) {
                this.$message.error('请选择商品分类');
                return
            }
            if (!this.checkNumber('float', this.formData.price) || !this.checkNumber('float', this.formData.wholesale_price)) {
                this.$message.error('价格必须是正确的数字')
                return
            }
            if (!this.checkNumber('Int', this.formData.position)) {
                this.$message.error('商品排序必须是整数')
                return
            }

            return true
        },
        checkNumber(type, str) { // type: float - 浮点型， Int-整型
            if (type == 'float') {
                // if(parseFloat(str).toString() == "NaN"){
                //     return false
                // }else{
                //     return true
                // }
                let reg = /^\d*\.{0,1}\d{0,1}$/
                return reg.test(str)
            } else {
                return String(str).match(/\D/) == null;
            }

        },

        handleClick(tab, event) {
            let _this = this
            if (this.productId && tab.name === 'config') {
                let _data = {
                    id_product: this.productId
                }
                _data = Object.assign({}, _data, this.userData)
                this.$api.getCombination(_data)
                    .then(res => {
                        if(res.data.status == 200){
                            _this.configData = res.data.data
                            _this.showClick = res.data.data[0].is_active==0?false:true // 0-可编辑， 1-不可编辑
                        }else{
                            _this.showClick = false
                        }
                        
                    })
            }
            if (this.productId && tab.name === 'picture') {
                // console.log('click tab',this.proImgs)
            }

        },
        updateFormdate(res){
            if(res == 'combination'){
                this.getProductInfo();
            }
            if(res == 'pricetrue') {
                this.priceStatus = true
            } else if(res == 'pricefalse'){
                this.priceStatus = false
            }
        }
        // updateConfig(value) {
        //     this.configData = value
        // },
    },
    computed: {
        ...mapGetters(['formData', 'proImgs', 'categoryIcons'])
    },
    mixins: [mixin],

    components: {
        pruductInfo,
        pruductImg,
        productConfig,
        Spec
    },
    beforeDestroy () {
        this.productId='';
        this.$root.eventBus.$off('updateCombination', 'combination')
    }
}
</script>
<style>
.submitBtn {
	margin-top: 15px;
}
</style>