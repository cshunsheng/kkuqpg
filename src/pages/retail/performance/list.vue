<template>
    <div id="per-shop-list__container">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}"><i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>业绩管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <div class="listFilter">
            <div class="dateFilter">
                <el-date-picker
                v-model="chaDate"
                type="daterange"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @editable="false"
                @clearable="false"
                @change="changeDate">
                </el-date-picker>
            </div>
            <div class="conditionFilter">
                <div class="conditionBox conditionStatus">
                    <el-select v-model="orderStatu" placeholder="订单状态" size="mini" @change='filterList("status", orderStatu)'>
                        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button class="ex-btn" type="primary" @click="exportExcel()">导出Excel</el-button>
            </div>
        </div>
        <div class="per-area">
            <p>九院001号自动售货柜/业绩</p>
            <el-button >总订单数:{{wholeNum}}</el-button>
            <el-button >总业绩：{{wholeAmount}}</el-button>
        </div>
         <div class="table table-container">
            <el-table :data="orderList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="reference" label="流水号" ></el-table-column>
                <el-table-column prop="pay_type" label="支付方式"></el-table-column>
                <el-table-column prop="cabinet_name" label="订单来源"></el-table-column>
                <el-table-column prop="date_add" label="交易时间"></el-table-column>
                <el-table-column prop="product_num" label="交易品项数"></el-table-column>
                <el-table-column prop="amount" label="交易金额"></el-table-column>
                <el-table-column prop="order_status" label="订单状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 翻页 -->
        <div class="pagin">
            <el-pagination background layout="prev, pager, next" :page-size="orderListQuerys.size" :total="orderTotal" @current-change="changePage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      userName: '', // 登录用户
      orderList: [], // 订单列表
      orderTotal: 0, // 订单总数
      chaDate: '', // 日期
      orderListQuerys: { // 订单列表所需参数
        beginDate: '',
        endDate: '',
        status: -1,
        num: 1,
        size: 12
      },
      orderStatu: '', // 订单状态
      orderStatus: [ // 所有订单状态
        {value: -1, label: '所有订单'},
        {value: 1, label: '待付款'},
        {value: 2, label: '已付款'},
        {value: 4, label: '已发货'},
        {value: 6, label: '已取消'},
        {value: 7, label: '已退款'},
        {value: 13, label: '已完成'},
        {value: 14, label: '新零售已付款但出货失败'}
      ],
      orderSource: '', // 来源筛选绑定值
      orderSources: [], // 来源列表（接口获取）
      wholeNum: '',
      wholeAmount: ''
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 详情
    handleEdit (index, row) {
      this.$router.push({path: 'detail', query: {id_order: row.id_order}})
    },
    formatter (row, column) {
      return row.address
    },
    // 获取业绩列表
    getOrderList () {
      let _beginDate = this.orderListQuerys.beginDate // 开始时间 可传空
      let _endDate = this.orderListQuerys.endDate // 结束时间 可传空
      let _status = this.orderListQuerys.status // 状态
      let _num = this.orderListQuerys.num // 页
      let _size = this.orderListQuerys.size // 数量

      this.$api.performanceList(_beginDate, _endDate, _status, _size, _num)
        .then((res) => {
          this.orderList = res.data.data.list
          this.orderTotal = res.data.data.total_num
          this.wholeNum = res.data.data.whole_num
          this.wholeAmount = res.data.data.whole_amount
        })
    },
    // 翻页
    changePage (e) {
      this.orderListQuerys.num = e
      this.getOrderList()
    },
    // 时间筛选
    changeDate () {
      if (this.chaDate) {
        this.orderListQuerys.beginDate = this.chaDate[0] // 开始时间
        this.orderListQuerys.endDate = this.chaDate[1] // 结束时间
      } else {
        this.orderListQuerys.beginDate = ''
        this.orderListQuerys.endDate = ''
      }
      this.getOrderList()
    },
    // 筛选
    filterList (name, val) { // name: 筛选条件， val：条件的值
      switch (name) {
        case 'status':
          this.orderListQuerys.status = val
          break
      }
      this.getOrderList()
    },
    // 将后台返回的导出文档流转换成excel后下载
    download (data) {
      if (!data) {
        return
      }
      const blob = new Blob([data])
      const fileName = '业绩管理.xlsx'
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    },
    // 导出excel
    exportExcel () {
      // 接口请求时间过长，显示loading，提高用户体验
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let _status = this.orderListQuerys.status // 状态

      this.$api.exportPerList(_status)
        .then((res) => { // 处理返回的文件流
          loading.close() // 隐藏loading
          this.download(res.data) // 开始下载
        })
        .catch(err => console.log(err))
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
.pagin {
    margin-top: 20px;
    text-align: right;
}
</style>
