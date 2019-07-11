import $axios from '../utils/http'

/**
 * 患者交流群后台管理
 */

export default {
    //患者交流群 用户管理
    getChatUsers({ end_date,keyword, page, page_size, start_date, type}) {
        return $axios.post('/chat/users', {
            end_date,
            keyword, 
            page, 
            page_size, 
            start_date, 
            type
        })
    },
    //拉黑用户/chat/joinblacklist
    joinBlackList({ access_token, status, uid, username }) {
        return $axios.post('/chat/joinblacklist', {
            access_token, 
            status, 
            uid, 
            username
        })
    },
    //群聊管理
    //群列表（含搜索）/chat/chatgrouplist
    getChatGroupList({ keyword, page, page_size,}) {
        return $axios.post('/chat/chatgrouplist', {
            page, 
            page_size,
            keyword
        })
    },
    //科室列表/chat/departmentlist
    getChatDepartmentList() {
        return $axios.post('/chat/departmentlist')
    },
    //根据科室获取群列表/chat/grouplist
    getDepChatGroupList({ department_list }) {
        return $axios.post('/chat/grouplist', {
            department_list
        })
    },
    //商品列表/chat/productlist
    getChatProductList({ keyword }) {
        return $axios.post('/chat/productlist', {
            keyword
        })
    },
    //群发群消息/chat/sendmsg
    chatSendMsg({ all_department_groups, department_list, group_list, group_type, msg_content, msg_type,product_list}) {
        return $axios.post('/chat/sendmsg', {
            all_department_groups,
            department_list,
            group_list,
            group_type,
            msg_content,
            msg_type,
            product_list
        })
    },
    //获取操作记录/chat/log
    getChatLog({ oid, page, page_size, type }) {
        return $axios.post('/chat/log',{
            oid, 
            page, 
            page_size, 
            type
        })
    },
    //关闭/开启群聊/chat/groupactive
    groupActive({ access_token, group_id, status, username }) {
        return $axios.post('/chat/groupactive',{
            access_token, 
            group_id, 
            status, 
            username 
        })
    },
}