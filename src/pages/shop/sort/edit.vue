<template>
  <div class="wholesale">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path: '/admin/shop/sort/list'}"><i class="el-icon-menu"></i>分类商品列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>新增/编辑</el-breadcrumb-item>
    </el-breadcrumb>
   <!--新增父类-->
  <div class="sub-set" v-if="showParForm">
    <el-form :model="parForm"  ref="parForm" label-width="100px"  class="w-form">
         <el-form-item label="父类名称" size="medium">
            <el-input v-model="parForm.name" placeholder="请输入分类名称"></el-input>
         </el-form-item>
        <el-form-item label="父类排序">
          <el-input  v-model="parForm.position" placeholder="数字越小越前面"></el-input>
        </el-form-item>
        <el-form-item label="是否上线">
          <el-select v-model="parForm.active" placeholder="状态">
            <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('par')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
   <!--新增子类-->
    <div class="sub-set" v-if="showSubForm">
      <el-form :model="subForm"  ref="subForm" label-width="100px"  class="w-form">
         <el-form-item label="选择父类" size="medium">
              <el-select v-model="subForm.id_parent"  placeholder="请选择父类" value-key="name">
                  <el-option v-for="item in sortProduct" :key="item.id_category" :label="item.name" :value="item.id_category">
                  </el-option>
              </el-select>
         </el-form-item>
        <el-form-item label="子类名称">
          <el-input  v-model="subForm.name" placeholder="请输入子类名称"></el-input>
        </el-form-item>
        <el-form-item label="子类排序">
          <el-input  v-model="subForm.position" placeholder="数字越小越前面"></el-input>
        </el-form-item>
        <el-form-item label="是否上线">
          <el-select v-model="subForm.active" placeholder="状态">
            <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
            </el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="分类图片" size="small">
        <el-upload class="avatar-uploader" action="http://admin-api.test.kangkanghui.com/upload/file" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="subForm.img_kkh_url" :src="subForm.img_kkh_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
          <span class="tip">(注：点击编辑图片，图片大小为240*240，大小不超过1M)</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('sub')">保存</el-button>
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
        isForm:'',
        accessToken:'',
        userName: '',
        page_num:1,
        page_size:'',
        id_parent:2,
        id_category:'',
        showSubForm:false,                            //子类表单是否显示
        subForm:{
          id_parent:'',  //新增子类时需要传的父类id
          img_kkh_url:'',
          active: '',
        },   //子类表单
        showParForm:false,                     //父类表单是否显示
        parForm:{active:''},                   //父类表单
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
      this.add=this.$route.query.add           //新增子类时需要显示父类的名称
      this.id_category = this.$route.query.id_category                  // id_category
      this.userName = localStorage.getItem('g_username');
      this.accessToken = localStorage.getItem('g_accessToken');
      this.showForm()
      this.getSubView()
    },
   
    methods: {
      getParentName(){
        if(this.add){
            this.subForm.id_parent=this.$route.query.id_subcategory
            var arr=this.sortProduct
            let obj=arr.find( (x)=> {
                return x.id_category == this.subForm.id_parent
            })
            this.subForm.id_parent=obj.name
            // console.log(obj.name);
        }
      },
      showForm(){
        this.isForm=this.$route.query.isForm               //是否为父类还是子类
        if(this.isForm=='showParForm'){
          this.showParForm=true
        }else if(this.isForm=='showSubForm'){
          this.showSubForm=true
          this.getSortList()
        }
      },
      //获取子类详情   获取父类详情
      getSubView() {
        if(this.id_category){
          this.$api.getSubView(this.accessToken,this.userName,this.id_category,'view')
           .then((res) => {
             this.subForm=res.data.data
             this.parForm=res.data.data
          })
        }
      },
      //取消
      cancel(){
        this.$router.back(-1)
      },

      //上传图片
      handleAvatarSuccess(res, file) {
        this.subForm.img_kkh_url = res.data.image_url;
      },

      beforeAvatarUpload(file) {
        return true;
      },

      //新增或者编辑保存
      submitForm(parSubForm){
        let reg=/^[0-9]*[0-9][0-9]*$/
        let value=this.parForm.position
        let limit_value= this.subForm.position
        if(value){
              if (new RegExp(reg).test(value) == false) {
                    this.$message.error('请输入正确的排序')
                    return false
              }
         }else if(limit_value){
            if (new RegExp(reg).test(limit_value) == false) {
                    this.$message.error('请输入正确的排序')
                    return false
              }
         }
        let _this=this
        let params={}
        //父类编辑新增
        if(parSubForm=='par'){
            params={
            access_token:this.accessToken,
            username:this.userName,
            name:this.parForm.name,
            position:this.parForm.position,
            active:this.parForm.active,
            id_parent:2                //父类新增
          }
        }else if(parSubForm=='sub'){
          //子类编辑新增
          if(this.add){
              var arr=this.sortProduct
              let obj=arr.find( (x)=> {
                  return x.name == this.subForm.id_parent
              })
              this.subForm.id_parent=obj.id_category
              // console.log(`obj.id_category:${this.subForm.id_parent}`);
          }
          
          params={
            access_token:this.accessToken,
            username:this.userName,
            name:this.subForm.name,
            position:this.subForm.position,
            id_parent:this.subForm.id_parent,
            img_kkh_url:this.subForm.img_kkh_url,
            active:this.subForm.active
          }
        }
        //编辑
        if(this.id_category){
           let newParams=Object.assign(params,{id:this.id_category},{action:'edit'})
           this.$api.EditSubView(newParams)
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
          let addParams=Object.assign(params,{action:'add'})
          console.log(addParams)
          this.$api.addSubView(addParams)
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
      // 获取父类商品列表
      getSortList() {
        this.$api.getClassList(this.accessToken,this.userName,this.page_num,this.page_size,this.id_parent)
          .then((res) => {
            this.$store.commit('SORTPSRLIST',{list:res.data.data.parent_class_list})
            this.getParentName()
          })
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
