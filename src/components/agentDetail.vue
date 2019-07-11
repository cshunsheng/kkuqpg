<template>
	<div>
		<el-collapse v-model="activeNames" @change="handleChange">
			<el-collapse-item title="患者信息" name="1">
				<div class="productList">
					<div class="infoBox info_orderInfo">
						<div class="infoSort">患者信息</div>
						<div class="orderInfos">
							<div class="infoWrap">
								<div class="infoTit">患者姓名</div>
								<div class="infoDate">{{patInfo.patient_real_name}}</div>
							</div>
							<div class="infoWrap">
								<div class="infoTit">性别</div>
								<div class="infoDate">
									<span v-if="patInfo.gender== 1">男</span>
									<span v-if="patInfo.gender== 0">女</span>
									<span v-if="patInfo.gender==''"></span>
								</div>
							</div>
							<div class="infoWrap">
								<div class="infoTit">年龄</div>
								<div class="infoDate">{{patInfo.age}}</div>
							</div>
							<div class="infoWrap">
								<div class="infoTit">身份证号</div>
								<div class="infoDate">{{patInfo.pid}}</div>
							</div>
							<div class="infoWrap">
								<div class="infoTit">手机号</div>
								<div class="infoDate">{{patInfo.contacts_phone}}</div>
							</div>
						</div>
					</div>
					<p class="source">影像资料(病例照片，出院小结，检验报告，X光等):</p>
					<div class="imgList">
						<div class="imgBox" v-for="(item,index) in patInfo.patient_images" :key="index">
							<a :href="item.images" target="_blank">
								<img :src="item.images">
							</a>
						</div>
					</div>
				</div>
			</el-collapse-item>
			<el-collapse-item title="订单信息" name="2">
				<div class="infoBox info_orderInfo">
					<div class="infoSort">订单信息</div>
					<div class="orderInfos">
						<div class="infoWrap">
							<div class="infoTit">订单号</div>
							<div class="infoDate">{{orderInfo.reference}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">创建时间</div>
							<div class="infoDate">{{orderInfo.created_at}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">患者姓名</div>
							<div class="infoDate">{{orderInfo.patient_name}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">手机号</div>
							<div class="infoDate">{{orderInfo.contacts_phone}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">服务项目</div>
							<div class="infoDate">{{orderInfo.service_name}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">服务费</div>
							<div class="infoDate">{{parseFloat(orderInfo.amount).toFixed(1)}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">医生姓名</div>
							<div class="infoDate">{{orderInfo.doctor_id+'-'+orderInfo.doctor_name}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">代理人</div>
							<div class="infoDate">{{orderInfo.agency_id+'-'+orderInfo.agency_name}}</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">订单状态</div>
							<div class="infoDate">
								<el-form>
									<el-form-item>
										<el-select v-model="orderInfo.current_status" placeholder="请选择订单状态" size="small" @change=editStatus(orderInfo.current_status)>
											<el-option v-for="s in orderStatus" :key="s.value" :label="s.label" :value="s.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-form>
							</div>
						</div>
						<div class="infoWrap">
							<div class="infoTit">客服备注</div>
							<div class="infoDate">
								<el-form>
									<el-form-item>
										<el-input type="textarea" v-model="orderInfo.remark"></el-input>
										<el-button size="mini" class="full-btn" type="primary" @click.stop="valueChange(orderInfo.remark)">确定</el-button>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</div>
				</div>
			</el-collapse-item>
			<el-collapse-item title="操作记录" name="3">
				<div class="productList">
					<el-table :data="orderRemark" border :header-cell-style="styleObj" :cell-style="styleObj" style="width: 100%">
						<el-table-column prop="modify_time" label="修改时间"></el-table-column>
						<el-table-column prop="operator" label="操作人"></el-table-column>
						<el-table-column prop="log_text" label="操作内容"></el-table-column>
					</el-table>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			activeNames: ['1'],
			orderStatus: [
				{ value: '1', label: "已付款" },
				{ value: '2', label: "已完成" },
				{ value: '7', label: "已退款" },
			],
			orderInfo: {},
			patInfo: {},
		}
	},
	props: ['orderId', 'userData', 'styleObj'],
	computed: {
		...mapGetters([
			'orderRemark'
		])
	},
	watch: {
		orderId(newValue, oldValue) {
			console.log(newValue)
			this.getorderDetail()
		}
	},
	created() {
		this.$emit('initInfo', true)
		this.getorderDetail()

	},
	methods: {
		handleChange(val) {
			// console.log(val);
		},
		initInfo() {
			this.orderInfo = {}
			this.patInfo = {}
			this.orderRemark = []
		},
		// 获取订单列表
		getorderDetail() {
			let data = {
				id: this.orderId
			}
			data = Object.assign({}, data, this.userData)
			this.$api.orderDetail(data)
				.then(res => {
					let resData = res.data.data
					this.$store.commit('ORDERREARK', { list: resData.operation_list })
					this.orderInfo = resData.order_info
					this.patInfo = resData.patient_info
					console.info(`patInfo.gender:${typeof(this.patInfo.gender)}`)
				})
		},
		//修改订单状态
		editStatus(status) {
			
			console.log(status)
			this.editOrderDetail(status, '', 1)
		},
		//编辑客服备注
		valueChange(value) {
			//console.log(value)
			this.editOrderDetail('', value, 2)
		},
		editOrderDetail(status, value, type) {
			let data = {
				id: this.orderId,
				current_status: status,
				remark: value,
				type: type,
			}
			data = Object.assign({}, data, this.userData)
			this.$api.editOrderDetail(data)
				.then(res => {
					if (res.status == 200) {
						this.$message.success('success')
						this.getorderDetail()
						this.$emit('initInfo1', true)
					} else {
						this.$message.error('fail')
					}
				})
		}
	},
}
</script>
<style scoped >
.source {
	color: #409eff;
}
.imgList {
	display: flex;
	flex-wrap: wrap;
	min-height: 160px;
}
.imgList .imgBox {
	width: 148px;
	height: 148px;
	overflow: hidden;
	margin: 10px 10px;
	position: relative;
	border: 1px solid #ccc;
	box-sizing: border-box;
}
.imgList .imgBox img {
	width: 100%;
	height: 100%;
	border: 1px solid #ccc;
	box-sizing: border-box;
}
.orderWrap {
	margin: 10px 0;
	font-size: 14px;
	color: #333;
}
.infoBox {
	margin-bottom: 10px;
	width: 100%;
	position: relative;
}
.infoBox .infoSort,
.operation .operTit {
	background: #084e7e;
	color: #fff;
	height: 30px;
	line-height: 30px;
	font-weight: bold;
	text-indent: 14px;
	margin: 0;
}
.orderInfos {
	border-left: 1px solid #ccc;
	border-right: 1px solid #ccc;
}
.orderInfos .infoWrap {
	min-height: 30px;
	line-height: 30px;
	display: flex;
	position: relative;
	box-sizing: border-box;
	border-bottom: 1px solid #ccc;
}
.orderInfos .infoWrap:hover {
	background: #f5f7fa;
}
.orderInfos .infoWrap > div {
	flex: 1;
	padding-left: 14px;
}
.orderInfos .infoWrap .infoTit {
	border-right: 1px solid #ccc;
	flex: 0.5;
}
.orderInfos .infoWrap .eidtInfo {
	position: absolute;
	right: 10px;
	cursor: pointer;
	color: green;
	flex: 1.5;
}
.orderInfos .infoWrap .infoDate {
	padding-right: 30px;
}
.orderInfos .infoWrap .infoDate i {
	margin-left: 10px;
	color: green;
}
</style>
