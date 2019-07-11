<template>
	<div class="refund">
		<el-form label-width="90px" label-position="left">
			<el-form-item label="订单号:">
				<span>{{orderInfo.reference}}</span>
			</el-form-item>
			<el-form-item label="退货原因:">
				<el-input v-model="reason"></el-input>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input v-model="remark"></el-input>
			</el-form-item>
		</el-form>
		<div class="sure-btn">
			<el-button type="primary" @click="refundSure">完成</el-button>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			reason: '',
			remark: ''
		}
	},
	props: ['orderInfo', 'userName'],

	computed: {

	},
	watch: {
		userName: {
			deep: true
		}
	},
	created() {
	},
	methods: {
		refundSure() {
			if(!this.reason){
				this.$message.error('退货原因必填')
				return
			}
			this.$api.modifyOrderStatus(this.orderInfo.id, this.userName, 7, this.reason, this.remark,
				this.operator).then((res) => {
					if (res.status == 200) {
						this.$message.success('退货信息保存成功')
						this.$emit('uploadClose', false)
						this.$emit('getOrderList',true)
					}
				})
		}
	},
}
</script>
<style scoped >
</style>
