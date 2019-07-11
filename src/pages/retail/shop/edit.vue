<template>
    <div id="retail-shop-edit">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}"><i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="id_stock">编辑商品</el-breadcrumb-item>
                <el-breadcrumb-item v-else>新增商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="form-wrap">
            <el-form v-if="edifOrAddFlag == 'add'" :model="ruleForm" status-icon :rules="addRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品货号" prop="id_product">
                    <el-input disabled class="el-input-text" v-model="ruleForm.id_product"></el-input>
                    <span class="tip">（注：选择商品名称自动生成货号）</span>
                </el-form-item>
                <el-form-item label="商品名称" size="small">
                    <el-select
                            v-model="value"
                            size="medium"
                            clearable
                            filterable
                            @change="selectChange"
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
                <el-form-item label="售价" prop="price_out">
                    <el-input disabled class="el-input-text" v-model="ruleForm.price_out"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="product_num">
                    <el-input class="el-input-text" v-model="ruleForm.product_num"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="cancelForm">取消</el-button>
                </el-form-item>
            </el-form>
            <el-form v-else-if="edifOrAddFlag == 'edit'" :model="ruleForm" status-icon :rules="editRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品货号" prop="id_product">
                    <el-input disabled class="el-input-text" v-model="ruleForm.id_product"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="product_name">
                    <el-input disabled class="el-input-text" v-model="ruleForm.product_name"></el-input>
                </el-form-item>
                <el-form-item label="售价" prop="price_out">
                    <el-input disabled class="el-input-text" v-model="ruleForm.price_out"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="product_num">
                    <el-input class="el-input-text" v-model="ruleForm.product_num"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="cancelForm">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                value: '',
                id_stock: null,
                edifOrAddFlag: '',
                productList: [],                                //商品列表
                ruleForm: {
                    id_product: '',                               //货号
                    product_name: '',                           //商品名称
                    price_out: '',                              //售价
                    product_num: '',                            //库存
                },
                //验证规则
                //新建商品，货号不为空
                addRules: {
                    id_product: [
                        {required: true, message: '请输入货号', trigger: 'blur change'},
                    ],
                    product_num: [
                        {required: true, message: '请输入库存', trigger: 'blur change'},
                    ]
                },
                //编辑商品，库存不为空
                editRules: {
                    product_num: [
                        {required: true, message: '请输入库存', trigger: 'blur change'},
                    ]
                }
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
                this.id_stock = this.$route.query.id_stock ? this.$route.query.id_stock : ''
                if(this.id_stock){
                    this.edifOrAddFlag = 'edit'
                    this.ruleForm.id_product = this.$route.query.id_product
                    this.ruleForm.product_name = this.$route.query.product_name
                    this.ruleForm.price_out = this.$route.query.price_out
                    this.ruleForm.product_num = this.$route.query.product_num
                } else {
                    this.edifOrAddFlag = 'add'
                }
            },

            getTotalProduct() {
                this.$api.cabinet_stockinproductlist().then((res)=>{
                    this.productList = res.data.data
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            selectChange(e) {
                this.$api.cabinet_productinfo({id_product: e}).then((res)=>{
                    this.ruleForm.id_product = e
                    this.ruleForm.price_out = res.data.data.product_price
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //保存
                        if(this.id_stock){
                            //编辑
                            const params = {
                                id_stock: this.id_stock,
                                product_num: this.ruleForm.product_num
                            }
                            console.log(params)
                            this.$api.cabinet_stockinedit(params).then((res)=>{
                                this.$router.push({path: 'list'})
                            }, (err)=>{
                                this.$message({
                                    message: err,
                                    type: 'error'
                                });
                            })
                        } else {
                            //新建
                            const params = {
                                id_product: this.ruleForm.id_product,
                                num_in: this.ruleForm.product_num
                            }
                            this.$api.cabinet_stockinadd(params).then((res)=>{
                                  this.$router.push({path: 'list'})
                            }, (err)=>{
                                this.$message({
                                    message: err,
                                    type: 'error'
                                });
                            })
                        }

                    } else {
                        this.$message({
                            message: '请填写完整信息!',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },

            cancelForm(){
                this.$router.push({path: 'list'})
            }

        }
    }
</script>

<style lang="scss" scoped>
    #retail-shop-edit {
        .el-input-text {
            width: 400px;
        }
    }
</style>
