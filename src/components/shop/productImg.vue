<template>
    <div id="base-pic__container">
        <el-row :gutter="15">
            <el-col class="box-card" :span="24">
                <el-card>
                    <div slot="header" class="imgTit clearfix">
                        <span>橱窗展示图</span>
                        <span class="saveImg" @click.stop="saveImg('cover_pic',1)">保存</span>
                    </div>
                    <uploadImg :picList="baseInfoData.cover" type="cover_pic" @updatePicList="updatePicList">
                    </uploadImg>
                </el-card>
            </el-col>
            <el-col class="box-card" :span="24">
                <el-card>
                    <div slot="header" class="imgTit clearfix">
                        <span>Banner头图</span>
                        <span class="saveImg" @click.stop="saveImg('head_pic',1)">保存</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <uploadImg :picList="baseInfoData.images" type="head_pic" @updatePicList="updatePicList">
                    </uploadImg>
                </el-card>
            </el-col>

            <el-col class="box-card" :span="24">
                <el-card>
                    <div slot="header" class="imgTit clearfix">
                        <span>详情图</span>
                        <span class="saveImg" @click.stop="saveImg('detail_pic',1)">保存</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <uploadImg :picList="baseInfoData.images_detail" type="detail_pic" @updatePicList="updatePicList">
                    </uploadImg>
                </el-card>
            </el-col>

            <el-col class="box-card" :span="24">
                <el-card>
                    <div slot="header" class="imgTit clearfix">
                        <span>医疗证书</span>
                        <span class="saveImg" @click.stop="saveImg('medical_pic',1)">保存</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <uploadImg :picList="baseInfoData.diploma" type="medical_pic" @updatePicList="updatePicList">
                    </uploadImg>
                </el-card>
            </el-col>

        </el-row>
    </div>
</template>
<script type="text/ecmascript-6">
import uploadImg from './uploadImg.vue'
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            baseInfoData: {},
            imgObj: {}
        }
    },

    props: ['proImgs','productId','userData'],

    created() {
        this.baseInfoData = Object.assign({},this.baseInfoData, this.proImgs);
        // console.log('imgPage-baseInfo',this.baseInfoData)
        // console.log('imgPage-proImg',this.proImgs)
    },
    watch: {
        proImgs: {
            handler(val, oldVal){
                this.baseInfoData = Object.assign({},this.baseInfoData, val);
            },
            deep: true
        }
    },


    methods: {
        updatePicList(type, value) {
            console.log(type, value);
            switch (type) {
                case 'cover_pic':
                    this.baseInfoData.cover = value;
                    break;
                case 'head_pic':
                    this.baseInfoData.images = value;
                    break;
                case 'detail_pic':
                    this.baseInfoData.images_detail = value;
                    break;
                case 'medical_pic':
                    this.baseInfoData.diploma = value;
                    break;
            }

        },
        saveImg(){
            console.log(this.baseInfoData.images)
            let _this = this
            let _data = {
                username:this.userName,
                access_token:this.accessToken
            }
            _data = Object.assign({},this.baseInfoData.images,this.userData)
            this.$api.saveImg(_data)
                .then(res=>{
                    console.log(res.status)
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        // 上传头像返回处理
        handleAvatarSuccess(res, file) {
            // this.editInfos.head_picture = URL.createObjectURL(file.raw);
            this.editInfos.head_picture = res.data.image_url;
        },
        // 保存图片(排序)
        saveImg(imgType,productType) {
            let _cover = 0  // 是否商品展示图
            let _is_detail_pic = 0;  // 是否详情图
            let _is_diploma = 0;     // 是否证书
            let _imgArr
            
            if(imgType === 'cover_pic'){
                _cover = 1;
                _imgArr = this.baseInfoData.cover
            }else{
                _imgArr = this.baseInfoData.images
            }
            if(imgType === 'detail_pic'){
                _is_detail_pic = 1
                _imgArr = this.baseInfoData.images_detail
            }
            if(imgType === 'medical_pic'){
                _is_diploma = 1
                _imgArr = this.baseInfoData.diploma
            }

            let resArr = _imgArr.map(item=>{
                return item.id_product_kkh_url
            })

            let data = {
                id_product: this.productId,
                type: 1,
                is_combination:productType,
                cover: _cover,
                is_detail_pic: _is_detail_pic,
                is_diploma: _is_diploma,
                images: resArr,
            }

            data = Object.assign({},data,this.userData)
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }
            this.$api.saveImg(data)
                .then(res=>{
                    if(res.data.status==200){
                        this.$message.success(res.data.msg)
                    }else{
                        this.$message.success(res.data.msg)
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        }
    },
    components: {
        'uploadImg':uploadImg
    },
    computed: {
        // ...mapGetters(['proImgs'])
    },
}
</script>

<style scoped>
#base-pic__container {
    
}
.box-card:not(:last-child) {
        margin-bottom: 15px;
    }
.imgTit{
    display: flex;
    justify-content: space-between;
}
.imgTit span{
    /* flex: 1; */
}
.imgTit span.saveImg{
    text-align: right;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 12px;
    color:#666;
}
.imgTit span.saveImg:hover{
    cursor: pointer;
    color:#20a0ff;
    border-color:#20a0ff;
}
</style>
