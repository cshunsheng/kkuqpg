<template>
    <div class="comboList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'supplier'}">
                <i class="el-icon-menu"></i> 供应商</el-breadcrumb-item>
                <el-breadcrumb-item>编辑供应商</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tab-wrap">
            <div id="base-info__container">
                <el-row :gutter="50">
                    <el-col :span="15">
                        <el-card class="box-card">
                            <el-form ref="leftForm" :label-position="labelPosition" label-width="120px" :model="formData1">
                                <el-form-item label="供应商名称：" prop="name">
                                    <el-input style="width:100%;" class="block-input" v-model.trim="formData1.name" maxlength="50" value-key="name" placeholder="请输入内容">
                                    </el-input>
                                    <div style="text-align:right">
                                        <el-button size="mini" @click="checkSupplier" :disabled="!formData1.name">检测</el-button>
                                    </div>
                                    
                                </el-form-item>
                                <el-form-item label="营业执照：">
                                    <Uploadcert :picList="buessImg" type="proImgs1" :userData="userData" @updatePicList="updatePicList"></Uploadcert>
                                </el-form-item>
                                <el-form-item label="经营许可证：">
                                    <Uploadcert :picList="licence" type="proImgs2" :userData="userData" @updatePicList="updatePicList"></Uploadcert>
                                </el-form-item>
                                <el-form-item label="授权书：">
                                    <Uploadcert :picList="authorization" type="proImgs3" :userData="userData" @updatePicList="updatePicList"></Uploadcert>
                                </el-form-item>

                                <!-- 新增品牌名 -->
                                <el-form-item v-for="(domain, index) in formData1.manufacturer_list" :label="'品牌名' + Number(index+1)" :key="domain.key"><!-- :prop="'manufacturer_list.' + index + '.manufacturer_name'"-->
                                    <el-input v-model="domain.manufacturer_name"></el-input>
                                    <el-button size="mini" @click.prevent="removeDomain(domain)">删除</el-button>
                                    <el-button size="mini" @click="addDomain">新增品牌名</el-button>
                                </el-form-item>
                                <el-button size="mini" v-if="formData1.id_supplier && formData1.manufacturer_list.length<1" @click="addDomain">新增品牌名</el-button>

                                <el-form-item label="地址：">
                                    <el-input v-model="formData1.address" placeholder="请输入地址"></el-input>
                                </el-form-item>
                                <el-form-item label="对接人姓名：">
                                    <el-input type="text" v-model="formData1.contact_name"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号码：">
                                    <el-input type="text" v-model="formData1.mobile_phone"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱：">
                                    <el-input type="text" v-model="formData1.email"></el-input>
                                </el-form-item>
                                <el-form-item label="打款账号：">
                                    <el-input type="text" v-model="formData1.bank_account_number"></el-input>
                                </el-form-item>
                                <el-form-item label="户名：">
                                    <el-input type="text" v-model="formData1.user_name"></el-input>
                                </el-form-item>
                                <el-form-item label="打款银行：">
                                    <el-input type="text" v-model="formData1.bank_name"></el-input>
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <el-input type="textarea" v-model="formData1.remark"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-button type="primary" @click="submitFormData">保存</el-button>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import Uploadcert from '../../../components/pssm/Uploadcert.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            baseInfoData: {},
            labelPosition: 'right',
            userData: null,

            userName: '',
            accessToken: '',
            // buessImg: [],
            // licence: [],//许可证
            // authorization: [],//授权书
        }
    },
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.userData = {
            access_token: this.access_token,
            username: this.username
        }

    },

    mounted() {
        this.id_supplier = this.$route.query.id_supplier
        if (this.id_supplier) {
            this.getSupInfo()
        }
    },
    methods: {
        updatePicList(type, value) {
            //console.log(`type:${type}, value:${JSON.stringify(value)}`);
            switch (type) {
                case 'proImgs1':
                // this.buessImg = value;
                this.$store.commit('BUESSIMG', { imgs: value }) //营业执照
                break;
                case 'proImgs2':
                // this.licence = value;
                this.$store.commit('LICENCE', { imgs: value })          //许可证
                break;
                case 'proImgs3':
                // this.authorization = value;
                this.$store.commit('AUTHORIZATION', { imgs: value })    //授权书
                break;
            }
        },
        removeDomain(item) {
            var index = this.formData1.manufacturer_list.indexOf(item)
            if (index !== -1) {
                this.formData1.manufacturer_list.splice(index, 1)
            }
        },
        addDomain() {
            this.formData1.manufacturer_list.push({
                value: '',
                key: Date.now()
            });
        },
        getSupInfo() {
            let _this = this
            let _data = {
                access_token: this.accessToken,
                username: this.userName,
                id_supplier: this.id_supplier,
            }
            this.$api.getSup(_data)
                .then(res => {
                    let _formData = res.data.data
                    let _business_license = res.data.data.business_license      //营业执照
                    let _licence = res.data.data.licence                        //许可证
                    let _authorization = res.data.data.authorization            //授权书
                    let _manufacturer_list = res.data.data.manufacturer_list   //品牌名
                    _formData = Object.assign({}, _this.formData1, _formData)
                    _this.$store.commit('FORMDATA1', { data: _formData })
                    _this.$store.commit('BUESSIMG', { imgs: _business_license }) //营业执照
                    _this.$store.commit('LICENCE', { imgs: _licence })          //许可证
                    _this.$store.commit('AUTHORIZATION', { imgs: _authorization })    //授权书
                    _this.$store.commit('CATEGORYICONS1', { manufacturer_list: _manufacturer_list })
                })
                .catch(err => {
                    console.log(err)
                })
        },
        submitFormData() {
            if (!this.validateFn()) {
                return
            }
            this.submitServer()
        },
        submitServer() {
            let _this = this
            let data = this.formData1;
            let _manufacturer_list = data.manufacturer_list
            if (_this.id_supplier && _manufacturer_list.length > 0) {
                let _names = _manufacturer_list.map(item => {
                    return item.manufacturer_name
                })
                data.manufacturer_list = [].concat(_names)
            }
            // buess imgs
            let _resArr = this.buessImg.map(item => {
                return item.img_url
            })
            data.business_license = [].concat(_resArr)

            // licence imgs
            let _resArr1 = this.licence.map(item => {
                return item.img_url
            })
            data.licence = [].concat(_resArr1)

            // authorization imgs
            let _resArr2 = this.authorization.map(item => {
                return item.img_url
            })
            data.authorization = [].concat(_resArr2)

            // 数组类型to json
            for (let key in data) {
                if (data[key] instanceof Array) {
                    data[key] = JSON.stringify(data[key])
                }
            }
            // 用户信息
            data = Object.assign({}, data)
            if (this.id_supplier) {
                data.access_token = this.accessToken
                data.username = this.userName             // 编辑供应商
                // console.log(`data:${JSON.stringify(data)}`)
                this.$api.editSup(data)
                    .then(res => {
                        if (res.data.status == 200) {
                            this.$router.push('supplier')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                data.access_token = this.accessToken
                data.username = this.userName
                this.$api.addSup(data)
                    .then((res) => {
                        if (res.data.status == 200) {
                            let _formData = Object.assign({}, this.formData1, data);
                            this.$store.commit('FORMDATA1', { data: _formData })
                            this.$router.push('supplier')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },
        validateFn() {
            if (!String(this.formData1.name).trim()) {
                this.$message.error('请输入供应商名');
                return
            }
            let reg = /^1[0-9]{10}$/;
            let value = this.formData1.mobile_phone
            // if (new RegExp(reg).test(value) == false ) {
            //   this.$message.error('请输入正确的手机号码')
            //   return
            // }
            // if(this.proImgs1.length<1 ){
            //   this.$message.error('请上传图片(营业执照/经营许可证/授权书)')
            //   return
            // }
            // if(!this.formData1.address|| !this.formData1.contact_name || !this.formData1.mobile_phone || !this.formData1.email || !this.formData1.bank_account_number ||!this.formData1.user_name || !this.formData1.bank_name){
            //   this.$message.error('请完善信息(供应商名字/对接人名字/电话/邮箱/银行卡号/户名/银行名称)')
            //   return
            // }
            return true
        },
        checkSupplier() {
            let _data = {
                access_token: this.accessToken,
                username: this.userName,
                id_supplier: this.id_supplier,
                type: 2,
                name: this.formData1.name
            }
            this.$api.getSup(_data)
                .then(res=>{
                    if(res.data.status == 200){
                        this.$message.error('该供应商已经存在')
                    }else{
                        this.$message.success('该供应商可添加')
                    }
                })
        }
    },
    computed: {
        ...mapGetters(['formData1', 'buessImg', 'licence', 'authorization', 'manufacturer_list'])
    },
    components: {
        Uploadcert,
    },
    destroyed() {
        this.$store.commit('BUESSIMG', { imgs: [] }) //营业执照
        this.$store.commit('LICENCE', { imgs: [] })          //许可证
        this.$store.commit('AUTHORIZATION', { imgs: [] })    //授权书
    }
}
</script>
<style>
.submitBtn {
	margin-top: 15px;
}
</style>