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
				<text class="text">人人红娘</text>
				<text class="sub">申请成为阅见红娘</text>
			</view>
			<view class="hight-circle"></view>
		</view>
		
		<view class="text-wrap padding-h">
			
			<view class="text-content">
				<text class="title">阅见相亲，诚招全市代理</text>
				<view class="text-row">
					<text class="summary">无需经验，无需店铺</text>
				</view>
				<view class="text-row">
					<text class="summary">品牌总监一对一扶持</text>
				</view>
				<view class="text-row">
					<text class="summary">报名瞬间开启美丽事业</text>
				</view>
			</view>	
			
			<view class="item-wrap">
				<view class="item">
					<image mode="scaleToFill" src="../../static/img/icons/icon-hn2.png"></image>
					<text>促得天下姻缘</text>
				</view>
				<view class="space"></view>
				<view class="item">
					<image mode="scaleToFill" src="../../static/img/icons/icon-hn3.png"></image>
					<text>事业互助共赢</text>
				</view>
				<view class="space"></view>
				<view class="item">
					<image mode="scaleToFill" src="../../static/img/icons/icon-hn1.png"></image>
					<text>获得可观收益</text>
				</view>
			</view>
			
			<view class="image-wrap margin-top">
				<image mode="scaleToFill" :src="barnnerImg"></image>
			</view>
			
			<!-- <view class="form-wrap">
				<view class="row">
					<input type="text" v-mode="name" placeholder="您的姓名" />
				</view>
				<view class="row">
					<input type="text" v-mode="mobile" placeholder="您的手机号" />
				</view>
				<view class="btn-submit">提交申请</view>
			</view> -->
		</view>	
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<!--  -->
					<!--  #ifdef  MP-WEIXIN -->
					<view class="item">
						<button open-type="contact"><f-icon type="consult" color="#7558ff" size="30"></f-icon>咨询</button>
					</view>
					<!--  #endif -->
					<!--  #ifndef  MP-WEIXIN -->
					<view class="item " @click="consult">
						<f-icon type="consult" color="#ff4f95" size="30"></f-icon>
						<text>在线咨询</text>
					</view>
					<!--  #endif -->
					
					<!-- <view class="item">
						<button open-type="share"><f-icon type="share" color="#7558ff" size="30"></f-icon>分享</button>
					</view> -->
					<view class="item button" @click="signUp">
						<view class="button-wrap">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>我要申请</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon,loginModal},
		data() {
			return{
				showLogin:false,
				teacherImg:this.$http.imgPath + 'manage/teacher1.png',
				barnnerImg:this.$http.imgPath + "manage/matchmaker-3.png",
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['loginCheck','agentMember']), 
		},
		methods:{
			...mapMutations(['redirect']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			signUp:function(){
				if(this.hasLogin){
					if(this.account && this.account.purposes && this.account.purposes.indexOf('everybody') > -1){
						uni.showToast({
							icon:'none',
							title:'您已经申请成为人人红娘！'
						})
					}else{
						uni.redirectTo({
							url:'/pages/blind/everybody'
						})
					}
				}else{
					this.redirect('/pages/blind/everybodyIntro');
					this.showLogin = true;
				}
			},
			consult:function(){
				uni.navigateTo({
					url: '/pages/form/kefu'
				});
			}
		},
		onLoad(option) {
			
		},
		onShareAppMessage(res) {
			if (res.from === 'button' || res.from === 'menu') {// 来自页面内分享按钮
			    return {
			      title: '"阅见"人人红娘',
			      imageUrl:this.$http.imgPath + 'manage/matchmaker-3.png',
			      path: '/pages/blind/everybodyIntro'
			    }
			}
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
		position: relative;
		overflow: hidden;
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
		align-items: flex-end;
	}
	.header .text{
		color: white;
	}
	.header .sub{
		color: white;
		font-size:14px;
		margin-left: 12upx;
	}
	
	.text-wrap{
		position: absolute;
		top:270upx;
		left: 0;
		right: 0;
		padding-bottom: 120upx;
	}
	.text-content{
		position:relative;
		border-radius:10upx;
		background-color: white;
		padding: 40upx;
		padding-bottom: 20upx;
		box-shadow: 0upx 0upx 20upx 2upx #dcdcdc;
	}
	.text-content .title{
		line-height: 54px;
		font-size: 16px;
		font-weight: 900;
	}
	.text-content .text-row{
		padding-left: 20upx;
	}
	.text-content .summary{
		line-height: 32px;
		font-size: 14px;
	}
	
	.item-wrap{
		margin-top: 60upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.item-wrap .space{
		width: 80upx;
	}
	.item-wrap .item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.item-wrap .item image{
		width: 96upx;
		height: 96upx;
	}
	.item-wrap .item text{
		margin-top: 20upx;
	}
	.image-wrap{
		display: flex;
		justify-content: center;
	}
	.image-wrap image{
		width: 600upx;
		height: 600upx
	}
	
	.form-wrap{
		width: 670upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 60upx;
	}
	.form-wrap .row{
		margin-top: 20upx;
		width: 670upx;
		border-radius: 80upx;
		box-shadow:0 0upx 50upx 5upx #ffe7ef;
	}
	.form-wrap .row input{
		padding: 20upx 0upx;
		margin-left: 40upx;
	}
	
	.btn-submit{
		margin-top: 30upx;
		margin-bottom: 60upx;
		width: 670upx;
		border-radius: 80upx;
		padding: 30upx 0upx;
		color: white;
		font-size:14px;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); 
		box-shadow: 0px 0px 10px #fe8dc8;
		align-items: center;
	}
	
	.bottom-bar-block{
		height: 200upx;
		align-items: flex-end;
	}
	
	.bottom-bar-wrap{
		width: 100%;
		position:fixed;
		left: 0;
		bottom: 0;
		height: 120upx;
		background-color: white;
		box-shadow: 0px -2px 30px 2px #f8f8f8;
		z-index: 100;
	}
	
	.bottom-bar{
		position:fixed;
		left: 40upx;
		right: 40upx;
		bottom: 0;
		height: 120upx;
		display: flex;
		flex-direction: row;
	}
	.bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.bottom-bar .bar-box .item{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
	.bottom-bar .bar-box .item text{
		margin-left: 10upx;
	}
	.bottom-bar .bar-box .item button{
		background-color: white;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
	.bottom-bar .bar-box .item button::after{ 
		border: none;
	}
	.bottom-bar .bar-box .button{
		justify-content: flex-end;
	}
	
	.bottom-bar .button-wrap{
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); 
		box-shadow: 0px 0px 10px #fc597b;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
	}
	.bottom-bar .button-wrap image{
		width: 60upx;
	}
	.bottom-bar .button-wrap text{
		color: white;
		font-weight: normal;
	}
</style>
