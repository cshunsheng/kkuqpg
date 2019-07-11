<template>
    <div id="per-shop-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>新零售/九院001号自动售货柜/业绩销售/{{reference}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="per-area">
            <p>商品明细</p>
        </div>
         <div class="table table-container">
            <el-table :data="orderList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="reference" label="订单号" ></el-table-column>
                <el-table-column prop="product_id" label="货号" width="80"></el-table-column>
                <el-table-column prop="product_name" label="商品名"></el-table-column>
                <el-table-column prop="" label="条码"></el-table-column>
                <el-table-column prop="category_name" label="类别"></el-table-column>
                <el-table-column prop="price_in" label="成本"></el-table-column>
                <el-table-column prop="price_out" label="售价"></el-table-column>
                <el-table-column prop="product_quantity" label="数量"></el-table-column>
                <el-table-column prop="earnings" label="利润"></el-table-column>
                <el-table-column prop="pay_type" label="支付方式"></el-table-column>
                <el-table-column prop="order_status" label="状态"></el-table-column>
                <el-table-column prop="date_add" label="交易时间"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      userName: '', // 登录用户
      orderList: [], // 订单列表
      id_order: '' // 订单号
    }
  },
  created () {
    this.getOrderDetail()
  },
  methods: {
    // 获取业绩详情
    getOrderDetail () {
      this.id_order = this.$route.query.id_order // 业绩详情id
      this.$api.performanceDetail(this.id_order)
        .then((res) => {
          this.orderList = res.data.data.list
        })
    }
  },
  computed: {
    // 登陆用户
    username () {
      let username = localStorage.getItem('g_username')
      return username || this.userName
    }
  },
  components: {}
}
</script>

<style scoped>

/* filter conditions */
.listFilter{
    display: flex;
    text-align: right;
    margin-top: 20px;
    /* flex-direction: column-reverse; */
}
.dateFilter{
    margin-right:30px;
}
.conditionFilter{
    display: flex;
}
.ex-btn{
    margin-left: 40px;
}
.conditionBox{
    flex: 1;
    margin-right: 10px;
}
.table-container{
    margin-top: 20px;
}
.per-area{
   margin-top: 10px;
}
.per-area p{
    padding: 10px 0;
    font-size: 20px;
    color: brown;
}
</style>
