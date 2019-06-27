<template>
	<view class="content">
		<view class="padding-h">			
			<view class="header">
				<text class="">服务</text>
			</view>
		</view>	
		
		<view class="banner">
			<image mode="scaleToFill" :src="barnnerImg" @click="enter('/pages/blind/everybodyIntro')"></image>
		</view>
		
		<view class="mapadding-h">	
			<view class="service-wrap">
				<view class="service-box" v-for="(service, index) in services" @click="enter(service.url)">
					<view class="service-box-inner">
						<image mode="aspectFit" :src="service.icon"></image>
					</view>
					<text class="">{{service.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	
	export default {
		components: {mIcon},
		data() {
			return{
				barnnerImg:this.$http.imgPath + "manage/matchmaker-2.png",
				"services":[{
					"icon": "../../static/img/icons/icon-matchmaker.png",
					"name": "红娘服务",
					"url": "matchmaker"
				},{
					"icon": "../../static/img/icons/icon-emotion-counseling.png",
					"name": "情感咨询",
					"url": "emotion-counseling"
				},{
					"icon": "../../static/img/icons/icon-fellowship.png",
					"name": "企业联谊",
					"url": "fellowship"
				}/* ,{
					"icon": "../../static/img/icons/icon-wedding-photo.png",
					"name": "婚纱摄影",
					"url": ""
				},{
					"icon": "../../static/img/icons/icon-design.png",
					"name": "形象设计",
					"url": ""
				},{
					"icon": "../../static/img/icons/icon-body-shaping.png",
					"name": "形体塑造",
					"url": ""
				},{
					"icon": "../../static/img/icons/icon-wedding-gifts.png",
					"name": "人人红娘",
					"url": "/pages/blind/everybodyIntro"
				} ,{
					"icon": "../../static/img/icons/icon-space.png",
					"name": "场地服务",
					"url": ""
				} */ ]
			}
		},
		computed: {
			
		},
		methods:{
			enter:function(url){
				uni.navigateTo({
					url:url
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.banner image{
		width: 750upx;
		height: 269upx
	}
	.service-wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-top: 60upx;
	}
	.service-box{
		width: 200upx;
		flex-grow: 1;
		display: flex;
		flex-direction:column;
		align-items: center;
		margin-bottom: 60upx;
	}
	.service-box-inner{
		width: 160upx;
		height: 160upx;
		border-radius: 120upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		box-shadow: 0px 0px 30px 2px #dcdcdc;
		margin-bottom: 20upx;
	}
	.service-box-inner image{
		width: 100upx;
		height: 100upx;
	}
	
</style>
