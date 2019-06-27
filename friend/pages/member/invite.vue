<template>
	<view class="content">
		<view class="padding-h">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text>我的邀请</text>
			</view>
			
			<view class="tab-wrap margin-top">
				<text class="tab" :class="tabIndex == 0?'selected':''" @click="selectTab(0)">邀请（{{invitePage.total}}）</text>
				<text class="tab last" :class="tabIndex == 1?'selected':''" @click="selectTab(1)">约见（{{appointmentPage.total}}）</text>
			</view>
			
			<view v-if="tabIndex == 0" class="invite-wrap">
				<view class="item" v-for="(invite, index) in invites" :class="index===invites.length-1?'last':''">
					<view class="left" @click="viewMember(invite.member)">
						<image class="avatar" mode="scaleToFill" :src="invite.member.avatarUrl"></image>
						<text>{{invite.member.nickname}}</text>
					</view>
					<view class="action">
						<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
						<view v-if="invite.member.agentAccountId == member.agentAccountId" class="btn-wrap">
							<!-- <view class="">{{invite.inviteLabel}}</view>
							<view class="sapce"></view> -->
							<button v-if="invite.inviteStatus == 'inviting'" class="female" @click="action(invite, 'cancel')">取消</button>
							<view v-else>{{invite.inviteLabel}}</view>
						</view>
						<view v-else-if="invite.inviteStatus == 'inviting'" class="btn-wrap">
							<button class="male marign-right" @click="action(invite, 'accept')">接受</button>
							<view class="sapce"></view>
							<button class="female" @click="action(invite, 'reject')">拒绝</button>
						</view>
						<text v-else class="">{{invite.inviteStatus == 'accept'?'已接受':'已拒绝'}}</text>
					</view>
					<view class="right" @click="viewMember(invite.targetMember)">
						<image class="avatar" mode="scaleToFill" :src="invite.targetMember.avatarUrl"></image>
						<text>{{invite.targetMember.nickname}}</text>
					</view>
				</view>
				<view v-if="invites.length == 0" class="empty">
					<image mode="scaleToFill" src="../../static/img/empty.png"></image>
					<text>您还没有任何邀请</text>
				</view>
				
				<view class="more-wrap margin-top">
					<text v-if="invitePage.current < invitePage.pages" @click="loadData(tabIndex)">加载更多</text>
					<view v-else-if="invitePage.current > 1" class="under-line">
						<view class="split"></view>
						<text class="text">没有更多</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex == 1" class="invite-wrap">
				<view class="item" v-for="(invite, index) in appointments" :class="index===appointments.length-1?'last':''">
					<view class="left" @click="viewMember(invite.member)">
						<image class="avatar" mode="scaleToFill" :src="invite.member.avatarUrl"></image>
						<text>{{invite.member.nickname}}</text>
					</view>
					<view class="action">
						<image class="love" mode="widthFix" src="../../static/img/icons/icon-love-arrow.png"></image>
						<view v-if="invite.member.agentAccountId == member.agentAccountId" class="btn-wrap">
							<button v-if="invite.inviteStatus == 'inviting'" class="female" @click="action(invite, 'cancel')">取消</button>
							<view v-else>{{invite.inviteLabel}}</view>
						</view>
						<view v-else-if="invite.inviteStatus == 'inviting'" class="btn-wrap">
							<button class="male marign-right" @click="action(invite, 'accept')">接受</button>
							<view class="sapce"></view>
							<button class="female" @click="action(invite, 'reject')">拒绝</button>
						</view>
						<text v-else class="">{{invite.inviteStatus == 'accept'?'已接受':'已拒绝'}}</text>
					</view>
					<view class="right" @click="viewMember(invite.targetMember)">
						<image class="avatar" mode="scaleToFill" :src="invite.targetMember.avatarUrl"></image>
						<text>{{invite.targetMember.nickname}}</text>
					</view>
				</view>
				<view v-if="appointments.length == 0" class="empty">
					<image mode="scaleToFill" src="../../static/img/empty.png"></image>
					<text>您还没有任何约见</text>
				</view>
				
				<view class="more-wrap margin-top">
					<text v-if="appointmentPage.current < appointmentPage.pages" @click="loadData(tabIndex)">加载更多</text>
					<view v-else-if="appointmentPage.current > 1" class="under-line">
						<view class="split"></view>
						<text class="text">没有更多</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				member:{},
				tabIndex:0,
				invites:[],
				appointments:[],
				invitePage:{
					pages:0,
					current:0,
					total:0
				},
				appointmentPage:{
					pages:0,
					current:0,
					total:0
				},
				index:{
					invite:0,
					inviteGet:0
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['loginCheck','agentMember'])
		},
		methods:{
			...mapMutations(['targetMember']),
			selectTab:function(index){
				this.tabIndex = index;
			},
			enter:function(url){
				this.$croute.enter(this.loginCheck(url));
			},
			viewMember:function(member){
				this.targetMember(member);
				this.enter('/pages/member/member?from=local&id='+member.id);
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
				else if(status == 'accept'){
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
						that.updateInvite(invite, status);
					}
				}
				//取消
				else if(status == 'cancel'){
					let label = '';
					if(invite.kind == 'invite'){
						label = '邀请';
					}else if(invite.kind == 'appointment'){
						label = '约见';
					}
					uni.showModal({
						title: '提示',
						content: '确定取消'+label+'？',
						success: function (res) {
							if (res.confirm) {
								that.updateInvite(invite, 'cancel');
							}
						},
					});
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
					url:this.$http.contextPath + 'invite/updateById',
					method:'POST',
					data:{
						id:invite.id,
						kind:invite.kind,
						memberId:invite.memberId,
						agentAccountId:invite.agentAccountId,
						targetMemberId:invite.targetMemberId,
						targetAgentAccountId:invite.targetAgentAccountId,
						inviteStatus:status
					},
					success(res) {
						if(that.$http.success(res)){
							invite.inviteStatus = status;
							if(status == 'cancel'){
								invite.inviteLabel = '已取消';
							}else if(status == 'accept'){
								invite.inviteLabel = '已接受';
								uni.showModal({
									title: '提示',
									content: '恭喜你即将阅见一段美好姻缘，我们将尽快为你安排相见。请耐心等待或直接与我们的客服取得联系。',
									showCancel:false,
									success: function (res) {
										if (res.confirm) {}
									}
								})
							}else if(status == 'reject'){
								invite.inviteLabel = '已拒绝';
							}
						}
					}
				})
			},
			handler:function(tabIndex, data){
				let map = {};
				data.members.forEach(item =>{
					map[item.id] = item;
				});
				
				let invites = [];
				let appointments = [];
				data.page.records.forEach(item =>{
					item.member = map[item.memberId];
					item.targetMember = map[item.targetMemberId];
					if(item.kind == 'invite'){
						if(item.inviteStatus == 'inviting'){
							item.inviteLabel = '邀请中';
						}else if(item.inviteStatus == 'accept'){
							item.inviteLabel = '已接受';
						}else if(item.inviteStatus == 'reject'){
							item.inviteLabel = '已拒绝';
						}else if(item.inviteStatus == 'cancel'){
							item.inviteLabel = '已取消';
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
						}else if(item.inviteStatus == 'cancel'){
							item.inviteLabel = '已取消';
						}else{
							item.inviteLabel = '未知';
						}
						appointments.push(item);
					}
				});
				if(tabIndex == 0){
					this.invites = this.invites.concat(invites);
					this.invitePage = data.page;
				}else if(tabIndex == 1){
					this.appointments = this.appointments.concat(appointments);
					this.appointmentPage = data.page;
				}
			},
			loadData(tabIndex){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'invite/my',
					method:'POST',
					data:{
						query:{
							//memberId:this.agentMember.id,
							agentAccountId:this.agentMember.agentAccountId,
							kind:(tabIndex == 0)?'invite':'appointment',
							status:'1'
						},
						current:(tabIndex == 0)?this.invitePage.current+1:this.appointmentPage.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							that.handler(tabIndex, res.data.data);
							that.updateIndex(tabIndex, res.data.data.page);
						}
					}
				});
			},
			updateIndex:function(tabIndex, page){
				let param = {
					memberId:this.agentMember.id
				};
				if(tabIndex == 0){
					if(this.index.invite === page.total){
						return;
					}else{
						param.invite = page.total;
					}
				}else if(tabIndex == 1){
					if(this.index.inviteGet === page.total){
						return;
					}else{
						param.inviteGet = page.total;
					}
				}
				uni.request({
					url: this.$http.contextPath + 'member/index/updateByMemberId',
					method:'POST',
					data:param
				})
			}
		},
		onLoad(option) {
			if(option.invite){
				this.index.invite = option.invite;
			}
			if(option.inviteGet){
				this.index.inviteGet = option.inviteGet;
			}
			if(this.hasLogin){
				Object.assign(this.member, this.agentMember);
				this.loadData(0);
				this.loadData(1);
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
		align-items: center;
		justify-content: center;
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
	
	.more-wrap{
		display: flex;
		justify-content: center;
		margin-bottom: 40upx;
	}
	
</style>
