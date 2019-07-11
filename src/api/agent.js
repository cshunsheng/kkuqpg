import $axios from '../utils/http'

/**
 * 代理商管理
 */
// 获取代理商列表
export default {
  agentList(access_token, username, page_num, page_size, keywords) {
    return $axios.post('/agency/list', {
      access_token,
      username,
      page_num,
      page_size,
      keywords
    })
  },
  //按月提现记录列表
  agenWithdraw( username, access_token, date_str, page ) {
    return $axios.post('/agency/withdraw', {
      username,
      access_token,
      date_str,
      page
    })
  },
  // 导出提现申请
  exportWithdraw (access_token,username,date_str) {
    return $axios({
    url: '/agency/toexport',
    method: 'POST',
    params: {
        'access_token': access_token,
        'username': username,
        'date_str': date_str
    },
    responseType: 'blob'
    })
},
  /**
   * 医生列表
   */
  //获取医生列表
  doctorList(access_token, username, page_num, page_size, keywords) {
    return $axios.post('/doctor/doctorlist', {
      access_token,
      username,
      page_num,
      page_size,
      keywords
    })
  },
  // 新增医生信息
  addDoc({
    access_token,
    username,
    doctor_id,
    service,
    position
  }) {
    return $axios.post('/doctor/adddoctor', {
      access_token,
      username,
      doctor_id,
      service,
      position
    })
  },
  // 获取某一个医生服务信息
  docInfo(access_token, username, doctor_id) {
    return $axios.post('/doctor/getdoctor', {
      access_token,
      username,
      doctor_id
    })
  },
  // 编辑某一个医生服务信息
  editDoc({ access_token, username, doctor_id, service,position }) {
    return $axios.post('/doctor/editservice', {
      access_token,
      username,
      doctor_id,
      service,
      position
    })
  },
  // 医生信息上下线
  docStatus(access_token, username, id, active) {
    return $axios.post('/doctor/editdoctor', {
      access_token,
      username,
      id,
      active
    })
  },
  /**
   * 医生服务
   */
  //查询医生
  docs(access_token,username,keywords) {
    return $axios.post('/doctor/docinfo', {
      access_token,
      username,
      keywords,
    })
  },
  // 服务列表
  docSerList(access_token, username,doctor_id) {
    return $axios.post('/doctor/servicelist', {
      access_token,
      username,
      doctor_id
    })
  },
  // 新增（type==1）修改医生服务(type==2)
  // 医生服务列表
  editDocSer({
    username,
    access_token,
    server_id,
    type,
    name,
    description,
    doc_title_price
  }) {
    return $axios.post('/doctor/addservice', {
      username,
      access_token,
      server_id,
      type,
      name,
      description,
      doc_title_price
    })
  },
  //获取服务
  getSerInfo(username, access_token, server_id) {
    return $axios.post('/doctor/getserver', {
      username,
      access_token,
      server_id
    })
  },
  //操作记录
  docSerRecord({username, access_token, server_id,page_num,page_size}) {
    return $axios.post('/doctor/servicelog', {
      username,
      access_token,
      server_id,
      page_num,
      page_size
    })
  },
  //获取职位列表
  titleList(username, access_token) {
    return $axios.post('/doctor/titlelist', {
      username,
      access_token
    })
  },
/*   //获取某个服务信息
  getServer(username, access_token,server_id) {
    return $axios.post('/doctor/getserver', {
      username,
      access_token,
      server_id
    })
  }, */
  /**
   * 服务订单
   */
  //list
  orderList(
    access_token,
    username,
    page_num,
    page_size,
    current_status,
    search_type,
    keywords
  ) {
    return $axios.post('/agency/orderlist', {
      access_token,
      username,
      page_num,
      page_size,
      current_status,
      search_type,
      keywords
    })
  },
  //获取订单详细信息
  orderDetail({username, access_token, id}) {
    return $axios.post('/agency/orderdetail', {
      username,
      access_token,
      id
    })
  },
  //修改订单信息
  editOrderDetail({username, access_token, id,current_status,remark,type}) {
    return $axios.post('/agency/modifyorderinfo', {
      username,
      access_token,
      id,current_status,remark,type
    })
  },
  //获取系统通知列表
  getSysNotice({username, access_token, page_size, page_num}) {
    return $axios.post('/message/systemlist', {
      username,
      access_token,
      page_size,
      page_num
    })
  },
  //保存通知
  saveNotice({username, access_token, title,content,link,remark,imgurl,share_title,share_img,send_state,send_time,msg_id,type}) {
    return $axios.post('/message/addsystem', {
      username,
      access_token,
      title,
      content,
      link,
      remark,
      imgurl,
      share_title,
      share_img,
      send_state,
      send_time,
      msg_id,
      type
    })
  },
  // 获取系统通知信息
  getNoticeInfo({username, access_token, msg_id}) {
    return $axios.post('/message/getinfo', {
      username,
      access_token,
      msg_id
    })
  },
  // 获取系统通知操作记录
  getNoticeRecords({username, access_token, msg_id,page_num,page_size}) {
    return $axios.post('/message/msglog', {
      username,
      access_token,
      msg_id,
      page_num,
      page_size
    })
  },
  //名医代理首页运用列表 (含搜索) /agency/bannerlist
  getBannerlist({doctor_name,page,page_size}) {
    return $axios.post('/agency/bannerlist', {
      doctor_name,
      page,
      page_size
    })
  },
  //新增addbanner
  addBanner({username, access_token,doctor_id,servers}) {
    return $axios.post('/agency/addbanner', {
      username, 
      access_token,
      doctor_id,
      servers
    })
  },
  //导入图片（绑定商品id）/agency/bindproduct
  bindProduct({username, access_token,product_id,id}) {
    return $axios.post('/agency/bindproduct', {
      username, 
      access_token,
      product_id,
      id
    })
  },
  //搜索医生/agency/getdoctorlist
  getDoctorList({keyword}) {
    return $axios.post('/agency/getdoctorlist', {
      keyword
    })
  },
  //根据医生ID获取服务id/agency/unbindservers
  unbindServers({doctor_id}){
    return $axios.post('/agency/unbindservers', {
      doctor_id
    })
  }
}
