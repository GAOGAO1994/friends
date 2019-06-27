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
				<text class="">约见申请</text>
			</view>
			
			<view class="remind">
				<f-icon type="info" color="#fc597b" size="30"></f-icon>	
				<text>请真实填写，我们将为您牵线搭桥</text>
			</view>
		</view>	
			
		<view class="form-wrap">
			
			<view class="hand-wrap margin-top">
				<view class="item ">
					<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
					<text class="name">{{member.nickname}}</text>
				</view>
				<text class="space"></text>
				<view class="item">
					<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
					<!-- <text class="label">约见</text> -->
				</view>
				<text class="space"></text>
				<view class="item ">
					<image class="avatar" mode="scaleToFill" :src="targetMember.avatarUrl"></image>
					<text class="name">{{targetMember.nickname}}</text>
				</view>
			</view>
			
			<view class="padding-l">
				<view class="item-wrap input-row border">
					<text class="item-title">申请人信息</text>
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
				<navigator url="/pages/statement/serviceAgreement"><text class="link">阅见™约见服务介绍</text></navigator>
			</view>
		</view>	
		
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import {mapState,mapGetters,mapMutations} from 'vuex';
	
	export default {
		components: {fIcon, mInput},
		data() {
			return{
				from:'',
				member:{
					id:0,
					accountId:0,
					nickname:'',
					avatarUrl:'',
					name:'',
					idNumber:'',
					mobile:'',
					mobileNew:'',
					message:''
				},
				targetMember:{
					id:0,
					accountId:0,
					nickname:'',
					avatarUrl:''
				}
			}
		},
		computed: {
			...mapState(['account', 'target']),
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
				if (this.member.mobileNew != '' && this.member.mobileNew.length != 11) {
				    uni.showToast({
				        icon: 'none',
				        title: '手机号码有误'
				    });
				    return;
				}
				return true;
			},
			doSubmit:function(){
				if(!this.verify())return;
				
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'apply/save',
					method:'POST',
					data:{
						kind:'appointment',			//约见
						agentAccountId:this.member.agentAccountId,
						accountId:this.member.accountId,
						memberId:this.member.id,
						targetAccountId:this.targetMember.accountId,
						targetMemberId:this.targetMember.id,
						targetAgentAccountId:this.targetMember.agentAccountId,
						mobileNew:this.member.mobileNew,
						message:this.member.message,
						name:this.member.name,
						idNumber:this.member.idNumber
					},
					success(res) {
						if(that.$http.success(res)){
							that.target.member.inviteStatus = 'inviting';
							that.target.member.inviteLabel = '邀约中';
							uni.navigateBack();
						}else if(res.data.data == null && res.data.msg == 'non-vip'){
							//会员账户:非会员或余额不足
							//跳转会员付费页面
							uni.navigateTo({
								url:'/pages/user/vip?from='+that.from
							})
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
				this.member.mobileNew = this.member.mobile.substring(0,3) + "****" + this.member.mobile.substring(this.member.mobile.length-4,this.member.mobile.length);
			}
		},
		onLoad(option) {
			this.from = option.from;
			Object.assign(this.targetMember, this.target.member);
			this.queryMember(this.agentMember.id);
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
		height: 70upx;
		line-height: 70upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
	}
	
	.hand-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 0upx;
	}
	.hand-wrap .item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.hand-wrap .avatar{
		width:100upx;
		height:100upx;
		border-radius: 60upx;
	}
	.hand-wrap .love{
		width:200upx;
		max-height:80upx;
	}
	.hand-wrap .name{
		margin-top: 10upx;
	}
	.hand-wrap .space{
		width: 40upx;
	}
	
	.statement{
		display: flex;
		justify-content: center;
	}
	.statement .link{
		text-decoration: underline;
	}
	
</style>
