<template>
	<view class="content">
		<view class="nav-back-wrap">
			<image mode="widthFix" :src="activity.thumbnail"></image>
			<!-- #ifndef H5 -->
			<navigator class="icon-back" open-type="navigateBack">
				<f-icon type="back" color="white" size="30"></f-icon>
			</navigator>
			<!-- #endif -->
		</view>
		
		<view class="title-wrap">
			<text class="title">{{activity.title}}</text>
			<!-- <view class="tags">
				<f-icon type="eye" color="#8F8F94" size="24"></f-icon>
				<text>{{activity.numberRead}}</text>
				<f-icon type="share" color="#8F8F94" size="24"></f-icon>
				<text>{{activity.numberShare}}</text>
				<f-icon type="thumbs-up" color="#8F8F94" size="24"></f-icon>
				<text>{{activity.numberThumbsUp}}</text>
			</view> -->
			<view class="items">
				<view class="item">
					<view class="icon-wrap">
						<f-icon type="clock" size="16" color="#7558ff"></f-icon>
					</view>
					<text class="">{{activity.activityDate}} {{activity.activityTime}}</text>
				</view>
				<view class="item">
					<view class="icon-wrap">
						<f-icon type="location" size="16" color="#7558ff"></f-icon>
					</view>
					<text class="" v-if="signed">{{activity.address}}</text>
					<text class="" v-else>{{activity.addressPreset}}</text>
				</view>
				<view class="item">
					<view class="icon-wrap">
						<f-icon type="money" size="16" color="#7558ff"></f-icon>
					</view>
					<text class="" v-if="activity.entryFee || activity.entryFee == 0">{{activity.entryFee/100}}元/人(限{{activity.numberLimit}}人)</text>
				</view>
				<image class="signed" v-if="signed" mode="scaleToFill" src="../../static/img/icons/sign.png"></image>
			</view>
		</view>
		
		<view class="sign-wrap">
			<view class="sign-title">
				<text>已报名<text class="primary">{{activity.activityMemberList.length}}</text>人</text>
				<navigator v-if="activity.activityMemberList.length > 5" class="more" :url="'members?activityId='+activity.id">更多></navigator>
			</view>
			
			<view class="member-scroll">
				<scroll-view class="member-wrap" scroll-x="true" scroll-left="0">
					<view class="member-box" v-for="(activityMember, index) in activity.activityMemberList" v-if="index<5" :class="index < activity.activityMemberList.length-1?'marign-right':''">
						<view class="member" @click="enter('/pages/member/member?from=remote&id='+activityMember.memberId)">
							<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
							<text>{{activityMember.nickname}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view v-if="activity.remark && activity.remark !=''" class="desc padding-h margin-top">
			<image mode="widthFix" :src="activity.remark"></image>
		</view>
		
		<view class="" style="height: 200upx;"></view>
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<!-- 会员选择 -->
				<view class="blind-member-scroll">
					<scroll-view class="member-wrap" scroll-x="true" scroll-left="0">
						<view class="member-box" v-for="(member, index) in allowMembers" :class="index < allowMembers.length-1?'marign-right':''">
							<view class="member" @click="doPick(member)">
								<image mode="scaleToFill" :src="member.avatarUrl"></image>
								<text :class="{primary:pickedMember.id === member.id}">{{member.nickname}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<view class="signup-wrap">
					<view v-if="!hasLogin" class="button-wrap" @click="toLogin">
						<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
						<text>登陆报名</text>
					</view>
					<view v-else>
						<text v-if="activity.activityStatus == 'unopened'" class="">此活动未开放</text>
						<text v-else-if="activity.activityStatus == 'end'" class="">此活动已结束</text>
						<view v-else-if="allow && !signed" class="button-wrap" @click="signUp">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>我要报名</text>
						</view>
						<view v-else-if="allow && signed" class="button-wrap" @click="invite">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>邀请他人</text>
						</view>
						<view v-else class="button-wrap">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>不可报名</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
		<!-- <member-picker title="为谁报名，请选择" :show="showMemberPicker" :members="allowMembers" @close="closeMemberPicker"></member-picker> -->
		
		
		<activity-select :themeColor="themeColor" :selectInformation="selectInformation" ref="activitySelect" 
		 ></activity-select>
	
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	/* import memberPicker from '@/components/user-switch/member-picker.vue'; */
	import mpWeixin from '@/static/data/mp-weixin.js';
	import {mapState, mapGetters, mapMutations} from 'vuex';
	import activitySelect from '@/components/activity-select/activitySelect.vue';
	
	// #ifdef H5
	var wx = require('@/services/weixin-js-sdk/index.js');
	// #endif
	
	export default {
		components: {fIcon, loginModal, activitySelect},
		data() {
			return{
				themeColor:'',
				showLogin:false,
				showMemberPicker:false,	//多个可报名会员选择
				banner:this.$http.imgPath + 'manage/xqh1.png',
				payed:false,			//支付标识
				activity:{
					id:0,
					allowPurposes:'',
					activityMemberList:[]
				},
				member:{id:0},
				inviteId:0,				//来源邀请
				share:{
					origin:0,
					from:0
				},
				pickedMember:{id:0},	//当前选中的会员
				selectInformation:{},
			}
		},
		computed:{
			...mapState(['hasLogin', 'account', 'target']),		
			...mapGetters(['loginCheck','agentMember']), 
			allow:function(){
				if(!this.hasLogin)return false;
				if(this.activity.allowPurposes == null)return false;
				//账号有多个意图，只要包含其中一个意图允许报名即可
				let purposes = this.account.purposes.split(',');
				for(let i=0; i<purposes.length; i++){
					if(this.activity.allowPurposes.indexOf(purposes[i]) > -1)return true;
				}
				return false;
			},
			allowMembers:function(){
				let members = [];
				if(this.account){
					this.account.members.forEach(item =>{
						if(this.activity.allowPurposes.indexOf(item.purpose) > -1){
							members.push(item);
						}
					});
				}
				return members;
			},
			signed:function(){
				if(!this.hasLogin)return false;
				for(let activityMember of this.activity.activityMemberList){
					if(activityMember.memberId == this.pickedMember.id){
						return true;
					}
				}
				return false;
			}
		},
		methods:{
			...mapMutations(['redirect', 'sign', 'saveShareFrom', 'targetMember', 'targetActivity']),
			enter:function(url){
				this.showLogin = this.$croute.enter(this.loginCheck(url));
			},
			toLogin:function(){
				let url = '/pages/activity/activity?from=remote&id='+this.activity.id+'&shareOrigin='+this.share.origin+'&shareFrom='+this.share.from;
				this.redirect(url);
				this.showLogin = true;
			},
			closeMemberPicker:function(member){
				this.showMemberPicker = false;
				this.doSignUp(member);
			},
			getAllowMember:function(index){
				return this.allowMembers[index];
			},
			doPick:function(member){
				this.pickedMember = member;
			},
			signUp(){
				//判断是否登陆
				this.showLogin = this.$croute.enter(this.loginCheck(''));
				if(!this.showLogin){
					
					//判断是否有多个可报名的代理会员
					if(this.allowMembers.length == 0 || this.pickedMember.id  == 0){
						uni.showToast({
							icon:'none',
							title: '不可报名'
						});
						return;
					}
					
					//
					this.targetMember(this.pickedMember);
					this.targetActivity(this.activity);
					
					this.selectInformation = {
						activityId: this.activity.id,
						inviteId: this.inviteId,
						shareOrigin: this.share.origin,
						shareFrom: this.share.from
					};
					
					
					this.$refs.activitySelect.show();
					
					// uni.navigateTo({
					// 	url:'/pages/form/applySign?activityId='+this.activity.id+'&inviteId='+inviteId+'&shareOrigin='+this.share.origin+'&shareFrom='+this.share.from
					// });
					
					//this.doSignUp(this.pickedMember);
				}
			},
			doSignUp(member){
				// #ifdef  H5
				this.preSaveSignup(member);	//先保存，返回商户订单号
				// #endif
				// #ifndef  H5
				this.payment(member);			//支付报名费
				// #endif
			},
			getData:function(member){
				let data = {
					'activityId':this.activity.id,
					'accountId':this.account.id,
					'memberId':member.id,
					'agentAccountId':member.agentAccountId,
					'nickname':member.nickname,
					'avatarUrl':member.avatarUrl,
					'fee':this.activity.entryFee
				};
				//来源邀请
				if(this.inviteId > 0){
					data.inviteId = this.inviteId;
				}
				//分享来源
				if(this.share.origin > 0){
					data.shareOrigin = this.share.origin;
				}
				if(this.share.from > 0){
					data.shareFrom = this.share.from;
				}
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
						if(that.$http.success(res,true)){
							window.location.href = that.$http.contextPath + 'payment/common/index?outTradeNo='+res.data.data.outTradeNo
							// uni.navigateTo({
							// 	url:'/pages/activity/payment?outTradeNo='+res.data.data.outTradeNo
							// });
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
							that.signed = true;
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
			invite:function(){
				this.targetMember(this.pickedMember);
				this.targetActivity(this.activity);
				uni.navigateTo({
					url:'/pages/member/members?invite=true'
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
								console.log("报名费: " + that.activity.entryFee);
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
													content: "支付失败,原因为: " + res
														.errMsg,
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
				this.payed = true;
				uni.showModal({
					title: '报名成功',
					content: '您已成功报名活动，您还可以邀请心仪的TA一起参加',
					confirmText:'去邀请',
					cancelText:'取消',
					success: function (res) {
						if (res.confirm) {
							that.invite();
						} else if (res.cancel) {
							console.log('取消');
						}
					}
				});
// 				uni.navigateTo({
// 					url: 'sign-success?activityId='+this.activity.id+'&memberId='+this.member.id
// 				});
			},
			closeLoginModal:function(){
				this.showLogin = false;
			},
			async init(id,from){
				if(true||from && from == 'remote'){
					var [error, res] = await uni.request({
						url: this.$http.contextPath + 'activity/queryAttachMember',
						method:'POST',
						data:{
							id:id,
							payStatus:'TRADE_SUCCESS'
						}
					});
					if(this.$http.success(res)){
						Object.assign(this.activity, res.data.data[0]);
						// this.signed = this.hasSigned();
						this.pickedMember = this.getAllowMember(0);
					}
				}else{
					if(id == parseInt(this.target.activity.id)){
						Object.assign(this.activity, this.target.activity);
						// this.signed = this.hasSigned();
						this.pickedMember = this.getAllowMember(0);
					}
				}
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
							// data.debug = true;
							wx.config(data);
							
							wx.error(function(res){
								 // alert(JSON.stringify(res));
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
			handleContact(e) {
				console.log(e.path)
				console.log(e.query)
			}
// 			async getMembers(id){
// 				var [error, res] = await uni.request({
// 					url:this.$http.contextPath + 'base/activity-member/list',
// 					method:'POST',
// 					data:{
// 						status:'1',
// 						activityId:id,
// 						signStatus:'active'			//已报名的（不含取消的）
// 					}
// 				});
// 				if(this.$http.success(res)){
// 					this.activity.activityMemberList = res.data.data;
// 				}
// 			}
		},
		onLoad(option) {
			if(option.inviteId){
				this.inviteId = option.inviteId;
			}
			//分享参数
			if(option.shareOrigin){
				this.share.origin = option.shareOrigin;
			}
			if(option.shareFrom){
				this.share.from = option.shareFrom;
				this.saveShareFrom({
					accountId:option.shareFrom,
					memberId:null
				});
			}
			
			if(this.hasLogin){
				Object.assign(this.member, this.agentMember);
				this.init(option.id, option.from);
			}else{
				let url = '/pages/activity/activity?id='+option.id+'&shareOrigin='+this.share.origin+'&shareFrom='+this.share.from;
				this.showLogin = this.$croute.enter(this.loginCheck(url));
			}
			
			//
			// #ifdef H5
			if(this.isWeixin()){
				this.initWechatJSConfig();
			}
			// #endif
		},
		onShareAppMessage(res) {
			// console.log(res);
			if (res.from === 'button' || res.from === 'menu') {// 来自页面内分享按钮和菜单转发
			    if(this.share.origin == 0)this.share.origin = this.member.id;
				return {
			      title: this.activity.title,
			      imageUrl:this.$http.imgPath + 'manage/xqh1.png',
			      path: '/pages/activity/activity?from=remote&id='+this.activity.id+'&shareOrigin='+this.share.origin+'&shareFrom='+this.member.id
			    }
			}
		}
	}
	
	
</script>

<style>
	.content{
		width:100%;
	}
	/* .banner-wrap{
		width: 100%;
		position: relative;
	}
	.banner-wrap image{
		width: 100%;
	}
	.banner-wrap .icon-back{
		position: fixed;
		left: 20upx;
		top: 60upx;
		z-index: 100;
	} */
	
	.title-wrap{
		margin-top: -100upx;
		margin-left: 40upx;
		margin-right: 40upx;
		z-index: 200;
		padding: 40upx;
		padding-bottom: 20upx;
		background-color: white;
		border-radius: 15upx;
		box-shadow: 0px 5px 20px 5px #f8f8f8;
	}
	.title-wrap .title{
		font-weight: 900;
		font-size: 1.4em;
	}
	.title-wrap .tags{
		display: flex;
		align-items: center;
		margin-top: 20upx;
		margin-bottom: 60upx;
	}
	.title-wrap .tags text{
		margin-left: 5upx;
		margin-right: 40upx;
	}
	.title-wrap .items{
		display: flex;
		flex-direction: column;
		position: relative;
		margin-top: 40upx;
	}
	.title-wrap .items .item{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20upx;
	}
	.title-wrap .items .item .icon-wrap{
		width: 54upx;
		height: 54upx;
		border-radius: 27upx;
		box-shadow: 2px 2px 20px 5px #f8f8f8;
		margin-right: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.signed{
		width: 150upx;
		height: 150upx;
		position: absolute;
		bottom: 0upx;
		right: 0upx;
	}
	
	.sign-wrap{
		margin-top: 40upx;
		margin-left: 40upx;
		margin-right: 40upx;
		padding: 40upx;
		background-color: white;
		border-radius: 15upx;
		box-shadow: 0px 5px 20px 5px #f8f8f8;
	}
	.sign-wrap .sign-title{
		display: flex;
		justify-content: space-between;
	}
	
	/* 已报名 */
	.member-scroll{
		margin-top: 40upx;
	}
	.member-scroll .member-wrap{
		white-space: nowrap;
		width: 100%;
	}
	.member-scroll .member-wrap .member-box{
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		width: 100upx;
	}
	.member-scroll .member-wrap .marign-right{
		margin-right: 20upx;
	}
	.member-scroll .member-wrap .member-box .member{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.member-scroll .member-wrap .member-box image{
		width: 100upx;
		height: 100upx;
		border-radius: 50upx;
		margin-bottom: 15upx;
	}
	
	/* 绑定的会员 */
	.blind-member-scroll{
		width: 420upx;
	}
	.blind-member-scroll .member-wrap{
		white-space: nowrap;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.blind-member-scroll .member-wrap .member-box{
		max-width: 180upx;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
	}
	.blind-member-scroll .member-wrap .marign-right{
		margin-right: 20upx;
	}
	.blind-member-scroll .member-wrap .member-box .member{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.blind-member-scroll .member-wrap .member-box image{
		width: 70upx;
		height: 70upx;
		border-radius: 50upx;
		margin-right: 10upx;
	}
	.blind-member-scroll .member-wrap .member-box text{
		max-width: 100upx;
		overflow: hidden;
		white-space:nowrap;
		text-overflow: ellipsis;
	}
	
	.desc image{
		width: 100%;
	}

	.bottom-bar-block{
		height: 60upx;
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
		justify-content: space-between;
		align-items: center;
	}
	/* .bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	} */
	
	.signup-wrap{
		
	}
	/* .bottom-bar .bar-box .item{
		display: flex;
		justify-content: center;
		align-items: center;
	} */
	/* .bottom-bar .bar-box .item text{
		margin-left: 10upx;
	}
	.bottom-bar .bar-box .item button{
		background-color: white;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
	.bottom-bar .bar-box .item button::after{ 
		border: none;
	}
	.bottom-bar .bar-box .button{
		justify-content: flex-end;
	} */
	
	.bottom-bar .button-wrap{
		width: 230upx;
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
		/* box-shadow: 0px 0px 10px #fe8dc8; */
		height: 80upx;
		line-height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.bottom-bar .button-wrap image{
		width: 58upx;
		height: 48upx;
	}
	.bottom-bar .button-wrap text{
		color: white;
		font-weight: normal;
	}
	
	.modal-dialog{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 300;
		background-color: rgba(0,0,0,0.6);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
