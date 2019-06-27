<template>
	<view class="content">
		<!-- <custom-header v-if="showHeader" title="我的" titleStyle="color:white;" showBack="false" :containerStyle="containerStyle"  @backTap="backClick" ref="backTap"></custom-header> -->
		<view class="top-wrap">
			<view class="bg-wrap" :class="agentMember.purpose == 'everybody'?'bg-red':'bg-blue'">
				<image mode="widthFix" src="../../static/img/wave.png"></image>
			</view>
			<view class="tool-wrap">
				<!-- <navigator url="detail">
					<f-icon type="edit2" color="white" size="23"></f-icon>
				</navigator>
				<view  class="space"></view>
				<f-icon type="user-switch" color="white" size="23" @click="switchUser"></f-icon>
				<view class="space"></view> -->
				<f-icon type="setting" color="#7759ff" size="25" @click="setting"></f-icon>
				<view class="space"></view>
				<view v-if="account && account.members.length > 0" class="user-switch" @click="switchUser">切换用户</view>
			</view>
			<view class="avatar-wrap">
				<navigator url="detail">
					<image mode="scaleToFill" :src="member.avatarUrl"></image>
				</navigator>
				<image class="modify" mode="scaleToFill" src="../../static/img/icons/icon-modify.png"></image>
			</view>
		</view>
		
		<view class="user-info-wrap">
			<navigator url="detail">
				<view class="name-wrap">
					<text class="name-female">{{member.nickname}}</text>
					<!-- <image v-if="member.vipStatus == 'vip'" class="vip" mode="scaleToFill" :src="member.vipStatus == 'vip'?'../../static/img/icons/icon-vip.png':'../../static/img/icons/icon-vip-expiry.png'"></image> -->
				</view>
			</navigator>
			<text class="label">{{member.location}}</text>
			<!-- <view class="slogan-wrap" v-if="agentMember.purpose != 'everybody'">
				<m-input :focus="slogan.focus" type="text" v-model="member.slogan" placeholder="内心独白" @blur="onBlur"></m-input>
				<f-icon class="icon-edit" type="edit" color="#" size="24" @click="edit"></f-icon>
			</view> -->
			<view class="slogan-wrap" v-if="agentMember.purpose != 'everybody'">
				<textarea @input="sloganInput" maxlength="1000" auto-height v-model="member.sloganUncheck" placeholder="自我介绍"/>
				<view v-if="slogan.disabled" class="disabled">确定</view>
				<view v-else class="button" @click="onBlur">确定</view>
			</view>
		</view>
		
		<!-- 人人红娘 -->
		<view class="everybody-wrap padding-h" v-if="agentMember.purpose == 'everybody'">
			
			<view class="gain-wrap margin-top">
				<view class="item" @click="enter('/pages/member/follow?follow='+member.follow+'&followGet='+member.followGet)">
					<text class="text">{{member.follow}}</text>
					<text class="label">我的会员</text>
				</view>
				<text class="space"></text>
				<text class="space"></text>
				<view class="item" @click="enter('/pages/member/follow?tabIndex=1&follow='+member.follow+'&followGet='+member.followGet)">
					<text class="text">{{member.followGet}}</text>
					<text class="label">我的关注</text>
				</view>
				<text class="space"></text>
				<text class="space"></text>
				<view class="item" @click="enter('/pages/member/invite?invite='+member.invite+'&inviteGet='+member.inviteGet)">
					<text class="text">{{member.invite+member.inviteGet}}</text>
					<text class="label">我的邀请</text>
				</view>
			</view>	
			
			<!-- 我的业绩 -->
			<view class="achievement margin-top">
				<view class="achievement-header">
					<f-icon type="income" size="28" color="#ff4a70"></f-icon>
					<text>我的业绩</text>
				</view>
				<view class="achievement-row">
					<view class="item-wrap">
						<text class="count">{{business.member}}</text>
						<text class="label">新增会员</text>
					</view>
					<view class="line-dashed"></view>
					<view class="item-wrap">
						<text class="count">{{business.memberRebate}}</text>
						<text class="label">会员返利</text>
					</view>
				</view>
				<view class="achievement-row">
					<view class="item-wrap">
						<text class="count">{{business.activity}}</text>
						<text class="label">活动报名</text>
					</view>
					<view class="line-dashed"></view>
					<view class="item-wrap">
						<text class="count">{{business.activityRebate}}</text>
						<text class="label">活动返利</text>
					</view>
				</view>
				<view class="line-wrap"><view class="line"></view></view>
				<view class="stat-wrap">
					<view>
						<picker @change="bindMonthChange" :value="date.value" :range="months">
							<view  class="date-wrap">
								<text class="date">{{date.name}}</text>
								<f-icon type="dropdown" size="14" color="#ff4a70"></f-icon>
							</view>
						</picker>
					</view>
					<view class="total-wrap">
						<text class="label">总收益</text>
						<text class="total">{{business.totalRebate}}</text>
					</view>
				</view>
			</view>
				
			<view class="modal" v-if="member.memberStatus != '1'">
				<text class="check-hint">审核中，请耐心等待...</text>
			</view>	
		</view>
		
		<!-- 非人人红娘 -->
		<view class="padding-h" v-else>
			
			<view class="gain-wrap">
				<view class="item" @click="enter('/pages/member/follow?follow='+member.follow+'&followGet='+member.followGet)">
					<text class="text">{{member.follow}}</text>
					<text class="label">关注</text>
				</view>
				<text class="space"></text>
				<text class="space"></text>
				<view class="item" @click="enter('/pages/member/follow?tabIndex=1&follow='+member.follow+'&followGet='+member.followGet)">
					<text class="text">{{member.followGet}}</text>
					<text class="label">粉丝</text>
				</view>
				<text class="space"></text>
				<text class="space"></text>
				<view class="item" @click="enter('/pages/member/invite?invite='+member.invite+'&inviteGet='+member.inviteGet)">
					<text class="text">{{member.invite+member.inviteGet}}</text>
					<text class="label">邀请</text>
				</view>
				<!-- <text class="space"></text>
				<text class="space"></text>
				<view class="item" @click="enter('/pages/member/invite')">
					<text class="text">{{member.matchUp+member.matchUpGet}}</text>
					<text class="label">牵线</text>
				</view> -->
			</view>
			
			<!-- <view class="banner-wrap banner-blue" @click="enter('appointments')">
				<view class="title-wrap">
					<text class="title">阅见好友</text>
					<text class="count">（<text class="">0</text>）</text>
				</view>
				<view class="icon">
					<f-icon type="user-group" color="#8c77c6" size="32"></f-icon>
				</view>
			</view> -->
			
			<!-- VIP会员 -->
			<view class="vip-wrap margin-top">
				<view class="bar-wrap">
					<view class="bar border">
						<view class="left">
							<image v-if="member.account.id>0" class="icon" src="../../static/img/icons/icon-crown.png" mode="scaleToFill"></image>
							<image v-else class="icon" src="../../static/img/icons/icon-crown-expiry.png" mode="scaleToFill"></image>
							<text class="title">会员特权</text>
							<!-- <view class="tip">免费体验</view> -->
						</view>
						<view class="right">
							<navigator url="vip?from=user">
								<view v-if="member.account.id>0" class="button">充值</view>
								<view v-else class="button">开通</view>
							</navigator>
						</view>
					</view>
				</view>
				
				<view class="list">
					
					<view class="column">
						<view class="cell name">约见名额</view>
						<view class="cell name mt">活动场次</view>
					</view>
					<view class="column">
						<view class="progress-wrap">
							<view class="base"></view>
							<view class="progress" :style="'width:'+member.account.appointmentWidth"></view>
						</view>
						<view class="progress-wrap mt">
							<view class="base"></view>
							<view class="progress" :style="'width:'+member.account.activityWidth"></view>
						</view>
					</view>
					
					<view class="column">
						<view class="cell value">{{member.account.appointmentRemain}}/{{member.account.appointmentTotal}}</view>
						<view class="cell value mt">{{member.account.activityRemain}}/{{member.account.activityTotal}}</view>
					</view>
					
					<!-- <view class="item">
						<view class="name">约见名额</view>
						<view class="progress-wrap">
							<view class="base"></view>
							<view class="progress" :style="'width:'+member.account.appointmentWidth"></view>
						</view>
						<view class="value">{{member.account.appointmentRemain}}/{{member.account.appointmentTotal}}</view>
					</view>
					<view class="space"></view>
					<view class="item">
						<view class="name">活动场次</view>
						<view class="progress-wrap">
							<view class="base"></view>
							<view class="progress" :style="'width:'+member.account.activityWidth"></view>
						</view>
						<view class="value">{{member.account.activityRemain}}/{{member.account.activityTotal}}</view>
					</view> -->
				</view>
			</view>
			
			<!-- <view class="banner-wrap banner-pink" @click="enter('album')">
				<view class="title-wrap">
					<text class="title">相册</text>
					<text class="count">（<text class="">{{member.photoCount}}</text>）</text>
				</view>
				<view class="icon">
					<f-icon type="photo" color="#cd7a94" size="32"></f-icon>
				</view>
			</view> -->
			
			<!-- <view class="hand-wrap margin-top">
				<view class="item ">
					<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
					<text class="name">{{member.nickname}}</text>
				</view>
				<text class="space"></text>
				<view class="item">
					<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
					<text class="label">23days</text>
				</view>
				<text class="space"></text>
				<view class="item ">
					<image class="avatar" mode="scaleToFill" src="../../static/img/photo/avatar3.png"></image>
					<text class="name">张鑫</text>
				</view>
			</view> -->
			
			<view class="tag-wrap margin-top">
				<view class="left red">
					<text class="sub-title">我的</text>
					<text class="title">爱好</text>
				</view>
				<view class="right">
					<view class="tag" v-for="tag in member.hobbies">{{tag.tagName}}</view>
					<view class="tag add" @click="enter('hobby')">添加</view>
				</view>
			</view>
			<view v-if="member.impression.length > 0" class="tag-wrap margin-top">
				<view class="left blue">
					<text class="sub-title">朋友</text>
					<text class="title">印象</text>
				</view>
				<view class="right">
					<view class="tag" v-for="tag in member.impression">{{tag}}</view>
				</view>
			</view>
			<view class="tag-wrap margin-top margin-bottom">
				<view class="left light">
					<text class="sub-title">择偶</text>
					<text class="title">标准</text>
				</view>
				<view class="right">
					<view class="tag" v-for="tag in member.requirements">{{tag.tagName}}</view>
					<view class="tag add" @click="enter('requirement')">添加</view>
				</view>
			</view>
			
			<view class="banner-wrap banner-red margin-bottom" @click="enter('album')">
				<view class="title-wrap">
					<f-icon type="photo" color="#f3fcff" size="32"></f-icon>
					<text class="title">相册</text>
				</view>
				<text class="count">{{member.photoCount}}</text>
				<view class="arc"></view>
			</view>
			
		</view>
	
		
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
		<user-switch :show="switchOpen" @close="closeSwitch"></user-switch>
	</view>
