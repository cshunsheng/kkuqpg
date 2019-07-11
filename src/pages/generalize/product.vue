<template>
    <div class="generalizeProducts">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin/generalize/accounts'}">
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item>商品选品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="productsWrap">
            <div class="productHeader">
                <div class="prosNum">当前共计：{{total}}款商品在售</div>
                <div class="proAdd">
                    <el-button @click="addProduct">新增商品</el-button>
                </div>
            </div>
            <ul class="productsList tableList">
                <li>
                    <span>时间</span>
                    <span>商品ID</span>
                    <span>商品名称</span>
                    <span>分类</span>
                    <span>平台价</span>
                    <span>市场价</span>
                    <span>奖励金</span>
                    <span>商品状态</span>
                    <span>操作</span>
                </li>
                <li class="listLine" v-for="(item,index) in generalizeProductList">
                    <span>{{item.created_at}}</span>
                    <span>{{item.id_product}}</span>
                    <span>{{item.p_info.name}}</span>
                    <span>{{item.category_name}}</span>
                    <span>￥{{item.p_info.price}}</span>
                    <span>￥{{item.p_info.wholesale_price}}</span>
                    <span>￥{{item.p_info.reward}}</span>
                    <span>{{item.p_info.active==0?'下线':'上线'}}</span>
                    <!-- <span><i @click.stop="deleteProduct(item.id_product, index)">删除</i></span> -->
                    <span>
                        <i @click.stop="stickProduct(item.id)">置顶</i>
                        <i @click.stop="deleteProduct(item.id_product, index)">删除</i>
                    </span>
                </li>
            </ul>
            <!-- 翻页 -->
            <div class="pagin">
                <el-pagination background layout="prev, pager, next" :page-size="size" :total="total" @current-change="changePage">
                </el-pagination>
            </div>

            <!-- 添加商品 -->
            <el-dialog title="添加商品" :visible.sync="showAdd">
                <el-form label-width="80px" label-position="left" class="p-form">
                    <div class="wrap">
                        <span class="lable-txt">商品名称</span>
                        <el-select v-model="addProductId" size="medium" clearable filterable class="el-input-text" placeholder="请输入商品名称">
                            <el-option v-for="(item, index) in filterProducts" :key="index" :label="item.name" :value="item.id_product">
                                <span>{{item.name}}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <el-form-item label="商品名称">
                        <el-select :span="24" v-model="addProductId" clearable filterable placeholder="请输入商品名称" :remote-method="searchProduct" :loading="loading">
                            <el-option v-for="item in filterProducts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="商品分类" size="large">
                        <el-select v-model="id_category" placeholder="商品分类" value-key="name" @click.native="searchProduct()">
                            <el-option v-for="item in sortProduct" :key="item.id_category" :label="item.name" :value="item.id_category">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click.stop="saveAdd">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    created() {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getProductList()

    },
    data() {
        return {
            page: 1,
            size: 0,
            total: 0,
            showAdd: false,  // 显示编辑添加商品框
            addProductId: null, // 添加商品id
            filterProducts: [], // 过滤搜索商品列表结果
            loading: false,
            sortProduct: [],
            name: '',
            id_category: '',
            id_doc: 2
        }
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getProductList();
        },
        // 获取在售商品列表
        getProductList() {
            this.$api.generalizeProductList(this.accessToken, this.userName, this.page)
                .then(res => {
                    let resData = res.data.data
                    this.$store.commit('GENERALIZEPRODUCTLIST', { list: resData.product_list })
                    this.total = resData.total
                    this.size = res.data.data.page_size
                })
        },
        // 弹出添加商品编辑框
        addProduct() {
            this.getTotalProduct()

            this.showAdd = true;
            this.addProductId = ''
            this.sortProduct = []
            this.filterProducts = []
            this.id_category = ''
        },
        // 取消
        cancelAdd() {
            this.showAdd = false;
            this.addProductId = ''
            this.sortProduct = []
            this.filterProducts = []
            this.id_category = ''
        },
        // 添加商品
        saveAdd() {
            if (!this.id_category) {
                this.$message.error('请填写商品分类')
                return
            }
            this.$api.addGeneralizeProduct(this.accessToken, this.userName, this.addProductId, this.id_category)
                .then(res => {
                    if (res.data.status === 200) {
                        // hide popup
                        this.$message.success(res.data.msg)
                        this.showAdd = false;
                        this.addProductId = null;
                        this.getProductList();
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        // 添加商品，根据id查找商品
        // searchProduct(query) {
        //     if (query !== '') {
        //         this.loading = true;
        //         setTimeout(() => {
        //             this.loading = false;
        //             this.$api.searchGeneralizePro(query)
        //                 .then(res => {
        //                     this.loading = false;
        //                     if (res.data.data) {
        //                         let _list = [res.data.data];
        //                         this.filterProducts = _list.map(item => {
        //                             this.getCategoryList(item.id_product)
        //                             return { value: item.id_product, label: item.name };
        //                         });
        //                     } else {
        //                         this.filterProducts = [];
        //                     }
        //                 })
        //         }, 1000);
        //     } else {
        //         this.filterProducts = [];
        //     }
        // },
        searchProduct() {
            console.log(1)
            this.getCategoryList(this.addProductId)
        },

        // 删除商品
        deleteProduct(id, index) {
            this.$api.editGeneralizeProduct(this.accessToken, this.userName, 'delete', id)
                .then(res => {
                    if (res.status === 200) {
                        this.generalizeProductList.splice(index, 1)
                    }
                })
        },
        // 置顶商品
        stickProduct(id, index) {
            this.$api.productStick(this.accessToken, this.userName, id)
                .then(res => {
                    if (res.status == 200) {
                        this.$message.success(res.data.msg)
                        this.getProductList()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        //商品分类
        getCategoryList(id_product) {
            this.$api.getCategoryList(this.accessToken, this.userName, id_product)
                .then(res => {
                    if (res.status == 200) {
                        this.sortProduct = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        //商品列表
        getTotalProduct() {
            this.$api.department_productlist(this.id_doc).then((res) => {
                this.filterProducts = res.data.data
            }, (err) => {
                this.$message.error(res.data.msg)
            })
        },
    },
    computed: {
        ...mapGetters([
            'generalizeProductList'
        ])
    }
}
</script>
<style lang="scss" scoped>
@import url('../../../static/css/tableStyle.css');
.productHeader {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	color: #666;
	margin-bottom: 10px;
}
.productHeader .prosNum {
	line-height: 40px;
}
.p-form .el-input--suffix .el-input__inne {
	width: 400px;
}
.wrap {
	margin-bottom: 20px;
	.lable-txt {
		padding-right: 20px;
	}
	.el-input-text {
		width: 400px;
	}
}
</style>
