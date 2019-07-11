/**
 * 进销存系统api
 */
import $axios from '../utils/http'
export default {
  //获取某个供应商进货信息
  getSupplier({ access_token, username, id_supplier, page_num, page_size }) {
    return $axios.post('/supplier/stocksupplierlist', {
      access_token, username, id_supplier, page_num, page_size
    })
  },
  //获取某个供应商操作记录
  getSupplierlog({ access_token, username, id_supplier, page_num, page_size }){
    return $axios.post('/supplier/supplierlog',{
      access_token, username, id_supplier, page_num, page_size
    })
  },
  // 供应商列表
  supplierList({ access_token, username, keywords, page_num, page_size }) {
    return $axios.post('/supplier/list', {
      access_token,
      username,
      keywords,
      page_num,
      page_size
    })
  },
  //获取某一个供应商信息
  getSup({ access_token, username, id_supplier,type,name}) {
    return $axios.post('/supplier/getone', {
      access_token,
      username,
      id_supplier,
      type,
      name
    })
  },
  //新增某一个供应商信息
  addSup({
    access_token,
    username,
    name,
    active,
    contact_name,
    mobile_phone,
    email,
    bank_account_number,
    user_name,
    bank_name,
    business_license,
    licence,
    authorization,
    keywords,
    remark,
    manufacturer_list,
    address
  }) {
    return $axios.post('/supplier/addinfo', {
      access_token,
      username,
      name,
      active,
      contact_name,
      mobile_phone,
      email,
      bank_account_number,
      user_name,
      bank_name,
      business_license,
      licence,
      authorization,
      keywords,
      remark,
      manufacturer_list,
      address
    })
  },
  //修改某一个供应商信息
  editSup({
    access_token,
    username,
    id_supplier,
    name,
    active,
    contact_name,
    mobile_phone,
    email,
    bank_account_number,
    user_name,
    bank_name,
    business_license,
    licence,
    authorization,
    keywords,
    remark,
    manufacturer_list,
    address
  }) {
    return $axios.post('/supplier/editinfo', {
      access_token,
      username,
      id_supplier,
      name,
      active,
      contact_name,
      mobile_phone,
      email,
      bank_account_number,
      user_name,
      bank_name,
      business_license,
      licence,
      authorization,
      keywords,
      remark,
      manufacturer_list,
      address
    })
  },
  //删除一个供应商信息
  delSup({ access_token, username, id_supplier }) {
    return $axios.post('/supplier/delinfo', {
      access_token,
      username,
      id_supplier
    })
  },
  //查看供应商商品信息
  getStockSup({ access_token, username, id_supplier }) {
    return $axios.post('/stock/getstockbysupplier', {
      access_token,
      username,
      id_supplier
    })
  },

  /**
   * 商品库
   */
  //获取商品库
  getStockList({
    access_token,
    username,
    page_num,
    page_size,
    keywords,
    type
  }) {
    return $axios.post('/stock/list', {
      access_token,
      username,
      page_num,
      page_size,
      keywords,
      type
    })
  },
  //获取商品库某个商品规格信息
  getProAttr({ access_token, username, id_stock_product }) {
    return $axios.post('/stock/getstockproduct', {
      access_token,
      username,
      id_stock_product
    })
  },
  //添加商品库信息
  addStock({
    access_token,
    username,
    product_name,
    id_supplier,
    fixed_price,
    attribute,
    manufacturer_name,
    remark
  }) {
    return $axios.post('/stock/addinfo', {
      access_token,
      username,
      product_name,
      id_supplier,
      fixed_price,
      attribute,
      manufacturer_name,
      remark
    })
  },
  //自由组合商品属性
  proStock({
    access_token,
    username,
    attribute
  }) {
    return $axios.post('/stock/attributelist', {
      access_token,
      username,
      attribute
    })
  },
  //添加商品库属性
  addProperty({
    access_token,
    username,
    id_stock_product,
    id_supplier,
    fixed_price,
    attribute
  }) {
    return $axios.post('/stock/stockadd', {
      access_token,
      username,
      id_stock_product,
      id_supplier,
      fixed_price,
      attribute
    })
  },
  //获取某个商品库某个属性
  getProperty({ access_token, username, id_stock }) {
    return $axios.post('/stock/getone', {
      access_token,
      username,
      id_stock
    })
  },
  //给某个商品入库
  store({
    hid,
    access_token,
    username,
    total_num,
    fixed_price,
    id_stock,
    id_supplier,
    invoice,
    remark,
    code
  }) {
    return $axios.post('/stock/addstockin', {
      access_token,
      username,
      total_num,
      fixed_price,
      id_stock,
      id_supplier,
      invoice,
      remark,
      code,
      hid
    })
  },
  //获取所有供应商信息
  getAllSup({ access_token, username }) {
    return $axios.post('/supplier/supplierall', {
      access_token,
      username
    })
  },
  //给某个商品出库
  addstockex({
    access_token,
    username,
    id_stock,
    ex_price,
    ex_num,
    buyer_name,
    buyer_address,
    buyer_phone,
    invoice,
    remark
  }) {
    return $axios.post('/stock/addstockex', {
      access_token,
      username,
      id_stock,
      ex_price,
      ex_num,
      buyer_name,
      buyer_address,
      buyer_phone,
      invoice,
      remark
    })
  },
  //获取待入库商品信息
  deliver({ access_token, username }) {
    return $axios.post('/stock/stockinlist', {
      access_token,
      username
    })
  },
  //设置预警库存
  setWarnStock({ access_token, username, id_stock, usable_quantity }) {
    return $axios.post('/stock/setstockinfo', {
      access_token,
      username,
      id_stock,
      usable_quantity
    })
  },
  //获取待入库的商品信息
  stockinlist({ access_token, username }) {
    return $axios.post('/stock/stockinlist', {
      access_token,
      username
    })
  },
  /**
   * 入库出库管理
   */
  //获取入库列表
  stockInList({
    access_token,
    username,
    active,
    keywords,
    s_time,
    e_time,
    page_num,
    page_size
  }) {
    return $axios.post('/stock/stockinlist', {
      access_token,
      username,
      active,
      keywords,
      s_time,
      e_time,
      page_num,
      page_size
    })
  },
  //获取出库列表
  stockOutList({
    access_token,
    username,
    keywords,
    s_time,
    e_time,
    page_num,
    page_size
  }) {
    return $axios.post('/stock/stockexlist', {
      access_token,
      username,
      keywords,
      s_time,
      e_time,
      page_num,
      page_size
    })
  },
  /**
   * 退货管理
   */
  //获取退货商品列表
  getRefundlist({ access_token, username, page_num, page_size }) {
    return $axios.post('/order2/refundlist', {
      access_token,
      username,
      page_num,
      page_size
    })
  },
  /*商品规格设置
   */
  //获取规格列表
  attributeList({access_token, username, keywords, page_num, page_size, type}) {
    return $axios.post('/attribute/list', {
      access_token,
      username,
      keywords,
      page_num,
      page_size,
      type
    })
  },
  //获取某个规格组信息
  attributeOne({ access_token, username, id_attribute_group }) {
    return $axios.post('/attribute/getone', {
      access_token,
      username,
      id_attribute_group
    })
  },
  //新增规格信息
  attributeAdd({ access_token, username, name, attribute_name }) {
    return $axios.post('/attribute/addinfo', {
      access_token,
      username,
      name,
      attribute_name
    })
  },
  //修改规格信息
  attributeEdit({
    access_token,
    username,
    id_attribute_group,
    attribute_name
  }) {
    return $axios.post('/attribute/editinfo', {
      access_token,
      username,
      id_attribute_group,
      attribute_name
    })
  },

  /*
进货邮件*/
  //获取青苹果信息
  getqpgInfo({ access_token, username }) {
    return $axios.post('/stock/getqpginfo', {
      access_token,
      username
    })
  },
  //发送进货邮件
  sendMail({
    access_token,
    username,
    product_list,
    id_supplier,
    invoice_name,
    address,
    receiver,
    receiver_phone,
    tax_id
  }) {
    return $axios.post('/stock/sendmail', {
      access_token,
      username,
      product_list,
      id_supplier,
      invoice_name,
      address,
      receiver,
      receiver_phone,
      tax_id
    })
  },
  //根据供应商ID获取商品信息
  getPro({ access_token, username, id_supplier }) {
    return $axios.post('/stock/getstockbysupplier', {
      access_token,
      username,
      id_supplier
    })
  },
  getallproduct({username,access_token,id_product,keywords}) {
    return $axios.post('/stock/getallproduct', {
        access_token,
        username,
        id_product,
        keywords
      })
  },
  baseNames({username,access_token,keywords}) {
    return $axios.post('/stock/getallproduct',{
        username,
        access_token,
        keywords
    })
  },
  //表格文件上传stock/uploadstockproduct
  uploadStockProduct({username,access_token,filepath,type}) {
    return $axios.post('stock/uploadstockproduct',{
        username,
        access_token,
        filepath,
        type
    })
  },
  //获取编辑时商品库商品信息stock/stockproductinfo
  stockproductinfo({username,access_token,id_stock_product}) {
    return $axios.post('stock/stockproductinfo',{
        username,
        access_token,
        id_stock_product
    })
  },
  editstockproduct({username,access_token,product_name,manufacturer_name,id_supplier,fixed_price,attribute,id_stock_product,remark}) {
    return $axios.post('stock/editstockproduct',{
        username,
        access_token,
        product_name,
        manufacturer_name,
        id_supplier,
        fixed_price,
        attribute,
        id_stock_product,
        remark
    })
  },
  //删除商品库信息stock/delstockproduct
  delstockproduct({username,access_token,id_stock_product}) {
    return $axios.post('stock/delstockproduct',{
        username,
        access_token,
        id_stock_product
    })
  },
//获取商品库操作记录/stock/stockproductlog
  getStockproductlog({ access_token, username, id_stock_product, page_num, page_size }){
    return $axios.post('/stock/stockproductlog',{
      access_token, 
      username, 
      id_stock_product,
      page_num, 
      page_size
    })
  },
  //规格操作记录attribute/attributelogs
  getAttributelogs({ access_token, username, id_attribute_group, page_num, page_size}){
    return $axios.post('/attribute/attributelogs',{
      access_token,
      username, 
      id_attribute_group, 
      page_num, 
      page_size
    })
  },
  //商品库审核/stock/updatecheckstate
  updateCheckState({ access_token, username, id_stock_product, check_state}){
    return $axios.post('/stock/updatecheckstate',{
      access_token,
      username, 
      id_stock_product, 
      check_state
    })
  },
  //供应商审核/supplier/updatecheckstate
  supplierCheckState({ access_token, username, id_supplier, check_state}){
    return $axios.post('/supplier/updatecheckstate',{
      access_token,
      username, 
      id_supplier, 
      check_state
    })
  },
  //采购管理----------------------------------------------------------

  //根据供应商ID获取商品信息/stock/getstockbysupplier
  getSupplierInfo({username,access_token,id_supplier}){
    return $axios.post('/stock/getstockbysupplier',{
      username,
      access_token,
      id_supplier
    })
  },
  //获取采购清单/stock/shoppinglist
  getShoppinglist({username,access_token,page_num,page_size,id_supplier,keywords,payment_status,s_time,e_time}){
    return $axios.post('/stock/shoppinglist',{
      username,
      access_token,
      page_num,
      page_size,
      id_supplier,
      keywords,
      payment_status,
      s_time,
      e_time
    })
  },
  //修改打款状态/stock/updatepaymentstatus
  updatePaymentStatus({username,access_token,payment_status,hid}){
    return $axios.post('/stock/updatepaymentstatus',{
      username,
      access_token,
      payment_status,
      hid
    })
  },
  //采购统计/stock/shopstatistics
  getShopStatistics({username,access_token,page_num,page_size,keywords,s_time,e_time}){
    return $axios.post('/stock/shopstatistics',{
      username,
      access_token,
      page_num,
      page_size,
      keywords,
      s_time,
      e_time
    })
  },
  //获取采购清单操作记录/stock/shoplistlogs
  getShoplistlogs({username,access_token,page_num,page_size,hid}){
    return $axios.post('/stock/shoplistlogs',{
      username,
      access_token,
      page_num,
      page_size,
      hid
    })
  }
}