</template>

<script>
	/* import customHeader from '@/components/header/custom-header.vue'; */
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '@/components/m-input.vue';
	import loginModal from '@/components/login-modal/login-modal.vue';
	import userSwitch from '@/components/user-switch/user-switch.vue';
	import memberSvc from '@/services/member/member.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon,mInput,loginModal,userSwitch},
		data() {
			return{
				showHeader:false,
				containerStyle:'background: linear-gradient(45deg, #58c2e9, #fd6e99)',
				loaded:false,			//是否完成载入
				showLogin:false,
				switchOpen:false,
				slogan:{
					focus:false,
					disabled:true
				},
				member:{
					memberStatus:'',
					thumbsUp:0,
					thumbsUpGet:0,
					follow:0,
					followGet:0,
					invite:0,
					inviteGet:0,
					matchUp:0,
					matchUpGet:0,
					photoCount:0,
					activities:[],
					hobbies:[{
						tagName:'添加',
						category:'hobby'
					}],
					impression:[],
					requirements:[{
						tagName:'添加',
						category:'requirement'
					}],
					account:{
						id:0,
						activityTotal:0,
						activityConsume:0,
						activityRemain:0,
						appointmentTotal:0,
						appointmentConsume:0,
						appointmentRemain:0,
						activityWidth:'300upx;border-top-left-radius:50upx;border-bottom-left-radius:50upx',				//活动消费宽度量化
						appointmentWidth:'300upx;border-top-left-radius:50upx;border-bottom-left-radius:50upx'				//约见消费宽度量化
					}
				},
				activityTab:{
					selectIndex:0
				},
				date: {
					year:2019,
					month:0,
					name:'',
					code:'',
					value:0
				},
				business:{
					member:0,
					memberRebate:0,
					activity:0,
					activityRebate:0,
					totalRebate:0
				},
				months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
			}
		},
		computed: {
			...mapState(['hasLogin', 'account', 'update']),
			...mapGetters(['purposes','loginCheck','agentMember','memberTags'])
		},
		watch:{
			update:function(newObj, oldObj){
				if(newObj.hobby != oldObj.hobby){
					this.member.hobbies = this.memberTags('hobby');
				}else if(newObj.requirement != oldObj.requirement){
					this.member.requirements = this.memberTags('requirement');
				}
			}
		},
		methods:{
			...mapMutations(['redirect','saveSlogan']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			getDate:function(){
				let date = new Date();
				let m = date.getMonth()+1;
				return {
					year:date.getFullYear(),
					month:date.getMonth()+1,
					name: '' + date.getFullYear().toString() + '年' + ((m>9)?m:'0'+m) + '月',
					code: '' + date.getFullYear().toString() + '-' + ((m>9)?m:'0'+m),
					value:date.getMonth()
				};
			},
			bindMonthChange:function(e){
				this.date.month = e.target.value+1;
				let m = this.date.month;
				this.date.name = '' + this.date.year.toString() + '年' + ((m>9)?m:'0'+m) + '月';
				this.date.code = '' + this.date.year.toString() + '-' + ((m>9)?m:'0'+m);
				this.getBusiness(this.date);
			},
			setting:function(e){
				uni.navigateTo({
					url:'setting'
				})
			},
			switchUser:function(){
				this.switchOpen = true;
			},
			closeSwitch:function(changed){
				this.switchOpen = false;
				if(changed){
					this.init();
				}
			},
			sloganInput:function(e){
				if(e.detail.value == this.member.slogan){
					this.slogan.disabled = true;
				}else{
					this.slogan.disabled = false;
				}
			},
			edit:function(){
				this.slogan.disabled = false;
				this.slogan.focus = true;
			},
			onBlur:function(){
				this.slogan.focus = false;
				this.slogan.disabled = true;
				if(this.member.sloganUncheck == ''){
					uni.showToast({
						title:'请输入内容'
					})
					return
				};
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data:{
						id:this.member.id,
						slogan:this.member.sloganUncheck
					},
					success(res) {
						if(that.$http.success(res)){
							that.member.slogan = that.member.sloganUncheck;
							that.saveSlogan({
								id:that.member.id, 
								sloganUncheck:that.member.sloganUncheck
							});
						}
					}
				})
			},
			enter:function(url){
				uni.navigateTo({
					url:url
				})
			},
			getIndex:function(){
				let that = this;
				console.log(this.member.id);
				uni.request({
					url:this.$http.contextPath + 'base/member-index/getOne',
					method:'POST',
					data:{
						status:'1',
						memberId:this.member.id
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data && res.data.data != 'null'){
								that.member.thumbsUp = res.data.data.thumbsUp;
								that.member.thumbsUpGet = res.data.data.thumbsUpGet;
								that.member.follow = res.data.data.follow;
								that.member.followGet = res.data.data.followGet;
								that.member.invite = res.data.data.invite;
								that.member.inviteGet = res.data.data.inviteGet;
								that.member.matchUp = res.data.data.matchUp;
								that.member.matchUpGet = res.data.data.matchUpGet;
							}else{
								that.member.thumbsUp = 0;
								that.member.thumbsUpGet = 0;
								that.member.follow = 0;
								that.member.followGet = 0;
								that.member.invite = 0;
								that.member.inviteGet = 0;
								that.member.matchUp = 0;
								that.member.matchUpGet = 0;
							}
						}
					}
				})
			},
			getPhotoCount:function(id){
				if(id){
					let that = this;
					uni.request({
						url:this.$http.contextPath + 'base/album/count',
						method:'POST',
						data:{
							memberId:id,
							status:'1'
						},
						success(res) {
							if(that.$http.success(res)){
								that.member.photoCount = res.data.data;
							}
						}
					});
				}else{
					this.member.photoCount = '';
				}
			},
			getMyTags:function(category){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/tag/hobbies',
					data:{
						status:'1',
						category:category,
						memberId:this.agentMember.id
					},
					success(res) {
						if(that.$http.success(res)){
							if(category == 'hobby'){
								that.member.hobbies = res.data.data.memberTagList;
							}else if(category == 'requirement'){
								that.member.requirements = res.data.data.memberTagList;
							}
						}
					}
				})
			},
			getMemberAccount:function(member){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/member-account/getOne',
					method:'POST',
					data:{
						// memberId:member.id,
						accountId:member.accountId,
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data){
								Object.assign(that.member.account, res.data.data);
								that.calculateWidth();
							}else{
								let account = {
									activityTotal:0,
									activityConsume:0,
									activityRemain:0,
									appointmentTotal:0,
									appointmentConsume:0,
									appointmentRemain:0,
									activityWidth:'300upx;border-top-left-radius:50upx;border-bottom-left-radius:50upx',				//活动消费宽度量化
									appointmentWidth:'300upx;border-top-left-radius:50upx;border-bottom-left-radius:50upx'				//约见消费宽度量化
								}
								Object.assign(that.member.account, account);
							}
						}
					}
				});
			},
			calculateWidth:function(){
				if(this.member.account.activityRemain > 0){
					this.member.account.activityWidth = this.member.account.activityConsume * 300/this.member.account.activityTotal + 'upx';
				}
				if(this.member.account.appointmentRemain > 0){
					this.member.account.appointmentWidth = this.member.account.appointmentConsume * 300/this.member.account.appointmentTotal + 'upx';
				}
			},
