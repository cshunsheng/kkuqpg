<template>
  <div class="wholesale">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/admin/shop/department/list'}"><i class="el-icon-menu"></i>科室管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>新增/编辑</el-breadcrumb-item>
    </el-breadcrumb>
   <!--新增科室-->
  <div class="sub-set">
    <el-form :model="parForm"  ref="parForm" label-width="100px"  class="w-form">
         <el-form-item label="科室名称" size="medium">
            <el-input v-model="parForm.name" placeholder="请输入科室名称"></el-input>
         </el-form-item>
        <el-form-item label="科室排序">
          <el-input  v-model="parForm.position" placeholder="数字越大越前面"></el-input>
        </el-form-item>
        <el-form-item label="是否上线">
          <el-select v-model="parForm.active" placeholder="状态">
            <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        cStatus: [
                {value: 1, label: "上线"},
                {value: 0, label: "下线"}],
        accessToken:'',
        userName: '',
        parForm:{},
        name:''
      }
    },
    computed: {
      // 登陆用户
      username() {
        let username = localStorage.getItem('g_username')
        return username || this.userName
      },
      ...mapGetters([
        'sortProduct'
      ])
    },

    created(){
      this.id_department = this.$route.query.id_department                  // id_department
      this.name=this.$route.query.name
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.getDerView()
    },
    methods: {
      //获取科室详情
      getDerView() {
        if(this.id_department){
          this.$api.getDerView(this.accessToken,this.userName,this.id_department)
           .then((res) => {
             this.parForm=res.data.data
          })
        }
      },
      //取消
      cancel(){
        this.$router.back(-1)
      },
      //新增或者编辑保存
      submitForm(){
        if (!this.parForm.name) {
            this.$message.error('请输入科室名称');
            return false
        }else if(!this.parForm.position){
            this.$message.error('请输入科室排序')
            return false
        }
        let reg=/^[0-9]*[0-9][0-9]*$/
        let value=this.parForm.position
        if(value){
              if (new RegExp(reg).test(value) == false) {
                    this.$message.error('请输入正确的排序')
                    return false
              }
         }
        let _this=this
        let params={}
            params={
            access_token:this.accessToken,
            username:this.userName,
            name:this.parForm.name,
            position:this.parForm.position,
            active:this.parForm.active,
          }
        //编辑
        if(this.id_department){
           let newParams=Object.assign(params,{id:this.id_department})
           this.$api.editDer(newParams)
           .then((res) => {
             if(res.data.status==200){
               _this.$message.success(res.data.msg)
               _this.cancel()
             }else {
                _this.$message.error(res.data.msg)
                return false;
              }
          })
        }else{
          //新增
          let addParams=Object.assign(params)
          this.$api.addDer(addParams)
           .then((res) => {
             if(res.data.status==200){
                _this.$message.success('新增成功')
                _this.cancel()
             }else {
               _this.$message.error(res.data.msg)
                return false;
              }
          })
        }
      },
    }
  }
</script>
<style lang="scss">
  .sub-set{
    background: rgba(240,240,240,1);
    padding: 20px 0;
    margin: 30px auto 30px;
  }
.w-form {
    width:500px;
    margin-top: 20px;
  }
</style>
