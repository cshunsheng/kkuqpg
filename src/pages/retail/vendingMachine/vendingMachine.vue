<template>
    <div id="vendingMachine">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}">
                    <i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>售货柜管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="vendingWrap">
            <!-- 新建 -->
            <el-button @click="addNew">待激活</el-button>
            <!-- 列表 -->
            <ul class="vendingList">
                <li>
                    <span>售货柜序列号</span>
                    <span>售货柜名称</span>
                    <span>详细地址</span>
                    <span>状态</span>
                    <span>负责人</span>
                    <span>操作</span>
                </li>
                <li v-for="(item,index) in vendingList" class="listLine">
                    <span>{{item.cd_key}}</span>
                    <span>{{item.cabinet_name}}</span>
                    <span>{{item.cabinet_address}}</span>
                    <span>{{item.cabinet_status==1? "正常":"故障"}}</span>
                    <span>{{item.charge_person}}</span>
                    <span>
                        <el-button size="mini" @click="eidtVending(item.cd_key,index)">编辑</el-button>
                    </span>
                </li>
            </ul>
        </div>
        <!-- 翻页 -->
        <div class="pagin">
            <el-pagination background layout="prev, pager, next" :page-size="size" :total="total" @current-change="changePage">
            </el-pagination>
        </div>
        <el-dialog title="编辑" :visible.sync="showEdit">
            <el-form label-width="120px" :model="vending" :rules="rules">
                <el-form-item label="货柜序列号">
                    <el-input :disabled="true" v-model="vending.cd_key"></el-input>
                </el-form-item>
                <el-form-item label="售货柜名称" prop="cabinet_name">
                    <el-input v-model="vending.cabinet_name"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="cabinet_address">
                    <el-input v-model="vending.cabinet_address"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="status" placeholder="状态">
                        <el-option v-for="s in cStatus" :key="s.value" :label="s.label" :value="s.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="绑定医院">
                    <el-select size="mini" v-model="vending.id_province" placeholder="省" @change="changeProvinces(2, vending.id_province)">
                        <el-option v-for="p in provinces" :key="p.id" :label="p.name" :value="p.id"></el-option>
                    </el-select>
                    <el-select size="mini" v-model="vending.id_city" placeholder="市" @change="changeCity(2, vending.id_city)">
                        <el-option v-for="c in citys" :key="c.id" :label="c.name" :value="c.id"></el-option>
                    </el-select>
                    <el-select size="mini" v-model="hospital" placeholder="医院">
                        <el-option v-for="h in hospitals" :key="h.id" :label="h.name" :value="h.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人" prop="charge_person">
                    <el-input v-model="vending.charge_person"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            vendingList: [],  // 售货机列表
            vendingId: "",     // 售货机id
            vending: {},      // 选中售货柜
            total: 0,        // 总条数
            cdKey: "",        // 机器id
            num: 1,          // 页码
            size: 10,          // 每页条数
            showEdit: false,
            cStatus: [
                {value: 1, label: "正常"},
                {value: 2, label: "故障"}
            ],
            status: 1,
            editIndex: 0,
            provinces: [],
            citys: [],
            hospitals: [],
            province: "",
            city: "",
            hospital: "",
            name: "",
            address:"",
            person: "",
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
        this.getVendings()
    },
    methods: {
        getVendings() {
            let _status = 1;
            let _num = this.num;
            let _size = this.size
            this.$api.getVendingList(_status, _num, _size)
                .then((res) => {
                    let _li = []
                    let _list = res.data.data.list ? res.data.data.list : _li
                    this.vendingList = _list
                    this.total = res.data.data.total_num
                })
        },
        eidtVending(id,index) {
            this.vending = {}
            let temple = this.vendingList.find(item => {
                return item.cd_key === id
            })
            Object.assign(this.vending, temple)
            this.editIndex = index;

            this.getProvinces(1);
            this.showEdit = true;
            this.status = temple.cabinet_status

        },
        saveEdit() {
            let _this = this
            // console.log(JSON.stringify(this.vending))
            let _name = this.vending.cabinet_name;
            let _address = this.vending.cabinet_address;
            let _person = this.vending.charge_person;
            if(_name === ""){
                this.$message.error('货柜名称不能为空');
            }else if(_address === ""){
                this.$message.error('地址不能为空');
            }else if(_person === ""){
                this.$message.error('负责人不能为空');
            }else if(!this.hospital){
                this.$message.error('请选择医院');
            }else{
                this.vending.id_hospital = this.hospital;
                this.vending.cabinet_status = this.status;
                this.$api.editVending(this.vending)
                .then(res => {
                    if(res.data.status == 200){
                        _this.showEdit = false
                        _this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        _this.vendingList[_this.editIndex] = _this.vending // 前端同时保存修改值

                    }else{
                        _this.showEdit = false
                        _this.$message.error('啊哦，修改失败');

                    }
                    
                })
                .catch(error => {console.log(error)})
            }
            
            
        },
        cancelEdit() {
            this.showEdit = false;
        },
        changeStatus(){
            console.log(this.vending.cabinet_status)
        },
        changePage(e) {
            this.num = e;
            this.getVendings();
        },
        addNew() {
            this.$router.push('/admin/retail/addVending')
        },
        getProvinces(type) { // 1:初始化数据， 2: 修改数据
            let _this = this
            this.$api.getProvince()
                .then(res => {
                    _this.provinces = res.data.data
                    if(type === 1){
                        // _this.province = this.vending.id_province  // this.vending.province
                        _this.changeProvinces(1, _this.vending.id_province)
                    }

                })
        },
        changeProvinces(type, provinceId) {
            let _this = this
            // this.city = "";
            this.hospital="";
            if(type === 2){
                _this.vending.id_city = ""
                // _this.vending.id_hospital = ""
            }
            
            this.$api.getCity(provinceId)
                .then(res => {
                    _this.citys = res.data.data
                    if(type === 1){
                        // _this.city =  this.vending.id_city;
                        _this.changeCity(1, _this.vending.id_city);
                    }
                })
        },
        changeCity(type, cityId) {
            let _this = this
            if(type === 1){
                _this.hospital = this.vending.id_hospital
            }else{
                _this.hospital="";
            }
            // if(type !== 1){
            //     this.vending.id_hospital = ""
            // }
            _this.hospitals = [];
            _this.$api.getHospital(cityId)
                .then(res => {
                    _this.hospitals = res.data.data
                })
        },
        changeHospital(){
            console.log(this.vending.id_hospital)
        }
    }
}
</script>

<style scoped>
.vendingList {
    width: 100%;
    position: relative;
    font-size: 12px; 
    color: #333;
    border-top: 1px solid #ccc;
    margin-top: 20px;
}
.vendingList li {
    /* margin-top: 20px; */
    padding: 5px 0;
}
.vendingList li {
    display: flex;
    /* height: 30px; */
    line-height: 30px;
    border: 1px solid #ccc;
    border-top: none;
    text-align: center;
}
.vendingList li.listLine:hover {
    background: #efefef;
}
.vendingList li:first-child {
    /* border: none; */
    /* border-top: 1px solid #ccc; */
}
.vendingList li span {
    flex: 1;
    word-break: break-all;
}
.pagin {
    margin-top: 20px;
    text-align: right;
}
.el-input.requireInp .el-input_inner{
    border: 1px solid #cf0000;
}
</style>
