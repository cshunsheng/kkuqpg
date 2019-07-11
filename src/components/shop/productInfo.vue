<template>
    <div id="base-info__container">
        <el-row :gutter="15">
            <el-col :span="12">
                <el-card class="box-card">
                    <el-form ref="leftForm" :label-position="labelPosition" label-width="100px" :model="formData" :rules="rules">
                        <!-- product name -->
                        <el-form-item label="商品属性" v-if="combination==0">
                            <el-select v-model="formData.is_virtual" :disabled='isVirtual==1' clearable size="small" placeholder="请选择" @change="changeVirtual">
                                <el-option v-for="item in shopAttrs" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>      
                        </el-form-item>
                        <el-form-item label="关联进销存" v-if="combination==0">
                            <el-select v-model="formData.id_stock_product" :disabled='cantEidtStock||formData.is_virtual?true:false'  size="small" placeholder="请选择" filterable clearable :filter-method="filterMethod" @clear="clearName"> 
                                <el-option v-if="cantEidtStock" v-for="(item,index) in basicNameList" :key="index" :label="'(ID=' + item.id_stock_product +')'+item.name" :value="item.id_stock_product"></el-option>
                                <el-option v-if="!cantEidtStock" v-for="item in basicList" :key="item.id_stock_product" :label="'(ID=' + item.id_stock_product +')'+item.name" :value="item.id_stock_product"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="商品名称" prop="id_stock_product" v-if="combination==0">
                            <el-autocomplete style="width:100%;" class="block-input" v-model="formData.id_stock_product" value-key="name" :fetch-suggestions="querySearch1" placeholder="请输入内容" @select="handleSelect">
                            </el-autocomplete>
                        </el-form-item> -->
                        <el-form-item label="商品名称描述" prop="name" v-if="combination==0">
                            <el-input style="width:100%;" class="block-input" v-model.trim="formData.name" maxlength="50" value-key="name" placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="name" v-if="combination==1">
                            <el-input style="width:100%;" class="block-input" v-model.trim="formData.name" maxlength="50" value-key="name" placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                        <!-- province -->
                        <el-form-item label="产地">
                            <el-select v-model="formData.madein" clearable placeholder="请选择">
                                <el-option v-for="item in provenanceList" :key="item.id_country" :label="item.name" :value="item.id_country">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- corner mark -->
                        <el-form-item label="角标">
                            <el-select v-model="formData.cornertag" clearable placeholder="请选择">
                                <el-option v-for="item in cornertagsList" :key="item.id" :label="item.title" :value="item.id">
                                    <span style="float: left">{{ item.title }}</span>
                                    <span style="float: right;position: relative;width:20px;height:100%">
                                        <img :src="item.img_url" style="position: absolute; top:50%; margin-top: -10px; width: 100%; height: 20px;" />
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- coupon able -->
                        <el-form-item label="优惠券">
                            <el-select v-model="formData.allowed_coupon" clearable placeholder="请选择">
                                <el-option v-for="s in couponStatus" :key="s.value" :label="s.label" :value="s.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- product spec -->
                        <el-form-item label="规格">
                            <el-input v-model="formData.guige" placeholder="请输入商品规格"></el-input>
                        </el-form-item>
                        <!-- product feature -->
                        <el-form-item label="商品特点">
                            <el-input type="textarea" v-model="formData.short_msg"></el-input>
                        </el-form-item>
                        <!-- product reclassify -->
                        <el-form-item label="商品分类">
                            <!-- <el-select v-model="formData.id_category_arr" multiple placeholder="商品分类">
                                <el-option v-for="p in classifyList" :key="p.id_category" :label="p.name" :value="p.id_category">
                                </el-option>
                            </el-select> -->
                            <ul class="categoryList">
                                <li v-for="(cly,index) in formData.id_category_arr" :key="index">{{cly.parent_name}}/{{cly.child_name}}
                                    <i class="el-icon-circle-close" @click.stop="deleteCategory(index)"></i>
                                </li>
                            </ul>
                            <el-button size="small" @click.stop="addClassify">+</el-button>
                        </el-form-item>
                        <!-- product reclassify -->
                        <el-form-item label="科室">
                            <el-select v-model="formData.department_arr" multiple placeholder="请选择">
                                <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库存">
                            <el-input type="text" v-model="formData.quantity"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <el-form ref="rightForm" :label-position="labelPosition" label-width="80px" :model="formData">
                        <!-- platform_price -->
                        <el-form-item label="平台价" prop="platform_price">
                            <el-input placeholder="请输入内容" v-model="formData.price" :disabled="priceStatus">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <!-- market_price -->
                        <el-form-item label="市场价" prop="market_price">
                            <el-input placeholder="请输入内容" v-model="formData.wholesale_price" :disabled="priceStatus">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <!-- doctor_reward -->
                        <el-form-item label="医生奖励">
                            <el-input placeholder="请输入内容" v-model="formData.doc_rewards">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="推广大使奖励" class="label-font">
                            <el-input placeholder="请输入内容" v-model="formData.ambassador_rewards">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="formData.active" clearable placeholder="请选择">
                                <el-option v-for="s in proStatus" :key="s.value" :label="s.label" :value="s.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医生端">
                            <el-select v-model="formData.doctor_visible" clearable placeholder="请选择">
                                <el-option v-for="s in doctorPlateform" :key="s.value" :label="s.label" :value="s.value">
                                </el-option>
                            </el-select>
                            <p style="font-size: 12px; color:#999;">注意：请将商品信息填写完成后再上架</p>
                        </el-form-item>
                        <!-- product_status_patient -->
                        <el-form-item label="患者端">
                            <el-select v-model="formData.patient_visible" clearable placeholder="请选择">
                                <el-option v-for="s in patientPlateform" :key="s.value" :label="s.label" :value="s.value">
                                </el-option>
                            </el-select>
                            <p style="font-size: 12px; color:#999;">注意：请将商品信息填写完成后再上架</p>
                        </el-form-item>
                        <!-- product_sort -->
                        <el-form-item label="商品排序">
                            <el-input placeholder="请输入内容" v-model="formData.position"></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <!-- 编辑 -->
        <el-dialog title="添加商品分类" :visible.sync="showClassify">
            <el-form label-width="120px">
                <el-form-item label="一级分类">
                    <el-select v-model="id_category_first" placeholder="一级分类" @change="changeFirstCategory">
                        <el-option v-for="p in classifyList" :key="p.id_category" :label="p.name" :value="p.id_category">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select v-model="id_category_sec" placeholder="二级分类" @change="changeSecontCategory">
                        <el-option v-for="s in classifyChilds" :key="s.id_category" :label="s.name" :value="s.id_category">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
    props: [
        'rules',
        'productList',
        'provenanceList',
        'cornertagsList',
        'classifyList',
        'departmentList',
        'combination',
        'userData',
        'basicNameList',
        'cantEidtStock',
        'priceStatus',
        'isVirtual',
    ],

    data() {
        return {
            basicList: [],
            labelPosition: 'right',
            inputValue: '',
            showClassify: false,  // 显示选择商品分类popup
            classifyRes: [],     // 商品分类popup选择返回值
            id_category_first: null, // 一级分类
            id_category_sec: null,  // 二级分类
            classifyChilds: [], // 二级分类列表
            chooseCategory: {
                id_parent: null,
                parent_name: '',
                id_child: null,
                child_name: ''
            },
            hasSecondCategory: true,
            //商品属性
            shopAttrs: [
                { value: 0, label: "实物" },
                { value: 1, label: "虚拟" }
            ],
            // 商品状态
            proStatus: [
                { value: 1, label: "上架" },
                { value: 0, label: "下架" }
            ],
            // 医生端
            doctorPlateform: [
                { value: 1, label: "上架" },
                { value: 0, label: "下架" }
            ],
            // 患者端
            patientPlateform: [
                { value: 1, label: "上架" },
                { value: 0, label: "下架" }
            ],
            // 是否可用优惠券
            couponStatus: [
                { value: 1, label: "可用" },
                { value: 0, label: "不可用" }
            ],
            proList:[]
        }
    },

    created() {
        this.querySearch1()
        this.filterMethod('')
    },

    methods: {
        changeVirtual(){
            if (!this.isVirtual&&this.formData.is_virtual==1) {
                this.formData.id_stock_product =''
            }
        },
        filterMethod(query) {
            let _data = {
                username: localStorage.getItem('g_username'),
                access_token: localStorage.getItem('g_accessToken'),
                keywords: query
            }
            this.$api.baseNames(_data)
            .then(res=>{
                this.basicList = res.data.data   
                })
        },
        clearName(){
            let _data = {
                username: localStorage.getItem('g_username'),
                access_token: localStorage.getItem('g_accessToken'),
                keywords: ''
            }
            this.$api.baseNames(_data)
            .then(res=>{
                this.basicList = res.data.data   
                })
        },
        querySearch1(queryString, cb) {
            let data = {
                
            }
            data = Object.assign({}, data, this.userData)
            this.$api.getStockList(data).then((res) => {
                this.proList = res.data.data.product_list
            })
            /* const proList = this.proList
            const results = queryString ? proList.filter(this.createFilter(queryString)) : proList;
            // 调用 callback 返回建议列表的数据
            cb(results); */
        },
        querySearch(queryString, cb) {
            const productList = this.productList
            const results = queryString ? productList.filter(this.createFilter(queryString)) : productList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.name.toLowerCase().includes(queryString.toLowerCase()));
            }
        },
        handleSelect(e) {
            // console.log(e)
        },
        // 显示选择商品分类popup
        addClassify() {
            this.showClassify = true
        },
        saveAdd() {
            if (!this.chooseCategory.id_parent) {
                this.$message.error('请选择一级分类')  // 如果有二级分类没有选，tip
                return;
            }
            if (this.hasSecondCategory) {  // 如果一级分类下有二 级分类
                let _choose = JSON.parse(JSON.stringify(this.chooseCategory));
                if (_choose.id_child) { // 有选择二级分类
                    let _arr = [_choose]
                    // this.formData.id_category_arr = this.formData.id_category_arr.concat(_arr);  // 将选择的分类推入显示数组中
                    this.formData.id_category_arr = [...this.formData.id_category_arr, ..._arr];
                    // 重置上一次选择的分类为null，以免重复添加
                    this.chooseCategory.id_child = null

                    // 重置popup中数据
                    this.id_category_first = null;
                    this.id_category_sec = null;

                    // 关闭对话框
                    this.showClassify = false;
                } else {
                    this.$message.error('请选择二级分类')  // 如果有二级分类没有选，tip
                }
            } else {
                this.$message.warning('添加失败：该分类无二级分类');  // 没有二级分类，如何处理，需要确认
                this.showClassify = false;
            }


        },
        cancelAdd() {
            this.id_category_first = null
            this.id_category_sec = null

            this.chooseCategory.id_child = null
            this.classifyChilds = [];
            this.showClassify = false;
        },
        changeFirstCategory(e) {
            // 重置二级分类列表为空
            this.classifyChilds = []
            // 选择一级分类，获取二级分类列表
            let _firstCategory = this.classifyList.find(item => {
                return item.id_category === e
            })

            // 设置选择分类相关数据
            this.chooseCategory.id_parent = e;
            this.chooseCategory.parent_name = _firstCategory.name
            this.chooseCategory.id_child = null;
            this.chooseCategory.child_name = '';

            // 如果有二级分类，赋值二级列表用以选取
            if (_firstCategory.child_all.length > 0) {
                this.hasSecondCategory = true;
                this.classifyChilds = [].concat(_firstCategory.child_all)
            } else {
                this.hasSecondCategory = false
            }

        },
        // 选择二级分类， 设置选取的相关数据给显示数组
        changeSecontCategory(e) {
            let _secondCategory = this.classifyChilds.find(item => {
                return item.id_category === e
            })
            this.chooseCategory.id_child = e;
            this.chooseCategory.child_name = _secondCategory.name;
        },
        deleteCategory(index) {
            let _inx = index
            this.formData.id_category_arr.splice(_inx, 1)
        }

    },
    computed: {
        ...mapGetters(['formData']),

    },

}
</script>

<style scoped>
.categoryList li {
	display: inline-block;
	padding: 5px 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-sizing: border-box;
	line-height: 20px;
	margin-right: 10px;
}
.categoryList li i {
	cursor: pointer;
}

.categoryList li:hover {
	border-color: #20a0ff;
	background-color: #eaf6ff;
}
</style>
