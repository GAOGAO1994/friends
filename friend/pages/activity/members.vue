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
				<text>已报名</text>
			</view>
			<view class="name-wrap">
				<text class="label">{{activity.title}}</text>
			</view>
			
			<view class="member-wrap">
				<view class="member-box" v-for="(activityMember, index) in activity.activityMemberList" :class="index < activity.activityMemberList.length-1?'marign-right':''" @click="viewMember(activityMember)">
					<view class="member">
						<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
						<text>{{activityMember.nickname}}</text>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				activity:{}
			}
		},
		computed: {
			
		},
		methods:{
			viewMember:function(activityMember){
				uni.navigateTo({
					url:'/pages/member/member?from=remote&id='+activityMember.memberId
				})
			}
		},
		onLoad(option) {
			let that = this;
			uni.request({
				url: this.$http.contextPath + 'activity/getById',
				data:{
					id:option.activityId
				},
				success(res) {
					if(that.$http.success(res)){
						that.activity = res.data.data;
					}
				},
				fail(res) {
					 that.$http.fail(res)
				}
			});
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	
	.member-wrap{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20upx;
		align-items: center;
	}
	.member-wrap .member-box{
		margin-top: 40upx;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		width: 120upx;
	}
	
	.member-wrap .marign-right{
		margin-right: 20upx;
	}
	
	.member-wrap .member-box .member{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.member-wrap .member-box image{
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
		margin-bottom: 15upx;
	}
</style>
