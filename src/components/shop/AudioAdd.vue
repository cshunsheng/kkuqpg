<template>
    <div class="audio">
        <div class="upload_box">
            <div style="width:300px">
                <el-form>
                    <el-form-item>
                        <el-upload
                            class="upload-demo"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-success="handleAvatarSuccess"
                            :before-remove="beforeRemove"
                            ref="upload"
                            action="http://admin-api.test.kangkanghui.com/upload/file"
                            multiple
                            accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb ,.wma,.wav,.rmvb,.amr,.mp3,.flac,.m4a,.ape,.aac,.aiff'>
                            <el-button type="primary" size="small">上传课程音频</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>    
            <el-button type="primary" size="small" @click="submit" :disabled="disButton">保存</el-button>
            <span class="tip">所有音频上传成功后，再进行“保存”操作</span>
        </div>
        <div class="table-box">
            <div class="tips">注：排序数字越小越在前面，不能输入0</div>
            <el-table border :header-cell-style="styleObj" :cell-style="styleObj" :data="course_list">
                <el-table-column prop="position" label="排序" width="100">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.position"  @change="positionSet(scope.row,2)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="course_name" label="课程标题">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.course_name"  @change="nameSet(scope.row)" type="textarea" :rows="1" resize="vertical"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="play_time" label="时长" width="100"></el-table-column>
                <el-table-column prop="" label="课程链接">
                    <template slot-scope="scope">
                        <a class="a_style" :href="scope.row.course_url" target="blank">{{scope.row.course_url}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.active" size="small" placeholder="" @change="positionSet(scope.row,1)" :class="{fontColor:scope.row.active == 1}">
                            <el-option v-for="item in activeArr" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="16" :gutter="0">
                                <!-- :show-file-list="false" -->
                                <el-upload
                                    :file-list="fileList1"
                                    :data="{id:scope.row.id}"
                                    :before-upload="beforeAvatarUpload"
                                    :on-success="successUpload"
                                    action="http://admin-api.test.kangkanghui.com/upload/file"
                                    accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb ,.wma,.wav,.rmvb,.amr,.mp3,.flac,.m4a,.ape,.aac,.aiff'>
                                    <el-button type="primary" size="small">重新上传</el-button>
                                </el-upload>
                            </el-col>
                            <el-col :span="8" :gutter="0"><el-button type="primary" size="small" @click="delCourse(scope.row)">删除</el-button></el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'userData',
        'productId',
    ],
    data() {
        return {
            styleObj:{
                "text-align": "center",
            },
            activeArr: [
                { value: 1, label: "上架" },
                { value: 0, label: "下架" }
            ],
            course_list: [],
            currentPage: 1,
            pageSize: 20,
            total: 0,
            position: '',
            course_name: '',
            id: '',
            videoUploadPercent: 0,
            videoFlag: false,
            fileList: [],
            fileList1: [],
            disButton: false,
            update_num: 0,
        }
    },
    created() {
        this.getAudioList()
    },
    methods: {
        getAudioList() {
            let _data = {
                id_product: this.productId,
                page_num: this.currentPage,
                page_size: this.pageSize
            } 
            _data = Object.assign({}, _data,this.userData)
            this.$api.getCourseList(_data)
                .then(res => {
                    // console.log(res)
                    this.course_list = res.data.data.course_list
                    this.total = res.data.data.total_num
                    // this.total = 10
                })
        },
        nameSet(scope) {  
            let data = {
                id_product: this.productId,
                course_name: scope.course_name, 
                course_url: scope.course_url,
                id: scope.id
            }
            data = Object.assign({}, data, this.userData)
            this.$api.editCourse(data).then((res) => {
                if (res.data.status == 200) {
                    this.$message.success('课程名称修改成功')
                    this.getAudioList()
                } else {
                    this.$message.error(res.data.msg)
                    this.getAudioList()
                }
            })
        },
        positionSet(scope,type) {
            let data = {
                id_product: this.productId,
                id: scope.id,
                type: type
            }
            if(type == 1) {
                data.active = scope.active
            } else {
                data.position = scope.position
            }
            data = Object.assign({}, data, this.userData)
            console.log(data)
            this.$api.edit2Course(data).then((res) => {
                if (res.data.status == 200) {
                    this.$message.success(`${res.data.msg}`)
                    this.getAudioList()
                } else {
                    this.$message.error(res.data.msg)
                    this.getAudioList()
                }
            })
        },
        delCourse(scope){
            // console.log(scope)
            this.$confirm('此操作将永久删除该课程视频, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _data = {
                    id_product: this.productId,
                    id: scope.id
                }
                console.log(_data)
                _data = Object.assign({}, _data, this.userData)
                this.$api.deleteCourse(_data).then(res => {
                    if (res.data.status == 200) {
                        this.$message.success('删除成功!')
                        if(Math.ceil(this.total/this.pageSize)==this.currentPage&&this.total%this.pageSize == 1&&this.currentPage!=1) {
                            this.currentPage-=1
                        }
                        this.getAudioList()
                    } else {
                        this.$message.error(`${res.data.data.msg}`)
                    }
                })
            }).catch(() => {
                this.$message.info('已取消删除')         
            })
        },
        beforeAvatarUpload(file) {
            this.disButton = true
            // console.log(file)
            // if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/wma','video/wav','video/rmvb','video/amr','audio/mp3','audio/flac','audio/m4a','audio/ogg','audio/ape','audio/aac','audio/aiff'].indexOf(file.type) == -1) {
            //     this.$message.error('请上传正确的视频格式');
            //     return false;
            // } 
        },
        handleAvatarSuccess(res, file,fileList) {
            // console.log(res,file,fileList)
            if (res.status == 200) {
                // let _data = {}
                // let type = file.raw.type.split('/')[0]
                // _data.name = file.raw.name.split(`.${file.raw.type.split('/')[1]}`)[0]
                // _data.url = res.data.image_url
                // _data.type = type
                // debugger
                // fileList.forEach(v => {
                //     console.log(v)
                //     let _data = {}
                //     _data.name = v.raw.name.split(`.${v.raw.type.split('/')[1]}`)[0]
                //     _data.url = v.response?v.response.data.image_url:''
                //     this.fileList.push(_data)
                // })
                this.fileList = fileList
                this.$message.success('上传成功了')
                this.update_num++;
                console.log(fileList.length)
                if(this.update_num >= fileList.length&&fileList.length!=0) {
                    this.disButton = false
                } 
            } else {
                this.$message.error(`${res.msg}`)
            }
        },
        async beforeRemove(file, fileList) {
            await this.$confirm(`确定移除 ${ file.name }？`, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
            // console.log(fileList)
            this.fileList = fileList
            this.update_num == 0?'':this.update_num--;
            return true
        },
        submit() {
            if(this.fileList.length == 0) return
            this.disButton = true
            let jsonStr = []
            this.fileList.forEach(v => {
                let _data = {}
                _data.name = v.raw.name.split(`.${v.raw.type.split('/')[1]}`)[0]
                _data.url = v.response.data.image_url
                jsonStr.push(_data)
            })
            jsonStr = JSON.stringify(jsonStr)
            let _data = {
                id_product: this.productId,
                course_info: jsonStr
            }
            _data = Object.assign({},_data,this.userData)
            this.$api.addCourse(_data)
                .then(res => {
                    // console.log(res)
                    if (res.data.status == 200) {
                        this.$message.success(`${res.data.msg}`)
                        this.update_num = 0
                        this.disButton = false
                        this.fileList = [];
                        this.getAudioList()
                    }
                })
        },
        successUpload(res, file) {
            if (res.status == 200) {
                let _data = {
                    id_product: this.productId,
                    id: res.data.id,
                    course_name: file.raw.name.split(`.${file.raw.type.split('/')[1]}`)[0],
                    course_url: res.data.image_url
                }
                _data = Object.assign({},_data,this.userData)
                this.$api.editCourse(_data).then((res) => {
                        this.videoFlag = false
                        this.videoUploadPercent = 0
                        // this.againUpload = false;
                        // this.againPercent = 0;
                    if (res.data.status == 200) {
                        this.$message.success('重新上传成功')
                        // this.fileList1 = [];
                        this.getAudioList()
                    } else {
                        this.$message.error(res.data.msg)
                        this.getAudioList()
                    }
                })
            } else {
                this.$message.error(`${res.msg}`)
            }
        },
        processUpload(event, file, fileList) {
            this.againUpload = true;
            this.againPercent = Number(file.percentage.toFixed(0));
        },
        changePage(e) {
            this.currentPage = e
            this.getAudioList()
        },

    }
}
</script>

<style lang="scss">
.audio {
    .el-upload--text {
        border: 0 solid #fff;
    }
    .upload_box {
        margin-bottom: 20px;
    }
    .tip {
        color: #909399;
        margin-left: 20px;
    }
    .table-box {
        .tips {
            margin-bottom: 20px;
            color: red; 
            border-bottom: 1px solid transparent; 
        }
        .el-table {
            margin-top: 10px;
        }
        .a_style {
            color: #20a0ff;
            // direction: 
        }
    }
    .fontColor .el-input--suffix .el-input__inner {
        color: #20a0ff;
    }
}
</style>