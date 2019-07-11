<template>
    <div id="keyword-edit__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i>搜索管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增关键字</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="form-wrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="关键字" prop="keyword">
                    <el-input v-model="ruleForm.keyword"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="pos">
                    <el-input v-model="ruleForm.pos"></el-input>
                </el-form-item>
                <el-form-item label="ID" prop="link">
                    <el-input v-model="ruleForm.id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                username: '',
                access_token: '',
                ruleForm: {
                    keyword: '',
                    id: '',
                    pos: '1'
                },
                rules: {
                    keyword: [
                            { required: true, message: '请输入关键字', trigger: 'blur change' },
                            {max: 10, message: '关键字长度不能超过10位', trigger: 'blur change'},
                    ],
                    pos: [
                            { required: true, message: '请输入显示顺序', trigger: 'blur change' }
                    ],
                    id: [
                            { required: true, message: '请输入商品ID', trigger: 'blur change' }
                    ]
                }
            }
        },

        created() {
            this.init()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = {
                            access_token: this.access_token,
                            username: this.username,
                            keyword: this.ruleForm.keyword,
                            id: this.ruleForm.id,
                            pos: this.ruleForm.pos,
                            type: '2'
                        }
                        this.$api.search_addkwd(params).then((res)=>{
                            this.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            this.$router.push({path: 'list'})
                        }, (err)=>{
                            this.$message({
                                message: err,
                                type: 'error'
                            });
                        })
                    } else {
                        this.$message({
                            message: '请填写正确的信息',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },

            cancel(){
                this.$router.push({path: 'list'})
            }

        }
    }
</script>

<style>

</style>
