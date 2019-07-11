<template>
  <div id="sort-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>商品分类/父级列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listFilter">
      <div class="conditionFilter">
        <el-button type="primary" @click="add('showParForm')"><i class="el-icon-plus"></i>新增父类</el-button>
        <el-button type="primary" @click="add('showSubForm')"><i class="el-icon-plus"></i>新增子类</el-button>
      </div>
    </div>
    <!--分类列表-->
    <div class="table table-container">
      <el-table :data="sortProduct" border style="width: 100%" ref="multipleTable">
        <el-table-column label="排序" prop="position">
</el-table-column>
        <el-table-column prop="id_category" label="ID"></el-table-column>
        <el-table-column prop="name" label="父类"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="edit" @click="edit(scope.$index, scope.row,'showParForm')">编辑    |</span>
            <span class="edit" @click="toSub(scope.index, scope.row)">查看子类</span>
            <span class="edit" @click="deleteSort(scope.index, scope.row)">| 删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 翻页 -->
    <div class="pagin">
      <el-pagination background layout="prev, pager, next" :page-size="page_size" :total="sortTotal" @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        accessToken:'',
        userName: '',
        page_num:1,
        page_size:12,
        id_parent:2,
        sortTotal: 0,          //分类总数
      }
    },
    created() {
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.getSortList()
    },
    methods: {
      //新增父类
      add(isForm){
        this.$router.push({path:'edit',query:{isForm:isForm}})
      },
      //编辑父类
      edit(index,row,showParForm){
        this.$router.push({path:'edit',query:{id_category:row.id_category,isForm:showParForm}})
      },

      //查看子类
      toSub(index,row){
        this.$router.push({path:'sub',query:{id_subcategory:row.id_category,name:row.name}})
      },

      //删除父类
      deleteSort(index,row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.delSort(this.accessToken,this.userName,row.id_category)
            .then((res)=>{
                if(res.data.status==200){
                  this.getSortList()
                  this.$message.success('删除成功')
                }else{
                  this.$message.error(res.data.msg)
                }
            })
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },

      // 获取父类商品列表
      getSortList() {
        this.$api.getClassList(this.accessToken,this.userName,this.page_num,this.page_size,this.id_parent)
          .then((res) => {
            this.$store.commit('SORTPSRLIST',{list:res.data.data.parent_class_list})
            this.sortTotal=res.data.data.total_num
          })
      },

      // 翻页
      changePage(e) {
        this.page_num = e
        this.getSortList()
      },
    },

    computed: {
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'sortProduct'
      ])
    }
  }
</script>

<style scoped>
  .listLine span{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
  }
  .table-container {
    margin-top: 40px;
  }
  .per-area p {
    padding: 10px 0;
    font-size: 20px;
    color: brown;
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
