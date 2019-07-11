<template>
    <div class="outIn">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: ''}">
                    <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>出入库记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane>
                <span slot="label">入库记录</span>
                <stockList :userData="this.userData" :styleObj="styleObj" :active="0" @updatePage="updatePage">
                </stockList>
            </el-tab-pane>
            <el-tab-pane label="出库记录">
                <stockList :userData="this.userData" :styleObj="styleObj" :active="1" @updatePage="updatePage">
                </stockList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import stockList from '@/components/stock/stockList.vue'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            userData: null,
            styleObj: {
                "text-align": "center",
            },
            active: ''
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
        },
        handleClick(tab, e) {
            let _val = tab.index
            this.updatePage(_val)
        },
        updatePage(value) {
            this.stockList = value
        },
    },
    computed: {
        ...mapGetters(
            'stockList',
            'stock_inputVal',
            'stockTotal'
        )
    },
    components: {
        stockList,
    },
}
</script>