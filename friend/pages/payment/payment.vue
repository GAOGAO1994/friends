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
				<text class="">在线支付</text>
			</view>
		</view>
		<view>
			<view class="padding-l">
				<view class="item-wrap input-row border">
					<text class="">支付费用</text>
					<view class="input-wrap">
				        <text class="">{{order.total/100}}元</text>
				    </view>
				</view>
				<view class="item-wrap input-row border margin-top">
					<text>支付方式</text>
				</view>
				<view class="item-wrap input-row border" v-if="from =='activity'" @click="pickPayType({name:'阅见支付',id:'yjpay'})">
					<view class="row-wrap">
						<image class="logo" mode="scaleToFill" src="../../static/img/icons/icon-logo.png"></image>
						<text class="">阅见会员：</text>
						<text class="primary" v-if="memberAccount.id == 0">未开通</text>
						<text class="primary" v-if="memberAccount.id>0 && memberAccount.activityRemain == 0">无余量</text>
						<text class="primary" v-if="memberAccount.id>0 && memberAccount.activityRemain > 0">剩余 <text class="emphasize">{{memberAccount.activityRemain}}</text> 次</text>
					</view>
					<view class="input-wrap">
						<text class="outline" v-if="memberAccount.id == 0" @click="open">开通</text>
						<text class="outline" v-if="memberAccount.id>0 && memberAccount.activityRemain == 0" @click="open">充值</text>
						<label v-if="memberAccount.id>0 && memberAccount.activityRemain > 0"><radio value="yjpay" :checked="payType.id === 'yjpay'" color="#008eff" /></label>
					</view>
				</view>
				<view class="item-wrap input-row border" v-for="(item,index) in providerList" @click="pickPayType(item)">
					<view class="row-wrap">
						<f-icon :type="item.id" :color="item.id === 'wxpay'?'#5ed555':'#00aaef'" size="46"></f-icon>
						<text class="">{{item.name}}</text>
					</view>
					<view class="input-wrap">
						<label><radio :value="item.id" :checked="payType.id === item.id" color="#008eff" /></label>
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
	import {mapState,mapGetters} from 'vuex'
	
	// #ifdef H5
	var wx = require('@/services/weixin-js-sdk/index.js');
	// #endif

	export default {
		components: {fIcon, guide},
		data() {
			return{
				from:'',
				guideShow:false,
				payType:{id:''},
				outTradeNo:'',
				order:{
					total:0
				},
				isBack:false,
				providerList: [{
					name:'微信支付',
					id:'wxpay',
					loading: false
				},{
					name:'支付宝支付',
					id:'alipay',
					loading: false
				}],
				memberAccount:{id:0}
			}
		},
		computed: {
			...mapState(['target']),
			...mapGetters(['agentMember'])
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
			open:function(){
				uni.redirectTo({
					url:'/pages/user/vip?from=payment'
				})
			},
			doSubmit:function(){
				if(this.payType.id == ''){
					uni.showToast({
						icon:'none',
						title:'请选择支付方式'
					})
					return;
				}
				this.requestPayment(this.payType);
			},
			paySuccess:function(){
				if(this.from == 'user'){
					//个人中心：开通会员支付或充值
					uni.navigateBack();
				}else if(this.from == 'index' || this.from == 'members'){
					//约见：开通会员支付
					uni.redirectTo({
						url:'/pages/form/apply?targetMemberId='+this.target.member.id
					})
				}else if(this.from == 'activity'){
					//活动报名支付
					uni.redirectTo({
						url:'/pages/activity/activity?id='+this.target.activity.id
					})
				}else if(this.from == 'payment'){
					//活动报名支付：开通会员支付或充值
					uni.redirectTo({
						url:'/pages/payment/payment?from=activity&outTradeNo='+this.outTradeNo
					})
				}
			},
			// comeback:function(activity){
			// 	uni.redirectTo({
			// 		url:'/pages/activity/activity?id='+activity.activityId
			// 	})
			// },
			// invite:function(activity){
			// 	uni.redirectTo({
			// 		url:'/pages/member/members?activityId='+activity.activityId
			// 	})
			// },
			initProvider(){
				uni.getProvider({
					service: "payment",
					success: (e) => {
						console.log("payment success:" + JSON.stringify(e));
						let providerList = [];
						e.provider.map((value) => {
							switch (value) {
								case 'alipay':
									providerList.push({
										name: '支付宝',
										id: value,
										loading: false
									});
									break;
								case 'wxpay':
									providerList.push({
										name: '微信',
										id: value,
										loading: false
									});
									break;
								default:
									break;
							}
						})
						this.providerList = providerList;
					},
					fail: (e) => {
						console.log("获取支付通道失败：", e);
					}
				});
			},
			async getPayOrderInfo(payType) {
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'payment/ali/order',
					method:'POST',
					data:{
						body:'阅见相亲',
						subject:'会员支付',
						productCode:'QUICK_MSECURITY_PAY',
						outTradeNo:this.outTradeNo,
						totalAmount:this.order.total/100
					}
				});
				if(this.$http.success(res)){
					return res.data.msg;
				}
			},
			async alipay(payType){
				let orderInfo = await this.getPayOrderInfo(payType.id);
				console.log(JSON.stringify(orderInfo));
				// if (orderInfo.statusCode !== 200) {
				if (!orderInfo) {
				    uni.showModal({
				        content: "获得订单信息失败",
				        showCancel: false
				    })
				    return;
				}
				uni.requestPayment({
				    provider: payType.id,
				    orderInfo: orderInfo,
				    success: (e) => {
				        // console.log("success", e);
				        uni.showToast({
				            title: "支付成功!"
				        })
						this.paySuccess();
				    },
				    fail: (e) => {
				        console.log("fail", e);
				        uni.showModal({
				            content: "支付失败,原因为: " + e.errMsg,
				            showCancel: false
				        })
				    },
				    complete: () => {
				        payType.loading = false;
				    }
				})
			},
			yjpay:function(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'payment/common/pay',
					method:'POST',
					data:{
						outTradeNo:this.outTradeNo,
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data){
								that.memberAccount = res.data.data;
								uni.showToast({
									title:'支付成功'
								})
								that.paySuccess();
							}
						}
					}
				});
			},
			async requestPayment(payType) {
                payType.loading = true;
				if(payType.id == 'alipay'){
					this.alipay(payType);
				}else if(payType.id == 'wxpay'){
					uni.showToast({
						icon:'none',
						title:'即将开通，请尝试其它方式'
					})
				}else if(payType.id == 'yjpay'){
					this.yjpay();
				}
            },
            getOrderInfo(e) {
                let appid = "";
                // #ifdef APP-PLUS
                appid = plus.runtime.appid;
				console.log("appid:"+appid);
                // #endif
                let url = 'https://demo.dcloud.net.cn/payment/?payid=' + e + '&appid=' + appid + '&total=' + 1/100;
                return new Promise((res) => {
                    uni.request({
                        url: url,
                        success: (result) => {
                            res(result);
                        },
                        fail: (e) => {
                            res(e);
                        }
                    })
                })
            },
			async getOrder(outTradeNo) {
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'payment/common/getOrder',
					method:'POST',
					data:outTradeNo
				});
				if(this.$http.success(res)){
					this.order = res.data.data;
					return res;
				}
			},
			getMemberAccount:function(){
				//获取会员账户
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/member-account/getOne',
					method:'POST',
					data:{
						agentAccountId:this.agentMember.agentAccountId,
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data){
								that.memberAccount = res.data.data;
							}
						}
					}
				});
			},
		},
		onLoad(option) {
			this.from = option.from;
			if(this.from == 'activity'){
				this.getMemberAccount();
			}
			
			// #ifdef APP-PLUS
			this.initProvider();
			// #endif
			// if(this.providerList.length > 0){
			// 	this.payType = this.providerList[0];
			// }
			
			if(option.out_trade_no){	//支付宝支付返回
				this.isBack = true;
				this.outTradeNo = option.out_trade_no;
				this.queryPayStatus();
			}else{
				this.outTradeNo = option.outTradeNo;
				this.getOrder(this.outTradeNo);
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
	.logo{
		width: 86upx;
		height: 86upx;
		border-radius:43upx;
		background-size: 100%;
		margin: 10upx 0;
	}
	.outline{
		border-radius: 50upx;
		background: white;
		border: 1px solid #ae74ff;
		padding: 10upx 40upx;
		color: #9b6bff;
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
