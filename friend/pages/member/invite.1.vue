<template>
	<view class="content">
		<view class="padding-h">			
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<view class="header">
				<text>我的邀请</text>
			</view>
			
			<view class="tab-wrap margin-top">
				<text class="tab" :class="tabIndex == 0?'selected':''" @click="selectTab(0)">邀请</text>
				<text class="tab last" :class="tabIndex == 1?'selected':''" @click="selectTab(1)">约见</text>
			</view>
			
			<view v-if="tabIndex == 0" class="invite-wrap">
				<view class="item" v-for="(invite, index) in invites" :class="index===invites.length-1?'last':''">
					<view class="left">
						<image class="avatar" mode="scaleToFill" :src="invite.member.avatarUrl"></image>
						<text>{{invite.member.nickname}}</text>
					</view>
					<view class="action">
						<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
						<text v-if="invite.member.id == member.id" class="">{{invite.inviteLabel}}</text>
						<view v-else-if="invite.inviteStatus == 'inviting'" class="btn-wrap">
							<button class="male marign-right" @click="action(invite, 'accept')">接受</button>
							<view class="sapce"></view>
							<button class="female" @click="action(invite, 'reject')">拒绝</button>
						</view>
						<text v-else class="">{{invite.inviteStatus == 'accept'?'已接受':'已拒绝'}}</text>
					</view>
					<view class="right">
						<image class="avatar" mode="scaleToFill" :src="invite.targetMember.avatarUrl"></image>
						<text>{{invite.targetMember.nickname}}</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex == 1" class="invite-wrap">
				<view class="item" v-for="(invite, index) in followers" :class="index===followers.length-1?'last':''">
					<view class="left">
						<image class="avatar" mode="scaleToFill" :src="invite.member.avatarUrl"></image>
						<text>{{invite.member.nickname}}</text>
					</view>
					<view class="action">
						<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
						<text v-if="invite.member.id == member.id" class="">{{invite.inviteLabel}}</text>
						<view v-else-if="invite.inviteStatus == 'inviting'" class="btn-wrap">
							<button class="male marign-right" @click="action(invite, 'accept')">接受</button>
							<view class="sapce"></view>
							<button class="female" @click="action(invite, 'reject')">拒绝</button>
						</view>
						<text v-else class="">{{invite.inviteStatus == 'accept'?'已接受':'已拒绝'}}</text>
					</view>
					<view class="right">
						<image class="avatar" mode="scaleToFill" :src="invite.targetMember.avatarUrl"></image>
						<text>{{invite.targetMember.nickname}}</text>
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState,mapGetters} from 'vuex'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				member:{},
				tabIndex:0,
				invites:[],
				followers:[]
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			selectTab:function(index){
				this.tabIndex = index;
			},
			viewMember:function(activityMember){
				uni.navigateTo({
					url:'/pages/member/member'
				})
			},
			action:function(invite, status){
				let that = this;
				//拒绝
				if(status == 'reject'){
					uni.showModal({
						title: '提示',
						content: '确定拒绝对方的邀请吗？',
						success: function (res) {
							if (res.confirm) {
								updateInvite(invite, status)
							} else if (res.cancel) {
								
							}
						}
					});
				}
				//接受
				else{
					//邀请参加活动：跳转至活动页面
					if(invite.kind == 'invite'){
						uni.showModal({
							title: '提示',
							content: '接受对方邀请，去报名',
							success: function (res) {
								if (res.confirm) {
									//检查是否已报名
									uni.request({
										url:that.$http.contextPath+'base/activity-member/count',
										method:'POST',
										data:{
											activityId:invite.activityId,
											memberId:that.agentMember.id,
											signStatus:'active'				//已报名
										},
										success(res) {
											if(that.$http.success(res)){
												if(res.data.data > 0){
													//已报名：更新邀请状态为接受
													that.updateInvite(invite, status);
												}else{
													//未报名
													that.navigateToActivity(invite);
												}
											}
										},
										fail(e) {
											that.navigateToActivity(invite);
										}
									})
									
								} else if (res.cancel) {}
							}
						});
					}
					//约见
					else if(invite.kind == 'appointment'){
						
					}
				}
			},
			navigateToActivity(invite){
				uni.navigateTo({
					url:'/pages/activity/activity?from=remote&id='+invite.activityId+'&inviteId='+invite.id
				})
			},
			checkSignup(activityId){
				
			},
			updateInvite(invite, status){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/invite/updateById',
					method:'POST',
					data:{
						id:invite.id,
						inviteStatus:status
					},
					success(res) {
						if(that.$http.success(res)){
							invite.inviteStatus = status;
							invite.inviteLabel = (status == 'accept')?'已接受':'已拒绝';
						}
					}
				})
			},
			handler:function(data){
				let map = {};
				data.members.forEach(item =>{
					map[item.id] = item;
				});
				
				let invites = [];
				let followers = [];
				data.invites.forEach(item =>{
					item.member = map[item.memberId];
					item.targetMember = map[item.targetMemberId];
					if(item.kind == 'invite'){
						if(item.inviteStatus == 'inviting'){
							item.inviteLabel = '邀请中';
						}else if(item.inviteStatus == 'accept'){
							item.inviteLabel = '已接受';
						}else if(item.inviteStatus == 'reject'){
							item.inviteLabel = '已拒绝';
						}else{
							item.inviteLabel = '未知';
						}
						invites.push(item);
					}else{
						if(item.inviteStatus == 'inviting'){
							item.inviteLabel = '邀约中';
						}else if(item.inviteStatus == 'accept'){
							item.inviteLabel = '已接受';
						}else if(item.inviteStatus == 'reject'){
							item.inviteLabel = '已拒绝';
						}else{
							item.inviteLabel = '未知';
						}
						followers.push(item);
					}
				});
				this.invites = invites;
				this.followers = followers;
			},
			async getInvites(){
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'invite/my',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						status:'1'
					}
				});
				if(this.$http.success(res)){
					this.handler(res.data.data);
				}
			}
		},
		onLoad(option) {
			if(this.hasLogin){
				Object.assign(this.member, this.agentMember);
				this.getInvites();
			}else{
				uni.redirectTo({
					url:'/pages/login/login'
				})
			}
		}
	}
