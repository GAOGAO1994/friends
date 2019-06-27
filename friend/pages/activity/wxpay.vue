<template>
	<view>
        <web-view v-if="url != ''" :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>

<script>
	export default {
		components: {},
		data() {
			return{
				show:false,
				url:'',
				webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
				payType:'wxpay',
				activityMember:{}
			}
		},
		computed: {},
		methods:{
			goPay:function(outTradeNo){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'payment/weixin/unifiedOrder',
					method:'POST',
					data:{
						out_trade_no:this.activityMember.outTradeNo,	// 商户订单号
						body:'阅见-报名费',								// 商品描述，可空
						total_fee:this.activityMember.fee,
						trade_type:'MWEB'
					},
					success(res) {
						if(that.$http.success(res)){
							that.url=res.data.mweb_url+'&redirect_url='+encodeURI(that.$http.h5Path+'pages/activity/payment?out_trade_no='+that.activityMember.outTradeNo);
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
