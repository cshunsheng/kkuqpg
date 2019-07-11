<template>
    <div id="salerank-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i>搜索管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增排行</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="edit-wrap">
            <div class="part-wrap select-article-wrap">
                <span class="label-txt">商品</span>
                <el-select
                        v-model="id_product"
                        size="medium"
                        clearable
                        filterable
                        class="el-input-text"
                        placeholder="请选择商品">
                    <el-option
                            v-for="(item, index) in productList"
                            :key="index"
                            :label="item.name"
                            :value="item.id_product">
                    </el-option>
                </el-select>
            </div>
            <div class="part-wrap sequence-wrap">
                <span class="label-txt">显示顺序</span>
                <el-input class="el-input-text" v-model="pos"></el-input>
            </div>
            <div class="part-wrap action-wrap">
                <el-button class="ation-btn" size="small" type="primary" @click="save">保存</el-button>
                <el-button class="ation-btn" size="small" @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: '',
                id_product: '',
                pos: '1'
            }
        },

        computed: {
            ...mapGetters([
                'productList'
            ])
        },

        created() {
            this.init()
            this.getProductList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getProductList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                }
                this.$api.salerank_prodlist(params).then((res)=>{
                    this.$store.commit('GETPRODUCTLIST', {
                        data: res.data.data.product_list
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            save() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    id_product: this.id_product,
                    pos: this.pos,
                }
                this.$api.salerank_add(params).then((res)=>{
                    this.$message({
                        message: '新增排行成功',
                        type: 'success',
                        showClose: true,
                    });
                    this.$router.push({path: 'list'})
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            cancel() {
                this.$router.push({path: 'list'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    #salerank-edit__container {
        .part-wrap{
            margin-bottom: 20px;
            .el-input-text {
                width: 200px;
            }
            .label-txt{
                display: inline-block;
                width: 80px;
                text-align: end;
                margin-right: 20px;
            }
        }
    }
</style>