</script>

<style>
	.tab-wrap{
		display: flex;
		align-items: center;
	}
	.tab-wrap .tab{
		color: #999999;
		font-size: 18px;
		font-weight: 900;
		padding: 15upx 40upx;
		margin-right: 40upx;
	}
	.tab-wrap .last{
		margin-right: 0;
	}
	.tab-wrap .selected{
		color: #7667a5;
		background-color: #ded4ff;
		border-radius: 100upx;
	}
	.filter-wrap{
		display: flex;
		align-items: center;
		margin-top: 40upx;
		margin-bottom: 20upx;
	}
	.invite-wrap{
		width: 100%;
	}
	.invite-wrap .item{
		width: 100%;
		display: flex;
		align-items: center;
		padding: 40upx 0;
		position: relative;
	}
	.invite-wrap .item::after {
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
	.invite-wrap .last::after{
		display: none;
	}
	
	.invite-wrap .item .left, .invite-wrap .item .right{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.invite-wrap .item .left text, .invite-wrap .item .right text{
		margin-top: 10upx;
	}
	.invite-wrap .item .action{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.invite-wrap .item .action image{
		width:200upx;
		max-height:80upx;
	}
	.invite-wrap .item .btn-wrap{
		display: flex;
	}
	.invite-wrap .item .btn-wrap .sapce{
		width:10upx;
	}
	.invite-wrap .item button{
		margin-top:20upx;
	}
	
	.invite-wrap .item .avatar{
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
	}
	
	
	.button-wrap{
		width: 200upx;
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); 
		box-shadow: 0px 0px 10px #fe8dc8;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-wrap image{
		width: 60upx;
	}
	.button-wrap text{
		color: white;
		font-weight: normal;
	}
	
	
</style>
