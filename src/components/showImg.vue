<template>
    <div class="show_img">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/agent/indexOperation'}">
                    <i class="el-icon-menu"></i>明星医生
                </el-breadcrumb-item>
                <el-breadcrumb-item>配置图片</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="top">
            一键导入商品图：  
            <div class="top_items"><el-input placeholder="输入精确商品ID" v-model="product_id"></el-input></div>
            <div class="top_items"><el-button type="primary" @click="getImgList">确 定</el-button></div>
        </div>
        <div class="img">
            <div class="img_item">
                <div>橱窗图：</div>
                <div class="img_detail" v-if="(imgList&&imgList.cover&&imgList.cover.length == 0)||imgShow"></div>
                <div v-for="(item,index) in imgList.cover" :key="index" class="img_detail" v-else>
                    <img :src="item.id_product_kkh_url" alt="">
                </div>
            </div>
            <div class="img_item">
                <div>Banner头图：</div>
                <div class="img_detail" v-if="(imgList&&imgList.images&&imgList.images.length == 0)||imgShow"></div>
                <div v-for="(item,index) in imgList.images" :key="index" class="img_detail" v-else>
                    <img :src="item.id_product_kkh_url" alt="">
                </div>
            </div>
            <div class="img_item">
                <div>详情图：</div>
                <div class="img_detail" v-if="(imgList&&imgList.images_detail&&imgList.images_detail.length == 0)||imgShow"></div>
                <div v-for="(item,index) in imgList.images_detail" :key="index" class="img_detail" v-else>
                    <img :src="item.id_product_kkh_url" alt="">
                </div>
            </div>

        </div>
        <el-button type="primary" @click="save">提交</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userData: {},
            id: '',
            product_id: '',
            imgList: {},
            imgShow: true,
            saveFlag: false
        }
    },
    created() {
        this.id = this.$route.query.id
        this.product_id = this.$route.query.product_id == 0?'':this.$route.query.product_id
        this.userData.username = localStorage.getItem('g_username');
        this.userData.access_token = localStorage.getItem('g_accessToken');
        if (this.product_id != '') {
            this.getImgList()
        }
    },
    methods:{
        save() {
            if (this.saveFlag) {
                this.$message.error('该商品未配置图片，请进行核查')
                return false
            }
            let data = {
                id: this.id,
                product_id: this.product_id
            }
            data = Object.assign({},data,this.userData)
            this.$api.bindProduct(data)
                .then(res => {
                    // console.log(res)
                    if(res.data.status == 200) {
                        this.$message.success('提交成功')
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(res => {
                    
                })
        },
        getImgList() {
            let _data = {
                id_product: this.product_id,
            }
            _data = Object.assign({}, _data, this.userData)
            this.$api.pmBasicView(_data)
                .then(res => {
                    // console.log(res)
                    if (res.data.status == 200) {
                        this.imgShow = false
                        this.imgList = res.data.data.product_image
                        if(res.data.data.length == 0) {
                            this.$message.error(res.data.msg)
                        }
                        if(this.imgList.images_detail.length == 0&&this.imgList.cover.length == 0&&this.imgList.images.length == 0) {
                            this.saveFlag = true
                            this.$message.error('该商品未配置图片，请进行核查')
                        }else {
                            this.saveFlag = false
                        }
                    }
                })
                .catch(res => {
                    console.log(res)
                })
        }
    }

}
</script>
<style>
.show_img .top_items {
    display: inline-block;
}
.show_img .img_detail {
    display: inline-block;
    width: 200px;
    height: 200px;
    line-height: 200px;
    margin-right: 20px; 
    border: 1px solid transparent;
}
.show_img .img {
    margin: 20px 0;
}
.show_img .img .img_item {
    padding-top: 5px; 
}
.show_img .img_detail img {
    display: inline-block;
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: middle;
}
</style>
