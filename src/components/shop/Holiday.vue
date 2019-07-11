<template>
    <div class="holiday">
        <div class="btn"><el-button type="primary" plain @click="edit('')">添加节假日</el-button></div>
        <div class="main">
            <el-table :data="tableList" border="" style="width: 100%">
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="id_holiday" label="id"></el-table-column>
                <el-table-column prop="holiday_name" label="节假日"></el-table-column>
                <el-table-column prop="date_range" label="日期范围"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.active" placeholder="请选择" :class="{selectclassName:scope.row.active}" @change="changeActive(scope.row)">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="showLog(scope.row)" type="text" size="small">操作记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增/编辑节假日 -->
        <el-dialog title="新增/编辑节假日" :visible.sync="add_edit" width="800px">
            <el-form :model="add_editform" ref="add_editform" :rules="rules" status-icon label-position='left'>
                <el-form-item label="节假日" prop="holiday_name" label-width="100px" style="width:500px">
                    <el-input v-model="add_editform.holiday_name" placeholder="请输入节假日名称"></el-input>
                </el-form-item>
                <el-form-item label="日期范围" prop="start_end" label-width="100px">
                    <el-date-picker
                        v-model="add_editform.start_end"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        <!-- :default-time="['24:00:00']" -->
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="active" label-width="100px">
                    <el-radio v-model="add_editform.active" :label="1">生效</el-radio>
                    <el-radio v-model="add_editform.active" :label="0">暂停</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 节假日操作记录 -->
        <el-dialog title="节假日操作记录" :visible.sync="logTable" width="50%">
            <el-table :data="logList" border="">
                <el-table-column property="id_holiday" label="ID"></el-table-column>
                <el-table-column property="operator" label="操作用户"></el-table-column>
                <el-table-column property="operation" label="操作内容"></el-table-column>
                <el-table-column property="created_at" label="时间"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        var validateTime = (rule, value, callback) => {
            // console.log(Date.parse(value[0]),Date.parse(value[1]))
            if (Date.parse(value[0]) >= Date.parse(value[1])) {
                callback(new Error('节假日开始时间不能大于或者等于结束时间'));
            } else {
                callback();
            }
        };
        return {
            tableList: [
                {
                    'id_holiday': 1,
                    'created_at': 2,
                    'holiday_name': 2,
                    'date_range': 2,
                    active: 0,
                },
                {
                    'id_holiday': 2,
                    'created_at': 2,
                    'holiday_name': 2,
                    'date_range': 2,
                    active: 1,
                },
                {
                    'id_holiday': 3,
                    'created_at': 2,
                    'holiday_name': 2,
                    'date_range': 2,
                    active: 0,
                },
                {
                    'id_holiday': 4,
                    'created_at': 2,
                    'holiday_name': 2,
                    'date_range': 2,
                    active: 0,
                },
                {
                    'id_holiday': 5,
                    'created_at': 2,
                    'holiday_name': 2,
                    'date_range': 2,
                    active: 1,
                },
            ],
            options: [
                {
                    value: 0,
                    label: '暂停'
                },
                {
                    value: 1,
                    label: '生效'
                }
            ],
            value: 1,
            add_edit: false,
            logTable: false,
            rules:{
                holiday_name: [{ required: true, message: '请输入节假日名称', trigger: 'blur' }],
                start_end: [{ required: true, message: '请选择起始日期', trigger: 'blur' },{ validator: validateTime, trigger: 'blur' }],
                active: [{ required: true, message: '请输入状态', trigger: 'blur' }]
            },
            add_editform:{
                holiday_name: '',
                start_end: [],
                active: '',
                id_holiday: '',
                type: '',
            },
            logList: [],
            type:''
        }
    },
    props:['username','accessToken'],
    created() {
        // console.log(this.username,this.accessToken)
        this.getList()
    },
    methods: {
        getList() {
            this.$api.holidayList({
                access_token: this.accessToken,
                username: this.username
                })
                .then(res => {
                    // console.log(res)
                    if (res.data.status == 200) {
                        this.tableList = res.data.data.holiday_list
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        changeActive(row) {
            let data = {
                access_token: this.accessToken,
                username: this.username,
                id_holiday: row.id_holiday,
                active: row.active
            }
            this.$api.editHolidayActive(data)
                .then(res => {
                    console.log(res)
                    this.getList()
                    this.$message.success(`状态更新成功`)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        edit(row) {
            this.add_edit = true
            if (!row) {
                console.log(1)
                this.add_editform.type = 1
                return false
            }
            console.log(2)
            this.add_editform.type = 2
            this.add_editform.id_holiday = row.id_holiday
            let date_start = '2019-02-04 00:00:00'
            let date_end = '2019-02-10 00:00:00'
            let data = {
                access_token: this.accessToken,
                username: this.username,
                id_holiday: row.id_holiday
            }
            // console.log(data)
            this.$api.getHoliday(data)
                .then(res => {
                    // console.log(res)
                    if (res.data.status == 200) {
                        this.add_editform.start_end.push(res.data.data.date_start)
                        this.add_editform.start_end.push(res.data.data.date_end)
                        this.add_editform.holiday_name = res.data.data.holiday_name
                        this.add_editform.active =  res.data.data.active
                        // this.add_editform.start_end.push(date_start)
                        // this.add_editform.start_end.push(date_end)
                        // this.add_editform.holiday_name = row.holiday_name
                        // this.add_editform.active = row.active
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        submit() {
            var date_start,date_end
            date_start = this.add_editform.start_end[0]
            date_end = this.add_editform.start_end[1]
            let data = {
                date_start,
                date_end,
                access_token: this.accessToken,
                username: this.username,
                ...this.add_editform
            }
            // console.log(data)
            this.$refs.add_editform.validate((valid,msg) => {
                if (!valid) return  console.log('Error submit')
                //  this.$message.error(`请输入正确的数据`)
                    // alert('submit!');
                this.$api.addOREditHoliday(data)
                    .then(res => {
                        console.log(res)
                        if (res.data.status == 200){
                            // console.log(res)
                            this.getList()
                            this.$message.success(`数据保存成功`)
                            this.add_edit = false
                        }
                        if (res.data.status == 400){
                            // console.log(res)
                            // this.getList()
                            this.$message.error(`${res.data.msg}`)
                            // this.add_edit = false
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        // this.$message.error(`${res.data.msg}`)
                        this.add_edit = false
                    })
            })
        },
        showLog(row){
            this.logTable = true
            this.$api.getHolidayLog({
                access_token: this.accessToken,
                username: this.username,
                id_holiday: row.id_holiday
            })
                .then(res => {
                    console.log(res)
                    this.logList = res.data.data.operation_list
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    watch: {
        add_edit:function() {
            if (!this.add_edit){
                this.$refs.add_editform.resetFields()
                this.add_editform.start_end = []
                this.add_editform.id_holiday = ''
                this.add_editform.type = ''
                this.add_editform.active = ''
                this.add_editform.holiday_name = ''
            }
        }
    },
}
</script>
<style>
.holiday .main .selectclassName .el-input--suffix .el-input__inner {
    color: #20a0ff;
} 
.holiday .btn {
    margin-top: 30px;
}
.holiday .main {
    padding-top: 20px;
}
</style>