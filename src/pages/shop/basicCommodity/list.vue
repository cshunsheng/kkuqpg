<template>
    <div class="comboList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}">
                    <i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>基础商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <ShopNav :productList="productList" :type="0" :userData="this.userData" @updatePage="updatePage" :inputVal="inputBasicValue">
            <template slot="add-btn">
                <el-button class="full-btn" type="primary" icon="el-icon-plus" @click.stop="createdProduct">新增基础商品</el-button>
            </template>
        </ShopNav>
        <div class="table-list">
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="comboList">
                <el-table-column prop="create_ts" label="创建时间" width="200" sortable></el-table-column>
                <el-table-column prop="id_product" label="商品ID" width="80"></el-table-column>
                <el-table-column prop="product_name" label="商品名称描述" width="320"></el-table-column>
                 <el-table-column label="平台价" width="90">
                    <template slot-scope="scope">
                        <span>{{scope.row.platform_price | price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="60">
                    <template slot-scope="scope">
                        <span v-if="scope.row.active==1" class="on-status">上架</span>
                        <span v-if="scope.row.active==0" class="down-status">下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="患者端" width="70">
                    <template slot-scope="scope">
                        <span v-if="scope.row.patient_visible==1" class="on-status">上架</span>
                        <span v-if="scope.row.patient_visible==0" class="down-status">下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="医生端" width="70">
                    <template slot-scope="scope">
                        <span v-if="scope.row.doctor_visible==1" class="on-status">上架</span>
                        <span v-if="scope.row.doctor_visible==0" class="down-status">下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="关联状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_interrelated=='已关联'" class="on-association">已关联</span>
                        <span v-if="scope.row.is_interrelated=='未关联'" class="down-association">未关联</span>
                        <span v-if="scope.row.is_interrelated=='不关联'" class="on-association">不关联</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button class="" size="small" @click="toEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button class="" size="small" @click="getCode(scope.$index, scope.row)">葵花码
                        </el-button>
                        <el-button class="" size="small" @click="opRecord(scope.$index, scope.row)">操作记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="comboListTotal">
            </el-pagination>
        </div>
        <!-- 操作记录 -->
        <el-dialog title="基础商品操作记录" :visible.sync="showRecords">
            <el-form label-width="100px" label-position="left">
                <el-table :data="recordsList" border style="width: 100%" ref="multipleTable">
                    <el-table-column prop="id_product" label="商品ID"></el-table-column>
                    <el-table-column prop="name" label="商品名称"></el-table-column>
                    <el-table-column prop="operator" label="操作用户"></el-table-column>
                    <el-table-column prop="operation" label="操作内容"></el-table-column>
                    <el-table-column prop="created_at" label="时间"></el-table-column>
                </el-table>
            </el-form>
            <!-- 翻页 -->
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :current-page="record_page_num" :page-size="record_size" :total="recordTotal" @current-change="changeRecordPage">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 葵花码 -->
        <el-dialog
        :title="kuihuaName"
        :visible.sync="showKuihua"
        width="40%">
        <div style="text-align: center;"><img :src="kuihuaImg" alt=""></div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showKuihua = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import mixin from '../../../mixin/index.vue'                    // 获取商品列表
import ShopNav from '../../../components/shop/nav.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            styleObj: {
                "text-align": "center",
            },
            currentPage: 1,
            pageSize: 20,
            showRecords: false,
            recordsList: [],
            record_page_num: 1,
            record_size: 5,
            recordTotal: 0,
            recordId: null,
            kuihuaImg: '',
            kuihuaName: '',
            showKuihua: false

        }
    },
    created () {
        
    },
    mounted() {
        this.currentPage = this.$store.state.shopAdmin.basicComboListNum
        this.getComboList(this.$store.state.shopAdmin.basicComboListNum)
    },
    //进入edit
    beforeRouteLeave(to, from, next) {
        if (!to.path.endsWith('edit')) {
            this.$store.dispatch('CHANGEBASICINPUTVALUE', {
                inputBasicValue: ""
            })
        }
        next()
    },
    methods: {
        updatePage(value) {
            this.currentPage = value
        },
        changePage(e) {
            this.currentPage = e
            this.getComboList(this.currentPage, this.pageSize)
        },
        changeRecordPage(e) {
            this.record_page_num = e
            this.getRecordList()
        },
        createdProduct() {
            let _formData = {
                id_stock_product:'',
                p_kkid: '',
                type: '',                                           // 操作类型: 1新增, 2编辑
                id_product: '',                                     // 商品id - 操作类型为编辑时传0
                is_combination: 0,
                name: '',                                           // 商品名称
                madein: '',                                     // 产地
                cornertag: '',                                    // 角标
                allowed_coupon: '',                                         // 优惠券
                guige: '',                                   // 商品规格
                short_msg: '',                                // 商品特点
                id_category_arr: [],
                id_category: [],                             // 商品二级分类
                department_arr: [],
                department: [],
                product_section: [],                        // 科室
                price: '',                                 // 平台价
                wholesale_price: '',                                   // 市场价
                doc_rewards: '',                                  // 医生奖励
                ambassador_rewards: '',                       //推广大使奖励金
                active: '',                                   //商品状态（上线，下线）
                doctor_visible: '',                          // 商品状态（医生端）
                patient_visible: '',                         // 商品状态（患者端）
                position: '',                                   // 商品排序
                is_virtual: 0,
                product_sku: [],                                    // 商品sku
            }
            let _proImgs = {
                cover: [],
                images: [],
                images_detail: [],
                diploma: []
            }

            this.$store.commit('FORMDATA', { data: _formData })
            this.$store.commit('PROIMGS', { imgs: _proImgs })
            this.$router.push({ path: 'edit' })
        },
        toEdit(index, scope) {
            // console.log(scope)
            // console.log(this.currentPage)
            this.$store.commit('BASICCOMBOLISTNUM', {num: this.currentPage})
            this.$router.push({ path: 'edit', query: { productId: scope.id_product, p_kkid: scope.p_kkid, is_virtual: scope.is_virtual } })
        },
        getComboList(page_num = 1, page_size = 20) {
            // console.log(page_num)
            let data = {
                is_combination: 0,
                key_word_type: this.selectType,                  // 关键字类型: 1商品id, 2商品名称.
                key_word: this.$store.state.shopAdmin.inputBasicValue || '', // 关键字. 为空表示搜索所有
                page_num: page_num,                              // 几页
                page_size: page_size                             // 每页数量
            };
            this.$api.pmBaselist(data).then((res) => {
                let _list = res.data.data.product_list;
                this.$store.commit('COMBOLIST', { list: _list })
                this.$store.commit('COMBOLISTTOTAL', { total: Number(res.data.data.total_num) })
            })
        },
        opRecord(index, scope) {
            this.showRecords = true;
            this.recordId = scope.id_product;
            this.getRecordList();
        },
        getCode(index, scope) {
            let _kkid = scope.p_kkid
            this.showKuihua = true;
            this.kuihuaName = '商品名称：' + scope.product_name
            this.$api.kuihua(_kkid,300)
                .then(res=>{
                    this.kuihuaImg = res.data.data.url
                })
        },
        getRecordList() {
            let data = {
                id_product: this.recordId,
                page_num: this.record_page_num,
                page_size: this.record_size
            }
            this.$api.pmBaseoperationlist(data)
                .then((res) => {
                    this.recordsList = res.data.data.operation_list
                    this.recordTotal = Number(res.data.data.total_num)
                })
        },
        closeRecord() {
            this.showRecords = false;
        }
    },
    destroyed() {
    },
    computed: {
        ...mapGetters([
            'comboList',
            'selectType',
            'inputBasicValue',
            'comboListTotal',
            'basicComboListNum'
        ])   
    },
    components: {
        ShopNav
    },
    mixins: [mixin],
}
</script>
<style>
.on-status{
    color:#1E90FF;
}
.down-association,
.down-status{
    color:#CD4F39;
}
.on-association {
    color: black;
}
</style>