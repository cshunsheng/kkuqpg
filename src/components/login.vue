<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!--<el-button @click.stop="toRegister" type="text">注册</el-button>-->
            </el-form>
        </div>
    </div>
</template>

<script>
    import $axios from '../utils/http';

    export default {
        data: function(){
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
            toRegister() {
                this.$router.push({path: '/register'})
            },

            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.apiUserLogin()
                    } else {
                        this.$message({
                            message: '账号密码有误',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },

            async apiUserLogin() {
                const self = this
                const params = {
                    username: this.ruleForm.username,
                    password: this.ruleForm.password,
                }
                try {
                    const response = await $axios.post('/user/login', params) //登录成功状态200
                    if(response.data.status !== 200){
                        throw new Error(response.data.msg)
                    }
                    const { username, access_token, auth_info} = response.data.data
                    localStorage.setItem('g_username', username);
                    localStorage.setItem('g_accessToken', access_token);
                    localStorage.setItem('auth_info', JSON.stringify(auth_info))
                    if(this.$route.query.redirect){
                        self.$router.push({path: this.$route.query.redirect});
                    } else {
                        self.$router.push({path: '/admin'});
                    }
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
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
