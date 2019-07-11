<template>
  <div id="">

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        userData: null,
        username: '',
        access_token: '',
        productList: [],                         // 商品列表
        provenanceList: [],                      // 产地列表
        classifyList: [],                        // 二级分类列表
        departmentList: [],                      // 科室列表
        cornertagsList: [],                      // 角标列表
        basicProductList: [],                   // 基础商品列表
        basicNameList: [],                       // 基础商品可选的商品名称

        rules: {
          product_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          platform_price: [
            {required: true, message: '请输入平台价', trigger: 'blur'},
          ],
          market_price: [
            {required: true, message: '请输入市场价', trigger: 'blur'},
          ]
        }
      }
    },

    created() {
      this.init();
      this.getTotalProduct();
      this.getPmBaseprovenancelist()
      this.getPmBasereclassifylist();

      this.getPmBasesectionlist();
      this.getCornertagsList();
      this.getPmBasesectionlist();

      this.getBasicProductList();
    //   this.getBasicNameList()
    },

    methods: {
      init() {
        this.username = localStorage.getItem('g_username')
        this.access_token = localStorage.getItem('g_accessToken')
        this.userData = {
          access_token: this.access_token,
          username: this.username
        }
      },

      // 商品列表
      getTotalProduct() {
        this.$api.comment_productlist(this.userData).then((res) => {
          this.productList = res.data.data
        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },

      // 分类列表
      getPmBasereclassifylist() {
        this.$api.pmBasereclassifylist(this.userData).then((res) => {
          this.classifyList = res.data.data.reclassify_list
        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },

      // 科室列表
      getPmBasesectionlist() {
        this.$api.pmBasesectionlist(this.userData).then((r) => {
            let _res = r.data.data
          this.departmentList = _res

        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },

      // 角标列表
      getCornertagsList() {
        this.$api.cornertags_list(this.userData).then((res) => {
          this.cornertagsList = res.data.data.cornertags_list
        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },

      // 产地列表
      getPmBaseprovenancelist() {
        this.$api.pmBaseprovenancelist(this.userData).then((res) => {
          this.provenanceList = res.data.data.provenance_list
        }, (err) => {
          this.$message({
            message: err,
            type: 'error'
          });
        })
      },

      // 基础商品列表 - 配置组合商品
      getBasicProductList() {
          let _this = this
          let _data = {
              key_word_type: 2,
              type: 3,   // 配置专用参数
              is_combination: 0
          };

          // console.log('data',_data)
          this.$api.pmBaselist(_data)
            .then(res =>{
                _this.basicProductList = res.data.data.product_list
            })
      },

      getBasicNameList() {
          let _data = {
              username: this.username,
              access_token: this.access_token
          }
          this.$api.baseNames(_data)
            .then(res=>{
                this.basicNameList = res.data.data
            })
      }

    }
  }
</script>

<style>

</style>
