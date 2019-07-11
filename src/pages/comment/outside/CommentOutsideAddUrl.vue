<template>
    <div id="comment-outside-addurl__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 外部评论</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: 'list'}">外部评论列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增链接</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 表单 -->
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="商品名称" size="small">
                <el-select
                        v-model="value10"
                        size="medium"
                        clearable
                        filterable
                        class="el-input-text"
                        placeholder="请输入商品名称">
                    <el-option
                            v-for="(item, index) in productList"
                            :key="index"
                            :label="item.name"
                            :value="item.id_product">
                        <span>{{item.name}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="京东链接" size="small">
                <el-input class="el-input-text" v-model="form.url_jd"></el-input>
            </el-form-item>
            <el-form-item label="天猫链接" size="small">
                <el-input class="el-input-text" v-model="form.url_tm"></el-input>
            </el-form-item>
            <el-button class="editor-btn" type="primary" @click="submit">保存</el-button>
            <el-button class="editor-btn" type="info" @click="cancel">取消</el-button>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">

    export default {
        data() {
            return {
                id_product: null,
                username: '',
                access_token: '',
                productList: [],               //商品列表
                form: {
                    url_jd: '',
                    url_tm: '',
                },
                value10: []
            }
        },

        created() {
            this.init()
            this.getTotalProduct()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
                this.id_product = this.$route.query.id_product?this.$route.query.id_product:''
                this.form.url_jd = this.$route.query.url_jd?this.$route.query.url_jd:''
                this.form.url_tm = this.$route.query.url_tm?this.$route.query.url_tm:''
                this.form.operator = this.$route.query.operator?this.$route.query.operator:''
                this.value10 = this.id_product
            },

            getTotalProduct() {
                this.$api.comment_productlist().then((res)=>{
                    this.productList = res.data.data
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            submit() {
                if(!this.value10){
                    this.$message({
                        message: '请选择商品!',
                        type: 'error'
                    });
                    return
                }
                const params = {
                    id_product: this.value10,
                    url_jd: this.form.url_jd,
                    url_tm: this.form.url_tm,
                    operator: this.username
                }
                this.$api.comment_importexternal(params).then((res)=>{
                    this.$router.push({path: 'list'})
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            cancel() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    #comment-outside-addurl__container {
        .el-input-text {
            width: 800px;
        }
    }

</style>