// 			getActivities:function(){
// 				let that = this;
// 				uni.request({
// 					url:this.$http.contextPath + 'member/getActivities',
// 					method:'POST',
// 					data:{
// 						status:'1',
// 						id:this.member.id
// 					},
// 					success(res) {
// 						if(that.$http.success(res)){
// 							that.member.activityMembers = res.data.data.activityMembers;
// 							that.member.activities = res.data.data.activities;
// 						}
// 					}
// 				})
// 			},
// 			select:function(index){
// 				this.activityTab.selectIndex = index;
// 			},
			getBusiness:function(date){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'share/business/stat',
					method:'POST',
					data:{
						status:'1',
						shareOrigin:this.account.id,
						month: date.code 
					},
					success(res) {
						if(that.$http.success(res)){
							that.businessHandle(res.data.data);
						}
					}
				})
			},
			businessHandle:function(datas){
				let business = {
					member:0,
					memberRebate:0,
					activity:0,
					activityRebate:0,
					totalRebate:0
				};
				datas.forEach(item =>{
					if(item.businessCode == 'member_register'){
						business.member = item.num;
						business.memberRebate = item.fee;
					}else if(item.businessCode == 'activity_sign'){
						business.activity = item.num;
						business.activityRebate = item.fee;
					}
				});
				business.totalRebate = business.memberRebate + business.activityRebate;
				Object.assign(this.business, business);
			},
			init:function(){
				let url = '/pages/user/user';
				let result = this.loginCheck(url, 'switchTab');
				if(result.isPass){
					this.initData();
				}else{
					result.loginType = 'navigateTo';
					this.$croute.enter(result);
				}
			},
			initData:function(){
				//
				Object.assign(this.member, this.agentMember);
				this.member.location = memberSvc.getCityAndCounty(this.member.residence);
				if(this.member.purpose == 'everybody'){
					Object.assign(this.date, this.getDate());
					this.getBusiness(this.date);
				}else{
					if(!this.member.slogan){
						this.member.slogan = '';
					}
					this.member.sloganUncheck = this.member.slogan;
					this.getPhotoCount(this.member.id);
					this.getMyTags('hobby');
					this.getMyTags('requirement');
					this.getMemberAccount(this.member);
				}
				this.getIndex();
				this.loaded = true;
			}
		},
