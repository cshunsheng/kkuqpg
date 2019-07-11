<template>
    <div id="banner-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>banner运营</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="table">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewbanner">新增banner
                </el-button>
            </div>
            <el-table :data="bannerList" border style="width: 100%" ref="multipleTable"
                      @selection-change="">
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="created_at" label="日期" sortable width="100">
                </el-table-column>
                <el-table-column prop="id" label="senceId" width="80">
                </el-table-column>
                <el-table-column prop="imgurl" label="展示图" width="120">
                    <template slot-scope="scope">
                        <a class="product-item" :href="scope.row.imgurl">
                            <img :src="scope.row.imgurl">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="链接/商品id">
                    <template slot-scope="scope">
                        <a v-if="scope.row.act_url" :href="scope.row.act_url">{{scope.row.act_url}}</a>
                        <a :href="'https://shop.kangkanghui.com/detail/' + scope.row.id_product" v-else>{{scope.row.id_product}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="pos" label="显示顺序">
                </el-table-column>
                <el-table-column prop="active" label="是否上线">
                </el-table-column>
                <el-table-column prop="description" label="备注">
                </el-table-column>
                <el-table-column prop="share_title" label="分享标题">
                </el-table-column>
                <el-table-column prop="share_img" label="分享图片" width="120">
                    <template slot-scope="scope">
                        <a class="product-item" :href="scope.row.share_img">
                            <img :src="scope.row.share_img">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!-- scope.$index, scope.row -->
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="small"
                                   @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button class="ation-btn" size="small" type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change=""
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="bannerList.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: '',
            }
        },

        created() {
            this.init()
            this.getBannerList()
        },

        computed: {
            ...mapGetters([
                'bannerList',                                     //banner列表
            ])
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getBannerList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'view'
                }
                this.$api.apost_list(params).then((res)=>{
                    this.$store.commit('GETBANNERLIST', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            addNewbanner() {
                this.$router.push({path: 'edit'})
            },

            handleEdit(index, row) {
                this.$router.push({path: 'edit', query: {banner_id: row.id}})
            },

            handleDelete(index, row) {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'del',
                    id: row.id
                }
                this.$api.apost_del(params).then((res)=>{
                    this.$store.commit('DELETEBANNER', {
                        id: row.id
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    #banner-list__container{
        .handle-del {
          margin-bottom: 20px;
        }
        .ation-btn {
            display: inline-block;
            margin-left: 0;
        }
        .ation-btn:first-child{
            margin-right: 10px;
            margin-bottom: 5px;
        }
        .product-item {
            display: block;
            img{
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
