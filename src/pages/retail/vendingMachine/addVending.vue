<template>
    <div class="addVending">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}">
                    <i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>售货柜管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button @click="backList">返回</el-button>
        <ul class="activityList">
            <li>
                <span>序号</span>
                <span>售货柜序列号</span>
                <span>申请时间</span>
                <span>操作</span>
            </li>
            <li v-for="(item,index) in actList" class="listLine">
                <span>{{index + 1}}</span>
                <span>{{item.cd_key}}</span>
                <span>{{item.create_ts}}</span>
                <span>
                    <el-button size="mini" @click="actVending(item.cd_key,index)">激活</el-button>
                </span>
            </li>
        </ul>
        <!-- 翻页 -->
        <div class="pagin">
            <el-pagination background layout="prev, pager, next" :page-size="size" :total="total" @current-change="changePage">
            </el-pagination>
        </div>

        <!-- 激活popup -->
        <el-dialog title="激活" :visible.sync="showEdit">
            <el-form label-width="120px" :model="aVending" :rules="rules">
                <el-form-item label="货柜序列号">
                    <el-input :disabled="true" v-model="aVending.cd_key"></el-input>
                </el-form-item>
                <el-form-item label="售货柜名称" prop="cabinet_name">
                    <el-input v-model="aVending.cabinet_name"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="cabinet_address">
                    <el-input v-model="aVending.cabinet_address"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="status" placeholder="状态">
                        <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="绑定医院">
                    <el-select size="mini" v-model="province" placeholder="省" @change="changeProvinces(province)">
                        <el-option v-for="p in provinces" :key="p.id" :label="p.name" :value="p.id"></el-option>
                    </el-select>
                    <el-select size="mini" v-model="city" placeholder="市" @change="changeCity(city)">
                        <el-option v-for="c in citys" :key="c.id" :label="c.name" :value="c.id"></el-option>
                    </el-select>
                    <el-select size="mini" v-model="hospital" placeholder="医院">
                        <el-option v-for="h in hospitals" :key="h.id" :label="h.name" :value="h.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人" prop="charge_person">
                    <el-input v-model="aVending.charge_person"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showEdit = false">取 消</el-button>
                <el-button type="primary" @click="add">确认激活</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
            total: 0,
            aVending: {},  // 选择的激活货柜
            cStatus: [
                {value: 1, label: "正常"},
                {value: 2, label: "故障"}
            ],
            status: 1,
            actList: [],
            num: 1,          // 页码
            size: 10,          // 每页条数
            showEdit: false,
            actIndex: 0,
            provinces: [],
            citys: [],
            hospitals: [],
            province: "",
            city: "",
            hospital: "",
            rules: {
                cabinet_name: [
                    {required: true, message: '请输货柜名称', trigger: 'blur change'},
                ],
                cabinet_address: [
                    {required: true, message: '请输入地址', trigger: 'blur change'},
                ],
                hospital: [
                    {required: true, message: '请选择医院', trigger: 'blur change'},
                ],
                charge_person: [
                    {required: true, message: '请输入负责人', trigger: 'blur change'},
                ]
            },

        }
    },
    created() {
        this.getVendings();
    },
    methods: {
        getVendings() {
            let _status = 0;
            let _num = this.num;
            let _size = this.size
            this.$api.getVendingList(_status, _num, _size)
                .then((res) => {
                    let _list = res.data.data.list ? res.data.data.list : _li
                    this.actList = _list
                    this.total = res.data.data.total_num
                })
        },
        actVending(key, index) {
            this.aVending = {};
            let _tem = this.actList.find(item => {
                return item.cd_key === key
            })
            this.aVending = Object.assign(this.aVending, _tem)
            this.actIndex = index;
            this.getProvinces();
            this.showEdit = true;
        },
        add() {
            let _this = this
            let _hospital = this.hospital
            let _province = this.province
            let _city = this.city
            this.aVending.cabinet_status = this.status;
            if(this.aVending.cabinet_name === ""){
                this.$message.error('货柜名称不能为空');
            }else if(this.aVending.cabinet_address === ""){
                this.$message.error('地址不能为空');
            }else if(this.aVending.charge_person === ""){
                this.$message.error('负责人不能为空');
            }else if(!this.hospital){
                this.$message.error('请选择医院');
            }else{
                this.$api.addVending(this.aVending, _hospital, _province, _city)
                    .then(res => {
                        if(res.data.status == 500){
                            console.log('get error message')
                        }
                        if(res.data.status == 200){
                            // _this.$router.push('/admin/retail/vendingMachine')
                            _this.actList.splice(_this.actIndex, 1)
                            this.showEdit = false
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        changePage(e) {
            this.num = e;
            this.getVendings();
        },
        backList(){
            this.$router.push('/admin/retail/vendingMachine')
        },
        getProvinces() {
            this.$api.getProvince()
                .then(res => {
                    this.provinces = res.data.data
                })
        },
        changeProvinces(provinceId) {
            this.city = "";
            this.hospital="";
            this.$api.getCity(provinceId)
                .then(res => {
                    this.citys = res.data.data
                })
        },
        changeCity(cityId) {
            this.hospital="";
            this.hospitals = [];
            this.$api.getHospital(cityId)
                .then(res => {
                    this.hospitals = res.data.data
                })
        }
    }
}
</script>
<style>
.addVending{
    width:80%;
    position: relative;
}
.footBtn{
    text-align: right;
}

.activityList {
    width: 100%;
    position: relative;
    font-size: 12px; 
    color: #333;
    border-top: 1px solid #ccc;
    margin-top: 20px;
}
.activityList li {
    /* margin-top: 20px; */
    padding: 5px 0;
}
.activityList li {
    display: flex;
    /* height: 30px; */
    line-height: 30px;
    border: 1px solid #ccc;
    border-top: none;
    text-align: center;
}
.activityList li.listLine:hover {
    background: #efefef;
}
.activityList li:first-child {
    /* border: none; */
    /* border-top: 1px solid #ccc; */
}
.activityList li span {
    flex: 1;
    word-break: break-all;
}
.pagin {
    margin-top: 20px;
    text-align: right;
}
</style>