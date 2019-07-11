<template>
    <div id="shop-add__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'container'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>新增商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="wrap">
            <span class="lable-txt">商品</span>
            <el-select
                    v-model="value"
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
        </div>

        <div class="wrap">
            <span class="lable-txt">显示顺序</span>
            <el-input class="el-input-text" v-model="position"></el-input>
        </div>

        <div class="wrap">
            <el-button class="ation-btn" size="small" type="primary" @click="submit">保存</el-button>
            <el-button class="ation-btn" size="small" @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                value: [],
                productList: [],
                shop_type: '',
                position: '1',
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
                this.shop_type = this.$route.query.shop_type?this.$route.query.shop_type:''
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
                if(!this.value || !this.shop_type || !this.position){
                    this.$message({
                        message: '信息不能为空！',
                        type: 'error'
                    });
                }
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    kkid: '',
                    id_product: this.value,
                    position: this.position,
                    shop_type: this.shop_type,
                    action: 'add'
                }

                this.$api.shop_shopadd(params).then((res)=>{
                      this.$message({
                          showClose: true,
                          message: '保存成功',
                          type: 'success'
                    });
                      this.$router.push({path: 'container'})
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            cancel() {
                this.$router.push({path: 'container'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    #shop-add__container {
        .wrap{
            margin-bottom: 20px;
            .lable-txt{
                width: 100px;
                display: inline-block;
                text-align: end;
            }
            .el-input-text {
                width: 400px;
            }
        }
    }
</style>
