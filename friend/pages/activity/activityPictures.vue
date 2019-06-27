<template>
	<view class="content">
		<view class="padding-h">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="black" size="26"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="text">往期精彩</text>
			</view>
			
			<view class="activity-wrap">
				<view class="activity" v-for="(activity, index) in activities">
					<view v-if="activity.isNewActivity" class="date-wrap">
						<image mode="scaleToFill" src="/static/img/icons/icon-circle.png"></image>
						<text class="date label">{{activity.activityDate}}</text>
					</view>
					
					<view class="list-wrap">
						<view class="left-line">
							<view class="v-line"></view>
						</view>
						<view class="right-content">
							<view v-if="activity.isNewActivity" class="text">{{activity.activityTitle}}</view>
							
							<view class="picture-wrap">
								<text class="desc">{{activity.pictureDesc}}</text>
								<image mode="widthFix" :src="activity.pictureUrl"></image>
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	
	export default {
		components: {fIcon},
		data() {
			return{
				parameter: {
					status:'1',
					byAsc:'show_index'
				},
				activities:[],
				activityPage:{
					pages:0,
					current:0,
					total:0
				}
			}
		},
		computed: {
			
		},
		methods:{
			loadData(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/activity-picture/page',
					method:'POST',
					data:{
						query:{
							...this.parameter
						},
						current:this.activityPage.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							that.activityPage = {
								pages:res.data.data.pages,
								current:res.data.data.current,
								total:res.data.data.total
							};
							if(that.activities.length == 0 && res.data.data.records.length > 0){
								res.data.data.records[0].isNewActivity = true;
							}else if(that.activities.length>0 && res.data.data.records.length > 0){
								res.data.data.records[0].isNewActivity = (res.data.data.records[0].activityId === that.activities[that.activities.length-1].activityId)?false:true;
							}
							for(let i=1; i<res.data.data.records.length; i++){
								res.data.data.records[i].isNewActivity = (res.data.data.records[i].activityId === res.data.data.records[i-1].activityId)?false:true;
							}
							that.activities = that.activities.concat(res.data.data.records);
						}
					}
				});
			}
		},
		onLoad(option) {
			this.loadData();
		}
	}
</script>

<style>
	.content{
		width:100%;
	}

	.activity-wrap{
		display: flex;
		flex-direction: column;
	}
	.date-wrap{
		height: 24upx;
		display: flex;
		align-items: center;
	}
	.date-wrap image{
		width: 32upx;
		height: 32upx;
	}
	.date-wrap .date{
		margin-left: 20upx;
		margin-bottom: 4px;
		font-size: 14px;
	}
	.list-wrap{
		display: flex;
	}
	.list-wrap .left-line{
		width: 84upx;
		min-width: 84upx;
		display: flex;
		flex-direction: column;
	}
	.list-wrap .left-line .v-line{
		width: 1px;
		flex-grow: 1;
		margin-left: 16upx;
		content: '';
		-webkit-transform: scaleX(.5);
		transform: scaleX(.5);
		background-color: #c8c7cc;
	}
	.list-wrap .right-content{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.list-wrap .right-content .text{
		line-height: 32px;
		font-size: 14px;
		font-weight: 900;
		color: #6d5eb3;
		margin-top: 20upx;
	}
	.list-wrap .right-content .picture-wrap{
		
	}
	.list-wrap .right-content .picture-wrap .desc{
		line-height: 24px;
	}
	.list-wrap .right-content .picture-wrap image{
		width: 586upx;
		margin-top: 20upx;
		margin-bottom: 40upx;
		border-radius: 10upx;
	}
	
	
	
</style>
