<template>
    <div class="wholesale">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/admin/shop/bargain/list'}">
                <i class="el-icon-menu"></i>心跳团列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="sub-btn">
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
        <p class="rule">注：活动开始时间，结束时间，价格，规格，商品ID,团长优惠，为必填项</p>
        <!-- 拼团基本设置 -->
        <div class="groupon-set ">
            <p class="set-title">心跳团基本设置</p>
            <el-form :model="groupForm" ref="groupForm" label-width="80px" class=" basic-set">
                <div>
                    <el-form-item label="活动时间" class="w-form-time">
                        <el-col :span="12">
                            <el-date-picker type="datetime" placeholder="开始时间" v-model="groupForm.from_date" style="width: 100%;" @change="fromdateChange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker type="datetime" placeholder="结束时间" v-model="groupForm.to_date" style="width: 100%;" @change="todateChange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否上线">
                        <el-select v-model="groupForm.is_online" placeholder="是否上线">
                            <el-option v-for="s in isOnline" :key="s.value" :label="s.label" :value="s.value">
                            </el-option>
                        </el-select>
                        <span class="font-color">(默认:下线)</span>
                    </el-form-item>
                    <!-- <el-form-item label="限时拼团">
                        <el-select v-model="groupForm.is_limit_time" placeholder="是否限时拼团">
                            <el-option v-for="s in isGoupon" :key="s.value" :label="s.label" :value="s.value">
                            </el-option>
                        </el-select>
                        <span class="font-color">(是否为首页限时拼团，默认:否)</span>
                    </el-form-item> -->
                </div>
            </el-form>
        </div>
        <!-- 关联商品 -->
        <div class="groupon-set ">
            <p class="set-title">关联商品</p>
            <el-form :model="groupForm" ref="groupForm" label-width="100px" class="w-form">
                <el-form-item label="商品名称" size="medium">
                    <el-select :disabled="id_group?true:false" v-model="groupForm.name" filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="searchProduct" style="width:382px;">
                        <el-option v-for="item in filterProducts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品ID">
                    <el-input disabled v-model="groupForm.p_kkid" placeholder="选择商品名称后自动获取"></el-input>
                </el-form-item>
                <el-form-item label="售价">
                    <el-input disabled v-model="groupForm.price" placeholder="选择商品名称后自动获取">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="底价">
                    <el-input v-model="groupForm.bottom_amount" placeholder="底价">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="参团人数">
                    <el-input v-model="groupForm.part_num" placeholder="参团人数">
                        <template slot="append">人</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="拉满人数">
                    <el-input v-model="groupForm.vouchers" placeholder="拉满人数">
                        <template slot="append">人</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="团长优惠价">
                    <el-input v-model="groupForm.master_amount" placeholder="团长优惠价">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                
            </el-form>
        </div>

        <div class="groupon-set">
            <p class="set-title">分享设置</p>
            <el-form :model="groupForm" ref="groupForm" label-width="80px" class="w-form">
                <el-form-item label="分享标题">
                    <el-input v-model="groupForm.share_title" placeholder="请输入分享标题"></el-input>
                </el-form-item>
                <!-- <el-form-item label="分享描述">
                    <el-input v-model="groupForm.share_description" placeholder="请输入分享描述"></el-input>
                </el-form-item> -->
                <el-form-item label="商品描述">
                    <el-input v-model="groupForm.product_description" type="textarea" placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item label="分享图片" size="small">
                    <el-upload class="avatar-uploader" action="http://admin-api.test.kangkanghui.com/upload/file" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="groupForm.share_image" :src="groupForm.share_image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="tip">(注：点击编辑图片，图片大小为520*416，大小不超过32k)</span>
                </el-form-item>
            </el-form>
        </div>
        <el-form>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userName: '',
            accessToken: '',
            isOnline: [
                { value: 1, label: "上线" },
                { value: 0, label: "下线" }
            ],
            isGoupon: [
                { value: 1, label: "是" },
                { value: 0, label: "否" }
            ],
            value: '',
            id_group: null,
            loading: false,
            filterProducts: [],               // 过滤搜索商品列表结果
            getHours: '',
            groupForm: {
                is_online: 0,                 // 是否上下线
                name: '',
                from_date: '',                // 开始时间
                to_date: '',                  // 结束时间
                price:'',           // 市场价、上限价
                bottom_amount:'',             // 下限价
                is_limit_time:0,              // 是否是首页限时拼团
                part_num:'',                  // 已参与人数
                product_description:'',       // 商品描述
                share_description:'',         // 分享描述
                share_image:'',               // 分享图片
                share_title:'',               // 分享标题
                master_amount:'',             // 满足人数时的团长价
                vouchers:'',                  // 团长可以以团长价购买商品时需要邀请的砍价人数
                p_kkid:'',                    // 商品kkid
                id_product: '',               // 商品ID
            }
        }
    },
    created() {
        this.id_group = this.$route.query.id_group    // 编辑id_group
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        if(this.id_group){
            this.getEditInfos()
        }
    },
    methods: {
        fromdateChange(val) {
            this.groupForm.from_date = val;
        },
        todateChange(val) {
            this.groupForm.to_date = val;
        },
        //获取编辑信息
        getEditInfos() {
            this.$api.bargianInfos(this.accessToken, this.userName, this.id_group)
                .then((res) => {
                    let _resData = res.data.data
                    _resData.price = _resData.top_amount
                    this.groupForm = Object.assign({},_resData)
                })
        },
        //取消
        cancel() {
            this.$router.push({ path: '/admin/shop/bargian/list' })
        },

        // 添加商品，根据id查找商品
        searchProduct(query) {
            if (query !== '') {
                setTimeout(() => {
                    this.loading = false;
                    this.$api.searchGeneralizePro(query)
                        .then(res => {
                            if (res.data.data) {
                                let _list = [res.data.data];
                                this.groupForm.price = res.data.data.price
                                this.groupForm.p_kkid = res.data.data.kkid
                                this.filterProducts = _list.map(item => {
                                    return { value: item.id_product, label: item.name };
                                });
                            } else {
                                this.filterProducts = [];
                            }
                        })
                }, 1000);
            } else {
                this.filterProducts = [];
            }
        },
        //上传图片
        handleAvatarSuccess(res, file) {
            this.groupForm.share_image = res.data.image_url;
        },

        beforeAvatarUpload(file) {
            return true;
        },
        //新增或者编辑保存
        submitForm() {
            if(!this.checkForm()) return ;
            let _this = this
            let params = Object.assign({},this.groupForm)
            //编辑
            if (this.id_group) {
                let editParams = Object.assign(params, { id_group: this.id_group })
                this.$api.editBargain(this.accessToken, this.userName, editParams)
                    .then(res => {
                        if (res.data.status == 200) {
                            _this.$message.success('保存成功')
                            _this.$router.push({ path: '/admin/shop/bargain/list' })
                        } else {
                            _this.$message.error(res.data.msg)
                            return false;
                        }
                    })
            } else {
                //新增
                this.$api.createBargain(this.accessToken, this.userName, params)
                    .then(res => {
                        if (res.data.status == 200) {
                            _this.$message.success('新增成功')
                            _this.$router.push({ path: '/admin/shop/bargain/list' })
                        } else {
                            _this.$message.error(res.data.msg)
                            return false;
                        }
                    })
            }
        },
        checkForm() {
            let regNum = /^[0-9]\d*$/
            let floatReg = /^\d*\.{0,1}\d{0,1}$/ // 2位小数价格正则
            let vouchers = this.groupForm.vouchers  // 拉满人数
            let part_num = this.groupForm.part_num // 参团人数
            let master_amount = this.groupForm.master_amount // 团长优惠价
            let bottom_amount = this.groupForm.bottom_amount // 下限价格
            if (!this.groupForm.p_kkid) {
                this.$message.error('请输入关联商品信息')
                return false
            }
            if (!this.groupForm.from_date || !this.groupForm.to_date) {
                this.$message.error('请选择日期区间')
                return false
            }
            if (vouchers) {
                if (isNaN(vouchers)) {
                    this.$message.error('请输入正确的拉满人数')
                    return false
                }
            }
            if (part_num) {
                if (isNaN(part_num)) {
                    this.$message.error('请输入正确的参团人数')
                    return false
                }
            }
            if (!floatReg.test(master_amount)) {
                this.$message.error('输入数字且最多一位小数')
                return false
            }
            if (!floatReg.test(bottom_amount)) {
                this.$message.error('输入数字且最多一位小数')
                return false
            }
            
            if(bottom_amount >= this.groupForm.price){
                this.$message.error('低价必须小于售价')
                return false
            }

            return true;
        }
    }
}
</script>
<style lang="scss">
// .content {
//     padding: 30px 20px;
// }
.wholesale .basic-set {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
    .el-date-editor--datetime input {
        width: 218px;
    }
    .group {
        el-select {
            width: 50%;
        }
    }
    .time-rule {
        padding-left: 84px;
    }
}
.font-color {
    color: #2a88bd;
    font-size: 12px;
}
.text-rule {
    padding-left: 20px;
}
.rule {
    font-size: 12px;
    color: #2a88bd;
}
.sub-btn {
    display: flex;
    justify-content: flex-end;
}
.groupon-set {
    background: rgba(240, 240, 240, 1);
    padding: 20px 0;
    margin: 0px auto 30px;
    .set-title {
        font-size: 20px;
        color: #333;
        font-weight: bold;
        padding-left: 10px;
        padding-bottom: 20px;
    }
}
.w-form {
    width: 540px;
    margin-top: 20px;
    .w-sale-area {
        padding: 40px 0;
        font-size: 20px;
        color: #11b95c;
        font-weight: bold;
    }
    .edit-time {
        text-align: center;
    }
}
</style>
