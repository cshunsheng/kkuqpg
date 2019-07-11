<template>   
  <div id="wholesale-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>拼团商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="list">
      <div class="condition">
        <el-button type="success" @click="add"><i class="el-icon-plus"></i>新增拼团</el-button>
        <el-button type="success" @click="sort"><i class="el-icon-sort"></i>拼团商品排序</el-button>
        <div class="condition-status">
          <el-select v-model="checkStatu" placeholder="选择搜索条件" @change='filterList("label", checkStatu)'>
            <el-option v-for="item in checkStatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <input type="text"  :placeholder="inputVal"  v-model="keyword" class="el-input__inner bt-input">
        <el-button class="ex-btn" type="primary" @click="getGroupList"><i class="el-icon-search"></i>搜索</el-button>
      </div>
    </div>

    <!--拼团列表-->
    <div class="table table-container">
      <p class="rule">注：上线的白底、下线的是灰色底</p>
      <el-table :data="groupProductList" border style="width: 100%" ref="multipleTable" :row-style="rowStyle">
        <el-table-column prop="kkid" label="拼团ID" ></el-table-column>
        <el-table-column prop="id_product" label="商品ID"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="from_date" label="拼团开始时间" width="160px;"></el-table-column>
        <el-table-column prop="to_date" label="拼团结束时间" width="160px;"></el-table-column>
        <el-table-column prop="vouchers" label="成团人数"></el-table-column>
        <el-table-column label="更改状态">
          <template slot-scope="scope">
            <span class="edit" v-if="scope.row.is_online=='0'" @click="upLine(scope.$index, scope.row)">改为上线</span>
            <span class="edit" v-if="scope.row.is_online=='1'" @click="downLine(scope.$index, scope.row)">改为下线</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="edit" @click="edit(scope.$index, scope.row)">编辑    |</span>
            <span class="edit" @click="showEdit(scope.index, scope.row)">操作记录</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑操作记录 -->
    <el-dialog title="拼团商品操作记录" :visible.sync="editStatusFrom">
      <el-form label-width="100px" label-position="left">
        <el-table :data="editForm" border style="width: 100%" ref="multipleTable">
          <el-table-column prop="created_at" label="时间"></el-table-column>
          <el-table-column prop="operator" label="操作人"></el-table-column>
          <el-table-column prop="content" label="操作记录"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
   
    <!-- 翻页 -->
    <div class="pagin">
      <el-pagination background layout="prev, pager, next" :page-size="size" :total="groupTotal" @current-change="changePage">
      </el-pagination>
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
        keyword:'',
        type:0,
        page:1,
        size:0,
        groupTotal: 0,          //拼团总数
        checkStatu: '',         //订单状态
        checkStatus: [
          {value: 1, label: '拼团ID'},
          {value: 2, label: '商品ID'},
          {value: 3, label: '商品名称'},
        ],
        inputVal:'',               //placeholder
        editStatusFrom: false,     // 订单状态编辑框
        editForm:[],              //操作记录表
      }
    },
    created() {
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.getGroupList()
    },
    methods: {
      //取消
      cancel(){
        this.$router.push({path: '/admin/shop/wholesale/list'})
      },
      //下线为灰色
      rowStyle({ row, rowIndex}) {
      if (row.is_online === 0) {
        return 'background:#ddd'
      }
    },
      //上线
      upLine(index,row) {
        this.$api.getOnline(this.accessToken,row.id_group,1,this.userName)
          .then((res) => {
            if(res.data.status==200){
              this.getGroupList()
            }else{
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, res.data.msg),
          ]),
          showCancelButton: true,
          confirmButtonText: '编辑',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              setTimeout(() => {
                done();
                setTimeout(() => {
                  this.$router.push({path:'edit',query:{id_group:row.id_group}})
                }, 10);
              }, 10);
            } else {
              done();
            }
          }
        })
            }
          })
      },
      //下线
      downLine(index,row) {
        this.$api.getOnline(this.accessToken,row.id_group,0,this.userName)
          .then((res) => {
            if(res.data.status==200){
              this.getGroupList()
             }else{
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, res.data.msg),
          ]),
          showCancelButton: true,
          confirmButtonText: '编辑',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              setTimeout(() => {
                done();
                setTimeout(() => {
                  this.$router.push({path:'edit',query:{id_group:row.id_group}})
                }, 10);
              }, 10);
            } else {
              done();
            }
          }
        })
            }
          })
      },
      // 操作记录
      showEdit(index, row) {
       this.editStatusFrom=true
        this.recordForm(row.id_group)
      },

      //获取操作记录表
      recordForm(id_group) {
        this.$api.recordGroup(id_group,this.accessToken,this.userName)
          .then((res) => {
            this.editForm = res.data.data
          })
      },

      //新增拼团
      add(){
        this.$router.push({path:'edit'})
      },
      //排序
      sort(){
        this.$router.push({path:'sort'})
      },
      //编辑拼团
      edit(index,row){
        this.$router.push({path:'edit',query:{id_group:row.id_group}})
      },

      // 获取拼团商品列表
      getGroupList() {
        this.$api.groupProductList(this.keyword,this.type,this.page)
          .then((res) => {
            this.$store.commit('GROUPPRODUCTLIST',{list:res.data.data.groupon_list})
            this.groupTotal=res.data.data.total
            this.size=res.data.data.page_size
          })
      },

      // 翻页
      changePage(e) {
        this.page = e
        this.getGroupList()
      },

      // 筛选
      filterList(name, val) { // name: 筛选条件， val：条件的值
        this.checkStatus.value = val
        this.type=val
        if(val===1){
          this.inputVal='请输入拼团ID'
          this.keyword=''
        }else if(val===2){
          this.inputVal='请输入商品ID'
          this.keyword=''
        }else if(val===3){
          this.inputVal='请输入商品名称'
          this.keyword=''
        }
      }
    },

    computed: {
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'groupProductList'
      ])
    }
  }
</script>

<style>
  #wholesale-list .el-table--enable-row-hover .el-table__body tr:hover > td {
   background: none; }
   #wholesale-list .el-table--enable-row-hover .el-table__body tr:active > td {
   background: none; }
   #wholesale-list .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: none; }
  #wholesale-list .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
    background: none;  }
  #wholesale-list .el-table__body tr.hover-row > td, .el-table__body tr.hover-row.current-row > td, .el-table__body tr.hover-row.el-table__row--striped > td, .el-table__body tr.hover-row.el-table__row--striped.current-row > td {
    background: none;  }
  #wholesale-list .el-table__body tr.current-row > td {
    background: none;  }
  #wholesale-list .list {
    display: flex;
    justify-content: space-between;
    text-align: right;
    margin-top: 20px;
  }

  #wholesale-list  .condition {
    display: flex;
    justify-content: space-between;
  }
  #wholesale-list .condition-status{
    margin-left: 20px;
    width: 500px; 
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
  .rule{
    font-size: 12px;
    color: #2a88bd;
  }
</style>
