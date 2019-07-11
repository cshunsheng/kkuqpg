import axiosIns from 'axios'
import qs from 'qs'

axiosIns.defaults.baseURL = process.env.BASE_URL;
console.log("baseURL", process.env.BASE_URL);

//axiosIns.defaults.headers['content-Type'] = 'application/x-www-form-urlencoded';
axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';

//发请求前对数据做一些改动
axiosIns.defaults.transformRequest = [function (data) {
    //数据序列化
    return qs.stringify(data);
}
];

//添加一个响应拦截
// axiosIns.interceptors.response.use(function (response){
//     let data = response.data?response.data.data:"";
//     let status = response.data?response.data.status:400;
//     // console.log(response)
//     if (status === 200) {
//         return Promise.resolve(response);
//     } else {
//         return Promise.reject(response.data?response.data.msg : "reject");
//     }
// })



export default axiosIns
