<template>
    <div class="fodders">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i>推广大使
                </el-breadcrumb-item>
                <el-breadcrumb-item>推广素材</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="fodder_search">
            <el-row :gutter="15" class="box">
                <el-col :span="4">
                    <div class="add-wrap">
                        <slot name="add-btn">
                            <el-button size="medium" type="primary" @click="addNew">
                                <i class="el-icon-plus"></i>新增素材</el-button>
                        </slot>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="searchType" placeholder="条件搜索" size="medium">
                        <el-option v-for="item in cSearch" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-input size="medium" v-model="searchWords" :placeholder="searchType==1?'请输入商品名称':'请输入商品id'" @input="valueChange"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button size="medium" class="full-btn" type="primary" @click.stop="getFodderList('searchBtn')">搜索</el-button>
                </el-col>
                <el-col :span="3">
                    共计{{total}}条结果
                </el-col>
            </el-row>
            
        </div>
        <div class="fodderList">
            <el-table border ref="multipleTable" :data="generalizeFodderList">
                <el-table-column prop="created_at" label="创建时间" width="100"></el-table-column>
                <el-table-column prop="id_product" label="商品ID" width="70"></el-table-column>
                <el-table-column prop="name" label="商品名称" width="160"></el-table-column>
                <el-table-column label="分享文案" width="260">
                    <template slot-scope="scope">
                        <p class="ser-line">{{scope.row.share_description}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="分享图片" width="330">
                    <template slot-scope="scope">
                        <div class="imgList">
                            <span v-for="item in scope.row.images">
                                <img :src="item.image_url" alt="">
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='edit(scope.$index, scope.row)'>编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 翻页 -->
        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="size" :total="total" @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    data() {
        return {
            userName:'',
            accessToken:'',
            fodderList: [],
            total: 0,
            eidtProduct_id: '',
            searchWords: '',
            searchType: 1,
            cSearch:[
                {value: 1, label: "商品名称"},
                {value: 2, label: "商品ID"},
            ],
            page: 1,
            size: 10,
        }
    },
    created () {
        this.userName = localStorage.getItem('g_username');
        this.accessToken = localStorage.getItem('g_accessToken');
        this.getFodderList()
    },
    methods: {
        // 翻页
        changePage(e) {
            this.page = e;
            this.getFodderList();
        },
        getFodderList(type) {
            console.log(this.page)
            if(type === 'searchBtn') {
                this.page = 1
            }
            let _data = {
                keyword: this.searchWords,
                page: this.page,
                page_size: this.size,
                type: this.searchWords?this.searchType:''
            }
            this.$api.getFodderList(_data)
                .then(res=>{
                    let _list = res.data.data.product_list
                    this.total = res.data.data.total
                    this.$store.commit('GENERALIZEFODDERLIST',{list: _list})
                })
        },
        valueChange(value) {
            this.searchWords = value
        },
        addNew() {
            this.$router.push({path:'fodderEdit'})
        },
        edit(index, row) {
            let id  = row.id_product
            this.$router.push({path:'fodderEdit',query: {productId: id}})
        }
    },
    computed: {
        ...mapGetters([
            'generalizeFodderList'
        ])
    }
}
</script>
<style>
.fodder_search{
    margin-bottom: 20px;
}
.imgList img{
    width: 50px;
    height: 50px;
    margin-left: 1px;
}
.fodderList .ser-line{
    display:-webkit-box;
    -webkit-line-clamp:5;
    -webkit-box-orient:vertical;
    overflow:hidden;
    border: none;
}
        
</style>