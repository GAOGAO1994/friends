<template>
	<view class="content">
		<view class="padding-h">	
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
		</view>
		
		<view class="header">
			<view class="left">
				<image mode="scaleToFill" src="../../static/img/icons/yj.png"></image>
				<text class="text">红娘服务</text>
			</view>
			<image class="right" mode="widthFix" :src="bg"></image>
		</view>
		
		<view class="padding-h">
			
			<view class="svc-wrap">
				<view class="svc-box" v-for="(svc,index) in svcs">
					<image mode="aspectFit" :src="svc.icon"></image>
					<text class="text">{{svc.text}}</text>
				</view>
			</view>
				
			<button class="primary margin-top" @click="signUp(1)">了解直营门店红娘服务</button>	
			
			<view class="member-svc">
				<view v-for="(member, index) in members" class="member-wrap" :class="index===members.length-1?'member-wrap-last':''">
					<view class="member-box">
						<view class="avatar-wrap">
							<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
							<view class="identification"><text>实名认证</text></view>
							<image v-if="member.vipStatus != 'non'" class="vip" mode="scaleToFill" :src="member.vipStatus == 'vip'?'../../static/img/icons/icon-vip.png':'../../static/img/icons/icon-vip-expiry.png'"></image>
						</view>
						<view class="name-wrap">
							<text :class="member.sex=='女'?'female':'male'">{{member.nickname}}</text>
							<text class="sex gray">{{member.sex}}</text>
							<text class="point gray">•</text>
							<text class="age gray">{{member.age}}岁</text>
						</view>
						<view class="tags" :class="member.sex=='女'?'tags-female':'tags-male'">
							<view class="tag" v-for="(tag, tagIndex) in member.tags" :key="tagIndex">
								<text>{{tag.name}}</text>
							</view>
						</view>
						<view class="location-wrap">
							<image class="icon-location" style="aspectFit" src="../../static/img/icons/icon-location.png"></image>
							<text>{{member.cityAndCounty}}</text>
						</view>
					</view> 
					<view class="photo-box-wrap">
						<view class="photo-box">
							<image class="photo-bg" style="aspectFill" :src="member.sex == '女'?femaleBg:maleBg"></image>
							<image class="photo" style="aspectFill" :src="member.photo"></image>
						</view>	
					</view>	
				</view>
			</view>
			
			<button class="primary margin-top" @click="signUp(2)">预约红娘匹配更多优质会员</button>	
			
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
				<text class="title">附近直营门店</text>
				<view class="row">
					<text class="">南京市秦淮区大行宫新世纪广场</text>
				</view>
			</view>
			
			<button class="primary margin-top margin-bottom" @click="signUp(3)">到店了解，提前预约</button>	
			
			
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
		<enroll title="红娘服务" kind="红娘服务" subTitle="贴心、专业、可靠" :show="enrollOpen" @close="closeEnroll"></enroll>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import enroll from '@/components/enroll/enroll.vue';
	import {mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon,enroll},
		data() {
			return{
				enrollOpen:false,
				maleBg:this.$http.imgPath + "manage/photot-male.png",
				femaleBg:this.$http.imgPath + "manage/photot-female.png",
				bg:this.$http.imgPath + "manage/matchmaker-1.png",
				svcs:[{
					icon:'../../static/img/icons/icon-svc-zl.png',
					text:'严格审核约见对象资料'
				},{
					icon:'../../static/img/icons/icon-svc-fw.png',
					text:'专业老师贴心跟踪服务'
				},{
					icon:'../../static/img/icons/icon-svc-zd.png',
					text:'一次免费专业情感指导'
				},{
					icon:'../../static/img/icons/icon-svc-cz.png',
					text:'恋爱学院里全年个人成长'
				}],
				members:[{
					avatarUrl:this.$http.imgPath + 'manage/avatar1.png',
					photo:this.$http.imgPath + "manage/member-photo1.png",
					nickname:'顾晓家',
					sex:'女',
					age:26,
					vipStatus:'vip',
					cityAndCounty:'南京市•秦淮区',
					tags:[{
						name:'学生'	
					},{
						name:'摩羯座'	
					},{
						name:'90后'	
					}]
				},{
					avatarUrl:this.$http.imgPath + 'manage/avatar2.png',
					photo:this.$http.imgPath + "manage/member-photo2.png",
					nickname:'张雯雯',
					sex:'女',
					age:28,
					vipStatus:'vip',
					cityAndCounty:'南京市•鼓楼区',
					tags:[{
						name:'新媒体'	
					},{
						name:'天枰座'	
					},{
						name:'很开朗'	
					}]
				},{
					avatarUrl:this.$http.imgPath + 'manage/avatar3.png',
					photo:this.$http.imgPath + "manage/member-photo3.png",
					nickname:'张鑫',
					sex:'男',
					age:28,
					vipStatus:'vip',
					cityAndCounty:'南京市•玄武区',
					tags:[{
						name:'IT工程师'	
					},{
						name:'金牛座'	
					},{
						name:'成熟稳重'	
					}]
				}],
			}
		},
		computed: {
			
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
			if (res.from === 'button') {// 来自页面内分享按钮
			    return {
			      title: '"阅见"红娘服务',
			      imageUrl:this.$http.imgPath + 'manage/matchmaker-1.png',
			      path: '/pages/college/college'
			    }
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
	}
	.header{
		margin-top: 40upx;
		padding:0;
	}
	.header .left{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
	.header .left image{
		width:175upx;
		height:137upx;
	}
	.header .left .text{
		font-size: 24px;
		font-weight: 900;
		margin-top: 40upx;
	}
	.header .right{
		width: 430upx;
		max-height: 500upx;
	}
	.header .right text{
		font-size:18px;
	}
	
	.svc-wrap{
		display: flex;
		flex-wrap: wrap;
		margin-top: 100upx;
	}
	.svc-wrap .svc-box{
		width: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 40upx;
	}
	.svc-wrap .svc-box image{
		width: 80upx;
		height: 80upx;
	}
	.svc-wrap .svc-box .text{
		margin-top: 20upx;
	}
	
	.member-svc{
		margin-top: 120upx;
	}
	
	.member-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 40upx;
		position: relative;
		padding-bottom: 40upx;
	}
	.member-wrap::after {
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
	.member-wrap-last::after {
		display:none;
	}
	
	.member-wrap .member-box{
		flex-grow: 1;
	}
	.avatar-wrap{
		position: relative;
	}
	.avatar-wrap .identification{
		position: absolute;
		top: 0;
		left: 100upx;
		border-radius: 20upx;
		padding: 5upx 10upx;
		color: white;
		font-size: 10px;
		background: linear-gradient(to bottom, #ae74ff, #7558ff);
	}
	.avatar-wrap .vip{
		width: 58upx;
		height: 33upx;
		position: absolute;
		top: 0;
		left: 215upx;
	}
	.member-wrap .member-box .avatar-wrap .avatar{
		width: 150upx;
		height: 150upx;
		border-radius: 75upx;
	}
	.member-wrap .member-box .name-wrap{
		margin-top:20upx;
		font-size: 19px;
		font-weight: 900;
	}
	.member-wrap .member-box .name-wrap .male{
		background: linear-gradient(to right, #00c0ff, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	.member-wrap .member-box .name-wrap .female{
		background: linear-gradient(to right, #ff527f, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	.member-wrap .member-box .name-wrap .point{
		padding: 0 5upx;
		font-size: 12px;
	}
	.member-box .name-wrap .sex, .member-box .name-wrap .age{
		font-size: 14px;
	}
	.member-box .name-wrap .sex{
		margin-left: 10upx;
	}
	
	.member-wrap .photo-box-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.member-wrap .photo-box{
		width: 260upx;
		height: 315upx;
		display: flex;
		justify-content: center;
		position: relative; 
	}
	.member-wrap .photo-box .photo-bg, .member-wrap .photo-box .photo{
		width: 90%;
		height: 90%;
		position:absolute;
	}
	.member-wrap .photo-box .photo-bg{
		/* align-items: flex-start; */
		top: 0;
		left: 0;
	}
	.member-wrap .photo-box .photo{
		bottom: 0;
		right: 0;
		border-radius: 15upx;
	}
	.member-wrap .btn-invate{
		margin-top: 40upx;
	}
	
	.member-wrap .member-box .tags{
		display: flex;
		flex-direction: row;
		margin-top: 20upx;
	}
	.member-wrap .member-box .tags-female .tag{
		border-radius: 50upx;
		padding: 5upx 10upx;
		border: 1px solid #ffc7d5;
		background-color: #ffedf3;
		color: #ff4b7d;
		margin-right: 10upx;
	}
	.member-wrap .member-box .tags-male .tag{
		border-radius: 50upx;
		padding: 5upx 10upx;
		border: 1px solid #88dfff;
		background-color: #e5f7fe;
		color: #00a9ee;
		margin-right: 10upx;
	}
	
	.member-wrap .member-box .location-wrap{
		margin-top: 20upx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}
	.member-wrap .member-box .location-wrap .icon-location{
		width: 25upx;
		height: 35upx;
		margin-right: 20upx;
	}
	.member-wrap .member-box .location-wrap text{
		color: #8F8F94;
	}
	
	.info-wrap{
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
	.margin-bottom{
		margin-bottom:60upx;
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
