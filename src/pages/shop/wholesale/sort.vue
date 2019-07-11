<template>
  <div id="wholesale-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/admin/shop/wholesale/list'}"><i class="el-icon-menu"></i>拼团商品列表
        </el-breadcrumb-item>
        <el-breadcrumb-item>拼团商品排序</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--拼团排序列表-->
    <div class="table table-container">
      <el-table :data="groupSort" border style="width: 100%" ref="multipleTable" type="index">
        <el-table-column label="顺序">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="kkid" label="拼团ID"></el-table-column>
        <el-table-column prop="id_product" label="商品ID"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <span class="edit" v-if="scope.row.is_top == '1'" @click="makTop(scope.$index, scope.row)">取消置顶</span>
            <span class="edit" v-if="scope.row.is_top == '0'" @click="cancelMakTop(scope.$index, scope.row)">置顶</span>
            <span  :class="scope.$index==0? 'none':'edit'" @click="upPos(scope.$index, scope.row)">| 上移</span>
            <span :class="scope.$index==groupSort.length-1 ? 'none' : 'edit'" @click="downPos(scope.$index, scope.row)">| 下移</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        userName: '',
        accessToken:'',
        type:1,
        page:1,
        id_category:1
      }
    },
    created() {
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.getGroupSortList()
    },
    methods: {
      //取消置顶
      makTop(index,row) {
        console.log(row.id,row.is_top)
        this.$api.makTop(this.accessToken,row.id,0,this.userName)
          .then((res) => {
              this.getGroupSortList()
          })
      },
      //置顶
       cancelMakTop(index,row) {
        this.$api.makTop(this.accessToken,row.id,1,this.userName)
          .then((res) => {
              this.getGroupSortList()
          })
      },
     
      //变换位置  //1-上移 2-下移
      upPos(index,row) {
        this.$api.exPos(this.accessToken,row.id,1,this.userName)
          .then((res) => {
            this.getGroupSortList()
          })
      },
      downPos(index,row) {
        this.$api.exPos(this.accessToken,row.id,2,this.userName)
          .then((res) => {
            this.getGroupSortList()
          })
      },

      // 获取拼团排序列表
      getGroupSortList() {
        this.$api.groupSort(this.id_category,this.type,this.page)
          .then((res) => {
            this.$store.commit('GROUPSORT',{list:res.data.data.groupon_list})
          })
      }
    },

    computed: {
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'groupSort'
      ])
    }
  }
</script>

<style scoped>
  .none{
    display: none;
  }
  .listLine span{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }
  .listFilter {
    display: flex;
    justify-content: space-between;
    text-align: right;
    margin-top: 20px;
  }

  .conditionFilter {
    display: flex;
    justify-content: space-between;
  }
  .conditionStatus{
    margin-left: 20px;
  }
  .table-container {
    margin-top: 40px;
  }
  .per-area p {
    padding: 10px 0;
    font-size: 20px;
    color: brown;
  }
  .bt-input{
    width: 500px;
  }
  .pagin {
    margin-top: 20px;
    text-align: right;
  }
  .edit{
    cursor: pointer;
  }

</style>
