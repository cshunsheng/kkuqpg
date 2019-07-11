<template>
  <div id="base-info__container">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card class="box-card">
          <el-form ref="leftForm" :label-position="labelPosition" label-width="80px" :model="formData" :rules="rules">
            <!-- product name -->
            <el-form-item label="商品名称" prop="name">
              <el-autocomplete
                style="width:100%;"
                class="block-input"
                v-model="formData.name"
                value-key="name"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>

            <!-- province -->
            <el-form-item label="产地">
              <el-select v-model="formData.madein" clearable placeholder="请选择">
                <el-option
                  v-for="item in provenanceList"
                  :key="item.id_country"
                  :label="item.name"
                  :value="item.id_country">
                </el-option>
              </el-select>
            </el-form-item>
            <!--&lt;!&ndash; corner mark &ndash;&gt;-->
            <el-form-item label="角标">
              <el-select v-model="formData.cornertag" value-key="title" clearable placeholder="请选择">
                <el-option
                  v-for="item in cornertagsList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                  <span style="float: left">{{ item.title }}</span>
                  <span style="float: right;position: relative;width:20px;height:100%">
                    <img :src="item.img_url" style="position: absolute; top:50%; margin-top: -10px; width: 100%; height: 20px;"/>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <!--&lt;!&ndash; coupon able &ndash;&gt;-->
            <el-form-item label="优惠券">
              <el-select v-model="formData.allowed_coupon" clearable placeholder="请选择">
                <el-option v-for="s in couponStatus" :key="s.value" :label="s.label" :value="s.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--&lt;!&ndash; product spec &ndash;&gt;-->
            <el-form-item label="规格">
              <el-input v-model="formData.guige" placeholder="请输入商品规格"></el-input>
            </el-form-item>
            <!--&lt;!&ndash; product feature &ndash;&gt;-->
            <el-form-item label="商品特点">
              <el-input type="textarea" v-model="formData.short_msg"></el-input>
            </el-form-item>
            <!--&lt;!&ndash; product reclassify &ndash;&gt;-->
            <el-form-item label="商品分类">
              <button type="button" class="el-button"><i class="el-icon-plus"></i><span @click="addClass">新增分类</span></button>
              <el-button type="text" v-for="item in formData.id_category_arr" :key="item.id">
                  {{item.parent_name}}-{{item.child_name || item.name}}
                  <i class="el-icon-delete" @click="delClass"></i>
              </el-button>
              <el-dialog title="添加分类列表" :visible.sync="addClassForm">
                <el-tree
                  :data="classifyList"
                  show-checkbox
                  default-expand-all
                  node-key="id_category"
                  ref="tree"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
                  <el-button type="primary" @click="getCheckedNodes">确定添加</el-button>
              </el-dialog>
              
            </el-form-item>
            <!-- <el-form-item label="商品分类"> -->
              <!-- <el-select v-model="formData.id_category_arr" value-key="name"  placeholder="请选择">
                <el-option
                  v-for="item in classifyList"
                  :key="item.id_category"
                  :label="item.name"
                  :value="item.id_category">
                </el-option>
              </el-select> -->
           <!-- </el-form-item> -->
            <!--&lt;!&ndash; product reclassify &ndash;&gt; multiple-->
            <el-form-item label="科室">
              <el-select v-model="formData.department_arr"  value-key="id" placeholder="科室" >
                        <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
              <!-- <el-select v-model="formData.department_arr"  placeholder="请选择">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <el-form ref="rightForm" :label-position="labelPosition" label-width="80px" :model="baseInfoData" :rules="rules">
            <!-- platform_price -->
            <el-form-item label="平台价" prop="platform_price">
              <el-input placeholder="请输入内容" v-model="formData.price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <!-- market_price -->
            <el-form-item label="市场价" prop="market_price">
              <el-input placeholder="请输入内容" v-model="formData.wholesale_price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <!-- doctor_reward -->
            <el-form-item label="医生奖励">
              <el-input placeholder="请输入内容" v-model="formData.doc_rewards">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formData.active" clearable placeholder="请选择状态">
                <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="医生端">
              <el-select v-model="formData.doctor_visible" clearable placeholder="请选择">
                <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- product_status_patient -->
            <el-form-item label="患者端">
              <el-select v-model="formData.patient_visible" clearable placeholder="请选择">
                <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- product_sort -->
            <el-form-item label="商品排序">
              <el-input placeholder="请输入内容" v-model="formData.position"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        baseInfoData:this.formData,
        labelPosition: 'right',
        inputValue: '',
        cStatus: [
          {value: 1, label: "上线"},
          {value: 0, label: "下线"}],
        couponStatus:[
          {value:1,label:'可用'},
          {value:0,label:'不可用'}
        ],
        addClassForm:false,
        editForm:[],
        defaultProps: {
          children: 'child_all',
          label: 'name'
        },
        department:''
      };
    },

    created() {
    },

    props: ['formData','rules', 'productList', 'provenanceList', 'cornertagsList', 'classifyList', 'departmentList'],


    watch: {
      baseInfoData: {
        handler(val, oldVal){
          this.$emit('updateFromData', val)
        },
        deep: true
      }
    },

    methods: {
      getCheckedNodes() {
        this.addClassForm=false
        let checkedNodes=this.$refs.tree.getCheckedNodes()
        for(let index in checkedNodes){
         let  checkedClass= checkedNodes[index]
         console.log(checkedClass)
         this.formData.id_category_arr.push(checkedClass)
         console.log(this.formData.id_category_arr)
        }
      },
      //删除分类
      delClass(){
        this.formData.id_category_arr=this.formData.id_category_arr.filter((item,index)=>{
            return index
        })
      },
      
      getCheckedAll(){
          return this.defaultProps.filter(function (e) {
              if(e.node.indeterminate){
                  return e.node.indeterminate
              }
              return e.node.checked
          }).map(function (e) {
              return e.node
          })
      },
      //添加分类
      addClass(){
        this.addClassForm=true
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
      }

    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  #base-info__container {
    .re-class{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      div{
        margin: 0 10px;
      }
    }
  }
</style>
