<template>
    <div class="comboList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑基础商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tab-wrap">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="infos">
                    <pruductInfo 
                        :formData="formData" 
                        :rules="rules"
                        :basicNameList="basicNameList"  
                        :productList="productList" 
                        :provenanceList="provenanceList" 
                        :cornertagsList="cornertagsList" 
                        :classifyList="classifyList" 
                        :departmentList="departmentList" 
                        :combination='0' 
                        :userData="userData"
                        :cantEidtStock="cantEidtStock"
                        :priceStatus="priceStatus"
                        :isVirtual="isVirtual">
                    </pruductInfo>
                    <el-button class="submitBtn" type="primary" @click="submitForm" v-if="!productId">立即创建</el-button>
                    <el-button class="submitBtn" type="primary" @click="submitForm" v-if="productId">保存</el-button>
                </el-tab-pane>
                <el-tab-pane label="图片" name="picture" :disabled="!productId">
                    <pruductImg :proImgs.sync="proImgs" :productId="productId" :userData="userData"></pruductImg>
                </el-tab-pane>
                <el-tab-pane label="规格" name="spec" :disabled="!productId">
                    <Spec :productId="productId" :userData="userData" :combination='0' :reSpec="reSpec" @updateFormdate="updateFormdate"></Spec>
                </el-tab-pane>
                <el-tab-pane label="音频" name="audio" :disabled="!productId||isVirtual == 0">
                    <!-- || is_virtual -->
                    <AudioAdd :productId="productId" :userData="userData" ></AudioAdd>
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
import AudioAdd from '../../../components/shop/AudioAdd.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            activeName: 'infos',
            userName: '',
            accessToken: '',
            productId: null,
            p_kkid: '',
            basicNameList:[],
            cantEidtStock: false,
            priceStatus: false,
            isVirtual: '',
            reSpec: false,
        }
    },
    provide() {
        return {
            reload: this.reload
        }
    },
    mounted () {
    //   this.$root.eventBus.$on('updateFormdate', (res)=>{
    //       console.log('is update Basic event bus')
    //         this.getProductInfo()
    //     })  
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.productId = this.$route.query.productId
        this.p_kkid = this.$route.query.p_kkid
        this.isVirtual = this.$route.query.is_virtual
        this.getBasicNameList()

        if (this.productId && this.p_kkid) {
            this.getProductInfo()
        }
    },
    methods: {
        reload() {
            if (this.productId && this.p_kkid) {
                this.getProductInfo()
            }else{
                return ;
            }
        },
        getProductInfo() {
            let _this = this
            let _data = {
                id_product: this.productId,
                p_kkid: this.p_kkid
            }
            _data = Object.assign({}, _data, this.userData)
            this.$api.pmBasicView(_data)
                .then(res => {
                    // console.log(res.data.data.product_info.is_virtual)
                    // console.log(res)
                    let _formData = res.data.data.product_info
                    let _imgs = res.data.data.product_image
                    let _icons = res.data.data.product_info.id_category_arr
                    _formData.id_stock_product = res.data.data.product_info.stock_info.id_stock_product
                    if(res.data.data.product_info.stock_info.id_stock_product){
                        this.cantEidtStock = true
                    }
                    _formData = Object.assign({}, _this.formData, _formData);
                    _this.$store.commit('FORMDATA', { data: _formData })
                    _this.$store.commit('PROIMGS', { imgs: _imgs })
                    _this.$store.commit('CATEGORYICONS', { icons: _icons })
                    this.formData.cornertag = this.formData.cornertag == 0 ? '' : this.formData.cornertag
                    this.formData.madein = this.formData.madein == 0 ? '' : this.formData.madein
                    this.basicNameList.push(res.data.data.product_info.stock_info)
                    // console.log(this.basicNameList);
                    
                })
                .catch(err => {
                    console.log(err)
                })
        },
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

            // console.log(this.formData)
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
                data.is_combination = 0; // 1- 组合商品， 0- 基础商品
                data.p_kkid = this.p_kkid
                this.$api.pmBaseaddedit(data)
                    .then(res => {
                        if (res.data.status == 200) {
                            this.$router.back(-1)
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                data.type = 1; // 新增商品
                data.is_combination = 0 // 1- 组合商品， 0- 基础商品
                this.$api.pmBaseaddedit(data)
                    .then((res) => {
                        // console.log(res)
                        if (res.data.status == 200) {
                            this.productId = res.data.data.product_info.id_product
                            this.p_kkid = res.data.data.product_info.kkid
                            let _resData = res.data.data.product_info
                            if(res.data.data.product_info.stock_info.id_stock_product){
                                this.cantEidtStock = true
                            }
                            this.isVirtual = res.data.data.product_info.is_virtual
                            let _formData = Object.assign({}, this.formData, _resData);
                            this.$store.commit('FORMDATA', { data: _formData })
                            // this.$router.push('list')
                            this.reSpec = true
                            this.$message.success('创建成功，可继续编辑或添加图片等信息')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },

        validateFn() {
            // if (!this.formData.id_stock_product) {
            //     this.$message.error('请选择商品')
            //     return
            // } 
            if (!String(this.formData.name).trim()) {
                this.$message.error('请输入商品名');
                return
            }
            if (this.formData.name.length > 50) {
                this.$message.error('商品名称的字数不超过50字')
                return
            }
            if (!this.formData.price) {
                this.$message.error('请输入平台价');
                return
            }
            if (this.formData.id_category_arr.length < 1) {
                this.$message.error('请填写商品分类')
                return
            }
            let quantity = this.formData.quantity
            if (quantity) {
                if (isNaN(quantity)) {
                    this.$message.error('请输入正确的库存')
                    return false
                }
            }
            let reg = /^\d*\.{0,1}\d{0,1}$/
            let value = this.formData.price
            let limit_value = this.formData.wholesale_price
            let doc_rewards = this.formData.doc_rewards
            let ambassador_rewards = this.formData.ambassador_rewards
            if (new RegExp(reg).test(value) == false || new RegExp(reg).test(limit_value) == false || new RegExp(reg).test(doc_rewards) == false || new RegExp(reg).test(ambassador_rewards) == false) {
                this.$message.error('请输入正确的价格(平台价/市场价/医生奖励/推广大使奖励)')
                return
            }
            if (!this.formData.wholesale_price) {
                this.$message.error('请输入市场价');
                return
            }
            if (!this.formData.position) {
                this.$message.error('商品排序必须填写');
                return
            }
            if (!this.formData.madein) {
                this.$message.error('产地必须填写');
                return
            }
            let posReg = /^[0-9]*[0-9][0-9]*$/
            let posValue = this.formData.position
            if (posValue) {
                if (new RegExp(posReg).test(posValue) == false) {
                    this.$message.error('请输入正确的排序')
                    return
                }
            }
            return true
        },

        handleClick(tab, event) {
            let _this = this
            if (!this.productId && tab.name === 'picture') {
                _this.$message.warning('请先添加基础信息')
                return;
            }

        },
        getBasicNameList() {
            let _data = {
                username: this.username,
                access_token: this.access_token,
                keywords: ''
            }
            this.$api.baseNames(_data)
            .then(res=>{
                this.basicNameList = res.data.data
            })
        },
        updateFormdate(res){
            if(res == 'basicInfo'){
                this.getProductInfo();
            }
            if(res == 'pricetrue') {
                this.priceStatus = true
            } else if(res == 'pricefalse'){
                this.priceStatus = false
            }
            if(res == 'specStatus') {
                this.reSpec = false
            }
        }
    },
    computed: {
        ...mapGetters(['formData', 'proImgs', 'categoryIcons'])
    },
    mixins: [mixin],

    components: {
        pruductInfo,
        pruductImg,
        productConfig,
        Spec,
        AudioAdd
    },
}
</script>
<style>
.submitBtn {
	margin-top: 15px;
}
</style>