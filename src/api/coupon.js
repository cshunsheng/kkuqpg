import $axios from '../utils/http'

/**
 * 优惠券后台管理
 */

export default {
  //券列表
  oneCouponList(page, page_size, all, type, type_id) {
    return $axios.post('/coupon/list', {
      page,
      page_size,
      all,
      type,
      type_id
    })
  },
  //操作记录
  showLog(id, action, page, page_size) {
    return $axios.post('/coupon/operatelog', {
      id,
      action,
      page,
      page_size
    })
  },
  // 添加券
  addCoupon(access_token, name, type, username, coupon_id) {
    return $axios.post('/coupon/add', {
      access_token,
      name,
      type,
      username,
      coupon_id
    })
  },
  // 发放
  putout(access_token, coupon_id, is_putout, username) {
    return $axios.post('/coupon/putout', {
      access_token,
      coupon_id,
      is_putout,
      username
    })
  },
  // 获取优惠券类型
  typeList() {
    return $axios.post('/coupon/typelist', {})
  },
  //添加单券
  addOneCoupon({
    access_token,
    channel,
    coupon_desc,
    coupon_value,
    cs_note,
    expired_days,
    is_putout,
    min_use_value,
    name,
    type,
    username,
    coupon_id
  }) {
    return $axios.post('/coupon/add', {
      access_token,
      channel,
      coupon_desc,
      coupon_value,
      cs_note,
      expired_days,
      is_putout,
      min_use_value,
      name,
      type,
      username,
      coupon_id
    })
  },
  // 获取套餐券的详情信息
  getCouponList(id_coupon, type) {
    return $axios.post('/coupon/baseinfo', {
      id_coupon,
      type
    })
  },
  //给套餐券添加单券
  addMoreCoupons(access_token, id_coupon, id_singles, username) {
    return $axios.post('/coupon/addsingle2combo', {
      access_token,
      id_coupon,
      id_singles,
      username
    })
  },
  //获取已绑定商品列表
  getProducts1(
    access_token,
    id_coupon,
    page,
    page_size,
    type,
    username,
    keyword
  ) {
    return $axios.post('/coupon/couponproductlist', {
      access_token,
      id_coupon,
      page,
      page_size,
      type,
      username,
      keyword
    })
  },
  //获取未绑定商品列表
  getProducts2(access_token, id_coupon, type, username, keyword) {
    return $axios.post('/coupon/couponproductlist', {
      access_token,
      id_coupon,
      type,
      username,
      keyword
    })
  },
  //添加商品
  addProducts(access_token, id_coupon, id_products, username) {
    return $axios.post('/coupon/addproduct2coupon', {
      access_token,
      id_coupon,
      id_products,
      username
    })
  },
  // 删除商品
  delProducts(access_token, id_coupon, id_product, username) {
    return $axios.post('/coupon/editproductcoupon', {
      access_token,
      id_coupon,
      id_product,
      username
    })
  },
  // 途径列表
  sourceList() {
    return $axios.post('/coupon/sourcelist', {})
  },
  // 添加途径列表
  addSource(access_token, coupon_id, source_desc, username) {
    return $axios.post('/coupon/addsource', {
      access_token, coupon_id, source_desc, username
    })
  },
  // 删除途径列表
  editSource(access_token, coupon_id, source_desc, username, id) {
    return $axios.post('/coupon/editsource', {
      access_token, coupon_id, source_desc, username, id
    })
  }
}
