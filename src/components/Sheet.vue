<template>
	<div>
		<div id="printPage">
			<!-- <div class="page-top">
				<div class="emsType">
					<span class="deviation">标准快递</span>
					<p class="num" v-if="sheetForm.bill_code.num">{{Number(sheetForm.bill_code.num)}}</p>
				</div>
				<div class="barcode right">
					<img class="code-top" :src="sheetForm.bill_code.barcode_url">
				</div>
			</div> -->
			<div class="page-remark">
				<div>
					<p class="deviation">{{sheetForm.mark_info.mark}}</p>
				</div>
				<div>
					<p class="addr">集：{{sheetForm.mark_info.bagAddr}}</p>
				</div>
			</div>
			<div class="page-top">
				<div class="left">
					<span class="deviation">寄件：</span>
					<span>{{sheetForm.sender.name}}</span>
					<p>{{sheetForm.sender.phone}}</p>
				</div>
				<div class="area">
					<span class="deviation">{{sheetForm.sender.city}}{{sheetForm.sender.address}}</span>
				</div>
			</div>
			<div class="recipient">
				<span class="deviation">收件人：{{sheetForm.receiver.name}}</span>
				<span class="deviation">电话：{{sheetForm.receiver.mobile}}</span>
				<span class="deviation">地址：{{sheetForm.receiver.city}}{{sheetForm.receiver.address}}</span>
				<p class="deviation product">备注：{{sheetForm.customer_remark}}</p>
			</div>
			<div class="page-top page-center">
				<div class="pay left">
					<span class="deviation">付款方式：</span><br/>
					<span class="deviation">计费重量（KG）：</span><br/>
					<span class="deviation">保价金额（元）：</span><br/>
				</div>
				<div class="delivers">
					<span class="deviation">收件人/代收人：</span>
					<p class="deviation">签收时间：</p>
					<span>年</span>
					<span>月</span>
					<span>日</span>
					<span>时</span>
				</div>
			</div>
			<div class="recipient">
				<span class="deviation">订单号：{{sheetForm.order_id}}</span>
				<p class="deviation product">商品：{{Name}}</p>
			</div>
			<div class="recipient">
				<span class="deviation">条码</span>
				<img class="code-img" :src="sheetForm.bill_code.barcode_url">
			</div>

			<div class="recipient">
				<img class="code-img de-code-img" :src="sheetForm.bill_code.barcode_url">
			</div>
			<div class="recipient">
				<span class="deviation ">
					<span class="border">收</span>{{sheetForm.receiver.name}}</span>
				<span class="deviation">电话：{{sheetForm.receiver.mobile}}</span>
				<span class="deviation">地址：{{sheetForm.receiver.city}}{{sheetForm.receiver.address}}</span>
			</div>
			<div class="recipient">
				<span class="deviation border">寄</span>
				<span>{{sheetForm.sender.name}}</span>
				<span>{{sheetForm.sender.phone}}</span>
				<span class="deviation">{{sheetForm.sender.city}}{{sheetForm.sender.address}}</span>
			</div>
		</div>
		<div class="print-btn">
			<el-button type="primary" @click="printPage">点击打印</el-button>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import printJS from 'print-js'
import html2canvas from 'html2canvas';
export default {
	data() {
		return {
		}
	},
	props: ['orderId', 'Name', 'sheetForm'],

	computed: {
		...mapGetters([
			'cSearch',
			'chConditions'
		]),
		// 登陆用户
		username() {
			let username = localStorage.getItem('g_username');
			this.accessToken = localStorage.getItem('g_accessToken');
			return username ? username : this.userName;
		}
	},
	created() {
	},
	methods: {
		printPage() {
			// console.log(`this.orderId:${this.orderId}`)
			let data = {
				username: this.username,
				access_token: this.accessToken,
				id_order: this.orderId
			};
			this.$api.ewaybillRecord(data).then(res => {
				this.printRecord()
				if (res.data.status == 200) {
					console.log(`打印成功`)
				}
			})
		},
		printRecord() {
			this.orderConditions()
			let subOutputRankPrin = document.getElementById('printPage');
			let options = { format: "CODE128", displayValue: true, fontSize: 24, height: 100, width: 200 };
			document.body.innerHTML = subOutputRankPrin.innerHTML;
			window.print();
			window.location.reload();
			return false;
		},
		orderConditions() {
			// 获取并存储筛选条件
			let _conditions = this.chConditions
			let _csearch = this.cSearch

			localStorage.setItem('cconditions', JSON.stringify(_conditions));
			localStorage.setItem('csearch', JSON.stringify(_csearch));
		}
	},
}
</script>
<style scoped media="print">
@page {
	size: auto; /* auto is the initial value */
	margin: 0mm; /* this affects the margin in the printer settings */
}
body {
	font-size: 24px;
}
.print-btn {
	margin: 20px auto;
}
#printPage {
	width: 426px;
	position: relative;
	margin-top: 30px;
	border: 1px solid #000000;
	box-sizing: border-box;
	color: #000;
	font-weight: bold;
	font-size: 10px;
}
.left {
	border-right: 1px solid #000000;
}
.right {
	border-left: 1px solid #000000;
}
.tel {
	width: 50%;
}
.border {
	width: 30px;
	height: 30px;
	padding: 1px;
	border-radius: 50%;
	border: 2px solid #333;
	font-size: 14px;
	margin-right: 4px;
}
.de-code-img {
	margin: 10px 0 0px 90px;
}
.page-top {
	display: flex;
	justify-content: space-around;
	align-items: center;
	overflow: hidden;
	border-bottom: 1px solid #000000;
}
.page-center {
	text-align: left;
	justify-content: flex-start;
}
.page-remark {
	padding: 34px 10px;
	overflow: hidden;
	border-bottom: 1px solid #000000;
}
.page-remark .deviation {
	font-size: 24px;
}
.page-remark .addr {
	font-size: 16px;
}
.num {
	font-size: 12px;
	text-align: left;
}
.deviation {
	margin-left: 2px;
}

.emsType span {
	font-size: 20px;
}

.recipient {
	padding: 5px 10px;
	border-bottom: 1px solid #000000;
}

.pay {
	width: 50%;
}
.code-top {
	width: 218px;
	height: 46px;
	background-size: cover;
	margin: 0 auto;
}
.code-img {
	width: 260px;
	height: 40px;
	background-size: cover;
}
.code-bottom {
	margin: 3px 10px 0;
	width: 60px;
	height: 60px;
	background-size: cover;
}
.product {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
.pro-name {
	padding: 2px 10px;
}
</style>
