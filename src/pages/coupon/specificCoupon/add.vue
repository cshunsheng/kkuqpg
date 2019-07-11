<template>
  <div class="add">
    <div style="padding-bottom:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/specificCoupon'}">
          <i class="el-icon-menu"></i>特定券
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="el-icon-menu"></i>关联商品
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_top">
      <el-input style="width:301.4px" placeholder="请输入商品名称" v-model="query"></el-input>
      <el-button type="primary" style="margin-left:50px" @click="search">搜索</el-button>
      <span class="count">共计{{count}}条结果</span>
    </div>
    <div class="main">
      <el-form
        :model="form"
        ref="form"
        label-position="left"
        label-width="100px"
        style="padding-bottom:20px"
      >
        <el-form-item label="商品名称/ID">
          <!-- <input type="text" class="input"> -->
          <el-select
            v-model="form.products_arr"
            multiple
            placeholder="请输入商品名称或商品ID"
            filterable
            style="width:400px"
            :filter-method="filterMethod"
          >
            <el-option
              v-for="item in list"
              :key="item.id_product"
              :label="item.name"
              :value="item.id_product"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            style="margin-left:300px"
            @click="add"
            :disabled="!form.products_arr.length"
          >添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableList" border="" style="width: 100%">
        <el-table-column prop="id_product" label="商品ID"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="allowed_coupon" label="是否可用优惠券"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content_bottom">
        <el-pagination
          @prev-click="prev"
          @next-click="next"
          @current-change="current"
          background=""
          :page-size="page_size"
          :current-page="currPage"
          layout="prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.dataInit()
    this.getProducts()
    this.getProductsAll()
  },
  data() {
    return {
      access_token: '',
      username: '',
      page: 1,
      page_size: 20,
      currPage: 1,
      type: 1,
      type_id: 0,
      count: 0,
      query: '',
      tableList: [],
      id_coupon: '',
      name: '',
      form: {
        products_arr: ''
      },
      productsList: [],
      list: []
    }
  },
  methods: {
    // 页面初始化数据
    dataInit() {
      this.access_token = localStorage.getItem('g_accessToken')
      this.username = localStorage.getItem('g_username')
      this.id_coupon = this.$route.params.id
      this.name = this.$route.params.name
    },
    // 获取已绑定的
    getProducts() {
      this.$api
        .getProducts1(
          this.access_token,
          this.id_coupon,
          this.page,
          this.page_size,
          1,
          this.username,
          this.query
        )
        .then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            res.data.data.list.forEach(
              v => (v.allowed_coupon = v.allowed_coupon ? '是' : '否')
            )
            this.tableList = res.data.data.list
            this.count = res.data.data.total
          }
        })
    },
    // 获取未绑定的商品
    getProductsAll(query) {
      this.$api
        .getProducts2(
          this.access_token,
          this.id_coupon,
          0,
          this.username,
          query
        )
        .then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            this.productsList = res.data.data.list
            this.list = res.data.data.list
          }
        })
    },
    // 搜索
    filterMethod(query) {
      // console.log(3)
      // if (query.includes('#')) {
      //   console.log(2)

      //   this.list = this.productsList.filter(item => {
      //     return item.id_product === +query.split('#')[1]
      //   })
      // } else {
      //   console.log(1)
      //   this.list = this.productsList.filter(item => {
      //     let strItem = item.name + ''
      //     return strItem.includes(query)
      //   })
      // }
      this.getProductsAll(query)
    },
    //搜索商品
    search() {
      this.page = 1
      this.getProducts(res => {
        if (!(this.query === '')) {
          this.total = res.data.data.total
          // console.log(res.data.data.total)
        } else {
          this.total = 0
        }
      })
    },
    // 添加商品
    add() {
      let jsonstr = JSON.stringify(this.form.products_arr)
      this.$api
        .addProducts(this.access_token, this.id_coupon, jsonstr, this.username)
        .then(res => {
          // console.log(res)
          if (res.data.status === 200) {
            this.list = []
            this.getProducts()
            this.getProductsAll()
            this.form.products_arr = []
          }
        })
    },
    // 删除操作
    del(row) {
      // console.log(row)
      // console.log(this.access_token, this.id_coupon, row.id_product, this.username)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api
            .delProducts(
              this.access_token,
              this.id_coupon,
              row.id_product,
              this.username
            )
            .then(res => {
              // console.log(res)
              if (res.data.status === 200) {
                this.getProducts()

                console.log(this.count % this.page_size == 1)
                console.log(this.page != 1)

                if (this.page != 1 && this.count % this.page_size == 1) {
                  console.log(1)
                  this.page--
                  this.getProducts()
                  // this.current(this.page)
                }

                this.$message.success(`关联商品${row.name}删除成功`)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // ------分页------
    prev() {
      this.page--
      this.getProducts()
    },
    current(val) {
      this.page = val
      this.getProducts()
    },
    next() {
      this.page++
      this.getProducts()
    }
  }
}
</script>
<style lang="scss" scoped>
.content_top {
  padding: 20px 0;
  .count {
    margin-left: 50px;
    display: inline-block;
    height: 40px;
  }
}
.content_bottom {
  float: right;
}
.bottom {
  padding: 20px 0;
  .dialog_bottom {
    float: right;
  }
}
</style>