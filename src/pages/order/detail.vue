<template>
    <div class="orderDetail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: 'order'}">
                    <i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 打印 -->
        <div class="print">
            <el-button type="primary" icon="el-icon-printer" @click="printCanvas()">打印</el-button>
            <el-button type="warning" icon="el-icon-printer" @click="showSheet" v-if="!orderInfo.is_virtual">电子面单</el-button>
        </div>
        <!-- 订单信息，打印区块 -->
        <div id="orderWrap" class="orderWrap">
            <div class="infoBox info_productList">
                <div class="infoSort">商品信息</div>
                <div class="productList">
                    <el-table :data="productList" border style="width: 100%">
                        <el-table-column prop="product_name" label="商品名称" width="280"></el-table-column>
                        <el-table-column prop="product_price" label="商品单价" width="180"></el-table-column>
                        <el-table-column prop="product_num" label="数量" width="100"></el-table-column>
                        <el-table-column prop="product_spec" label="规格" width="100"></el-table-column>
                        <el-table-column prop="total_price" label="金额"></el-table-column>
                        <el-table-column prop="" label="商品属性">
                            <template slot-scope="scope">
                                <span v-if="scope.row.is_virtual==0">实物</span>
                                <span v-if="scope.row.is_virtual==1">虚拟</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_source" label="商品所属来源"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="infoBox info_orderInfo">
                <div class="infoSort">订单信息</div>
                <div class="orderInfos">
                    <div class="infoWrap">
                        <div class="infoTit">订单号</div>
                        <div class="infoDate">{{orderInfo.reference}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">创建时间</div>
                        <div class="infoDate">{{orderInfo.create_ts}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">客户姓名</div>
                        <div class="infoDate">{{orderInfo.buyer_name}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">电话</div>
                        <div class="infoDate">{{orderInfo.phone_number}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">地址</div>
                        <div class="infoDate">{{orderInfo.is_virtual?'':orderInfo.address}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">物流信息</div>
                        <div class="infoDate">{{orderInfo.carrier_info ? orderInfo.carrier_info :'无'}}
                            <i @click="showEdit('editDeliveryFrom')" class="el-icon-edit"></i>
                        </div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">客户备注</div>
                        <div class="infoDate">{{orderInfo.buyer_note}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">推荐医生</div>
                        <div class="infoDate">{{orderInfo.doctor_info}}
                            <i @click="showEdit('editDoctorFrom')" class="el-icon-edit"></i>
                        </div>
                        <!-- <div class="eidtInfo" @click="showEdit('editDoctorFrom')"><i class="el-icon-edit"></i></div> -->
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">推广大使ID</div>
                        <div class="infoDate">{{orderInfo.recommender_info}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">是否首次下单</div>
                        <div class="infoDate">{{orderInfo.first_order==1?'是':'否'}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">商品总价值</div>
                        <div class="infoDate">￥{{Number(orderInfo.total_price).toFixed(2)}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">优惠券价值</div>
                        <div class="infoDate">￥{{orderInfo.coupon_price}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">配送方式</div>
                        <div class="infoDate">{{orderInfo.is_virtual?'':`${orderInfo.express_name}￥${orderInfo.freight_price}`}}</div>
                        <!-- <span v-if="!orderInfo.is_virtual">{{orderInfo.express_name}}￥{{orderInfo.freight_price}}</span> -->
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">最终付款金额</div>
                        <div class="infoDate">￥{{orderInfo.final_price}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">订单状态</div>
                        <div class="infoDate">{{orderInfo.order_status}}
                            <i @click="showEdit('editStatusFrom')" class="el-icon-edit"></i>
                        </div>
                        <!-- <div class="eidtInfo" @click="showEdit('editStatusFrom')"><i class="el-icon-edit"></i></div> -->
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">订单来源</div>
                        <div class="infoDate">{{orderInfo.order_source}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">订单类型</div>
                        <div class="infoDate">{{orderInfo.order_type}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">订单属性</div>
                        <div class="infoDate">{{orderInfo.is_virtual?'虚拟':'实物'}}</div>
                    </div>
                    <div class="infoWrap">
                        <div class="infoTit">客服备注</div>
                        <div class="infoDate">{{orderInfo.customer_note?orderInfo.customer_note:'无'}}
                            <i @click="showEdit('editNoteFrom')" class="el-icon-edit"></i>
                        </div>
                        <!-- <div class="eidtInfo" @click="showEdit('editNoteFrom')"><i class="el-icon-edit"></i></div> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- 操作记录，不打印 -->
        <div class="operation">
            <div class="operTit">操作记录</div>
            <el-table :data="operates" border style="width: 100%">
                <el-table-column prop="create_ts" label="修改时间" width="280"></el-table-column>
                <el-table-column prop="operator" label="操作人" width="180"></el-table-column>
                <el-table-column prop="content" label="操作"></el-table-column>
            </el-table>
        </div>
        <!-- 编辑医生 -->
        <el-dialog title="修改-推荐医生" :visible.sync="editDoctorFrom">
            <el-form label-width="100px" label-position="left">
                <el-form-item label="原推荐医生:">
                    <span>{{orderInfo.doctor_info}}</span>
                </el-form-item>
                <el-form-item label="新推荐医生:">
                    <el-select v-model="editDoctor" filterable remote reserve-keyword placeholder="请输入医生ID" :remote-method="searchDoctor" :loading="loading">
                        <el-option v-for="item in filterDoctors" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <!-- <el-select v-model="editDoctor" filterable remote placeholder="请输入医生ID" :loading="loading">
                        <el-option v-for="item in filterDoctors" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>-->
                    <!-- <i class="el-icon-search" @click="searchDoctor"></i>  -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit('editDoctorFrom')">取 消</el-button>
                <el-button type="primary" @click="saveDoctor">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑订单状态 -->
        <el-dialog title="修改-订单状态" :visible.sync="editStatusFrom">
            <el-form label-width="100px" label-position="left">
                <el-form-item label="原订单状态:">
                    <span>{{orderInfo.order_status}}</span>
                </el-form-item>
                <el-form-item label="订单状态:">
                    <el-select v-model="editStatus" placeholder="订单状态">
                        <el-option v-for="item in oStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit('editStatusFrom')">取 消</el-button>
                <el-button type="primary" @click="saveStutus">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑客户备注 -->
        <el-dialog title="修改-客服备注" :visible.sync="editNoteFrom">
            <el-form label-width="80px" label-position="left">
                <el-form-item label="客服备注:">
                    <el-input type="textarea" v-model="editNote"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit('editNoteFrom')">取 消</el-button>
                <el-button type="primary" @click="saveNote">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑物流信息 -->
        <el-dialog title="修改-物流信息" :visible.sync="editDeliveryFrom">
            <el-form label-width="90px" label-position="left">
                <el-form-item label="原物流信息:">
                    <span>{{orderInfo.carrier_info}}</span>
                </el-form-item>
                <el-form-item label="快递公司:">
                    <el-input v-model="editDeliComy"></el-input>
                </el-form-item>
                <el-form-item label="快递单号:">
                    <el-input v-model="editDelNum"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit('editDeliveryFrom')">取 消</el-button>
                <el-button type="primary" @click="saveDelivery">确 定</el-button>
            </div>
        </el-dialog>
        <!--打印电子面单-->
        <el-dialog title="电子面单" :visible.sync="ewaybill">
            <Sheet v-loading="loading" :orderId="this.orderId" :sheetForm="this.sheetForm" :Name="this.name"></Sheet>
        </el-dialog>
    </div>
</template>
<script>
import printJS from 'print-js'
import html2canvas from 'html2canvas';
import Sheet from '@/components/Sheet.vue'
export default {
    data() {
        return {
            userName: "",  // 登陆用户
            orderId: "",            // 订单ID
            productList: [],        // 商品信息
            orderInfo: {},          // 订单信息
            operates: [],           // 操作记录
            editDoctorFrom: false,  // 推荐医生编辑框
            editStatusFrom: false,  // 订单状态编辑框
            editNoteFrom: false,    // 备注编辑框
            editDeliveryFrom: false, //物流信息
            editDeliComy: '',         //快递公司
            editDelNum: '',           //快递单号
            editDoctor: "",         // 修改的医生
            filterDoctors: [],      // 根据条件筛选后的可选的医生
            list: [],               // 所有可选的医生选项
            loading: false,         // 加载可选医生loading
            doctorSourceDatas: [],  // 推荐医生数据源
            editStatus: null,       // 编辑的订单状态
            editNote: "",           // 编辑的备注
            oStatus: [              // 可选的订单状态
                { value: 1, label: "待付款" },
                { value: 2, label: "已付款" },
                { value: 4, label: "已发货" },
                { value: 6, label: "已取消" },
                { value: 7, label: "已退款" },
                { value: 13, label: "已完成" }
            ],
            ewaybill: false,
            name: '',
            sheetForm: {},
            loading: false
        }
    },
    created() {
        this.orderId = this.$route.query.orderId;
        this.getOrderDetail();
        //this.printSheet();
    },

    methods: {
        // 获取订单信息
        async getOrderDetail() {
            let _orderId = this.$route.query.orderId;
            let _resDate = await this.$api.getOrderInfos(_orderId)
            let _orderInfo = _resDate.data.data;
            this.orderInfo = _orderInfo.order_info;
            this.productList = _orderInfo.product_list;
            this.operates = _orderInfo.operation_list;
        },
        printInfos() {
            printJS({
                documentTitle: '订单信息',
                printable: 'orderWrap',
                type: 'html',
                targetStyles: ['*']
            });
        },
        printCanvas() {
            html2canvas(document.getElementById('orderWrap')).then(canvas => {
                // document.body.appendChild(canvas);
                //生成base64图片数据  
                var dataUrl = canvas.toDataURL();
                // var newImg = window.document.createElement("img");  
                // newImg.src = dataUrl;
                // var printWindow = window.open(dataUrl);
                // printWindow.document.write('<img width="100%" src="'+newImg.src + '" />')
                // printWindow.document.body.innerHTML = '<img width="100%" src="'+newImg.src + '" />'
                // printWindow.print();

                printJS({
                    documentTitle: this.orderId + '订单信息',
                    printable: dataUrl,
                    type: 'image',
                    targetStyles: ['*']
                });
            });
        },
        // 显示编辑框 form: 编辑框showname
        showEdit(form) {
            let _form = form    
            this[_form] = true;
            // 初始化编辑数据
            this.editStatus = null;
            this.editDoctor = "";
            this.filterDoctors = [];
            if (_form === 'editNoteFrom') {
                this.editNote = this.orderInfo.note
            }
            if(_form=='editDeliveryFrom'){
                this.editDeliComy=''
                this.editDelNum=''
            }
        },
        // 退出编辑 form: 编辑框showname
        cancelEdit(form) {
            let _form = form
            this[_form] = false;
            this.$message.warning('已取消编辑');
        },
        // 保存编辑推荐医生
        saveDoctor() {
            if (this.editDoctor.length > 0) {
                this.$api.editDoctor(this.orderId, this.username, this.editDoctor)
                    .then(res => {
                        if (res.status === 200) {
                            let _res = res.data.data;
                            this.operates.unshift(_res);
                            this.orderInfo.doctor_info = this.editDoctor;
                            this.$message.success('成功修改推荐医生')
                        } else {
                            this.$message.error("网络错误，请稍后再试")
                        }
                    })
                this.editDoctorFrom = false;
            } else {
                this.$message.error('请选择推荐医生');
            }
        },
        // 保存物流信息
        saveDelivery() {
            if (this.editDeliComy.length > 0 && this.editDelNum.length > 0) {
                let delivery = this.editDeliComy.trim() + '-' + this.editDelNum.trim()
                this.$api.editDelivery(this.orderId, this.username, delivery)
                    .then(res => {
                        if (res.status === 200) {
                            this.$message.success('成功修改物流信息')
                            this.getOrderDetail();
                        } else {
                            this.$message.error("网络错误，请稍后再试")
                        }
                    })
                this.editDeliveryFrom = false;
            } else {
                this.$message.error('请修改物流信息');
            }
        },
        // 保存客户备注
        saveNote() {
            this.$api.modifyNote(this.orderId, this.username, this.editNote)
                .then(res => {
                    if (res.status === 200) {
                        let _res = res.data.data;
                        this.operates.unshift(_res);
                        this.orderInfo.customer_note = this.editNote;
                        this.editNoteFrom = false;
                        this.$message.success("成功修改客服备注")
                    } else {
                        this.$message.error("网络错误，请稍后再试")
                    }
                })
                .catch(err => { console.log(err) })
        },
        // 保存编辑订单状态
        saveStutus() {
            if (this.editStatus) {
                this.$api.modifyOrderStatus(this.orderId, this.username, this.editStatus)
                    .then(res => {
                        if (res.status === 200) {
                            let _res = res.data.data;
                            this.operates.unshift(_res);
                            switch (this.editStatus) {
                                case 1:
                                    this.orderInfo.order_status = "待付款";
                                    break;

                                case 2:
                                    this.orderInfo.order_status = "已付款";
                                    break;

                                case 4:
                                    this.orderInfo.order_status = "已发货";
                                    break;

                                case 6:
                                    this.orderInfo.order_status = "已取消";
                                    break;

                                case 7:
                                    this.orderInfo.order_status = "已退款";
                                    break;

                                case 13:
                                    this.orderInfo.order_status = "已签收";
                                    break;
                            }
                            this.editStatusFrom = false;
                            this.$message.success("成功修改订单状态")
                        } else {
                            this.$message.error("网络错误，请稍后再试")
                        }
                    })
                    .catch(err => { console.log(err) })
            } else {
                this.$message.error('请选择订单状态');
            }

        },
        // 搜索推荐医生信息
        searchDoctor(query) {
            console.log('search doctor')
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.$api.searchDoctor(query)
                        .then(res => {
                            this.loading = false;
                            if (res.data.data) {
                                let _list = [res.data.data];
                                this.filterDoctors = _list.map(item => {
                                    return { value: item, label: item };
                                });
                            } else {
                                this.filterDoctors = [];
                            }
                        })
                }, 1000);
            } else {
                this.filterDoctors = [];
            }
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.filterDoctors = this.list.filter(item => {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.filterDoctors = [];
            }
        },
        printSheet() {
            this.loading = true;
            let data = {
                username: this.username,
                access_token: this.accessToken,
                id_order: this.orderId
            };
            this.$api.ewaybill(data).then(res => {
                if (res.data.status == 200) {
                    this.loading = false;
                    this.sheetForm = res.data.data
                    this.name = this.sheetForm.product_list
                    this.getOrderDetail()
                }
            })
        },
        showSheet() {
            this.printSheet()
            this.ewaybill = true;
        }
    },
    mounted() {
        this.list = this.doctorSourceDatas.map(item => {
            return { value: item, label: item };
        });
    },
    computed: {
        // 登陆用户
        username() {
            let username = localStorage.getItem('g_username');
            this.accessToken = localStorage.getItem('g_accessToken');
            return username ? username : this.userName;
        }
    },
    components: {
        'Sheet': Sheet
    }
}
</script>
<style>
.orderWrap {
	margin: 10px 0;
	font-size: 14px;
	color: #333;
}
.orderWrap .infoBox {
	margin-bottom: 10px;
	width: 100%;
	position: relative;
}
.orderWrap .infoBox .infoSort,
.operation .operTit {
	background: #084e7e;
	color: #fff;
	height: 30px;
	line-height: 30px;
	font-weight: bold;
	text-indent: 14px;
	margin: 0;
}
.orderWrap .orderInfos {
	border-left: 1px solid #ccc;
	border-right: 1px solid #ccc;
}
.orderWrap .orderInfos .infoWrap {
	min-height: 30px;
	line-height: 30px;
	display: flex;
	position: relative;
	box-sizing: border-box;
	border-bottom: 1px solid #ccc;
}
.orderWrap .orderInfos .infoWrap:hover {
	background: #f5f7fa;
}
.orderWrap .orderInfos .infoWrap > div {
	flex: 1;
	padding-left: 14px;
}
.orderWrap .orderInfos .infoWrap .infoTit {
	border-right: 1px solid #ccc;
	flex: 0.5;
}
.orderWrap .orderInfos .infoWrap .eidtInfo {
	position: absolute;
	right: 10px;
	cursor: pointer;
	color: green;
	flex: 1.5;
}
.orderWrap .orderInfos .infoWrap .infoDate {
	padding-right: 30px;
}
.orderWrap .orderInfos .infoWrap .infoDate i {
	margin-left: 10px;
	color: green;
}
</style>