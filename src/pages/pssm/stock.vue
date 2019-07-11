<template>
    <div class="stock">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'stock'}">
                    <i class="el-icon-menu"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>采购</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs type="border-card">
            <el-tab-pane label="采购邮件" v-if="auto_info.purchase_eamil == 1">
                <stockMail :userData="userData" :styleObj="styleObj" :supplierList="supplierList"></stockMail>
            </el-tab-pane>
            <el-tab-pane label="采购清单" v-if="auto_info.show_purchase == 1">
                <purchasingList :styleObj="styleObj" :supplierList="supplierList"></purchasingList>
            </el-tab-pane>
            <el-tab-pane label="采购统计" v-if="auto_info.show_purchase == 1">
                <purchasingStatistics :userData="userData" :styleObj="styleObj"></purchasingStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import stockMail from '@/components/pssm/stockMail.vue'
import purchasingList from '@/components/pssm/purchasingList.vue'
import purchasingStatistics from '@/components/pssm/purchasingStatistics.vue'
export default {
    data() {
        return {
            userData: null,
            auto_info: {},
            supplierList: [],
            styleObj: {
                "text-align": "center",
            },
        }
    },
    created() {
        this.init()
        this.getSupplierList()
    },
    methods: {
        init() {
            this.username = localStorage.getItem('g_username')
            this.access_token = localStorage.getItem('g_accessToken')
            this.userData = {
                access_token: this.access_token,
                username: this.username
            }
            this.auto_info = JSON.parse(localStorage.getItem('auth_info'))
        },
        //供应商列表
        getSupplierList() {
            let data = {};
            data = Object.assign({}, data, this.userData)
            this.$api.getAllSup(data).then((res) => {
                // console.log(res)
                this.supplierList = res.data.data
            }, (err) => {
                this.$message.error(res.data.msg)
            })
        },
    },
    computed: {

    },
    components: {
        stockMail,
        purchasingList,
        purchasingStatistics
    }

}
</script>
<style>
    
</style>
