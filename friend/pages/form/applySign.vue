<template>
	<view class="content">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="#7558ff" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="">活动报名</text>
			</view>
			
			<view class="remind">
				<f-icon type="info" color="#fc597b" size="30"></f-icon>	
				<text>请真实填写，我们将为您牵线搭桥</text>
			</view>
		</view>	
			
		<view class="form-wrap">
			
			<view class="padding-l">
				<view class="item-wrap input-row border">
					<text class="item-title">报名人信息</text>
				</view>
				
				<view class="item-wrap input-row border">
					<text class="label">真实姓名</text>
					<view class="input-wrap">
						<text v-if="member.certification" class="m-input">{{member.name}}</text>
						<m-input v-else class="m-input" type="text" v-model="member.name" placeholder="您的真实姓名"></m-input>
					</view>
				</view>
				
				<view class="item-wrap input-row border">
					<text class="label">身份证号</text>
					<view class="input-wrap">
						<text v-if="member.certification" class="m-input">{{member.idNumber}}</text>
						<m-input v-else class="m-input" type="text" v-model="member.idNumber" placeholder="您的身份证号"></m-input>
					</view>
				</view>
				
				<!-- <view class="item-wrap input-row border">
					<text class="label">手机号码</text>
					<view class="input-wrap">
						<m-input class="m-input" type="text" v-model="member.mobileNew" placeholder="您的手机号码"></m-input>
					</view>
				</view> -->
				
				<view class="item-wrap textarea-wrap">
					<textarea maxlength="1000" style="height: 120upx;" v-model="member.message" placeholder="输入您的留言"/>
				</view>
				
			</view>
			
			<view class="submit-wrap">
				<view class="button" @click="doSubmit">提交</view>
			</view>
			
			<view class="statement">
				<navigator url="/pages/statement/serviceAgreement"><text class="link">阅见™相亲活动服务介绍</text></navigator>
			</view>
		</view>	
		
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import mpWeixin from '@/static/data/mp-weixin.js'
	import {mapState,mapGetters,mapMutations} from 'vuex';
	import selectData from '@/components/activity-select/select-data/selectData.js'
	
	export default {
		components: {fIcon, mInput},
		data() {
			return{
				kind:'sign',
				outTradeNo:'',
				activity:{id:0},
				selectedItems: selectData.selectItems,
				pickedItems:{},
				member:{
					id:0,
					accountId:0,
					nickname:'',
					avatarUrl:'',
					name:'',
					idNumber:'',
					mobile:'',
					mobileNew:'',
					message:'',
					pickedItems:''
				},
				inviteId:0,				//来源邀请
				share:{
					origin:0,
					from:0
				}
			}
		},
		computed: {
			...mapState(['account', 'target', 'shareFrom']),
			...mapGetters(['agentMember'])
		},
		methods:{
			verify:function(){
				if (this.member.name == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的真实姓名'
				    });
				    return;
				}
				if (this.member.idNumber == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的身份证号'
				    });
				    return;
				}
				if (this.member.idNumber.length != 18) {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写有效身份证号'
				    });
				    return;
				}
				/* if (this.member.mobileNew != '' && this.member.mobileNew.length != 11) {
				    uni.showToast({
				        icon: 'none',
				        title: '手机号码有误'
				    });
				    return;
				} */
				return true;
			},
			doSubmit:function(){
				if(!this.verify())return;
				this.doSignUp(this.member);
			},
			doSignUp(member){
				//先保存，返回商户订单号
				this.preSaveSignup(member);	
			},
			getData:function(member){
				let data = {
					'activityId':this.activity.id,
					'fee':this.activity.entryFee,
					'accountId':member.accountId,
					'memberId':member.id,
					'agentAccountId':member.agentAccountId,
					'nickname':member.nickname,
					'avatarUrl':member.avatarUrl,
					'message':member.message,
					'name':member.name,
					'idNumber':member.idNumber,
					'fromAccountId':this.shareFrom.accountId			//分享来源
				};
				//来源邀请
				if(this.inviteId > 0){
					data.inviteId = this.inviteId;
				}
				//分享来源
				// if(this.share.origin > 0){
				// 	data.shareOrigin = this.share.origin;
				// }
				// if(this.share.from > 0){
				// 	data.shareFrom = this.share.from;
				// }
				return data;
			},
			preSaveSignup(member){
				//预先保存报名信息
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'activity/signup',
					method:'POST',
					data:this.getData(member),
					success(res) {
						if(that.$http.success(res)){
							that.outTradeNo = res.data.data.outTradeNo;
							// #ifdef  H5
							window.location.href = that.$http.contextPath + 'payment/common/index?outTradeNo='+res.data.data.outTradeNo
							// #endif
							// #ifndef  H5
							uni.navigateTo({
								url:'/pages/payment/payment?from=activity&outTradeNo='+res.data.data.outTradeNo
							})
							// #endif
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '报名失败，请稍后再试'
							});
						}
					}
				})
			},
			saveSignup(member, outTradeNo){
				//保存报名信息
				let that = this;
				let data = this.getData(member);
				data.outTradeNo = outTradeNo;
				data.signStatus = 'active';
				uni.request({
					url:this.$http.contextPath + 'activity/signup',
					method:'POST',
					data:data,
					success(res) {
						if(that.$http.success(res,true)){
							// that.signed = true;
							that.outTradeNo = outTradeNo;
							that.activity.activityMemberList.splice(0, 0, res.data.data);
							that.activity.numberSignUp++;
							that.signupSuccess();
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '报名失败，请稍后再试'
							});
						}
					}
				})
			},
			payment:function(member){
				console.log("发起支付");
				let that = this;
				uni.login({
					success: (e) => {
						uni.request({
							url: mpWeixin.openIdUrl + e.code,
							method: 'GET',
							success: (sess) =>{
								console.log("获取openId");
								console.log(sess.data.openid);
								//
								uni.request({
									url: mpWeixin.orderUrl, //统一下单
									method:'POST',
									 header: {
										"Content-Type": "application/x-www-form-urlencoded"  // 默认值
									},
									data:{
										body: '报名费',
										total_fee: that.activity.entryFee,
										trade_type: 'JSAPI',
										openid: sess.data.openid
										// out_trade_no: "test"+String.valueOf(new Date().getTime())
									},
									success: (res) => {
										console.log("pay request success", res);
										if (res.statusCode !== 200) {
											uni.showModal({
												content: "支付失败，请重试！",
												showCancel: false
											});
											return;
										}
										uni.requestPayment({
											timeStamp: res.data.timeStamp,
											nonceStr: res.data.nonceStr,
											package: res.data.package,
											signType: 'MD5',
											paySign: res.data.paySign,
											success: () => {
												that.saveSignup(member, res.data.out_trade_no);
											},
											fail: (res) => {
												uni.showModal({
													content: "支付失败,原因为: " + res.errMsg,
													showCancel: false
												})
											},
											complete: () => {
												// this.loading = false;
											}
										})
									},
									fail: (e) => {
										console.log("fail", e);
										// this.loading = false;
										uni.showModal({
											content: "支付失败,原因为: " + e.errMsg,
											showCancel: false
										})
									}
								})
							}
						});
					},
					fail: (e) => {
						console.log("fail", e);
						// this.loading = false;
						uni.showModal({
							content: "支付失败,原因为: " + e.errMsg,
							showCancel: false
						})
					}
				})
			},
			signupSuccess:function(){
				let that = this;
				// this.payed = true;
				uni.showModal({
					title: '报名成功',
					content: '您已成功报名活动，您还可以邀请心仪的TA一起参加',
					confirmText:'去邀请',
					cancelText:'返回',
					success: function (res) {
						if (res.confirm) {
							that.invite();
						} else if (res.cancel) {
							that.goback();
						}
					}
				});
			},
			invite:function(){
				uni.redirectTo({
					url:'/pages/member/members?activityId='+this.activity.id+'&inviteMemberId='+this.member.id+'&sex='+this.member.sex
				})
			},
			goback:function(){
				uni.redirectTo({
					url:'/pages/activity/activity?id='+this.activity.id+'&inviteId='+this.inviteId+'&shareOrigin='+this.share.origin+'&shareFrom='+this.share.from
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
			queryMember:function(memberId){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/member/getOne',
					method:'POST',
					data:{
						id:memberId
					},
					success(res) {
						if(that.$http.success(res)){
							that.initData(res.data.data)
						}
					}
				})
			},
			initData:function(member){
				Object.assign(this.member, member);
				if(!this.member.name){
					this.member.name = '';
				}
				if(!this.member.idNumber){
					this.member.idNumber = '';
				}
				// this.member.mobileNew = this.member.mobile.substring(0,3) + "****" + this.member.mobile.substring(this.member.mobile.length-4,this.member.mobile.length);
			}
		},
		onShow() {
			//返回去检查支付状态
			// if(this.outTradeNo != ''){
			// 	this.queryPayStatus();
			// }
		},
		onLoad(option) {
			this.activityId = option.activityId;
			this.activity = this.target.activity;
			this.queryMember(this.target.member.id);
			this.pickedItems = JSON.parse(option.pickedItems);
			
			var itemName = [];
			for(var key in this.pickedItems) {
				key = parseInt(key);
				itemName.push(this.selectedItems[key].items[this.pickedItems[key]].name);
				// console.log(this.selectedItems[key],);
			}
			
			console.log(itemName);
			
			
			//邀请人ID
			if(option.inviteId){
				this.inviteId = option.inviteId;
			}
			//分享参数
			if(option.shareOrigin){
				this.share.origin = option.shareOrigin;
			}
			if(option.shareFrom){
				this.share.from = option.shareFrom;
			}
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.header text{
		color: black;
	}
	
	.remind{
		display: flex;
		align-items: center;
	}
	.remind text{
		margin-left: 10upx;
	}
	
	.form-wrap{
		
	}
	.form-wrap .item-title{
		/* font-size:18px; */
	}
	.form-wrap .item-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40upx 0;
		align-items: center;
	}
	.form-wrap .input-wrap{
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		margin-right: 40upx;
		align-items: center;
	}
	.form-wrap .input-wrap text{
	    font-size:18px;
	}
	.m-input {
	    font-size:18px;
		font-weight: bold;
	}
	.textarea-wrap{
		display: flex;
	}
	textarea{
		flex-grow: 1;
		border-radius: 15upx;
		padding: 15upx;
		margin-right: 40upx;
		/* border: 1px solid #dcdcdc; */
		background-color: #F2F2F2;
	}
	.form-wrap .submit-wrap{
		display: flex;
		flex-direction: row;
		padding: 40upx;
		align-items: center;
	}
	.form-wrap .submit-wrap .button{
		flex-grow: 1;
		display: flex;
		justify-content: center;
		padding: 20upx 0;
		color: white;
		font-size:14px;
		border-radius: 80upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
	}
	
	.hand-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 0upx;
	}
	
	
	.statement{
		display: flex;
		justify-content: center;
	}
	.statement .link{
		text-decoration: underline;
	}
	
</style>
