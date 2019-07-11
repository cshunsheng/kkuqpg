<template>
  <div id="shop_nav__container">
    <el-row :gutter="15" class="box">
      <el-col :span="4">
        <div class="add-wrap">
          <slot name="add-btn"></slot>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="select-wrap full-box">
          <el-select :value="selectType" placeholder="请选择" @change="selectChange">
            <el-option v-for="(item, index) in selectList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="input-wrap full-box">
          <!-- <el-autocomplete
            class="block-input"
            :value="inputValue"
            :value-key="keyName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect">
          </el-autocomplete> -->
          <el-input :value="inputVal" placeholder="请输入内容" @input="valueChange"></el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button class="full-btn" type="primary" @click.stop="search">搜索</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      selectList: [{
        name: "商品名称",
        id: 2
      }, {
        name: "商品id",
        id: 1
      }],
      keyName: 'name',          // 搜索匹配键名
    }
  },
  props: ['productList', 'type', 'userData', 'inputVal'],

  computed: {
    ...mapGetters([
      'selectType',
      // 'inputValue',
      // 'inputBasicValue'
    ])
  },

  created() {
    if (this.type === 1) {
      let _selectList = [
        { name: "商品名称", id: 2 },
        { name: '商品ID', id: 1 }
      ]
      this.selectList = [].concat(_selectList)
    }
  },

  methods: {
    search() {
      this.$emit('updatePage', 1)
      let key_word = this.type == 1 ? this.$store.state.shopAdmin.inputValue : this.$store.state.shopAdmin.inputBasicValue
      let data = {
        key_word_type: this.selectType,
        key_word: key_word,
        page_num: 1,
        page_size: 20,
        is_combination: this.type
      };
      data = Object.assign({}, data, this.userData)
      this.$api.pmBaselist(data).then(res => {
          this.$store.commit('COMBOLIST', {
            list: res.data.data.product_list
          });
          this.$store.commit('COMBOLISTTOTAL', { total: Number(res.data.data.total_num) })
        })
    },
    selectChange(type) {
      this.$store.dispatch('CHANGESELECTTYPE', {
        selectType: type
      })
    },
    //change 实时改变value值
    valueChange(value) {
      let type = 'CHANGEINPUTVALUE'
      let key = 'inputValue'
      if (this.type == 0) {
        key = 'inputBasicValue'
        type = 'CHANGEBASICINPUTVALUE'
      }
      this.$store.dispatch(type, {
        [key]: value
      })
    },
  },
}
</script>

<style>
#shop_nav__container {
	height: 40px;
	margin-bottom: 20px;
}

#shop_nav__container .box {
	width: 100%;
}

#shop_nav__container > div {
	height: 100%;
}

#shop_nav__container .block-input {
	width: 100%;
	display: block;
}

#shop_nav__container .full-box,
#shop_nav__container .full-btn {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
