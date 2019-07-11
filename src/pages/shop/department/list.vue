<template>
  <div id="sort-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>科室管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listFilter">
      <div class="conditionFilter">
        <el-button type="primary" @click="add"><i class="el-icon-plus"></i>添加科室</el-button>
      </div>
    </div>
    <!--分类列表-->
    <div class="table table-container">
      <el-table :data="departmentList" :header-cell-style="styleObj"
                      :cell-style="styleObj" border style="width: 100%" ref="multipleTable">
        <el-table-column label="排序" prop="position"></el-table-column>
        <el-table-column prop="id" label="科室ID"></el-table-column>
         <el-table-column prop="name" label="科室名称"></el-table-column>
        <el-table-column label="科室商品">
          <template slot-scope="scope">
            <span class="edit" @click="view(scope.$index, scope.row)">详情</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="edit" @click="edit(scope.$index, scope.row)">编辑    |</span>
            <span class="edit" @click="deleteDer(scope.index, scope.row)">删除 |</span>
            <span class="edit" @click="toActive(scope.index, scope.row)">
              <span v-if="scope.row.active===1">改为下线</span>
              <span v-if="scope.row.active===0">改为上线</span>
            </span>
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
        styleObj: {
                    "text-align": "center",
                },
        accessToken:'',
        userName: '',
      }
    },
    created() {
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.getDerList()
    },
    methods: {
      //新增科室
      add(){
        this.$router.push({path:'edit'})
      },
      //编辑科室
      edit(index,row){
        this.$router.push({path:'edit',query:{id_department:row.id,name:row.name}})
      },
      //查看商品
      view(index,row){
        this.$router.push({path:'productlist',query:{id_department:row.id,name:row.name}})
      },
      //删除科室
      deleteDer(index,row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.delDerView(this.accessToken,this.userName,row.id)
            .then((res)=>{
                if(res.data.status==200){
                  this.getDerList()
                  this.$message.success('删除成功')
                }else{
                  this.$message.error(res.data.msg)
                }
            })
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
      //改为上下线
      toActive(index,row){
          let params={
            access_token:this.accessToken,
            username:this.userName,
            id:row.id,
            name:row.name,
            position:row.position
          }
          let isActive;
          if(row.active==1){isActive=0}else{isActive=1}
           let newParams=Object.assign(params,{active:isActive})
           this.$api.editDer(newParams)
           .then((res) => {
             if(res.data.status==200){
               this.$message.success(res.data.msg)
               this.getDerList()
             }else {
                this.$message.error(res.data.msg)
                return false;
              }
          })
      },
      // 获取科室列表
      getDerList() {
        this.$api.getDerList(this.accessToken,this.userName)
          .then((res) => {
            this.$store.commit('DEPARTMENTLIST',{list:res.data.data})
          })
      },
    },

    computed: {
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'departmentList'
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
