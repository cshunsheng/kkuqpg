<template>
    <div class="tracks">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/admin'}">
                    <i class="el-icon-menu"></i>新零售</el-breadcrumb-item>
                <el-breadcrumb-item>货道管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="trackWrap">
            <ul class="trackLine">
                <li class="tabalNam clearfix">
                    <div>层\列</div>
                    <div>列1</div>
                    <div>列2</div>
                    <div>列3</div>
                    <div>列4</div>
                    <div>列5</div>
                    <div>列6</div>
                    <div>列7</div>
                    <div>列8</div>
                </li>
                <li v-for="(item,index) in trackList" class="clearfix">
                    <div class="rowNum">层{{item.row}}</div>
                    <div>
                        <ul class="trackRow clearfix">
                            <li v-for="(rows,inx) in item.list">
                                <div class="rowsInfo">
                                    <!-- <span>{{rows.column}}</span> -->
                                    <span style="margin-right: 5px;">{{rows.product_num}}件</span>
                                    <i v-if="rows.id_product !== 0" class="el-icon-edit hoverIcon" @click="showEditNum(item.row, rows.column, rows.product_num, item.depth, index+1)"></i>
                                </div>
                                <div class="rowsEdit">
                                    <span v-if="rows.id_product !== 0">{{rows.product_name}}</span>
                                    <i v-if="rows.id_product !== 0" class="el-icon-delete hoverIcon" @click="removeOptions(item.row, rows.column, index+1)"></i>
                                    <span class="hoverIcon" v-if="rows.id_product === 0" @click="editAdd(item.row, rows.column, rows.id_product, rows.product_num, item.depth, index+1)">
                                        <i class="el-icon-circle-plus-outline"></i>添加商品
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>

        <el-dialog class="trackDialog" title="添加商品" :visible.sync="dialogFormVisible">
            <el-form :inline="true" :model="proInfo">
                <el-form-item>
                    <el-input size="small" prefix-icon="el-icon-search" placeholder="商品名称" v-model="keyWord" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getSearchRes(keyWord)">搜索</el-button>
                </el-form-item>
                <div class="resList" v-if="noRes === false">
                    <el-radio-group v-model="checkProduct" size="small">
                        <el-radio v-for="item in searchRes" :key="item.id_product" :label="item.id_product" border>{{item.product_name}}</el-radio>
                    </el-radio-group>

                </div>
                <div v-if="noRes === true">对不起，未找到相关商品...</div>
                <el-form-item label="添加数量">
                    <el-input v-model="proNum"></el-input>
                    <span class="greyText">最多可添加 {{proInfo.maxNum}} 件</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addProduct(checkProduct)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="trackDialog" title="编辑数量" :visible.sync="dialogEditNum">
            <el-form :inline="true" :model="editInfo">
                <el-form-item label="添加数量">
                    <el-input v-model="editNum"></el-input>
                    <span class="greyText">最多可添加 {{editInfo.maxNum - editInfo.product_num}}件</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditNum = false">取 消</el-button>
                <el-button type="primary" @click="saveNum(editNum)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            trackList: [], // 货道管理列表
            dialogFormVisible: false, // 添加商品popup
            keyWord: "",     // 搜索关键字
            searchRes: [],  // 搜索可添加的商品结果
            checkProduct: 0, // 选择将要添加的商品
            proInfo: {    // 选中的货道商品属性

            },
            noRes: false,
            proNum: 0,  // 添加数量初始为0，业务逻辑：只有在货道清0后，才能添加，因此不需要考虑是否要传值到编辑窗，它只能为0
            editNum: 0  // 编辑数量初始值， 需要接收传值
            , editInfo: {}
            , dialogEditNum: false
        }
    },
    created() {
        this.getTrackList(); // 页面加载时获取货道列表
    },
    methods: {
        // 获取货道列表
        getTrackList() {
            this.$api.tracks()
                .then(res => {
                    this.trackList = res.data.data
                })
                .catch(err => { console.log(err) })
        },
        // 货道无商品（商品id===0)时可为货道添加商品操作
        // 触发后弹出添加商品popup，并将选中的货道信息进行传递
        editAdd(row, column, id, num, maxNum, index) { // 行，列，商品id,最大存放数，行index
            this.proNum = 0;     // 初始化数量为0 （添加商品，只能在数量为0时进行操作）
            this.searchRes = []; // 初始化搜索结果为空
            this.checkProduct = 0; // 重置，不刷新页面删除后才能再直接添加
            let obj = { // 
                row,
                column,
                id,
                num,
                maxNum,
                index
            }
            this.proInfo = obj // 传递给popup商品信息
            this.dialogFormVisible = true;
        },
        // 货道无商品
        // 在搜索结果中，为货道设置商品
        // 添加完成后关闭popup
        addProduct(productId) {
            let _this = this
            let _id = productId;      // 选择添加的商品Id
            let _row = this.proInfo.row; // 选择编辑所在的行
            let _column = this.proInfo.column; // 选择编辑所在的列
            let _num = this.proNum   // 添加的商品数量
            let _inx = this.proInfo.index  // 提交后台所用的行数（提交类型为数字类型，对应ABCDEF)
            let _maxNum = this.proInfo.maxNum  // 最大存放数
            if (productId === 0) {
                this.$message.error('请选择一件商品');
            } else if (_num > _maxNum) {
                this.$message.error('最多只能添加' + _maxNum + '件商品');
            } else if (_num % 1 !== 0) {
                this.$message.error('添加的数量必须是整数');
            } else {
                this.$api.assignTrack(_inx, _column, _id, _num) // 行(后台接收数字类型)，列， 商品id， 商品数量 
                    .then(res => {
                        if (res.status === 200) {
                            // 提交成功后重置前端列表中数据
                            let _r = _this.trackList.find((item, index) => { //通过行号查找出列表中对应的行的对象
                                return item.row === _row
                            })
                            let _c_list = _r.list // 获取所在行的货道列表
                            let _c = _c_list.find((item, index) => {   // 获取所在行及所在列的货道对象
                                return item.column === _column
                            })
                            // 从原始列表中找出所在行及所在列的对象，用以重置前端渲染数据
                            let _robj = _this.trackList[_inx - 1]
                            let _cobj = _robj.list[_column - 1]

                            let _check = _this.searchRes.find(item => { // 从搜索结果中获取最后选择的商品信息对象
                                return item.id_product === productId
                            })
                            let _name = _check.product_name  // 获取选择的商品名称，渲染显示用

                            // 重置前端渲染数据 - id, 名称，数量
                            _this.$set(_cobj, "id_product", productId)
                            _this.$set(_cobj, "product_name", _name)
                            _this.$set(_cobj, "product_num", _num)
                        }
                    })
                    .catch(err => { console.log(err) })

                this.dialogFormVisible = false; // 隐藏popup
            }
        },
        // 清空货道
        removeOptions(row, column, rindex) { // 行，列，行（number)
            let _this = this
            this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', { // 清空前提示警告
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.clearTrack(rindex, column)
                .then(res => {
                    if (res.status === 200) {
                        // 从原始列表中找出所在行及所在列的对象，用以重置前端渲染数据
                        let _robj = _this.trackList[rindex - 1]
                        let _cobj = _robj.list[column - 1]

                        _this.$set(_cobj, "id_product", 0)
                        _this.$set(_cobj, "product_num", 0)
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })
                .catch(err => {})
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            
        },
        // 添加商品popup 搜索可添加的商品列表结果
        getSearchRes(name) {
            let _this = this
            this.noRes = false // 初始化是否有结果判断
            this.$api.getTrackProductList(name)
                .then(res => {
                    _this.searchRes = res.data.data
                    if (res.data.data <= 0) {
                        _this.noRes = true // 如果无商品时，显示未找到tip
                    }
                })
        },
        // 显示数量编辑窗
        showEditNum(row, column, product_num, maxNum, rindex) { // 行， 列， 商品数量， 行（number）
            this.dialogEditNum = true
            let obj = {
                row,
                column,
                product_num,
                maxNum,
                rindex
            }
            this.editNum = product_num // 同步输入框数量
            this.editInfo = obj
        },
        // 保存数量更新
        saveNum(editNum) {
            let _this = this
            let _row = this.editInfo.rwo;
            let _column = this.editInfo.column;
            let _index = this.editInfo.rindex;
            let _maxNum = this.editInfo.maxNum;

            // this.editNum = this.editInfo.product_num;
            // 提交修改数量 
            if (editNum % 1 !== 0) {
                this.$message.error("添加的数量必须是整数")
            } else if ((parseInt(editNum) + parseInt(_this.editInfo.product_num)) > _maxNum) {
                this.$message.error("最多只能添加" + (parseInt(_maxNum) - parseInt(_this.editInfo.product_num)) + '件商品')
            } else {
                this.$api.eidtCount(_index, _column, editNum)
                    .then(res => {
                        if (res.status === 200) {
                            // 从原始列表中找出所在行及所在列的对象，用以重置前端渲染数据
                            let _robj = _this.trackList[_index - 1]
                            let _cobj = _robj.list[_column - 1]
                            _this.$set(_cobj, "product_num", parseInt(editNum) + parseInt(_this.editInfo.product_num))
                        }
                    })
                this.dialogEditNum = false
            }
        }
    }
}
</script>
<style>
.trackWrap {
    font-size: 14px;
    color: #333;
}
.trackLine > li,
.trackRow {
    display: flex;
    /* width:100%; */
    position: relative;
    vertical-align: bottom;
    box-sizing: border-box;
}
.trackLine > li > div,
.trackRow > li {
    float: left;
    box-sizing: border-box;
}
.trackLine > li {
}
.trackRow {
    border-bottom: 1px solid #ccc;
}
.trackRow > li {
    border-left: 1px solid #ccc;
    text-align: center;
    width: 100px;
}
.trackRow > li:last-child {
    border-right: 1px solid #ccc;
}

