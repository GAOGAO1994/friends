<template>
	<view class="content">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="#7558ff" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="">阅见™客服</text>
			</view>
			
			<view class="remind">
				<!-- <f-icon type="info" color="#fc597b" size="30"></f-icon>	 -->
				<text>请使用微信扫描下方二维码（可任选一个）</text>
			</view>
		</view>	
			
		<view class="content-wrap padding-h">
			<view class="sub-title">添加阅见™客服进行咨询</view>	
			<view class="qrcode-wrap">
				<view class="qrcode" v-for="(staff,index) in staffs" :class="{marginright:index < staffs.length-1 && (index+1)%3!=0}">
					<image mode="scaleToFill" :src="staff.qrcodeUrl" @click="preview(staff.qrcodeUrl)"></image>
					<view class="nickname">
						<f-icon type="attention" color="#7558ff" size="21"></f-icon>
						<text>{{staff.nickname}}</text>
					</view>
					<text class="label">{{staff.weixin}}</text>
				</view>
			</view>
		</view>	
		<view class="group-wrap">
			<view class="title">阅见™单身交流服务群</view>
			<view class="qrcode-wrap">
				<view class="qrcode" v-for="(item,index) in group" :class="{marginright:index < group.length-1}">
					<image mode="scaleToFill" :src="item.src" @click="preview(item.src)"></image>
					<!-- <view class="nickname">
						<f-icon type="attention" color="#7558ff" size="21"></f-icon>
						<text>{{item.title}}</text>
					</view> -->
					<text class="sub-title">{{item.title}}</text>
				</view>
			</view>
			<view class="info">
				<view class="step">Step1、先扫描上面的二维码，加客服好友</view>
				<view class="step">Step2、根据兴趣爱好由客服好友邀请进入相应交流群</view>
			</view>
		</view>	
		<image-preview :show="previewOpen" :src="previewSrc" @close="closePreview"></image-preview>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import imagePreview from '@/components/preview/image-preview.vue';
	import {mapState,mapGetters,mapMutations} from 'vuex';
	
	export default {
		components: {fIcon,imagePreview},
		data() {
			return{
				previewOpen:false,
				previewSrc:'',
				staffs:[],
				group:[{
					title:'高知单身群',
					src:'https://friend-1251032618.cos.ap-shanghai.myqcloud.com/logo/logo200x200.png'
				},{
					title:'阅读者单身群',
					src:'https://friend-1251032618.cos.ap-shanghai.myqcloud.com/logo/logo200x200.png'
				},{
					title:'Cosplay单身群',
					src:'https://friend-1251032618.cos.ap-shanghai.myqcloud.com/logo/logo200x200.png'
				}]
			}
		},
		computed: {
			...mapState(['hasLogin']),
			...mapGetters(['agentMember'])
		},
		methods:{
			closePreview:function(){
				this.previewOpen = false;
			},
			preview:function(url){
				this.previewSrc = url;
				this.previewOpen = true;
			},
			getData:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/kefu/list',
					method:'POST',
					data:{
						status:'1',
						residenceCode:(this.hasLogin && this.agentMember && this.agentMember.residenceCode)?this.agentMember.residenceCode.substring(0,4):'3201'	//未登录，显示南京客服
					},
					success(res) {
						if(that.$http.success(res)){
							that.staffs = res.data.data;
						}
					}
				})
			}
		},
		onLoad(option) {
			this.getData();
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
	
	.sub-title{
		margin-top: 10upx;
	}
	.qrcode-wrap{
		display: flex;
		flex-wrap: wrap;
		margin-top: 20upx;
		margin-bottom: 60upx;
	}
	.qrcode-wrap .marginright{
		margin-right: 30upx;
	}
	.qrcode-wrap .qrcode{
		width: 200upx;
		margin-top: 40upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.qrcode-wrap .qrcode image{
		width: 200upx;
		height: 200upx;
	}
	.qrcode-wrap .qrcode .nickname{
		margin: 20upx 0;
		display: flex;
		align-items: center;
	}
	.qrcode-wrap .qrcode .nickname text{
		color: #7558ff;
		margin-left: 10upx;
	}
	
	.group-wrap{
		background-color: #d9caff;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 60upx;
	}
	.group-wrap .title{
		margin-top: 40upx;
		color: white;
		font-size: 18px;
		font-weight: 900;
	}
	.group-wrap .sub-title{
		margin-top: 20upx;
	}
	.group-wrap .step{
		margin-top: 20upx;
	}
	
</style>
