import $axios from '../utils/http'

/**
 * 商品后台管理
 */


// 基础商品
export default {
  //设置属性是否显示(市场价 平台价 虚拟库存)
  setVisible({ access_token, username, id_product_attribute,type,visible,price,wholesale_price,quantity }) {
    return $axios.post('/attribute/setvisible', {
      access_token, username, id_product_attribute,type,visible,price,wholesale_price,quantity
    })
  },
  //组合商品配置保存
  setAttr({ access_token, username, combination_id_product }) {
    return $axios.post('/pm/setattribute', {
      access_token,
      username,
      combination_id_product
    })
  },
  //获取进销存商品库中所有商品
  specList({ access_token, username, id_product, is_combination,id_group }) {
    return $axios.post('/pm/getattributelist', {
      access_token,
      username,
      id_product,
      is_combination,
      id_group
    })
  },
  //删除组合商品配置
  delCom({access_token, username, id}) {
    return $axios.post('/pm/delcombination', {
      access_token,
      username,
      id
    })
  },
  // 商品列表
  pmBaselist ({is_combination,access_token, username, key_word, key_word_type, page_num, page_size,type}) {
    return $axios.post('/pm/baselist', {
      is_combination,
      access_token,
      username,
      key_word,
      key_word_type,
      page_num,
      page_size,
      type
    })
  },
  //获取基础商品的信息
  pmBasicView({username,access_token,id_product,p_kkid}){
    return $axios.post('/pm/getproduct',{
      username,
      access_token,
      id_product,
      p_kkid
    })
  },
  // 新增/编辑基本信息和sku
  pmBaseaddedit ({
    access_token, username, type, is_combination, id_product,p_kkid, name, madein, cornertag,
    allowed_coupon, guige, short_msg, id_category,department,price,wholesale_price,doc_rewards,
    ambassador_rewards,doctor_visible,patient_visible,active,position,quantity,id_stock_product,
    is_virtual
  }) {
    return $axios.post('/pm/productadd', {
      access_token,
      username,
      type,
      is_virtual,
      is_combination,
      id_product,
      p_kkid,
      name,
      madein,
      cornertag,
      allowed_coupon,
      guige,
      short_msg,
      id_category,
      department,
      price,
      wholesale_price,
      doc_rewards,
      ambassador_rewards,
      doctor_visible,
      patient_visible,
      active,
      position,
      quantity,
      id_stock_product
    })
  },
  // 获取产地列表
  pmBaseprovenancelist({access_token, username, id}) {
    return $axios.post('/pm/baseprovenancelist', {
      access_token,
      username
    })
  },

  // 获取商品二级分类列表
  pmBasereclassifylist ({access_token, username}) {
    return $axios.post('/pm/basereclassifylist', {
      access_token,
      username
    })
  },
  // 获取科室列表
  pmBasesectionlist ({access_token, username, id}) {
    return $axios.post('/pm/getdepartment', {
      access_token,
      username
    })
  },
  // 获取sku列表
  pmBaseskulist ({access_token, username, id}) {
    return $axios.post('/pm/baseskulist', {
      access_token,
      username
    })
  },
  // 操作记录
  pmBaseoperationlist ({id_product, page_num, page_size}) {
    return $axios.post('/pm/baseoperationlist', {
      id_product,
      page_num,
      page_size
    })
  },
  // 保存图片
  saveImg({username, access_token, type,id_product,cover,is_detail_pic,is_diploma,is_combination,images}) {
    return $axios.post('/pm/muladdimage', {
        username,   //后台登录名
        access_token, //后台登录token
        type,  //操作类型  1 
        id_product,  //商品id
        cover,      //是否是头图  1 是 0 否
        is_detail_pic,  //是否是详情  1 是  0 否
        is_diploma,    //是否是证书  1 是  0 否
        is_combination,     // 0基础商品 1组合商品
        images
    })
  },
  // 编辑图片
  editImgs ({username, access_token,id_product}) {
    return $axios.post('/pm/delcombination', {
      username,
      access_token,
      id_product
    })
  },
  // 添加组合商品配置
  addCombination ({username, access_token, combination_id_product,id_product,quantity,short_name}) {
    return $axios.post('/pm/addcombination', {
      username,
      access_token,
      combination_id_product,
      id_product,
      quantity,
      short_name
    })
  },
  // 删除组合商品配置
  delCombination ({username, access_token,id_product}) {
    return $axios.post('/pm/delcombination', {
      username,
      access_token,
      id_product
    })
  },
  // 获取组合商品配置
  getCombination ({username, access_token,id_product}) {
    return $axios.post('/pm/getcombination', {
      username,
      access_token,
      id_product
    })
  },
  // 葵花码
  kuihua(id_product,size){
    return $axios.post('https://mx.kangkanghui.com/tools/xqrcode',{
        id_product,
        size,
        path: '/pages/shop/detail',
    })
  },
  // 心跳团列表
  bargainList(type,page,page_size,keyword) {
    return $axios.post('/bargain/list',{
        type,
        page,
        page_size,
        keyword
    })
  },
  // 创建心跳团
  createBargain(access_token,username,parama) {
    return $axios.post('/bargain/add',{
        access_token,//后台用户token
        username,//后台用户名
        bottom_amount:parama.bottom_amount, //下限价
        from_date:parama.from_date,//开始时间
        to_date:parama.to_date,//结束时间
        is_limit_time:parama.is_limit_time,//是否是首页限时拼团
        is_online:parama.is_online,//是否上线
        part_num:parama.part_num,//参与人数
        product_description:parama.product_description,//商品描述
        share_description:parama.share_description,//分享描述
        share_image:parama.share_image,//分享图片
        share_title:parama.share_title,//分享标题
        master_amount:parama.master_amount,//满足人数时的团长价
        vouchers:parama.vouchers, //团长可以以团长价购买商品时需要邀请的砍价人数
        p_kkid:parama.p_kkid//商品kkid

    })
  },
  // 编辑心跳团
  editBargain(access_token,username,parama) {
    return $axios.post('/bargain/edit',{
        access_token,//后台用户token
        username,//后台用户名
        bottom_amount:parama.bottom_amount, //下限价
        from_date:parama.from_date,//开始时间
        to_date:parama.to_date,//结束时间
        is_limit_time:parama.is_limit_time,//是否是首页限时拼团
        is_online:parama.is_online,//是否上线
        part_num:parama.part_num,//参与人数
        product_description:parama.product_description,//商品描述
        share_description:parama.share_description,//分享描述
        share_image:parama.share_image,//分享图片
        share_title:parama.share_title,//分享标题
        master_amount:parama.master_amount,//满足人数时的团长价
        vouchers:parama.vouchers, //团长可以以团长价购买商品时需要邀请的砍价人数
        id_group:parama.id_group//团kkid
    })
  },
  // 获取心跳团信息
  bargianInfos(access_token,username,id_group) {
    return $axios.post('/bargain/view',{
        access_token,
        username,
        id_group
    })
  },
  // 团上下线
  onlineEidt(access_token,username,is_online,id_group) {
    return $axios.post('/bargain/online',{
        access_token,
        username,
        is_online,
        id_group
    })
  },
  // 可置顶列表
  bargainSortList(id_category) { // 参数写死 1
    return $axios.post('/bargain/categrouponlist',{
        id_category
    })
  },
  bargainTop(access_token,username,id) {
    return $axios.post('/bargain/maketop',{
        access_token,
        username,
        id
    })
  },
  // 首页心跳团设置 - 上线心跳团列表
  onlineBargainlist(access_token,username) {
    return $axios.post('/bargain/nowlist',{
        access_token,
        username
    })
  },
  // 首页心跳团设置 - 已设置好的信息
  indexBargainInfo(v) {
    return $axios.post('/bargain/getlimittime',{
        v
    })
  },
  // 首页心跳团设置 - 选择设置
  indexBargainSet(id_group) {
    return $axios.post('/bargain/bargainedit',{
        id_group
    })
  },
  // 设置团属性信息
  editCouponSku({access_token,username,discount_amount,take_part_amount,virtual_inventory,visible,id}) {
    return $axios.post('/groupon/setattribute',{
        access_token,
        username,
        discount_amount,    //团长价
        take_part_amount,   //拼团价
        virtual_inventory,  //虚拟库存
        visible,            //是否上线  1 上线 0 下线
        id                  //修改的那条属性的自增 ID
    })
  },
  //节假日列表
  holidayList({access_token,username}) {
    return $axios.post('/holiday/list',{
      access_token,
      username           
    })
  },
  //获取某个节假日详情信息
  getHoliday({access_token,username,id_holiday}) {
    return $axios.post('/holiday/getholiday',{
      access_token,
      username,
      id_holiday          
    })
  },
  //添加修改节假日信息
  addOREditHoliday({access_token,username,id_holiday,holiday_name,date_start,date_end,active,type}) {
    return $axios.post('/holiday/addholiday',{
      access_token,
      username,
      id_holiday,
      holiday_name,
      date_start,
      date_end,
      active,
      type        
    })
  },
  //修改节假日状态
  editHolidayActive({access_token,username,id_holiday,active}) {
    return $axios.post('/holiday/editactive',{
      access_token,
      username,
      id_holiday,
      active          
    })
  },
  // 节假日操作记录
  getHolidayLog({access_token,username,id_holiday}) {
    return $axios.post('/holiday/operation',{
      access_token,
      username,
      id_holiday          
    })
  },
  updatedAudio(data){
    return $axios.post('/file',data,{baseURL:"http://admin-api.test.kangkanghui.com/upload"})
  },
  //获取虚拟商品音频列表/course/list
  getCourseList({username,access_token,id_product,page_num,page_size}){
    return $axios.post('/course/list',{
      username,
      access_token,
      id_product,
      page_num,
      page_size
    })
  },
  //上传课程音频/course/addcourse
  addCourse({username,access_token,id_product,course_info}){
    return $axios.post('/course/addcourse',{
      username,
      access_token,
      id_product,
      course_info
    })
  },
  //修改某个课程音频/course/addcourse
  editCourse({username,access_token,id_product,course_name,course_url,id}){
    return $axios.post('/course/editcourse',{
      username,
      access_token,
      id_product,
      course_name,
      course_url,
      id
    })
  },
  //修改某个课程上下架状态/排序/course/modifyactive
  edit2Course({username,access_token,id_product,id,active,type,position,}){
    return $axios.post('/course/modifyactive',{
      type,
      username,
      access_token,
      id_product,
      id,
      active,
      position
    })
  },
  //删除某个音频/course/delcourse
  deleteCourse({username,access_token,id_product,id}){
    return $axios.post('/course/delcourse',{
      username,
      access_token,
      id_product,
      id
    })
  },
}