// 		onPageScroll:function(obj){
// 			if(obj.scrollTop == 0)this.showHeader = false;
// 			else if(!this.showHeader)this.showHeader = true;
// 		},
		onShow() {
			if(!this.loaded){
				   this.init();
			}
		},
		onLoad() {
			this.init();
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.top-wrap{
		width: 100%;
		height: 450upx;
		position: relative;
	}
	.bg-wrap{
		width: 100%;
		height: 350upx;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		/* background: linear-gradient(45deg, #58c2e9, #fd6e99); */
		/* background: linear-gradient(45deg, #7558ff, #ff527f); */
		box-shadow: 0 2upx 30upx 5upx #f8f8f8;
	}
	.bg-blue{
		/* background: linear-gradient(45deg, #58c2e9, #fd6e99); */
		background: linear-gradient(45deg, #9465ff, #7753ff);
	}
	.bg-red{
		background: linear-gradient(45deg, #ff729d, #ff4f84);
	}
	.bg-wrap image{
		width: 100%;
	}
	.tool-wrap{
		position: absolute;
		top: 450upx;
		right: 0upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.tool-wrap .space{
		width: 20upx;	
	}
	.user-switch{
		padding: 7upx 20upx;
		color: #ffffff;
		background-color: #cccccc;
		border-radius: 30upx 0 0 30upx;
		font-size: 13px;
	}
	.avatar-wrap{
		width: 750upx;
		position: absolute;
		top: 220upx;
		left: 0;
		display: flex;
		justify-content: center;
	}
	.avatar-wrap image{
		width: 200upx;
		height: 200upx;
		border-radius: 100upx;
	}
	.avatar-wrap .modify{
		width:38upx;
		height: 38upx;
		margin-top: 150upx;
		margin-left: -50upx;
	}
	.toolbar-wrap{
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.header{
		margin-top: 120upx;
		display: flex;
		justify-content: space-between;
	}
	.header text{
		color: white;
	}
	
	.user-info-wrap{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.user-info-wrap .name-wrap{
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20upx;
	}
	.user-info-wrap .vip{
		width: 58upx;
		height: 33upx;
		margin-left: 10upx;
	}
	
	.slogan-wrap{
		width: 670upx;
		display: flex;
		flex-direction: column;
		margin: 0 40upx;
		margin-top: 30upx;
		border-radius: 20upx;
		border: 1px solid #f4f4f4;
	}
	.slogan-wrap .button{
		align-self: flex-end;
		margin-right: 20upx;
		margin-bottom: 20upx;
		padding: 5upx 20upx;
		color: white;
		border-radius: 10upx;
		background: linear-gradient(to bottom, #ae74ff, #7558ff);
	}
	.slogan-wrap .disabled{
		align-self: flex-end;
		margin-right: 20upx;
		margin-bottom: 20upx;
		padding: 5upx 20upx;
		color: #999999;
		border-radius: 10upx;
		background: linear-gradient(to bottom, #f2f2f2, #dcdcdc);
	}
	.slogan-wrap textarea{
		width: 630upx;
		margin: 20upx;
		margin-top: 10upx;
	}
	
	.margin-top{
		margin-top: 60upx;
	}
	
	.margin-bottom{
		margin-bottom: 60upx;
	}
	
	.everybody-wrap{
		position: relative;
	}
	
	.everybody-wrap .modal{
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 20upx;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	
	.everybody-wrap .modal .check-hint{
		background-color: white;
		padding: 40upx;
		border-radius: 15upx;
	}
	
	.gain-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40upx;
	}
	.gain-wrap .item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gain-wrap .text{
		font-size: 25px;
		font-weight: 900;
	}
	.gain-wrap .space{
		width: 40upx;
	}
	
	.hand-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40upx 0upx;
		border-radius: 15upx;
		box-shadow: 0 0 30upx 5upx #dcdcdc;
	}
	.hand-wrap .item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.hand-wrap .avatar{
		width:120upx;
		height:120upx;
		border-radius: 60upx;
	}
	.hand-wrap .love{
		width:200upx;
		max-height:80upx;
	}
	.hand-wrap .name{
		font-size: 16px;
	}
	.hand-wrap .space{
		width: 40upx;
	}
	
	.banner-wrap{
		width: 100%;
		height: 200upx;
		margin-top: 40upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	/* 	padding: 0 80upx; */
		border-radius: 15upx;
		box-shadow:0 12upx 50upx 10upx #f2f2f2;
		position: relative;
		overflow:hidden
	}
	.banner-light-blue{
		position: relative;
		background: linear-gradient(to right, #2acaff, #529aff);
	}
	.banner-red{
		background: linear-gradient(to right, #ff83a9, #ff578a);
	}
	
	.banner-wrap .arc{
		position: absolute;
		width: 700upx;
		height:700upx;
		border-radius: 350upx;
		left:350upx;
		top: -40upx;
		background-color: rgba(255,255,255,.1);
	}
	
	.banner-wrap .title-wrap{
		font-size: 22px;
		font-weight: 900;
		margin-left: 80upx;
		display: flex;
		align-items: center;
	}
	.banner-wrap .title-wrap .title{
		margin-left: 20upx;
	}
	
	.banner-light-blue .title-wrap, .banner-red .title-wrap{ 
		color: white;
	}
	.banner-wrap .count{
		font-size: 22px;
		font-weight: 900;
		color: white;
		margin-right: 80upx;
	}
	
	/* .banner-blue{
		background: #dcd6f0 url(../../static/img/wave-blue.png) no-repeat bottom;
		background-size: 100% 100%;
	}
	.banner-pink{
		background: #ffcee5 url(../../static/img/wave-pink.png) no-repeat bottom;
		background-size: 100% 100%;
		margin-bottom: 60upx;
	}	 */
	
	
	/* .banner-blue .title-wrap{ 
		color: #8c77c6;
	}
	.banner-pink .title-wrap{ 
		color: #cd7a94;
	} */
	/* .banner-wrap .icon{
		margin-right: 80upx;
	} */
	
	.tab-wrap{
		display: flex;
		justify-content: center;
	}
	.tab-wrap .tab{
		padding: 15upx 40upx;
		color: #999999;
		font-size: 18px;
		border-radius: 100upx;
		margin-right: 40upx;
	}
	.tab-wrap .selected{
		color: #7667a5;
		font-weight: 900;
		background-color: #ded4ff;
		border-radius: 100upx;
	}
	.tab-wrap .last{
		margin-right: 0;
	}
	
	.activity-box{
		width: 100%;
		border-radius: 15upx;
		padding-bottom: 90upx;
		box-shadow:0 12upx 50upx 10upx #f2f2f2;
		margin-bottom: 40upx;
	}
	.activity-box image{
		border-radius:15upx 15upx 0 0;
		width: 100%;
		height:300upx;
	}
	.activity-box .title-wrap{
		width: 100%;
		position: relative;
	}
	.activity-box .title-wrap .title{
		font-weight: 900;
		position: absolute;
		top: 20upx;
		left: 20upx;
	}
	.activity-box .title-wrap .date-box{
		height: 70upx;
		position: absolute;
		top: -35upx;
		right: 20upx;
		font-size: 13px;
		padding:0 40upx;
		border-radius: 60upx;
		background-color: #FFFFFF;
		box-shadow:0 12upx 20upx 0 #f2f2f2;
	}
	.activity-box .title-wrap .date-box text{
		line-height: 70upx;
	}
	
	.tag-wrap{
		display: flex;
		width: 100%;
		border-radius: 20upx;
		box-shadow:0 0 30upx 15upx #f8f8f8;
	}
	.tag-wrap .left{
		width:140upx;
		min-width:140upx;
		min-height: 180upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color:white;
		border-top-left-radius: 20upx;
		border-bottom-left-radius: 20upx;
	}
	.tag-wrap .right{
		display:flex;
		flex-wrap: wrap;
		flex-grow: 1;
		padding-left: 10upx;
		padding-top: 10upx;
		padding-right: 30upx;
		padding-bottom: 30upx;
	}
	.tag-wrap .red{
		background: linear-gradient(to bottom right, #fe61a0, #fe9474);
	}
	.tag-wrap .blue{
		background: linear-gradient(to bottom right, #7a6efe, #c07dfe);
	}
	.tag-wrap .light{
		background: linear-gradient(to bottom right, #5676ff, #5cdeff);
	}
	.tag-wrap .left .title{
		font-size: 20px;
		font-weight: bold;
		margin-top: 12upx;
	}
	.tag-wrap .left .sub-title{
		font-size: 12px;
	}
	.tag-wrap .tag{
		height: 32upx;
		line-height: 32upx;
		border-radius: 100upx;
		padding: 10upx 30upx;
		border: 1px solid #C8C7CC;
		/* background-color: #eeeeee; */
		/* color: #777777; */
		margin-left: 20upx;
		margin-top: 20upx;
	}
	.tag-wrap .add{
		height: 32upx;
		line-height: 32upx;
		border: 1px dashed #C8C7CC;
		color:#C8C7CC;
		margin-left: 20upx;
		margin-top: 20upx;
		border-radius: 100upx;
		padding: 10upx 30upx;
	}
	.text-link-wrap{
		margin-left: 20upx;
		align-self: center;
		display: flex;
	}
	.text-link{
		text-decoration: underline;
	}
	
	.achievement{
		padding: 30upx;
		margin-bottom: 60upx;
		box-shadow: 0 0 30upx 5upx #dcdcdc;
	}
	.achievement-header{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.achievement-header text{
		font-size:16px;
		font-weight: 900;
		margin-left: 8upx;
	}
	.achievement-row{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40upx;
	}
	.achievement-row .item-wrap{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.achievement-row .item-wrap .count{
		font-size:14px;
		font-weight: 900;
	}
	.achievement-row .item-wrap .label{
		margin-top: 10upx;
	}
	.line-wrap{
		padding: 40upx 30upx;
	}
	.line-dashed{
		width: 150upx;
		height: 2px;
		border-bottom: 1px dashed #ff4a70;
		margin: 0 40upx;
	}
	.stat-wrap{
		margin: 0 40upx;
		display: flex;
		justify-content: space-between;
	}
	.stat-wrap .date-wrap{
		display: flex;
		align-items: center;
	}
	.stat-wrap .date-wrap .date{
		margin-right: 10upx;
	}
	.stat-wrap .total-wrap{
		display: flex;
		align-items: center;
	}
	.stat-wrap .total-wrap .total{
		margin-left: 10upx;
		font-size: 16px;
		font-weight: 900;
	}
	
	.vip-wrap{
		width: 100%;
		display: flex;
		flex-direction: column;
		border-radius: 15upx;
		box-shadow:0 0 30upx 15upx #f8f8f8;
	}
	.vip-wrap .bar-wrap{
		position: relative;
		margin-left: 30upx;
	}
	.vip-wrap .bar-wrap .border::after{
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.vip-wrap .bar-wrap .bar{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
	}
	.vip-wrap .bar-wrap .bar .left{
		display: flex;
		align-items: center;
	}
	.vip-wrap .bar-wrap .bar .right{
		padding-right: 30upx;
	}
	.vip-wrap .icon{
		width: 38upx;
		height: 38upx;
	}
	.vip-wrap .title{
		font-size: 16px;
		font-weight: 900;
		margin: 0 15upx;
	}
	.vip-wrap .tip{
		color: white;
		border-radius: 50upx;
		padding: 3upx 10upx;
		background: linear-gradient(to bottom, #ae74ff, #7558ff);
	}
	.vip-wrap .button{
		border-radius: 50upx;
		background: white;
		border: 1px solid #ae74ff;
		padding: 10upx 40upx;
		color: #9b6bff;
	}
	
	.vip-wrap .list{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 60upx 0upx;
	}
	.vip-wrap .list .column{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.vip-wrap .list .column .cell{
		height: 25upx;
		line-height: 25upx;
	}
	.vip-wrap .list .mt{
		margin-top: 30upx;
	}
	
	/* .vip-wrap .list .item{
		display: flex;
		align-items: center;
	}
	.vip-wrap .list .space{
		height: 20upx;
	} */
	
	.progress-wrap{
		width: 300upx;
		height: 20upx;
		position: relative;
		margin: 0 20upx;
	}
	.progress-wrap .base{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 50upx;
		width: 300upx;
		height: 100%;
		background-color: #9b6bff;
	}
	.progress-wrap .progress{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		border-top-right-radius: 50upx;
		border-bottom-right-radius: 50upx;
		/* border-radius: 50upx; */
		height: 100%;
		max-width: 300upx;
		background-color: #ded4ff;
		z-index: 100;
	}
	
	
</style>
