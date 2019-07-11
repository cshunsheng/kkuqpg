<template>
    <div class="fodderEdit">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/admin/generalize/fodder'}">
                    推广素材
                </el-breadcrumb-item>
                <el-breadcrumb-item>编辑素材</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="editForm">
            <el-form ref="ruleform" :rules="rules" :model="ruleform" label-width="80px">
                <!-- <el-form-item label="活动名称" prop="name">
                    <el-input v-model="ruleform.name"></el-input>
                </el-form-item> -->
                <el-form-item label="商品名称" size="medium" prop="productId">
                    <!-- <el-select placeholder="请选择商品" :disabled="eidtProductId?true:false" v-model="ruleform.productId" clearable filterable remote style="width:400px;" :loading="loading" :remote-method="searchProduct"> -->
                    <el-select placeholder="请选择商品" :disabled="eidtProductId?true:false" v-model="ruleform.productId" clearable filterable style="width:400px;" :loading="loading">
                        <el-option v-for="(item,inx) in filterProducts" :key="inx" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分享文案" prop="sharetext">
                    <el-input type="textarea" v-model="ruleform.sharetext" style="width:400px;" rows="5"></el-input>
                </el-form-item>
                <el-form-item label="分享图">
                    <p class="picTip">可配置6张分享图</p>
                    <p class="picTip">支持jpg/png文件，且不超过200kb，建议尺寸为1000:1000比例</p>
                    <uploadImg :picList="fodderImgs" @updatePicList="updatePicList">
                    </uploadImg>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancel">取消</el-button>
                    <el-button @click="submit" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import uploadImg from '@/components/generalize/uploadImg.vue'
export default {
    data() {
        return {
            userName:'',
            accessToken:'',
            fodderName:'',
            fodderImgs: [],
            ruleform: {
                productId: '',
                sharetext: ''
            },
            rules: {
                productId: [{required: true, message: '请输入名称', trigger: 'blur'}],
                sharetext: [{required: true, message: '请输入分享文案', trigger: 'blur' }]
            },
            filterProducts:[],
            eidtProductId: '',
            loading: false
        }
    },
    created () {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.eidtProductId = this.$route.query.productId
        
        if(this.eidtProductId){
            this.getProductInfo(this.eidtProductId)
        }
    },
    async mounted() {
        await this.searchProduct()
    },
    methods: {
        updatePicList(value) {
            this.fodderImgs = value;
        },
        submit() {
            if(!this.checkData()) return ;
            let imgObj = {}
            this.fodderImgs.forEach((item,inx)=>{
                imgObj[inx] = item.image_url
            })
            let submitData = {
                access_token: this.accessToken,
                username: this.userName,
                id_product: this.ruleform.productId,
                images: JSON.stringify(imgObj),
                share_description: this.ruleform.sharetext
            }
            console.log(JSON.stringify(submitData))
            this.$api.saveFodder(submitData)
                .then(res=>{
                    console.log(res.status)
                    this.$router.go(-1)
                })
        },
        // 添加商品，根据id查找商品
        searchProduct(query) {
            let _this = this
            if (query !== '') {
                this.loading = true;
                _this.filterProducts = []
                setTimeout(() => {
                    _this.$api.searchFodderProductList(query)
                        .then(res => {
                            this.loading = false;
                            if (res.data.data) {
                                let _list = res.data.data.product_list;
                                let _filterProducts = _list.map(item => {
                                    return { value: item.id_product, label: item.name };
                                });
                                _this.filterProducts = [..._this.filterProducts, ..._filterProducts]
                            }
                        })
                },500)
            }else{
                this.filterProducts = []
            }
            
        },
        getProductInfo(id) {
            let _this = this
            let _data = {
                access_token: this.accessToken,
                username: this.userName,
                id_product: id
            }
            this.$api.getFodderInfo(_data)
                .then(res=>{
                    console.log(res.data.data)
                    let _resData = res.data.data
                    let imgList = _resData.images
                    this.ruleform.productId = _resData.id_product;
                    this.ruleform.sharetext = _resData.share_description
                    this.fodderImgs = imgList
                    let proListObj = {
                        value: _resData.id_product,
                        label: _resData.name
                    }
                    this.filterProducts.push(proListObj)
                })
        },
        checkData() {
            if(!this.ruleform.productId) {
                this.$message.error('请选择商品');
                return false;
            }
            if(!this.ruleform.sharetext){
                this.$message.error('请填写分享文案');
                return false;
            }
            if(this.fodderImgs.length<1){
                this.$message.error('请添加分享图');
                return false;
            }
            return true;
        },
        cancel() {
            this.$router.go(-1)
        }
    },
    components: {
        'uploadImg':uploadImg
    },
}
</script>
<style>
.el-form-item__content .picTip{
    font-size: 12px;
    color:#999;
    line-height: 20px;
}
.el-form-item__content .picTip:first-child{
    margin-top: 10px;
}
</style>