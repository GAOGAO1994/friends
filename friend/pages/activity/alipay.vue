<template>
	<div v-html='apply'>
		{{apply}}
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			return{
				apply: '',
				payType:'alipay',
				activityMember:{}
			}
		},
		computed: {},
		methods:{
			goPay:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'payment/ali/getForm',
					method:'POST',
					data:{
						outTradeNo:this.activityMember.outTradeNo,
						subject:'活动报名',							// 订单名称，必填
						totalAmount: this.activityMember.fee,		// 付款金额，必填
						body:'阅见-报名费'							// 商品描述，可空
					},
					success(res) {
						if(that.$http.success(res)){
							that.apply = res.data.msg;
							that.$nextTick(() => {
								document.forms [0].submit()
							})
						}
					}
				})
			},
			getPreSign:function(outTradeNo){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/activity-member/getOne',
					method:'POST',
					data:{
						outTradeNo:outTradeNo
					},
					success(res) {
						if(that.$http.success(res)){
							that.activityMember = res.data.data;
						}
					}
				})
			}
		},
		onLoad(option) {
			this.getPreSign(option.outTradeNo);
			
			
			// if(window.location.href.indexOf('time') > 0){
			// 	let a = window.location.href.split('?');
			// 	window.location.href = a[0] + '#' + a[1].split('#')[1] + '?' + a[2];
			// }else{
			// 	this.outTradeNo = option.outTradeNo;
			// 	this.activity.id = option.activityId;
			// 	this.activity.entryFee = option.entryFee;
			// 	this.member.accountId = option.accountId;
			// 	this.member.id = option.memberId;
			// 	this.member.nickname = option.nickname;
			// 	this.member.avatarUrl = option.avatarUrl;
			// 	
			// 	if(option.inviteId){
			// 		this.inviteId = option.inviteId;
			// 	}
			// 	//分享参数
			// 	if(option.shareOrigin){
			// 		this.share.origin = option.shareOrigin;
			// 	}
			// 	if(option.shareFrom){
			// 		this.share.from = option.shareFrom;
			// 	}
			// 	this.saveSignup();
			// }
		}
	}
	
	
</script>
	
<style>
	
</style>
