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
				<text class="text">情感咨询</text>
				<text class="sub">专业咨询顾问团</text>
			</view>
			<view class="hight-circle"></view>
		</view>
		<view class="text-wrap padding-h">
			
			<view class="text-content">
				<text class="summary">阅见，阅己阅TA阅见爱，全国唯一真实可靠、精准需求的单身交友平台，人人红娘分享独特机制，帮助个人成长学会去爱的恋爱学院，婚恋中一片净土。</text>
			</view>	
			
			<view class="teacher-wrap">
				<image mode="scaleToFill" :src="teacherImg"></image>
				<view class="round">
					<text class="name">周老师</text>
					<text class="split">/</text>
					<text class="title">婚恋专家</text>
				</view>
			</view>
			
			<view class="words-wrap">
				<image mode="scaleToFill" src="../../static/img/icons/icon-left-quotation.png"></image>
				<text class="text">如果找对象用100天的话，99天用来和自己谈恋爱看见自己的圆满，剩下一天看见对方的圆满，一见钟情。</text>
			</view>
			
			<view class="words margin-top">多年婚恋、情感、心理咨询丰富经验及自由撰稿人。“牵手之王”相亲会主持人，专研恋爱牵手成功率。崇尚自然简单纯粹，活出生命喜悦感。每天分享自我觉察，教会大家在生活点滴中修行，引领幸福和个人成长。</view>
			<view class="words label margin-top">二级心理咨询师</view>
			<view class="words label">二级家庭婚姻咨询师</view>
			<view class="words label">非暴力沟通导师</view>
			<view class="words label">萨提亚个人成长讲师</view>
			<view class="words label">恋爱学院创始人</view>
			<view class="words label">恋爱/婚前上岗培训独创者</view>
			<view class="words label">江苏省广播电台99.7特邀情感嘉宾</view>
			
			<view class="info-content">
				<view class="info-wrap">
					<text class="title">门店工作时间</text>
					<view class="row">
						<text class="emphasize">平时：</text>
						<text class="">周一～周五，9:00-17:00</text>
					</view>
					<view class="row">
						<text class="emphasize">周末：</text>
						<text class="">周六～周日，9:30-17:30</text>
					</view>
				</view>
				
				<view class="info-wrap">
					<text class="title">门店地址</text>
					<view class="row">
						<text class="">南京市秦淮区大行宫新世纪广场</text>
					</view>
				</view>
			</view>
			
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
						<f-icon type="consult" color="#7558ff" size="30"></f-icon>
						<text>在线客服</text>
					</view>
					<!--  #endif -->
					
					<!-- <view class="item">
						<button open-type="share"><f-icon type="share" color="#7558ff" size="30"></f-icon>分享</button>
					</view> -->
					<view class="item button">
						<view class="button-wrap" @click="signUp">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>我要咨询</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		<enroll title="情感咨询" kind="情感咨询" subTitle="专业咨询顾问团" :show="enrollOpen" @close="closeEnroll"></enroll>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import enroll from '@/components/enroll/enroll.vue';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon,enroll},
		data() {
			return{
				enrollOpen:false,
				teacherImg:this.$http.imgPath + 'manage/teacher1.png'
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			closeEnroll:function(){
				this.enrollOpen = false;
			},
			signUp:function(){
				this.enrollOpen = true;
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
			      title: '"阅见"情感咨询',
			      imageUrl:this.$http.imgPath + 'manage/xqh1.png',
			      path: '/pages/svc/emotion-counseling'
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
		background: linear-gradient(to bottom, #ae74ff, #7b58ff); 
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
		background: linear-gradient(to bottom, #79d2fe, #ffffff); 
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
	.text-content .summary{
		line-height: 32px;
		font-size: 14px;
	}
	
	.teacher-wrap{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 60upx;
	}
	.teacher-wrap image{
		width: 400upx;
		height: 480upx;
	}
	.teacher-wrap .round{
		width: 600upx;
		border-radius: 80upx;
		padding: 20upx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ff5986;
	}
	.teacher-wrap .round .name{
		color: white;
		font-size:18px;
		font-weight: 900;
	}
	.teacher-wrap .round .title{
		color: white;
	}
	.teacher-wrap .round .split{
		color: white;
		margin: 0 20upx;
	}
	
	.words-wrap{
		margin-top: 20upx;
		display: flex;
		align-items: flex-start;
	}
	.words-wrap image{
		width: 49upx;
		height: 42upx;
	}
	.words-wrap .text{
		font-size: 18px;
		font-weight: 900;
		color: #ff5986;
		margin-top: 15upx;
		margin-left: 10upx;
	}
	
	.words{
		line-height:24px;
	}
	.info-content{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60upx;
	}
	.info-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 60upx;
	}
	.info-wrap .title{
		font-size:20px;
		font-weight: 900;
		margin: 20upx 0;
	}
	.info-wrap .row{
		margin: 10upx 0;
	}
	.info-wrap .emphasize{
		color:#7558ff;
		font-weight: 900;
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
		background: linear-gradient(to bottom, #ae74ff, #7558ff); /* 标准的语法 */
		box-shadow: 0px 0px 10px #7558ff;
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
