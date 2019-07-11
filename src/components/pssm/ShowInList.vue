<template>
    <div class="table-list">
        <el-table border :header-cell-style="styleObj" :cell-style="styleObj" ref="multipleTable" :data="stockinList">
            <el-table-column prop="id" label="序号" width="60"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column label="规格">
                <template slot-scope="scope">
                    <p class="ser-line" v-for="(itemAttr,index) in scope.row.product_attribute_list" :key="index">
                        {{itemAttr.group_name}}:{{itemAttr.attribute_name}}
                    </p>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="date_in" label="入库时间"></el-table-column> -->
            <el-table-column label="入库数量" prop="total_num"></el-table-column>
            <el-table-column label="商品总金额" prop="total_amount"></el-table-column>
            <el-table-column label="入库人" prop="username"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
        stockinList: []
        }
    },
    props: ['userData', 'styleObj'],

    mounted () {
        this.$root.eventBus.$on('updateList', (res)=>{
            this.stockinlist()
        })
    },
    created() {
        this.stockinlist()
    },

    methods: {
        stockinlist() {
            let data = {}
            data = Object.assign({}, data, this.userData)
            this.$api.stockinlist(data).then((res) => {
                this.stockinList = res.data.data
            })
        },
    },
    destroyed() {
        this.$root.eventBus.$off('updateList', 1)
    }
}
</script>
<style>
</style>

