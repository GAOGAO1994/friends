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
				<text>我的关注</text>
			</view>
			
			<view class="tab-wrap margin-top">
				<text class="tab" :class="tabIndex == 0?'selected':''" @click="selectTab(0)">关注（{{followPage.total}}）</text>
				<text class="tab last" :class="tabIndex == 1?'selected':''" @click="selectTab(1)">粉丝（{{followerPage.total}}）</text>
			</view>
			
			<view v-if="tabIndex == 0">
				<!-- <view class="filter-wrap">
					<switch color="#7667a5" @change="switch1Change" />
					<text class="label">互相关注</text>
				</view> -->
				
				<view class="follow-wrap">
					<view class="follow-item border" v-for="(follow, index) in follows" :class="index===follows.length-1?'last':''" @click="viewMember(follow.member)">
						<view class="left">
							<image class="avatar" mode="scaleToFill" :src="follow.member.avatarUrl"></image>
							<view class="info">
								<view class="name-wrap">
									<text class="name-female">{{follow.member.nickname}}</text>
									<text class="point">•</text>
									<text class="age">{{follow.member.age}}岁</text>
								</view>
								<view class="location">
									<f-icon type="location" color="#7558ff" size="13"></f-icon>
									<text class="label">{{follow.member.city}}</text>
								</view>
							</view>
						</view>
						<view class="right">
							<view v-if="follow.workStatus == 'active'" class="button-wrap" @click.stop="cancel(follow)">
								<!-- <image mode="widthFix" src="../../static/img/icons/bird.png"></image> -->
								<text>取消关注</text>
							</view>
							<text v-if="follow.workStatus == 'cancel'">已取消</text>
						</view>
					</view>
					<view v-if="follows.length == 0" class="empty">
						<image mode="scaleToFill" src="../../static/img/empty.png"></image>
						<text>您还没有任何关注</text>
					</view>
				</view>
				
				<view class="more-wrap margin-top">
					<text v-if="followPage.current < followPage.pages" @click="loadData('follow')">加载更多</text>
					<view v-else-if="followPage.current > 1" class="under-line">
						<view class="split"></view>
						<text class="text">没有更多</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex == 1">
				<view class="follow-wrap">
					<view class="follow-item border" v-for="(follower, index) in followers" :class="index===followers.length-1?'last':''" @click="viewMember(follower.member)">
						<view class="left">
							<image class="avatar" mode="scaleToFill" :src="follower.member.avatarUrl"></image>
							<view class="info">
								<view class="name-wrap">
									<text class="name-female">{{follower.member.nickname}}</text>
									<text class="point">•</text>
									<text class="age">{{follower.member.age}}岁</text>
								</view>
								<view class="location">
									<f-icon type="location" color="#7558ff" size="13"></f-icon>
									<text class="label">{{follower.member.city}}</text>
								</view>
							</view>
						</view>
						<!-- <view class="right">
							<view v-if="index != 1" class="button-wrap" @click.stop="attention(follower)">
								<text>关注</text>
							</view>
							<text v-if="index == 1">已关注</text>
						</view> -->
					</view>
					<view v-if="followers.length == 0" class="empty">
						<image mode="scaleToFill" src="../../static/img/empty.png"></image>
						<text>您还没有任何粉丝</text>
					</view>
				</view>
				
				<view class="more-wrap margin-top">
					<text v-if="followerPage.current < followerPage.pages" @click="loadData('follower')">加载更多</text>
					<view v-else-if="followerPage.current > 1" class="under-line">
						<view class="split"></view>
						<text class="text">没有更多</text>
					</view>
				</view>
			</view>
			
			
			<!-- <view class="member-wrap">
				<view class="member-box" v-for="(activityMember, index) in activity.activityMemberList" :class="index < activity.activityMemberList.length-1?'marign-right':''" @click="viewMember(activityMember)">
					<view class="member">
						<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
						<text>{{activityMember.nickname}}</text>
					</view>
				</view>
			</view> -->
			
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import memberSvc from '@/services/member/member.js';
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				tabIndex:0,
				follows:[],
				followers:[],
				followPage:{
					pages:0,
					current:0,
					total:0
				},
				followerPage:{
					pages:0,
					current:0,
					total:0
				},
				index:{
					follow:0,
					followGet:0
				},
				interactive:{
					attention:{
						disabled:false
					}
				},
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
// 				if(!this.inits[index]){
// 					this.inits[index] = true;
// 					if(index == 1){
// 						this.getData('follower');
// 					}
// 				}
			},
			enter:function(url){
				this.$croute.enter(this.loginCheck(url));
			},
			viewMember:function(member){
				this.targetMember(member);
				this.enter('/pages/member/member?from=local&id='+member.id);
			},
			attention:function(follower){
				setTimeout(() => { 
					this.interactive.attention.disabled = false;
				}, 1000)
				
				if(this.interactive.attention.disabled){
					return;
				}else{
					this.interactive.attention.disabled = true;
				}
				
				this.interactiveSubmit(follower);
			},
			interactiveSubmit:function(follower){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/interactive/saveOrUpdate',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						targetMemberId:follower.id,
						kind: 'follow', 
						workStatus: 'active'
					},
					success(res) {
						if(that.$http.success(res)){
							
						}
					}
				});
			},
			cancel:function(follow){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定取消关注？',
					success: function (res) {
						if (res.confirm) {
							uni.request({
								url:that.$http.contextPath+'member/interactive/saveOrUpdate',
								method:'POST',
								data:{
									id:follow.id,
									memberId:follow.memberId,
									targetMemberId:follow.targetMemberId,
									kind:'follow',
									workStatus:'cancel'				//取消
								},
								success(res) {
									if(that.$http.success(res)){
										that.followPage.total--;
										follow.workStatus = 'cancel';
									}
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			handler:function(type, res){
				if(type == 'follow'){
					let obj = {};
					res.targetMembers.forEach(item =>{
						obj[item.id] = item;
					});
					res.page.records.forEach(item =>{
						item.member = obj[item.targetMemberId];
						item.member.city = memberSvc.getCity(item.member.residence);
					});
				}else if(type == 'follower'){
					let obj = {};
					res.members.forEach(item =>{
						obj[item.id] = item;
					});
					res.page.records.forEach(item =>{
						item.member = obj[item.memberId];
						item.member.city = memberSvc.getCity(item.member.residence);
					});
				}
				return res.page.records;
			},
			loadData:function(type){
				let that = this;
				let param = {
					query:{
						kind:'follow',
						workStatus:'active'
					},
					size:10
				};
				if(type == 'follow'){
					param.query.memberId = this.agentMember.id;
					param.current = this.followPage.current+1;
				}else if(type == 'follower'){
					param.query.targetMemberId = this.agentMember.id;
					param.current = this.followerPage.current+1;
				}
				uni.request({
					url: this.$http.contextPath + 'member/interactive/follows',
					method:'POST',
					data:param,
					success(res) {
						if(that.$http.success(res)){
							let datas = that.handler(type, res.data.data);
							if(type == 'follow'){
								if(datas.length > 0)that.follows = that.follows.concat(datas);
								that.followPage = res.data.data.page;
							}else if(type == 'follower'){
								if(datas.length > 0)that.followers = that.followers.concat(datas);
								that.followerPage = res.data.data.page;
							}
							that.updateIndex(type, res.data.data.page);
						}
					}
				});
			},
			updateIndex:function(type, page){
				let param = {
					memberId:this.agentMember.id
				};
				if(type == 'follow'){
					if(this.index.follow === page.total){
						return;
					}else{
						param.follow = page.total;
					}
				}else if(type == 'follower'){
					if(this.index.followGet === page.total){
						return;
					}else{
						param.followGet = page.total;
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
			if(option.tabIndex){
				this.tabIndex = option.tabIndex;
			}
			if(option.follow){
				this.index.follow = option.follow;
			}
			if(option.followGet){
				this.index.followGet = option.followGet;
			}
			
			if(this.hasLogin){
				this.loadData('follow');
				this.loadData('follower');
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
	.follow-wrap{
		width: 100%;
	}
	.follow-wrap .last::after{
		display: none;
	}
	.follow-item{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		position: relative;
	}
	.follow-item::after {
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
	.follow-item .left{
		display: flex;
	}
	.follow-item .right{
		width: 240upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.follow-wrap .left .avatar{
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
	}
	.info{
		margin-left: 30upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.info .name-wrap{
		display: flex;
	}
	.info .name-wrap .name{
		font-size: 18px;
		margin-left: 2px;
	}
	.info .name-wrap .point, .info .name-wrap .age{
		font-size: 18px;
		color: #999999;
		font-weight: 900;
	}
	.info .location{
		display: flex;
		align-items:center;
		margin-top: 15upx;
	}
	.info .location .label{
		color: #999999;
		font-size: 11px;
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
