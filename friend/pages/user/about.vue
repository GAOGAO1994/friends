<template>
	<view class="content">
		<view class="padding-l">
			<!-- #ifndef H5 -->
			<view class="header">
				<text>关于</text>
			</view>
			<!-- #endif -->
			<view class="logo-wrap">
				<text class="title">阅见</text>
				<!-- <image class="logo" mode="scaleToFill" src="/static/img/icons/yj.png"></image> -->
				<image class="qrcode" mode="scaleToFill" :src="qrcodeUrl"></image>
				<text class="text">扫描二维码，可直接访问！</text>
			</view>
			
			<view class="list">
				<view class="item border" @click="enter('serviceAgreement')">
					<view class="left">
						<text>服务条款</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>	
				<view class="item" @click="enter('privacyPolicy')">
					<view class="left">
						<text>隐私政策</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>	
			</view>
			
			<view class="copy-right">
				<text class="label">Copyright©2019</text>
				<text class="label">亿缘网络科技 版权所有</text>
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
				qrcodeUrl:this.$http.imgPath + "manage/qrcode-h5.png",
			}
		},
		computed: {
			
		},
		methods:{
			enter:function(url){
				uni.navigateTo({
					url:'../statement/'+url
				})
			}
		},
		onLoad() {
			
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
	
	.logo-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/* .logo-wrap .logo{
		width: 175upx;
		height: 137upx;
		margin-top:60upx;
	} */
	.logo-wrap .qrcode{
		width: 256upx;
		height: 256upx;
		margin-top:20upx;
	}
	.logo-wrap .title{
		font-size:18px;
		font-weight:900;
		margin-top:60upx;
	}
	.logo-wrap .text{
		margin-top:20upx;
	}
	
	.list{
		position: relative;
		margin-top: 40upx;
	}
	.list .item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		position: relative;
	}
	.list .border::after {
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
	.list .item .left{
		display: flex;
	}
	.list .item .left text{
		margin-left: 20upx;
		font-size: 16px;
	}
	.list .item .right{
		margin-right: 20upx;
	}
	
	.copy-right{
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 24px;
		margin-top: 100upx;
	}
	
</style>
