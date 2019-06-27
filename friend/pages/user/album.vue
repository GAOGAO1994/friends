<template>
	<view class="content">
		<view class="header-wrap">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap padding-h">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="white" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="text">我的相册</text>
			</view>
		</view>
		<view class="hight-circle"></view>
		<view class="album-wrap padding-h">
			<view class="album-add" @click="pickPhoto">
				<f-icon type="new" color="#fc597b" size="32"></f-icon>
			</view>	
			<view class="album-content">
				<view class="count-wrap label">共 <text class="count">{{photos.length}}</text> 张</view>	
				<view class="album-box">
					<view class="photo-colunm">
						<view class="photo-box" v-for="(photo, index) in photos" v-if="index%2===0">
							<view class="thumbnail-box">
								<image mode="aspectFill" :src="photo.url" @click="preview(photo)"></image>
								<view v-if="!photo.id" class="upload">
									<view class="icon-wrap" @click.stop="upload(photo)">
										<f-icon type="upload" color="#ae74ff" size="32"></f-icon>
									</view>
									<view class="space"></view>
									<view class="icon-wrap" @click.stop="remove(photo)">
										<f-icon type="remove" color="#fe8dc8" size="32"></f-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="photo-colunm">
						<view class="photo-box" v-for="(photo, index) in photos" v-if="index%2===1">
							<view class="thumbnail-box">
								<image mode="aspectFill" :src="photo.url" @click="preview(photo)"></image>
								<view v-if="!photo.id" class="upload">
									<view class="icon-wrap" @click.stop="upload(photo)">
										<f-icon type="upload" color="#ae74ff" size="32"></f-icon>
									</view>
									<view class="space"></view>
									<view class="icon-wrap" @click.stop="remove(photo)">
										<f-icon type="remove" color="#fe8dc8" size="32"></f-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>	
			</view>	
		</view>	
		
		<image-preview :show="previewOpen" :src="previewSrc" @close="closePreview"></image-preview>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import imagePreview from '@/components/preview/image-preview.vue';
	import memberSvc from '@/services/member/member.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon,imagePreview},
		data() {
			return{
				photos:[],
				previewOpen:false,
				previewSrc:''
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			preview:function(photo){
				this.previewSrc = photo.url;
				this.previewOpen = true;
			},
			closePreview:function(){
				this.previewOpen = false;
			},
			pickPhoto:function(e){
				let that = this;
				 uni.chooseImage({
					count:1,
					success: (chooseImageRes) => {
						if(chooseImageRes.tempFiles[0].size > 1024*1024*5){
							uni.showToast({
								title:'图片大小限制5M'
							})
							return;
						}
						const tempFilePaths = chooseImageRes.tempFilePaths;
						that.photos.push({
							id:0,
							url:tempFilePaths[0]
						});
					}
				});
			},
			remove:function(photo){
				this.photos.forEach((item,index) =>{
					if(item.url == photo.url){
						this.photos.splice(index,1);
						return;
					}
				})
			},
			upload:function(photo){
				let that = this;
				uni.uploadFile({
					url: this.$http.contextPath + 'member/photo/upload',
					filePath: photo.url,
					name: 'file',
					formData: {
						'name':'photo',
						'memberId': this.agentMember.id
						// 'suffix': photo.url.substring(photo.url.lastIndexOf('.')+1)
					},
					success: (res) => {
						if(that.$http.success(res)){
							photo.id = JSON.parse(res.data).data.id;
						}
					}
				});
			},
			getPhotos(){
				if(!this.agentMember || !this.agentMember.id){
					return;
				}
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/album/list',
					method:'POST',
					data:{
						status:'1',
						memberId:this.agentMember.id
					},
					success(res) {
						if(that.$http.success(res)){
							that.photos = res.data.data;
						}
					}
				});
			}
		},
		onLoad(option) {
			this.getPhotos();
		}
	}
</script>

<style>
	.content{
		width:100%;
		position: relative;
	}
	.header-wrap{
		height:360upx;
		background: linear-gradient(to bottom, #fd6e99, #ff4f95); 
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.hight-circle{
		width:750upx;
		height:750upx;
		border-radius:375upx;
		position: absolute;
		top: -50upx;
		left:350upx;
		background: linear-gradient(to bottom, #fd6e99, #ffffff); 
		opacity: 0.3;
	}
	.header{
		margin-top: 120upx;
		margin-left: 40upx;
		display: flex;
		justify-content: space-between;
	}
	.header .text{
		color: white;
	}
	.header .right{
		display: flex;
		align-items: center;
	}
	.header .right text{
		font-size:18px;
	}
	
	.album-wrap{
		position: absolute;
		top:270upx;
		left: 0;
		right: 0;
	}
	.album-content{
		position:relative;
		border-radius:10upx;
		background-color: white;
		min-height: 600upx;
		padding: 0 20upx;
		padding-bottom: 20upx;
		box-shadow: 0upx 0upx 20upx 2upx #dcdcdc;
	}
	.album-add{
		width:100upx;
		height: 100upx;
		border-radius: 50upx;
		position: absolute;
		top:-40upx;
		right: 100upx;
		z-index: 100;
		background-color: white;
		box-shadow: 0upx 0upx 20upx 2upx #dcdcdc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.count-wrap{
		position: relative;
		font-size: 16px;
		padding-top:40upx;
		padding-left:20upx;
		padding-bottom: 40upx;
	}
	.count-wrap .count{
		margin: 0 10upx;
	}
	.album-box{
		width:100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:space-between;
		align-items: flex-start;
	}
	
	.album-box .photo-colunm{
		width: calc(50% - 5upx);
	}
	.album-box .photo-box{
		width: 100%;
		margin-bottom: 5upx;
		border-radius:15upx;
		background-color: white;
	}
	.album-box .photo-box .thumbnail-box{
		position: relative;
	}
	.album-box .photo-box .thumbnail-box image{
		width: 100%;
		height: 310upx;
		border-radius:10upx;
	}
	.album-box .photo-box .thumbnail-box .upload{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.8;
	}
	.album-box .photo-box .thumbnail-box .icon-wrap{
		width:32px;
		height: 32px;
		border-radius: 32px;
		background-color: white;
	}
	.album-box .photo-box .thumbnail-box .space{
		width:30upx;
	}
	
</style>
