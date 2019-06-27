<template>
	<view class="content">
		<view class="padding-h">			
			<!-- <view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="white" size="30"></m-icon>
				</navigator>
			</view>
			<view class="title-wrap">
				<text class="title">{{article.title}}</text>
				<view class="sub-title">
					<text class="author label">{{article.author}}</text>
					<text class="time label">{{article.time}}</text>
				</view>
			</view> -->
			
			<web-view class="web" :src="article.link" style=""></web-view>
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import category from '@/static/data/category.js';
	import {mapState} from 'vuex'
	
	export default {
		components: {mIcon,fIcon},
		data() {
			return{
				article:{}
			}
		},
		computed: {
			...mapState(['target'])
		},
		methods:{
			
		},
		onLoad(option) {
			let id = option.id;
			if(id == parseInt(this.target.article.id)){
				this.article = this.target.article;
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
	}
	.title-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 150upx;
		margin-bottom: 40upx;
	}
	.title-wrap .title{
		font-size:18px;
		font-weight: bold;
	}
	.title-wrap .sub-title{
		display: flex;
		margin-top: 20upx;
	}
	.title-wrap .sub-title .time{
		margin-left: 20upx;
	}
	
	
</style>
