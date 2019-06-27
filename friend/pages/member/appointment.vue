<template>
	<view class="content">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text>约见</text>
			</view>
			
			<view class="avatar-wrap">
				<image mode="scaleToFill" :src="member.avatarUrl"></image>
				<text>{{member.nickname}}</text>
			</view>
			
			<view class="tab-wrap margin-top">
				<text class="tab" :class="tabIndex == 0?'selected':''" @click="selectTab(0)">关注</text>
				<text class="tab last" :class="tabIndex == 1?'selected':''" @click="selectTab(1)">粉丝</text>
			</view>
			
			<view v-if="tabIndex == 0">
				<view class="filter-wrap">
					<switch color="#7667a5" @change="switch1Change" />
					<text class="label">互相关注</text>
				</view>
				
				<view class="follow-wrap">
					<view class="follow-item border" v-for="(follow, index) in member.follows" :class="index===member.follows.length-1?'last':''" @click="viewMember()">
						<view class="left">
							<image class="avatar" mode="scaleToFill" src="../../static/img/photo/avatar1.png"></image>
							<view class="info">
								<view class="name-wrap">
									<text class="name-female">顾晓家</text>
									<text class="point">•</text>
									<text class="age">33岁</text>
								</view>
								<view class="location">
									<f-icon type="location" color="#7558ff" size="13"></f-icon>
									<text class="label">南京市•秦淮区</text>
								</view>
							</view>
						</view>
						<view class="right">
							<view class="button-wrap" @click="">
								<!-- <image mode="widthFix" src="../../static/img/icons/bird.png"></image> -->
								<text>取消关注</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="tabIndex == 1">
				<view class="follow-wrap">
					<view class="follow-item border" v-for="(follower, index) in member.followers" :class="index===member.followers.length-1?'last':''" @click="viewMember()">
						<view class="left">
							<image class="avatar" mode="scaleToFill" src="../../static/img/photo/avatar1.png"></image>
							<view class="info">
								<view class="name-wrap">
									<text class="name-female">顾晓家</text>
									<text class="point">•</text>
									<text class="age">33岁</text>
								</view>
								<view class="location">
									<f-icon type="location" color="#7558ff" size="13"></f-icon>
									<text class="label">南京市•秦淮区</text>
								</view>
							</view>
						</view>
						<view class="right">
							<view v-if="index != 1" class="button-wrap" @click="">
								<!-- <image mode="widthFix" src="../../static/img/icons/bird.png"></image> -->
								<text>关注</text>
							</view>
							<text v-if="index == 1">已关注</text>
						</view>
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
	import {mapState} from 'vuex'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				tabIndex:0,
				member:{
					follows:[{},{}],
					followers:[{},{}]
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'account'])
		},
		methods:{
			selectTab:function(index){
				this.tabIndex = index;
			},
			viewMember:function(activityMember){
				uni.navigateTo({
					url:'/pages/member/member'
				})
			}
		},
		onLoad(option) {
			if(this.hasLogin){
				let that = this;
// 				uni.request({
// 					url: this.$http.contextPath + 'activity/getById',
// 					data:{
// 						id:option.activityId
// 					},
// 					success(res) {
// 						if(that.$http.success(res)){
// 							that.activity = res.data.data;
// 						}
// 					},
// 					fail(res) {
// 						 that.$http.fail(res)
// 					}
// 				});
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
		padding-right: 40upx;
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
	
	
</style>
