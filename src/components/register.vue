<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-register">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import $axios from '../utils/http';

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur change'},
                        {min: 8, message: '用户名长度大于8位', trigger: 'blur change'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur change'},
                        {min: 8, message: '密码长度大于8位', trigger: 'blur change'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.apiUserRegister()
                    } else {
                        this.$message({
                            message: '请输入正确的用户名与密码！',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },

            async apiUserRegister() {
                const self = this
                const params = {
                    username: this.ruleForm.username,
                    password: this.ruleForm.password,
                }
                try {
                    const response = await $axios.post('/user/register', params) //登录成功状态200，无返回
                    if(response.data.status !== 200){
                        throw new Error(response.data.msg)
                    }
                    self.$router.push({path: '/login'})
                } catch (error) {
                    self.$message({
                        message: error.message,
                        type: 'error'
                    });

                }
            }

        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-register {
        position: absolute;
        left: 50%;
        top: 50%;
        min-width: 300px;
        height: 160px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }
</style>
