<template>
	<view class="content">
		<view class="padding-h">
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="black" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="">报名费</text>
			</view>
		</view>
		<view>
			<view class="padding-l">
				<view class="item-wrap input-row border">
					<text class="">支付费用</text>
					<view class="input-wrap">
				        <text class="">{{activityMember.fee/100}}元</text>
				    </view>
				</view>
				<view class="item-wrap input-row border margin-top">
					<text>支付方式</text>
				</view>
				<view class="item-wrap input-row border" @click="pickPayType('wxpay')">
					<view class="row-wrap">
						<f-icon type="wxpay" color="#5ed555" size="46"></f-icon>
						<text class="">微信支付</text>
					</view>
					<view class="input-wrap">
						<label><radio value="wxpay" :checked="payType === 'wxpay'" color="#008eff" /></label>
					</view>
				</view>
				<view class="item-wrap input-row" @click="pickPayType('alipay')">
					<view class="row-wrap">
						<f-icon type="alipay" color="#00aaef" size="46"></f-icon>
						<text class="">支付宝</text>
					</view>
					<view class="input-wrap">
						<label><radio value="alipay" :checked="payType === 'alipay'" color="#008eff" /></label>
					</view>
				</view>
			</view>
			<view class="padding-h margin-top">
				<button class="primary" @click="doSubmit">立即支付</button>
			</view>
		</view>
		<guide :show="guideShow" @close="closeGuide"></guide>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import guide from '@/components/guide/guide.vue';
	
	// #ifdef H5
	var wx = require('@/services/weixin-js-sdk/index.js');
	// #endif

	export default {
		components: {fIcon, guide},
		data() {
			return{
				guideShow:false,
				payType:'wxpay',
				outTradeNo:'',
				activityMember:{
					fee:0
				},
				isBack:false
			}
		},
		computed: {
			
		},
		methods:{
			pickPayType: function(payType) {
				this.payType = payType;
			},
			closeGuide:function(){
				this.guideShow = false;
				let that = this;
				uni.showModal({
					title: '确认',
					content: '已完成支付？',
					success: function (res) {
						if (res.confirm) {
							that.queryPayStatus();
						} else if (res.cancel) {
							
						}
					}
				});
			},
			doSubmit:function(){
				if(this.isWeixin()){
					this.guideShow = true;
				}else{
					this.toPay();
				}
			},
			toPay:function(){
				if(this.payType == 'alipay'){
					uni.redirectTo({
						url:'/pages/activity/alipay?outTradeNo='+this.outTradeNo
					})
				}else if(this.payType == 'wxpay'){
					uni.redirectTo({
						url:'/pages/activity/wxpay?outTradeNo='+this.outTradeNo
					})
				}
			},
			signupSuccess:function(activity){
				let that = this;
				uni.showModal({
					title: '报名成功',
					content: '您已成功报名活动，您还可以邀请心仪的TA一起参加',
					confirmText:'去邀请',
					cancelText:'返回',
					success: function (res) {
						if (res.confirm) {
							that.invite(activity);
						} else if (res.cancel) {
							that.comeback(activity);
						}
					}
				});
			},
			comeback:function(activity){
				uni.redirectTo({
					url:'/pages/activity/activity?id='+activity.activityId
				})
			},
			invite:function(activity){
				uni.redirectTo({
					url:'/pages/member/members?activityId='+activity.activityId
				})
			},
			queryPayStatus:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/activity-member/getOne',
					method:'POST',
					data:{
						outTradeNo:this.outTradeNo
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data && res.data.data.payStatus == 'TRADE_SUCCESS'){		//支付成功
								that.signupSuccess(res.data.data);
							}else{
								uni.showToast({
									icon:'none',
									title:'未查到支付信息'
								})
							}
						}
					}
				})
			},
			initWechatJSConfig:function(){
				//alert(window.location.href + '&shareOrigin='+this.account.id+'&shareFrom='+this.account.id);
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'wechat/getWechatJSConfig',
					data:{
						currUrl: window.location.href
					},
					success(res) {
						if(that.$http.success(res)){
							// alert(JSON.stringify(res));
							let data = res.data.data;
							// alert(JSON.stringify(data));
							data.debug = true;
							wx.config(data);
							
							wx.error(function(res){
								 alert(JSON.stringify(res));
							});
							wx.ready(function(){
								wx.updateAppMessageShareData(getShareData('appmessage'));
								wx.updateTimelineShareData(getShareData('timeline'));
							});
						}
					}
				})
			},
			getShareData:function (type){
				let link = window.location.href + '&shareOrigin='+this.account.id+'&shareFrom='+this.account.id;
				let data = {
					title: this.activity.title,
					link: link,
					imgUrl: this.banner,
					success: function (res) {
						// alert(JSON.stringify(res));
					}	
				}
				if(type == 'appmessage'){
					data.desc = "阅己阅TA阅见爱——来自‘阅见’的分享";
				}
				return data;
			},
			isWeixin:function(){
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
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
			// #ifdef H5
			if(this.isWeixin()){
				this.initWechatJSConfig();
			}
			// #endif
			
			if(option.out_trade_no){	//支付宝支付返回
				this.isBack = true;
				this.outTradeNo = option.out_trade_no;
				this.queryPayStatus();
			}else{
				this.outTradeNo = option.outTradeNo;
				this.getPreSign(this.outTradeNo);
			}
			
		}
	}
	
	
</script>
	
<style>
	.banner {
		width: 100%;
	}
	.banner image{
		width: 100%;
		max-height: 300upx;
	}
	.title{
		font-size: 20px;
		font-weight: 900;
		margin-top: 40upx;
		margin-bottom: 20upx;
	}
	.item-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40upx 0;
		align-items: center;
	}
	.input-wrap{
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		margin-right: 40upx;
	}
	.row-wrap{
		display: flex;
		align-items: center;
	}
	.row-wrap text{
		margin-left: 20upx;
	}
	
	.bottom-bar-block{
		height: 140upx;
		align-items: flex-end;
	}
	
	.bottom-bar-wrap{
		width: 100%;
		position:fixed;
		left: 0;
		bottom: 0;
		height: 120upx;
		background-color: white;
		box-shadow: 0px -2px 30px 2px #f8f8f8;
	}
	
	.bottom-bar{
		position:fixed;
		left: 40upx;
		right: 40upx;
		bottom: 0;
		height: 120upx;
		display: flex;
		flex-direction: row;
	}
	.bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.bottom-bar .bar-box .item{
		display: flex;
		align-items: center;
		flex-grow: 1;
	}
	.bottom-bar .bar-box .item text{
		margin-left: 10upx;
		/* font-weight:bold; */
	}
	.bottom-bar .bar-box .button{
		justify-content: flex-end;
	}
	.bottom-bar .button-wrap{
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
		box-shadow: 0px 0px 10px #fe8dc8;
		line-height: 80upx;
		height: 80upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
	}
	.bottom-bar .button-wrap image{
		width: 60upx;
	}
	.bottom-bar .button-wrap text{
		color: white;
		font-weight: normal;
	}
	
</style>
