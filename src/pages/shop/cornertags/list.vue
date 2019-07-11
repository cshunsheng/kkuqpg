<template>
    <div id="tags__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'list'}"><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>角标</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addNewTags">新增角标</el-button>

        <div class="table">
            <el-table :data="tagsList" border style="width: 100%" ref="multipleTable"
                      @selection-change="">
                <el-table-column prop="created_at" width="100" label="创建时间"></el-table-column>
                <el-table-column prop="title" width="255" label="标签"></el-table-column>
                <el-table-column width="100" label="样式">
                    <template slot-scope="scope">
                        <a class="product-item" :href="scope.row.img_url">
                          <img :src="scope.row.img_url">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!-- scope.$index, scope.row -->
                    <template slot-scope="scope">
                        <el-button class="ation-btn" size="small" type="primary"
                                   @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button v-if="scope.row.active == '1'" class="ation-btn" size="small"
                                   @click="handleToggleShow(0, scope.row)">隐藏
                        </el-button>
                        <el-button type="primary" v-else-if="scope.row.active == '0'" class="ation-btn" size="small"
                                   @click="handleToggleShow(1, scope.row)">显示
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @current-change=""
                        layout="prev, pager, next"
                        :page-size="20"
                        :total="tagsList.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                username: '',
                access_token: ''
            }
        },

        computed: {
            ...mapGetters([
                'tagsList'
            ])
        },


        created() {
            this.init()
            this.getTagsList()
        },

        methods: {
            init(){
                this.username = localStorage.getItem('g_username')
                this.access_token = localStorage.getItem('g_accessToken')
            },

            getTagsList() {
                const params = {
                    access_token: this.access_token,
                    username: this.username
                }

                this.$api.cornertags_list(params).then((res)=>{
                    this.$store.commit('GETTAGSLIST', {
                        data: res.data.data.cornertags_list
                    })
                }, (err)=>{
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: 'err'
                    })
                })
            },

            addNewTags() {
                this.$router.push({path: 'edit'})
            },

            handleEdit(index, row) {
                this.$router.push({path: 'edit', query: {id: row.id}})
            },

            handleToggleShow(index, row) {
                const params = {
                    access_token: this.access_token,
                    username: this.username,
                    id: row.id,
                    active: index
                }
                this.$api.cornertags_delete(params).then((res)=>{
                    this.$store.commit('TOGGLESHOWTAGS', {
                        id: row.id
                    })
                }, (err)=>{
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: 'err'
                    })
                })

            }
        }
    }
</script>

<style lang="scss" scoped>
    #tags__container{
        .handle-del{
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
            img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }
    }

</style>
