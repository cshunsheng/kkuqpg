<template>
    <div id="home-shop__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'container'}"><i class="el-icon-menu"></i> 首页运营</el-breadcrumb-item>
                <el-breadcrumb-item>商品运营</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main">
            <div class="table">
                <el-table :data="middleImgList" border style="width: 100%">
                    <el-table-column prop="created_at" label="日期" width="100"></el-table-column>
                    <el-table-column label="模块" width="180">
                        <template slot-scope="scope">
                            <span>模块{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="模块名称" width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="图片">
                        <template slot-scope="scope">
                            <a class="product-item" :href="scope.row.img_url">
                                <img :src="scope.row.img_url">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <!-- scope.$index, scope.row -->
                        <template slot-scope="scope">
                            <el-button class="ation-btn" size="small" type="primary" @click="editModule(scope.$index, scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            
        </div>
        <div class="grouponSetting">
            <div class="wholesale-wrap">
                <el-card class="box-card">
                    <span class="w-title">限时拼团：</span>
                    <el-select class="w-select" v-model="wholesaleId" placeholder="请选择">
                        <el-option
                          v-for="item in wholesaleList"
                          :key="item.value"
                          :label="item.name"
                          :value="item.id_group">
                        </el-option>
                    </el-select>
                    <el-button class="ation-btn" size="small" type="primary" @click="wholesaleSave">保存</el-button>
                </el-card>
            </div>
            <div class="wholesale-wrap">
                <el-card class="box-card">
                    <span class="w-title">心跳团：</span>
                    <el-select class="w-select" v-model="bargainId" placeholder="请选择">
                        <el-option
                          v-for="item in bargainList"
                          :key="item.value"
                          :label="item.name"
                          :value="item.id_group">
                        </el-option>
                    </el-select>
                    <el-button class="ation-btn" size="small" type="primary" @click="bargainSetting">保存</el-button>
                </el-card>
            </div>
        </div>

        <div class="add-module-item">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewModuleShop">新增商品</el-button>
        </div>

        <!-- 各个模块商品 -->
        <div class="module-shop-wrap">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane :key="index" v-for="(item, index) in middleImgList" :label="item.name" :name="item.type">
                    <el-table :data="shopList" border style="width: 100%">
                        <el-table-column prop="name" label="商品" width="400"></el-table-column>
                        <el-table-column prop="position" label="显示顺序" width="100"></el-table-column>
                        <el-table-column label="操作" width="100">
                            <!-- scope.$index, scope.row -->
                            <template slot-scope="scope">
                                <el-button class="ation-btn" size="small" type="danger"
                                           @click="handleDelete(scope.$index, scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                access_token:'',
                username:'',
                activeName: '1',
                wholesaleId: '',
                defaultWholesle: {}                                 //当前默认在线拼团
                ,bargainId: ''
                ,bargainList: []
            }
        },

        computed: {
            ...mapGetters([
                'middleImgList',                                      //模块列表
                'shopList',                                           //模块商品列表
                'wholesaleList'
            ])
        },

        created() {
            this.init()
            this.getApostMiddleimg()
            this.getShopList()
            this.getDefaultWholesale()
            this.getWholesaleList()
            this.getBargainlist()
            this.bargainSetted()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            //获取模块
            getApostMiddleimg() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'view'
                }
                this.$api.apost_middleimg(params).then((res)=>{
                    this.$store.commit('GETMIDDLEIMGLIST', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            //获取模块商品列表
            getShopList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    shop_type: this.activeName,
                    action: 'view'
                }
                this.$api.shop_shoplist(params).then((res)=>{
                    this.$store.commit('GETSHOPLIST', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: '请选择是否上线',
                        type: 'error'
                    });
                })
            },

            //获取默认拼团商品
            getDefaultWholesale() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    action: 'view'
                }
                this.$api.groupon_getlimittime(params).then((res)=>{
                    this.defaultWholesle = res.data.data
                    this.wholesaleId = res.data.data.id_group
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },

            //获取限时拼团商品列表
            getWholesaleList() {
                const params = {
                    v: 1
                }
                this.$api.groupon_groupelist(params).then((res)=>{
                    this.$store.commit('GETWHOLESALELIST', {
                        data: res.data.data
                    })
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },
            wholesaleSave() {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    id_group: this.wholesaleId,
                    action: 'edit'
                }
                this.$api.groupon_groupedit(params).then((res)=>{
                    this.$message({
                        showClose: true,
                        message: '拼团商品保存成功',
                        type: 'success'
                    });
                }, (err)=>{
                    this.$message({
                        message: err,
                        type: 'error'
                    });
                })
            },
            /**
             * 心跳团设置
             */
            //获取心跳团在线团列表
            getBargainlist() {
                this.$api.onlineBargainlist(this.access_token,this.username)
                    .then(res=>{
                        if(res.data.status === 200){
                            this.bargainList = res.data.data
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
            },
            // 已选的心跳团信息
            bargainSetted() {
                let v = 1
                this.$api.indexBargainInfo(v)
                    .then(res=>{
                        this.bargainId = res.data.data.id_group
                    })
            },
            // 心跳团选择
            bargainSetting() {
                let _id_goup = this.bargainId
                this.$api.indexBargainSet(_id_goup)
                    .then(res=>{
                        if(res.data.status === 200){
                            this.$message.success("心跳团商品保存成功")
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
            },

            handleClick(tab, event) {
                this.getShopList()
            },

            handleDelete(index, row) {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    shop_type: this.activeName,
                    id: row.id,
                    action: 'del'
                }
                this.$api.shop_shopdel(params).then((res)=>{
                    this.$store.commit('DELETESHOPITEM', {
                        id: row.id
                    })
                }, (err)=>{
                    this.$message({
                        message: '请选择是否上线',
                        type: 'error'
                    });
                })
            },

            editModule(index, row) {
                const params = {
                    id: row.id,
                    type: row.type,
                    name: row.name,
                    img_url: row.img_url,
                }
                this.$router.push({path: 'moduleEdit', query:{params: JSON.stringify(params)}})
            },

            addNewModuleShop() {
                this.$router.push({path: 'addCom', query: {shop_type: this.activeName}})
            },

        }
    }
</script>

<style lang="scss" scoped>
    #home-shop__container {
        .main {
            display: flex;
            justify-content: space-between;
        }
        .table{
            width: 70%;
        }
        
        .product-item {
            width: 50px;
            height: 50px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .add-module-item {
          margin-top: 20px;
        }
        .module-shop-wrap {
            margin-top: 20px;
        }
        .grouponSetting{
            display: flex;
            margin: 20px 0;
            .wholesale-wrap {
                margin-right: 20px;
                width: 25%;
                font-size: 14px;
                .box-card {
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    display: flex;
                    .w-title{
                        display: block;
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    .w-select{
                        margin-bottom: 50px;
                        width: 100%;
                    }
                    .ation-btn {
                        display: block;
                    }
                }
            }
        }
    }
</style>
