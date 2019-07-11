<template>
  <div id="sort-list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path: '/admin/shop/department/list'}"> 科室管理</el-breadcrumb-item>
        <el-breadcrumb-item>科室名称 -{{name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listFilter">
      <div class="conditionFilter">
        <el-button type="primary" @click="add"><i class="el-icon-plus"></i>添加商品</el-button>
      </div>
    </div>
    <!--科室商品列表-->
    <div class="table table-container">
      <el-table :data="departmentPro" :header-cell-style="styleObj"
                      :cell-style="styleObj" border style="width: 100%" ref="multipleTable">
        <el-table-column label="商品排序" prop="position"></el-table-column>
        <el-table-column label="商品ID" prop="id_product"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column  label="平台价">
          <template slot-scope="scope">
                <span>{{scope.row.price.toFixed(1)}}</span>
          </template>
        </el-table-column>
         <el-table-column label="医生奖励">
           <template slot-scope="scope">
              <span>{{scope.row.doc_rewards.toFixed(1)}}</span>
           </template>
         </el-table-column>
         <el-table-column label="商品状态">
            <template slot-scope="scope">
              <span v-if="scope.row.active==1">上架</span>
              <span v-if="scope.row.active==0">下架</span>
            </template>
         </el-table-column>
         <el-table-column label="医生端状态">
           <template slot-scope="scope">
              <span v-if="scope.row.doctor_visible==1">上架</span>
              <span v-if="scope.row.doctor_visible==0">下架</span>
            </template>
         </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="edit" @click="edit(scope.$index, scope.row)">编辑    |</span>
            <span class="edit" @click="deleteSort(scope.index, scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <el-dialog title="添加商品" :visible.sync="addPro">
            <el-form>
                <el-form-item label="商品名称" label-width="120">
                   <el-select
                    v-model="value"
                    size="medium"
                    clearable
                    filterable
                    class="el-input-text"
                    placeholder="请输入商品名称">
                <el-option
                        v-for="(item, index) in productList"
                        :key="index"
                        :label="item.name"
                        :value="item.id_product">
                    <span>{{item.name}}</span>
                </el-option>
            </el-select>
                    <!-- <el-autocomplete  style="width:100%;" class="block-input" v-model="productName" value-key="name" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
                    </el-autocomplete> -->
                </el-form-item>
                 <el-form-item label="商品排序">
                  <el-input  v-model="position" placeholder="数字越大越前面" style="width:390px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveAddPro">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        value:[],
        id_department:'',
        styleObj: {
                    "text-align": "center",
                },
        accessToken:'',
        userName: '',
        addPro:false,
        position:'',
        productList:[],
        id_doc:1,

        productId: null,
        productName: null,
      }
    },
    created() {
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.name=this.$route.query.name
      this.id_department=this.$route.query.id_department
      this.getProtList() //科室列表
      this.getTotalProduct()
    },
    methods: {
      //添加商品
      add(){
        this.addPro=true
        this.value=''
        this.position=''
      },
      //编辑商品
      edit(index, scope) {
        if(scope.is_combination==0){
          this.$router.push({path: '/admin/shop/basic_commodity/edit', query:{productId: scope.id_product,p_kkid:scope.kkid}})
        }else if(scope.is_combination==1){
          this.$router.push({path: '/admin/shop/comboEdit', query:{productId: scope.id_product,p_kkid:scope.kkid}})
        }
      },
      //删除商品
      deleteSort(index,row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.getDelProList(this.accessToken,this.userName,row.id)
            .then((res)=>{
                if(res.data.status==200){
                  this.getProtList()
                  this.$message.success(res.data.msg)
                }else{
                  this.$message.error(res.data.msg)
                }
            })
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },
      // 获取科室商品列表
      getProtList() {
        this.$api.getDerProList(this.accessToken,this.userName,this.id_department)
          .then((res) => {
            this.$store.commit('DEPARTMENTPRO',{list:res.data.data})
          })
      },
      // 商品列表
      getTotalProduct() {
        this.$api.department_productlist(this.id_doc).then((res) => {
          this.productList=res.data.data.filter((item,index)=>{
            console.log(item.active)
            return item.active=='1' && item.doctor_visible=='1'
          })
        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },
      saveAddPro(){
        if (!this.value) {
            this.$message.error('请输入商品名称');
            return false
        }else if(!this.position){
            this.$message.error('请输入排序')
            return false
        }
        let reg=/^[0-9]*[0-9][0-9]*$/
        let posValue=this.position
        if(posValue){
              if (new RegExp(reg).test(posValue) == false) {
                    this.$message.error('请输入正确的排序')
                    return false
              }
         }
        this.$api.addDepartPro(this.accessToken,this.userName,this.id_department,this.value,this.position)
        .then((res)=>{
          if(res.data.status==200){
              this.getProtList()
              this.$message.success(res.data.msg)
              this.addPro=false
           }else{
              this.$message.error(res.data.msg)
           }
        })
      },

      querySearch(queryString, cb) {
            const productList = this.productList
            const results = queryString ? productList.filter(this.createFilter(queryString)) : productList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return (item.name.toLowerCase().includes(queryString.toLowerCase()));
            }
        },
        handleSelect(e) {
            console.log(e)
            this.productId = e.id_product
        },
    },

    computed: {
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'departmentPro'
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
