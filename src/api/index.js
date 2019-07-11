
import $axios from '../utils/http'
import ShopApi from './shop.js'
import agentApi from './agent.js'
import couponApi from './coupon.js'
import chatApi from './chat.js'
import dealerApi from './dealer.js'
import PssmApi from './pssm.js';
const defaultApi = {
  /*
   * 首页运营
   */
  // banner 运营
  // banner列表
  apost_list({ access_token, username, action }) {
    return $axios.post('/apost/list', {
      access_token,
      username,
      action // action = 'view'
    })
  },
  // banner添加
  apost_add({
    access_token,
    username,
    action,
    imgurl,
    act_url,
    id,
    pos,
    active,
    description,
    share_title,
    share_img
  }) {
    return $axios.post('/apost/add', {
      access_token,
      username,
      action, // action = 'add'
      imgurl,
      act_url,
      id,
      pos,
      active,
      description,
      share_title,
      share_img
    })
  },
  // 获取某条banner详情
  apost_view({ access_token, username, action, id }) {
    return $axios.post('/apost/view', {
      access_token,
      username,
      action,
      id
    })
  },
  // banner修改
  apost_edit({
    access_token,
    username,
    action,
    imgurl,
    act_url,
    pos,
    active,
    description,
    id,
    share_title,
    share_img
  }) {
    return $axios.post('/apost/edit', {
      access_token,
      username,
      action, // action = 'edit'
      imgurl,
      act_url,
      pos,
      active,
      description,
      id,
      share_title,
      share_img
    })
  },
  // banner删除
  apost_del({ access_token, username, action, id }) {
    return $axios.post('/apost/del', {
      access_token,
      username,
      action, // action = 'edit'
      id
    })
  },

  // 商品 运营
  // 模块列表
  apost_middleimg({ access_token, username, action }) {
    return $axios.post('/operation/middleimg', {
      access_token,
      username,
      action
    })
  },
  // 编辑模块
  apost_middleimgedit({
    access_token,
    username,
    action,
    id,
    type,
    name,
    img_url
  }) {
    return $axios.post('/operation/edit', {
      access_token,
      username,
      action,
      id,
      type,
      name,
      img_url
    })
  },
  // 青苹果精选、口碑商品、新品推荐查询接口
  shop_shoplist({ access_token, username, action, shop_type }) {
    return $axios.post('/shop/shoplist', {
      access_token,
      username,
      action,
      shop_type
    })
  },
  // 精选、口碑、新品推荐新增接口
  shop_shopadd({
    access_token,
    username,
    action,
    id_product,
    kkid,
    position,
    shop_type
  }) {
    return $axios.post('/shop/shopadd', {
      access_token,
      username,
      action,
      id_product,
      kkid,
      position,
      shop_type
    })
  },
  // 精选、口碑、新品推荐删除接口
  shop_shopdel({ access_token, username, action, id, shop_type }) {
    return $axios.post('/shop/shopdel', {
      access_token,
      username,
      action,
      id,
      shop_type
    })
  },
  // 拼团列表
  groupon_groupelist({ v }) {
    return $axios.post('/groupon/nowlist', {
      v
    })
  },
  // 限时拼团查询
  groupon_getlimittime({ access_token, username, action }) {
    return $axios.post('/groupon/getlimittime', {
      access_token,
      username,
      action
    })
  },
  // 限时拼团配置
  groupon_groupedit({ access_token, username, action, id_group }) {
    return $axios.post('/groupon/groupedit', {
      access_token,
      username,
      action,
      id_group
    })
  },

  // 文章 运营
  // 文章列表
  article_headlinelist({ access_token, username, action }) {
    return $axios.post('/article/headlinelist', {
      access_token,
      username,
      action
    })
  },
  // 新增文章
  article_headlistadd({
    access_token,
    username,
    action,
    aid,
    position,
    hid,
    headline,
    subhead
  }) {
    return $axios.post('/article/headlistadd', {
      access_token,
      username,
      action,
      aid,
      position,
      hid,
      headline,
      subhead
    })
  },
  // 删除文章
  article_headlistdel({ access_token, username, action, aid, hid }) {
    return $axios.post('/article/headlistdel', {
      access_token,
      username,
      action,
      aid,
      hid
    })
  },

  /**
   * 配置搜索关键字(关键字，销量排行)
   */
  // 关键字列表
  search_listkwd({ access_token, username }) {
    return $axios.post('/search/listkwd', {
      access_token,
      username
    })
  },
  // 关键字添加
  search_addkwd({ access_token, username, keyword, id, pos, type }) {
    return $axios.post('/search/addkwd', {
      access_token,
      username,
      keyword,
      id,
      pos,
      type
    })
  },
  // 关键字删除
  search_delkwd({ access_token, username, id }) {
    return $axios.post('/search/delkwd', {
      access_token,
      username,
      id
    })
  },
  // 销量排行榜列表
  salerank_list({ access_token, username }) {
    return $axios.post('/salerank/list', {
      access_token,
      username
    })
  },
  // 销量排行榜添加
  salerank_add({ access_token, username, id_product, pos }) {
    return $axios.post('/salerank/add', {
      access_token,
      username,
      id_product,
      pos
    })
  },
  // 销量排行榜删除
  salerank_del({ access_token, username, id }) {
    return $axios.post('/salerank/del', {
      access_token,
      username,
      id
    })
  },
  // 销量排行榜商品下拉列表
  salerank_prodlist({ access_token, username }) {
    return $axios.post('/salerank/prodlist', {
      access_token,
      username
    })
  },

  /**
   * 角标配置
   */
  // 列表
  cornertags_list({ access_token, username }) {
    return $axios.post('/cornertags/list', {
      access_token,
      username
    })
  },
  // 查看
  cornertags_view({ access_token, username, id }) {
    return $axios.post('/cornertags/view', {
      access_token,
      username,
      id
    })
  },
  // 添加
  cornertags_add({ access_token, username, title, img_url }) {
    return $axios.post('/cornertags/add', {
      access_token,
      username,
      title,
      img_url
    })
  },
  // 显示／隐藏
  cornertags_delete({ access_token, username, id, active }) {
    return $axios.post('/cornertags/delete', {
      access_token,
      username,
      id,
      active
    })
  },
  // 编辑
  cornertags_edit({ access_token, username, id, img_url, title }) {
    return $axios.post('/cornertags/edit', {
      access_token,
      username,
      id,
      img_url,
      title
    })
  },

  /*
   * 工具类接口
   */
  // 上传图片
  upload_file({ path }) {
    return $axios.post('/upload/file', {
      path
    })
  },

  /*
   * 科普文章模块
   */
  // 新增科普文章
  article_add({
    access_token,
    author,
    share_image,
    belong,
    content,
    show_type,
    title,
    username
  }) {
    return $axios.post('/article/add', {
      access_token,
      author,
      share_image,
      belong,
      content,
      show_type,
      title,
      username
    })
  },
  // 文章详情
  article_view({ access_token, username, aid }) {
    return $axios.post('/article/view', {
      access_token,
      username,
      aid
    })
  },
  // 编辑文章
  article_edit({
    access_token,
    username,
    active,
    aid,
    author,
    share_image,
    belong,
    content,
    show_type,
    title,
    viewed
  }) {
    return $axios.post('/article/edit', {
      access_token,
      active,
      aid,
      author,
      share_image,
      belong,
      content,
      show_type,
      title,
      username,
      viewed
    })
  },
  // 删除文章
  article_delete({ access_token, aid, username, active }) {
    return $axios.post('/article/delete', {
      access_token,
      aid,
      username,
      active
    })
  },
  // 文章列表
  article_search({ access_token, username, keyword, page }) {
    return $axios.post('/article/search', {
      access_token,
      username,
      keyword,
      page
    })
  },

  /*
   * 商品评论模块
   */
  // 商品列表
  comment_productlist() {
    return $axios.post('/comment/productlist')
  },
  com_pro_list({is_doc, type}) {
    return $axios.post('/comment/productlist',{
      is_doc,
      type
    })
  },

  // 外部评论 - 获取外部评论信息
  comment_externalinfo({ page_num, page_size, keyword }) {
    return $axios.post('/comment/externalinfo', {
      page_num,
      page_size,
      keyword
    })
  },

  // 获取商品的外部评论
  comment_getexternal({
    id_product,
    only_display,
    have_picture,
    page_num,
    page_size,
    id_source
  }) {
    return $axios.post('/comment/getexternal', {
      id_product,
      id_source,
      only_display,
      have_picture,
      page_num,
      page_size
    })
  },
  // 获取商品的自然评论
  comment_getnature({
    keyword,
    only_negative,
    have_picture,
    page_num,
    page_size
  }) {
    return $axios.post('/comment/getnature', {
      keyword,
      only_negative,
      have_picture,
      page_num,
      page_size
    })
  },
  // 展示隐藏评论
  comment_display({ id_comment, display, operator }) {
    return $axios.post('/comment/display', {
      id_comment,
      display,
      operator
    })
  },
  // 倒入外部评论
  comment_importexternal({ id_product, url_jd, url_tm, operator }) {
    return $axios.post('/comment/importexternal', {
      id_product,
      url_jd,
      url_tm,
      operator
    })
  },

  /** 订单模块 */
  // 获取订单列表
  getOrderList(params) {
    return $axios.post('/order2/get', {
      begin_date: params.beginDate, // 开始日期
      end_date: params.endDate, // 结束日期
      ignore_test: params.ignore_test, // 是否是首次下单: 1是, 0否, 为-1时表示无此限制
      order_status: params.status, // 订单状态: 1待付款, 2已付款, 4已发货, 6已取消, 7已退款, 13已签收, 为-1时表示无此限制
      order_source: params.source, // 订单来源
      order_type: params.type, // 订单类型
      page_num: params.num, // 第几页
      page_size: params.size, // 一页显示多少评论
      key_word_type: params.key_word_type,
      key_word: params.key_word,
      username: params.username,
      access_token: params.access_token,
      is_virtual: params.virtual //实物Or虚拟
    })
  },
  // 订单详情页
  getOrderInfos(orderId) {
    return $axios.post('/order2/orderdetail', {
      id_order: orderId
    })
  },
  // 修改订单状态
  modifyOrderStatus (orderId, operator, status,reason,remark) {
    return $axios.post('/order2/modifyorderstatus', {
      'id_order': orderId,
      'operator': operator,
      'order_status': status,
      'reason':reason,
      'remark':remark
    })
  },

  // 修改订单备注
  modifyNote(orderId, operator, note) {
    return $axios.post('/order2/modifycustomernote', {
      id_order: orderId,
      operator: operator,
      customer_note: note
    })
  },
  // 搜索推荐医生
  searchDoctor(id_doctor) {
    return $axios.post('/order2/doctorinfo', {
      id_doctor: id_doctor
    })
  },
  // 修改推荐医生
  editDoctor(id_order, operator, doctor) {
    return $axios.post('/order2/modifydoctor', {
      id_order: id_order,
      operator: operator,
      doctor_info: doctor
    })
  },
  // 修改物流信息
  editDelivery(id_order, operator, delivery_info) {
    return $axios.post('/order2/modifydelivery', {
      id_order: id_order,
      operator: operator,
      delivery_info: delivery_info
    })
  },
  // 获取订单来源列表和订单类型列表
  sourceType() {
    return $axios.post('/order/ordertype', {})
  },

  // 导出订单列表
  exportList(
    beginDate,
    endDate,
    ignore_test,
    status,
    source,
    type,
    key_word_type,
    key_word,
    virtual
  ) {
    return $axios({
      url: '/order2/export',
      method: 'POST',
      params: {
        begin_date: beginDate, // 开始日期
        end_date: endDate, // 结束日期
        ignore_test: ignore_test, // 忽略测试订单 - 1:忽略, 0:不忽略
        order_status: status, // 订单状态: 1待付款, 2已付款, 4已发货, 6已取消, 7已退款, 13已签收, 为-1时表示无此限制
        order_source: source, // 订单来源
        order_type: type, // 订单类型
        key_word_type: key_word_type, // 搜索 - 关键字类型 0无此限制, 1电话, 2客户姓名, 3推荐医生id, 4订单号, 5金额, 6推荐医生名字
        key_word: key_word, // 搜索 - 关键字
        is_virtual: virtual //订单属性
      },
      responseType: 'blob'
    })
  },

  /**
   * 新零售（货柜管理、商品管理、业绩管理、盘点管理）
   */
  /** 业绩管理 */
  // 获取业绩管理
  performanceList(beginDate, endDate, status, size, num) {
    return $axios.post('/cabinet/stockoutget', {
      date_begin: beginDate, // 开始日期
      date_end: endDate, // 结束日期
      order_status: status, // 订单状态, -1表示无此限制
      page_size: size, // 每页显示数量
      page_num: num // 第几页
    })
  },
  // 业绩详情
  performanceDetail(id_order) {
    return $axios.post('/cabinet/stockoutdetail', {
      id_order: id_order
    })
  },
  // 导出业绩管理
  exportPerList(status) {
    return $axios({
      url: '/cabinet/stockoutexport',
      method: 'POST',
      params: {
        order_status: status // // 1待付款, 2已付款, 4已发货, 6已取消, 7已退款, 13已完成, -1表示无此限制
      },
      responseType: 'blob'
    })
  },

  // 货柜管理 - 列表
  getVendingList(status, num, size) {
    return $axios.post('/cabinet/cabinetget', {
      active_status: status, // 激活状态: 1已激活, 0未激活
      page_num: num,
      page_size: size
    })
  },

  // 货柜管理 - 激活
  addVending(params, hospital, province, city) {
    return $axios.post('/cabinet/cabinetactive', {
      id_cabinet: params.id_cabinet,
      cabinet_name: params.cabinet_name,
      cabinet_address: params.cabinet_address,
      cabinet_status: params.cabinet_status,
      charge_person: params.charge_person,
      id_hospital: hospital,
      id_province: province,
      id_city: city
    })
  },

  // 货柜管理 - 省
  getProvince() {
    return $axios.post('/cabinet/hospitalprovince', {})
  },

  // 货柜管理 - 市
  getCity(provinceId) {
    return $axios.post('/cabinet/hospitalarea', {
      province_id: provinceId
    })
  },
  // 货柜管理 - 绑定医院
  getHospital(cityId) {
    return $axios.post('/cabinet/hospitallist', {
      area_id: cityId
    })
  },
  // 货柜管理 - 编辑
  editVending(params) {
    return $axios.post('/cabinet/cabinetedit', {
      cd_key: params.cd_key,
      cabinet_name: params.cabinet_name,
      cabinet_address: params.cabinet_address,
      cabinet_status: params.cabinet_status,
      charge_person: params.charge_person,
      id_cabinet: params.id_cabinet,
      id_hospital: params.id_hospital,
      id_province: params.id_province,
      id_city: params.id_city
    })
  },

  // 货道管理 - 获取
  tracks() {
    return $axios.post('/cabinet/counterget', {})
  },

  // 货道管理 - 编辑数量
  eidtCount(row, column, num) {
    // 行数，列数，数量
    return $axios.post('/cabinet/counteradd', {
      row,
      column,
      num
    })
  },
  // 货道管理 - 搜索可用商品列表
  getTrackProductList(key_word) {
    return $axios.post('/cabinet/counterproductlist', {
      key_word
    })
  },
  // 货道管理 - 分配商品
  assignTrack(row, column, id_product, num) {
    // 行数，列数，商品id，数量
    return $axios.post('/cabinet/counterassign', {
      row,
      column,
      id_product,
      num
    })
  },
  // 货道管理 - 清除货道
  clearTrack(row, column) {
    // 行数，列数
    return $axios.post('/cabinet/counterclear', {
      row,
      column
    })
  },
  //库存- 获取(商品管理)
  cabinet_stockget({ page_size, page_num }) {
    return $axios.post('/cabinet/stockget', {
      page_size,
      page_num
    })
  },
  //入库 - 新增(新建商品)
  cabinet_stockinadd({ id_product, num_in }) {
    return $axios.post('/cabinet/stockinadd', {
      id_product,
      num_in
    })
  },
  //入库 - 编辑(编辑商品)
  cabinet_stockinedit({ id_stock, product_num }) {
    return $axios.post('/cabinet/stockedit', {
      id_stock,
      product_num
    })
  },
  // 查看商品价钱信息
  cabinet_productinfo({ id_product }) {
    return $axios.post('/cabinet/stockinproductinfo', {
      id_product
    })
  },

  // 获取进销存库存商品列表
  cabinet_stockinproductlist() {
    return $axios.post('/cabinet/stockinproductlist')
  },

  // 推广大使
  // 用户管理 - 用户列表
  // 获取进销存库存商品列表
  generalizeAccounts(access_token, username, page) {
    return $axios.post('/recommender/userlist', {
      access_token,
      username,
      page
    })
  },
  // 单个用户详情
  accountInfo(access_token, username, uid) {
    return $axios.post('/recommender/userdetail', {
      access_token,
      username,
      uid
    })
  },
  // 编辑用户信息
  accountEdit(params, access_token, username, action) {
    return $axios.post('/recommender/useredit', {
      alipay: params.alipay, // 支付宝
      father_id: params.father_id,
      head_picture: params.head_picture, // 头像
      mobile_number: params.mobile_number,
      uid: params.user_id, // userId
      user_name: params.user_name, // 推荐人
      access_token,
      username, // 操作人
      action
    })
  },
  // 删除用户
  deleteAccount(access_token, username, uid, action) {
    return $axios.post('/recommender/useredit', {
      access_token,
      username,
      uid,
      action
    })
  },
  // 商品列表
  generalizeProductList(access_token, username, page) {
    return $axios.post('/recommender/productlist', {
      access_token,
      username,
      page
    })
  },
  //获取推广大使分类
  getCategoryList(access_token, username, id_product) {
    return $axios.post('/recommender/categorylist', {
      access_token,
      username,
      id_product
    })
  },
  // 商品置顶
  productStick(access_token, username, id) {
    return $axios.post('/recommender/productstick', {
      access_token,
      username,
      id
    })
  },
  // 添加商品
  addGeneralizeProduct(access_token, username, id_product, id_category) {
    return $axios.post('/recommender/productadd', {
      access_token,
      username,
      id_product,
      id_category
    })
  },
  searchGeneralizePro(id_product) {
    return $axios.post('/product/get', {
      id_product
    })
  },
  // 编辑商品
  editGeneralizeProduct(access_token, username, action, id_product) {
    return $axios.post('/recommender/productedit', {
      access_token,
      username,
      action,
      id_product
    })
  },
  //获取推广大使提现系数
  getConfig(access_token, username) {
    return $axios.post('/recommender/getconfig', {
      access_token,
      username
    })
  },
  //修改推广大使提现系数
  editConfig(access_token, username, type, id, num) {
    return $axios.post('/recommender/editconfig', {
      access_token,
      username,
      type,
      id,
      num
    })
  },
  //获取推广大使提现系数
  getAgencyConfig(access_token, username) {
    return $axios.post('/agency/getconfig', {
      access_token,
      username
    })
  },
  //修改推广大使提现系数
  editAgencyConfig(access_token, username, type, id, num) {
    return $axios.post('/agency/editconfig', {
      access_token,
      username,
      type,
      id,
      num
    })
  },
  // 提现申请列表
  applyList(access_token, username, date_str, page) {
    return $axios.post('/recommender/withdraw', {
      access_token,
      username,
      date_str,
      page
    })
  },
  // 导出提现申请
  exportApply(access_token, username, date_str) {
    return $axios({
      url: '/recommender/export',
      method: 'POST',
      params: {
        access_token: access_token,
        username: username,
        date_str: date_str
      },
      responseType: 'blob'
    })
  },

  // 白名单
  getWhiteList(access_token, username, page) {
    return $axios.post('/recommender/whitelist', {
      access_token,
      username,
      page
    })
  },
  // 添加白名单用户
  addWhiteList(access_token, username, user_name, type, phone) {
    return $axios.post('/recommender/addwhiteuser', {
      access_token,
      username,
      user_name,
      type,
      phone
    })
  },
  // 删除白名单用户
  deleteWhiteList(access_token, username, id) {
    return $axios.post('/recommender/delwhiteuser', {
      access_token,
      username,
      id
    })
  },
  // 推广素材 - 获取活动列表
  getFodderList({ keyword = '', page, page_size, type }) {
    //type 1-商品名，2-商品id
    return $axios.post('/recommender/materiallist', {
      keyword,
      page,
      page_size,
      type
    })
  },
  // 推广素材 - 编辑商品，选择商品
  searchFodderProductList(name) {
    return $axios.post('/recommender/materialproducts', {
      name
    })
  },
  // 保存推广素材
  saveFodder({
    access_token,
    username,
    id_product,
    images,
    share_description
  }) {
    return $axios.post('/recommender/addmaterial', {
      access_token,
      username,
      id_product,
      images,
      share_description
    })
  },
  // 获取推广素材信息
  getFodderInfo({ access_token, username, id_product }) {
    return $axios.post('/recommender/materialinfo', {
      access_token,
      username,
      id_product
    })
  },

  /*
  拼团商品管理
  */

  //排序列表
  groupSort(id_category, type, page) {
    return $axios.post('/groupon/categrouponlist', {
      id_category: id_category,
      type: type,
      page: page
    })
  },
  //置顶
  makTop(access_token, id, is_top, username) {
    return $axios.post('/groupon/maketop', {
      access_token: access_token,
      id: id,
      is_top: is_top,
      username: username
    })
  },

  //变换位置
  exPos(access_token, id, move, username) {
    return $axios.post('/groupon/expos', {
      access_token: access_token,
      id: id,
      move: move,
      username: username
    })
  },

  // 获取拼团商品列表
  groupProductList(keyword, type, page) {
    return $axios.post('/groupon/list', {
      keyword: keyword,
      type: type,
      page: page
    })
  },
  //上下线
  getOnline(access_token, id_group, is_online, username) {
    return $axios.post('/groupon/online', {
      access_token: access_token,
      id_group: id_group,
      is_online: is_online,
      username: username
    })
  },
  //新增拼团商品
  addGroupProduct(params) {
    return $axios.post('/groupon/add', {
      access_token: params.access_token,
      username: params.username,
      discount_amount: params.discount_amount,
      from_date: params.from_date,
      to_date: params.to_date,
      is_auto_finish: params.is_auto_finish,
      is_online: params.is_online,
      is_same_price: params.is_same_price,
      virtual_inventory: params.virtual_inventory,
      limit_new: params.limit_new,
      limit_quantity: params.limit_quantity,
      limited_time: params.limited_time,
      limited_vouchers: params.limited_vouchers,
      p_kkid: params.p_kkid,
      part_num: params.part_num,
      product_description: params.product_description,
      share_description: params.share_description,
      share_image: params.share_image,
      share_title: params.share_title,
      take_part_amount: params.take_part_amount,
      vouchers: params.vouchers,
      is_postage_free: params.is_postage_free
    })
  },
  //获取团详情
  getGroupSet(access_token, id_group, username) {
    return $axios.post('/groupon/view', {
      access_token: access_token,
      id_group: id_group,
      username: username
    })
  },
  //编辑拼团
  editGroupSet(params) {
    return $axios.post('groupon/edit', {
      access_token: params.access_token,
      username: params.username,
      discount_amount: params.discount_amount,
      from_date: params.from_date,
      to_date: params.to_date,
      is_auto_finish: params.is_auto_finish,
      is_online: params.is_online,
      is_same_price: params.is_same_price,
      virtual_inventory: params.virtual_inventory,
      limit_new: params.limit_new,
      limit_quantity: params.limit_quantity,
      limited_time: params.limited_time,
      limited_vouchers: params.limited_vouchers,
      part_num: params.part_num,
      product_description: params.product_description,
      share_description: params.share_description,
      share_image: params.share_image,
      share_title: params.share_title,
      take_part_amount: params.take_part_amount,
      vouchers: params.vouchers,
      id_group: params.id_group,
      is_postage_free: params.is_postage_free
    })
  },
  //拼团操作记录
  recordGroup(id_group, access_token, username) {
    return $axios.post('groupon/log', {
      id_group: id_group,
      access_token: access_token,
      username: username
    })
  },

  /*
  分类商品
  * */
  //获取父类以及对应的子类列表
  getClassList(access_token, username, page_num, page_size, id_parent) {
    return $axios.post('/pm/parentclasslist', {
      access_token: access_token,
      username: username,
      page_num: page_num,
      page_size: page_size,
      id_parent: id_parent
    })
  },
  //删除父类、子类
  delSort(access_token, username, id) {
    return $axios.post('/pm/parentclassdel', {
      access_token: access_token,
      username: username,
      id: id
    })
  },
  //获取子类详情
  getSubView(
    access_token,
    username,
    id,
    action,
    name,
    position,
    id_parent,
    img_kkh_url,
    active
  ) {
    return $axios.post('/pm/parentclassedit', {
      access_token: access_token,
      username: username,
      id: id,
      action: action
    })
  },
  // 编辑子类
  EditSubView(params) {
    return $axios.post('/pm/parentclassedit', {
      access_token: params.access_token,
      username: params.username,
      id: params.id,
      action: params.action,
      name: params.name,
      position: params.position,
      id_parent: params.id_parent,
      img_kkh_url: params.img_kkh_url,
      active: params.active
    })
  },
  //新增子类
  addSubView(params) {
    return $axios.post('/pm/parentclassadd', {
      access_token: params.access_token,
      username: params.username,
      action: params.action,
      name: params.name,
      position: params.position,
      id_parent: params.id_parent,
      img_kkh_url: params.img_kkh_url,
      active: params.active
    })
  },

  /*
  科室管理
  * */
  //获取科室列表
  getDerList(access_token, username) {
    return $axios.post('/pm/getdepartment', {
      access_token,
      username
    })
  },
  //获取科室详情
  getDerView(access_token, username, id) {
    return $axios.post('/pm/departmentinfo', {
      access_token,
      username,
      id
    })
  },
  //新增科室
  addDer(params) {
    return $axios.post('/pm/adddepartment', {
      access_token: params.access_token,
      username: params.username,
      name: params.name,
      position: params.position,
      active: params.active
    })
  },
  //编辑科室
  editDer(params) {
    return $axios.post('/pm/editdepartment', {
      access_token: params.access_token,
      username: params.username,
      id: params.id,
      name: params.name,
      position: params.position,
      active: params.active
    })
  },
  //删除科室
  delDerView(access_token, username, id) {
    return $axios.post('/pm/deldepartment', {
      access_token,
      username,
      id
    })
  },
  //获取科室商品列表
  getDerProList(access_token, username, id_department) {
    return $axios.post('/pm/departmentproduct', {
      access_token,
      username,
      id_department
    })
  },
  //添加科室商品
  addDepartPro(access_token, username, id_department, id_product, position) {
    return $axios.post('/pm/adddepartproduct', {
      access_token,
      username,
      id_department,
      id_product,
      position
    })
  },
  //删除科室商品
  getDelProList(access_token, username, id) {
    return $axios.post('/pm/deldepartproduct', {
      access_token,
      username,
      id
    })
  },
  // 科室添加商品列表
  department_productlist(is_doc) {
    return $axios.post('/comment/productlist', {
      is_doc
    })
  },
  //邮费管理 获取邮费信息
  getexpress(username, access_token) {
    return $axios.post('/postage/getexpress', {
      username,
      access_token
    })
  },
  //更新邮费信息
  eidtExpress(username, access_token, id, exempt_num, ykg_money) {
    return $axios.post('/postage/editexpress', {
      username,
      access_token,
      id,
      exempt_num,
      ykg_money
    })
  },
  //打印电子面单
  ewaybill({ username, access_token, id_order }) {
    return $axios.post('/zto/ewaybill', {
      username,
      access_token,
      id_order
    })
  },
   //打印电子面单记录
   ewaybillRecord({username,access_token,id_order}){
    return $axios.post('/printer/record',{
      username,
      access_token,
      id_order
    })
  },
  //商品规格列表
  getProductAttirbuteList({ username, access_token, keywords }) {
    return $axios.post('/attribute/list', {
      username,
      access_token,
      keywords
    })
  }
}

const combinApi = Object.assign({}, defaultApi, ShopApi,PssmApi, agentApi, couponApi,chatApi,dealerApi)

export default combinApi