.trackLine .tabalNam {
    color: #fff;
    font-weight: 600;
    height: 35px;
    line-height: 35px;
}
.trackLine .tabalNam > div {
    width: 100px;
    text-align: center;
    background: rgb(78, 132, 233);
    border-left: 1px solid #ccc;
    box-sizing: border-box;
}
.trackLine > li > div:first-child {
    width: 60px;
    border-left: 1px solid #ccc;
}

.trackRow .rowsInfo {
    border-bottom: 1px dashed #ccc;
    margin-bottom: 3px;
    background: #dedcdc;
    padding: 5px 0;
}
.trackRow .rowsEdit {
    font-size: 12px;
    color: #666;
    padding: 5px 3px;
    min-height: 30px;
}

.trackLine .rowNum {
    line-height: 48px;
    font-weight: 600;
    text-align: center;
    border-bottom: 1px solid #ccc;
}

.resList {
    margin: 15px 0;
    min-height: 30px;
    max-height: 200px;
    width: 100%;
    overflow: auto;
    overflow-x: hidden;
}
.resList .el-radio-group > label {
    margin: 5px;
}

span.greyText {
    color: #999;
    font-size: 12px;
}
.hoverIcon:hover {
    cursor: pointer;
    color: rgb(78, 132, 233);
}

.trackDialog .el-form-item {
    margin-bottom: 5px;
}
.trackDialog .el-dialog__body {
    padding: 10px 20px;
}
</style>