<template>
    <div class="wholesale">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path: '/admin/shop/wholesale/list'}">
                <i class="el-icon-menu"></i>拼团商品列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>新增/编辑拼团商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="sub-btn">
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
        <p class="rule">注：活动开始时间，结束时间，价格，商品ID,是否包邮为必填项</p>
        <!-- 拼团基本设置 -->
        <div class="groupon-set ">
            <p class="set-title">拼团基本设置</p>
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
                    <el-form-item label="成团人数">
                        <el-input v-model="groupForm.vouchers" placeholder="至少2人" style="width:50%;"></el-input>
                        <span class="font-color">(至少2人)</span>
                    </el-form-item>
                    <el-form-item label="每人限购">
                        <el-input v-model="groupForm.limit_quantity" placeholder="请填入每人限购数" style="width:50%;">
                        </el-input>
                        <span class="font-color">(-1代表不限购)</span>
                    </el-form-item>
                    <el-form-item label="是否包邮">
                        <el-radio-group v-model="groupForm.is_postage_free">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>

                <div class="group">
                    <el-form-item label="参团限制">
                        <el-select v-model="groupForm.limit_new" placeholder="请选择参团限制">
                            <el-option v-for="s in limitNewStatus" :key="s.value" :label="s.label" :value="s.value">
                            </el-option>
                        </el-select>
                        <span class="font-color">(所有人可参团／仅限新人参团)</span>
                    </el-form-item>
                    <el-form-item label="价格限制">
                        <el-select v-model="groupForm.is_same_price" placeholder="请选择价格限制">
                            <el-option v-for="s in samePriceStatus" :key="s.value" :label="s.label" :value="s.value">
                            </el-option>
                        </el-select>
                        <span class="font-color">(所有人价格相同／团长团员价格不同)</span>
                    </el-form-item>
                    <el-form-item label="拼团状态">
                        <el-select v-model="groupForm.is_online" placeholder="请选择拼团状态">
                            <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
                            </el-option>
                        </el-select>
                        <span class="font-color">(上线／下线，默认情况下保存的是下线)</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 关联商品 -->
        <div style="margin: 20px 0;">
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="关联商品" name="infos">
                    <el-form :model="groupForm" ref="groupForm" label-width="100px" class="w-form">
                        <el-form-item label="商品名称" size="medium">
                            <el-select @change="getAttrs" v-model="groupForm.name" filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="searchProduct" style="width:382px;">
                                <el-option v-for="item in filterProducts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品ID">
                            <el-input disabled v-model="groupForm.p_kkid" placeholder="选择商品名称后自动获取"></el-input>
                        </el-form-item>
                        <el-form-item label="市场价">
                            <el-input disabled v-model="groupForm.wholesale_price" placeholder="选择商品名称后自动获取">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                            <el-input v-model="groupForm.virtual_inventory" placeholder="商品数量">
                                <template slot="append">件</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="团长价格">
                            <el-input  :disabled="discount_amount_status" v-model="groupForm.discount_amount" placeholder="团长价格">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="参团价格">
                            <el-input  :disabled="groupForm.is_same_price=='1'||discount_amount_status" v-model="groupForm.take_part_amount" placeholder="参团价格">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="已成团数">
                            <el-input v-model="groupForm.part_num" placeholder="已成团数">
                                <template slot="append">单</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="分享标题">
                            <el-input v-model="groupForm.share_title" placeholder="请输入分享标题"></el-input>
                        </el-form-item>
                        <el-form-item label="分享描述">
                            <el-input v-model="groupForm.share_description" placeholder="请输入分享描述"></el-input>
                        </el-form-item>
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
                </el-tab-pane>
                <el-tab-pane label="规格" name="sku" :disabled="!id_group">
                    <el-table border :data="attrbuitList">
                        <el-table-column prop="attribute_str" label="规格"></el-table-column>
                        <el-table-column  label="团长价">
                            <template slot-scope="scope">
                                <el-input size="mini" :value="scope.row.discount_amount" v-model="scope.row.discount_amount" @change='qunSet(scope.row)'></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="参团价">
                            <template slot-scope="scope">
                                <el-input size="mini" :value="scope.row.take_part_amount" v-model="scope.row.take_part_amount" @change='qunSet(scope.row)' :disabled="take_part_amount_status"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template slot-scope="scope">
                                <el-select :class="{fontColor:scope.row.visible==1}" v-model="scope.row.visible" placeholder="状态" size="mini" @change='qunSet(scope.row)'>
                                    <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="虚拟库存">
                            <template slot-scope="scope">
                                <el-input size="mini" :value="scope.row.virtual_inventory" v-model="scope.row.virtual_inventory" @change='qunSet(scope.row)'></el-input>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作">
                            <el-button size="mini" @click="editSku">编辑</el-button>
                        </el-table-column> -->
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 自动拼团设置 -->
        <div class="groupon-set">
            <p class="set-title">自动拼团设置</p>
            <el-form :model="groupForm" ref="groupForm" label-width="80px" class="w-form">
                <el-form-item label="自动成团">
                    <el-select v-model="groupForm.is_auto_finish" placeholder="请选择是否自动成团" style="width:40%;">
                        <el-option v-for="s in autoStatus" :key="s.value" :label="s.label" :value="s.value">
                        </el-option>
                    </el-select>
                    <span class="font-color">(开启／关闭，默认情况下保存的是关闭)</span>
                </el-form-item>
                <el-form-item label="剩余人数">
                    <el-input v-model="groupForm.limited_vouchers" placeholder="1" style="width:50%;"></el-input>
                    <span class="font-color">(默认是1,可编辑)</span>
                </el-form-item>
                <el-form-item label="剩余时间">
                    <el-input v-model="groupForm.limited_time" placeholder="20分钟" style="width:50%;"></el-input>
                    <span class="font-color">(默认是20min,可编辑)</span>
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
            cStatus: [
                { value: 1, label: "上线" },
                { value: 0, label: "下线" }],
            autoStatus: [
                { value: 1, label: "开启" },
                { value: 0, label: "关闭" }],
            samePriceStatus: [
                { value: 1, label: "所有人价格相同" },
                { value: 0, label: "团长团员价格不同" }],
            limitNewStatus: [
                { value: 1, label: "仅限新人参团" },
                { value: 0, label: "所有人可参团" }],
            value: '',
            id_group: '',
            loading: false,
            filterProducts: [], // 过滤搜索商品列表结果
            getHours: '',
            groupForm: {
                is_online: '',      //是否上下线
                is_auto_finish: '', //是否自动成团
                id_product: '',    //商品ID
                p_kkid: '',
                wholesale_price: '',
                p_kkid: '',
                share_image: '',
                name: '',
                //拼团基本设置
                from_date: '',        //开始时间
                to_date: '',          //结束时间
                vouchers: '',         //成团人数
                limit_new: '',        //参团限制
                is_same_price: '',    //价格限制
            },
            attrbuitList: [],  // 规格列表
            productId:'',
            activeName: 'infos',
            onlineStatus: [
                { value: 1, label: "上线" },
                { value: 0, label: "下线" }
            ],
            discount_amount_status: false,
            take_part_amount_status: false,
        }
    },
    computed: {
        // 登陆用户
        username() {
            let username = localStorage.getItem('g_username')
            return username || this.userName
        }
    },
    created() {
        this.id_group = this.$route.query.id_group                  // id_group
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getGrouponView()
    },
    methods: {
        getAttrs() {
            if(!this.id_group){
                return ;
            }
            let _data = {
                username: this.userName,
                access_token: this.accessToken,
                id_product: this.groupForm.id_product,
                is_combination: '',
                id_group:this.id_group
            }
            this.$api.specList(_data)
                .then(res=>{
                    this.attrbuitList = res.data.data
                    let flag = this.attrbuitList.some(v => v.visible == 1)
                    // console.log(flag)
                    this.discount_amount_status = flag?true:false
                })
        },
        fromdateChange(val) {
            this.groupForm.from_date = val;
        },
        todateChange(val) {
            this.groupForm.to_date = val;
        },
        //获取拼团详情
        async getGrouponView() {
            if (this.id_group) {
                let _resData = await this.$api.getGroupSet(this.accessToken, this.id_group, this.userName)
                this.groupForm = _resData.data.data
                this.take_part_amount_status = _resData.data.data.is_same_price == 1?true : false;
                this.getAttrs();
            }
        },
        //取消
        cancel() {
            this.$router.push({ path: '/admin/shop/wholesale/list' })
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
                            this.groupForm.wholesale_price = res.data.data.wholesale_price
                            this.groupForm.p_kkid = res.data.data.kkid
                            this.groupForm.productId = res.data.data.id_product
                            this.filterProducts = _list.map(item => {
                                return { value: item.id_product, label: item.name };
                            });
                            // this.productId = res.data.data.id_product
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
            let reg = /^[0-9]*[2-9][0-9]*$/
            let limit_reg = /^[-1-9]\d*$/
            let regNum = /^[0-9]\d*$/
            let value = this.groupForm.vouchers
            let limit_value = this.groupForm.limit_quantity
            let virtual_inventory = this.groupForm.virtual_inventory
            if (!this.groupForm.p_kkid) {
                this.$message.error('请输入关联商品信息')
                return false
            } else if (!this.groupForm.from_date || !this.groupForm.to_date) {
                this.$message.error('请输入拼团基本设置')
                return false
            } else if (value) {
                if (isNaN(value)) {
                this.$message.error('请输入正确的成团人数')
                return false
                }
            }
            if (limit_value && new RegExp(limit_reg).test(limit_value) == false) {
                this.$message.error('请输入正确的每人限购数量')
                return false
            }
            if (virtual_inventory) {
                if (isNaN(virtual_inventory)) {
                this.$message.error('请输入正确的库存数')
                return false
                }
            }
            let _this = this
            let params = {
                access_token: this.accessToken,
                username: this.userName,
                discount_amount: this.groupForm.discount_amount,
                from_date: this.groupForm.from_date,
                to_date: this.groupForm.to_date,
                is_auto_finish: this.groupForm.is_auto_finish,
                is_online: this.groupForm.is_online,
                is_same_price: this.groupForm.is_same_price,
                virtual_inventory: this.groupForm.virtual_inventory,
                limit_new: this.groupForm.limit_new,
                limit_quantity: this.groupForm.limit_quantity,
                limited_time: this.groupForm.limited_time,
                limited_vouchers: this.groupForm.limited_vouchers,
                p_kkid: this.groupForm.p_kkid,
                part_num: this.groupForm.part_num,
                product_description: this.groupForm.product_description,
                share_description: this.groupForm.share_description,
                share_image: this.groupForm.share_image,
                share_title: this.groupForm.share_title,
                take_part_amount: this.groupForm.take_part_amount,
                vouchers: this.groupForm.vouchers,
                is_postage_free: this.groupForm.is_postage_free
            }
            //编辑
            if (this.id_group) {
                let newParams = Object.assign(params, { id_group: this.id_group })
                // console.log(newParams)
                this.$api.editGroupSet(newParams)
                .then((res) => {
                    if (res.data.status == 200) {
                    _this.$router.push({ path: '/admin/shop/wholesale/list' })
                    } else {
                    _this.$message.error(res.data.msg)
                    return false;
                    }
                })
            } else {
                //新增
                this.$api.addGroupProduct(params)
                .then((res) => {
                    if (res.data.status == 200) {
                    _this.$message.success('新增成功')
                    _this.$router.push({ path: '/admin/shop/wholesale/list' })
                    } else {
                    _this.$message.error(res.data.msg)
                    return false;
                    }
                })
            }
        },
        qunSet(scope) {
            if(scope.discount_amount===''){
                this.$message.error('请输入团长价格 ')
                return
            }
            if(scope.take_part_amount===''){
                this.$message.error('请输入参团价格')
                return
            }
            if(scope.virtual_inventory===''){
                this.$message.error('请输入虚拟库存')
                return
            }
            let _data = {
                access_token: this.accessToken,
                username: this.userName,
                visible: scope.visible,
                discount_amount: scope.discount_amount,
                take_part_amount: scope.take_part_amount,
                virtual_inventory: scope.virtual_inventory,
                id: scope.id
            };


            this.$api.editCouponSku(_data)
                .then(res => {
                    if (res.data.status == 200) {
                        this.$message.success('修改成功')
                        this.getAttrs()
                        this.getGrouponView()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
    }
}
</script>
<style lang="scss">
// .content {
// 	padding: 30px 20px;
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
.wholesale .fontColor .el-input--mini .el-input__inner {
  color: #20a0ff;
}
</style>
