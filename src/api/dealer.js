import $axios from '../utils/http'

/**
 * 经销商后台管理
 */

export default {
    //经销商列表 /dealer/list
    getDealerList({ access_token,username, page_num, page_size, keywords,type}) {
        return $axios.post('/dealer/list', {
            type,
            access_token,
            username, 
            page_num,
            page_size,
            keywords,
        })
    },
     //获取某个经销商信息 /dealer/info
    getDealerInfo({ access_token,username, id_dealer}) {
        return $axios.post('/dealer/info', {
            access_token,
            username, 
            id_dealer
        })
    },
    //添加某个经销商信息/dealer/add
    addDealer({ username,access_token,name, order_email, report_email, contact_name,mobile_phone,product_info}) {
        return $axios.post('/dealer/add', {
            access_token,
            username, 
            name, 
            order_email, 
            report_email, 
            contact_name,
            mobile_phone,
            product_info
        })
    },
    //修改某个经销商信息dealer/edit
    editDealer({ username,access_token, id_dealer, name, order_email, report_email, contact_name,mobile_phone,product_info}) {
        return $axios.post('/dealer/edit', {
            access_token,
            username,
            id_dealer, 
            name, 
            order_email, 
            report_email, 
            contact_name,
            mobile_phone,
            product_info
        })
    },
    //获取销售列表/dealer/salelist
    getSaleList({ access_token,username, page_num, page_size, keywords,type}) {
        return $axios.post('/dealer/salelist', {
            access_token,
            username, 
            page_num,
            page_size,
            keywords,
            type
        })
    },
    //获取某个销售信息
    getSaleInfo({ access_token,username, id_sale}) {
        return $axios.post('/dealer/saleinfo', {
            access_token,
            username, 
            id_sale
        })
    },
    //添加销售信息
    addSale({ access_token,username, name, mobile_phone,id_dealer}) {
        return $axios.post('/dealer/saleadd', {
            access_token,
            username, 
            id_dealer,
            name, 
            mobile_phone
        })
    },     
    //修改销售信息
    editSale({ id_sale,access_token,username, name, mobile_phone,id_dealer}) {
        return $axios.post('/dealer/saleedit', {
            id_sale,
            access_token,
            username, 
            id_dealer,
            name, 
            mobile_phone
        })
    },
    //医生列表/dealer/doclist
    getDealerDoctorList({ access_token,username, page_num, page_size, keywords}) {
        return $axios.post('/dealer/doclist', {
            access_token,
            username, 
            page_num,
            page_size,
            keywords,
        })
    },
    //获取某个医生信息
    getDoctorInfo({ access_token,username, id}) {
        return $axios.post('/dealer/docinfo', {
            access_token,
            username, 
            id
        })
    }, 
    //添加一个医生信息
    addDealerDoctor({ access_token,username, real_name, phone_num, title_med, department_id, hospital_id, internal_remark,id_sale,id_dealer}) {
        return $axios.post('/dealer/docadd', {
            access_token,
            username, 
            real_name, 
            phone_num, 
            title_med, 
            department_id, 
            hospital_id, 
            internal_remark,
            id_sale,
            id_dealer
        })
    }, 
    //批量添加医生信息/dealer/docmuladd
    docmulAdd({ access_token,username, num, internal_remark,id_dealer}) {
        return $axios.post('/dealer/docmuladd', {
            access_token,
            username, 
            num, 
            internal_remark,
            id_dealer
        })
    }, 
    //修改一个医生信息
    editDealerDoctor({ access_token,username, id, real_name, phone_num, title_med, department_id, hospital_id, internal_remark,id_sale,id_dealer}) {
        return $axios.post('/dealer/docedit', {
            access_token,
            username,
            id, 
            real_name, 
            phone_num, 
            title_med, 
            department_id, 
            hospital_id, 
            internal_remark,
            id_sale,
            id_dealer
        })
    },   
     //搜索医院或者科室
    searchHospital({ access_token,username, keywords, type, hospital_id}) {
        return $axios.post('/dealer/search', {
            access_token,
            username,
            keywords, 
            type, 
            hospital_id, 
        })
    },                                                                 
}