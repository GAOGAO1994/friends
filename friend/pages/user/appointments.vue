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
				<text class="text">阅见好友</text>
			</view>
		</view>
		<view class="hight-circle"></view>
		<view class="album-wrap padding-h">
			<!-- <view class="album-add" @click="pickPhoto">
				<f-icon type="new" color="#fc597b" size="32"></f-icon>
			</view>	 -->
			<view class="album-content">
				<view class="count-wrap label">共 <text class="count">{{page.total}}</text> 个</view>	
				<view class="appointment-wrap">
					<view class="appointment-item border" v-for="(appointment, index) in appointments" :class="index===appointments.length-1?'last':''" @click="viewMember(appointment.member)">
						<view class="left">
							<image class="avatar" mode="scaleToFill" :src="appointment.member.avatarUrl"></image>
							<view class="info">
								<view class="name-wrap">
									<text class="name-female">{{appointment.member.nickname}}</text>
									<text class="point">•</text>
									<text class="age">{{appointment.member.age}}岁</text>
								</view>
								<view class="location">
									<f-icon type="location" color="#7558ff" size="13"></f-icon>
									<text class="label">{{appointment.member.city}}</text>
								</view>
							</view>
						</view>
						<!-- <view class="right">
							<view v-if="appointment.workStatus == 'active'" class="button-wrap" @click.stop="cancel(appointment)">
								<text>取消关注</text>
							</view>
						</view> -->
					</view>
					
					<view class="more-wrap margin-top">
						<text v-if="page.current < page.pages" @click="loadData()">加载更多</text>
						<view v-else-if="page.current > 1" class="under-line">
							<text class="text">没有更多</text>
						</view>
					</view>
				</view>	
			</view>	
		</view>	
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import memberSvc from '@/services/member/member.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon},
		data() {
			return{
				appointments:[],
				page:{
					pages:0,
					current:0,
					total:0
				}
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			handler:function(data){
				let map = {};
				data.members.forEach(item =>{
					item.city = memberSvc.getCity(item.residence);
					map[item.id] = item;
				});
				
				let appointments = [];
				data.page.records.forEach(item =>{
					item.member = map[item.memberId];
					item.targetMember = map[item.targetMemberId];
					appointments.push(item);
				});
				this.appointments = this.appointments.concat(appointments);
				this.page = data.page;
			},
			loadData(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'invite/my',
					method:'POST',
					data:{
						query:{
							memberId:this.agentMember.id,
							kind:'appointment',
							status:'1',
							// presenceStatus:'present'
						},
						current:this.page.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							that.handler(res.data.data);
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
		position: relative;
	}
	.header-wrap{
		height:360upx;
		background: linear-gradient(to bottom, #58c2e9, #3195ff); 
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
		background: linear-gradient(to bottom, #79d2fe, #ffffff); 
		opacity: 0.3;
	}
	.header{
		margin-top: 120upx;
		margin-left: 40upx;
		display: flex;
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
	.appointment-wrap{
		width: 100%;
		padding: 0 20upx;
	}
	.appointment-wrap .last::after{
		display: none;
	}
	.appointment-item{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		position: relative;
	}
	.appointment-item::after {
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
	.appointment-item .left{
		display: flex;
	}
	.appointment-item .right{
		width: 240upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.appointment-wrap .left .avatar{
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
	}
	.info{
		margin-left: 30upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.info .name-wrap{
		display: flex;
	}
	.info .name-wrap .name{
		font-size: 18px;
		margin-left: 2px;
	}
	.info .name-wrap .point, .info .name-wrap .age{
		font-size: 18px;
		color: #999999;
		font-weight: 900;
	}
	.info .location{
		display: flex;
		align-items:center;
		margin-top: 15upx;
	}
	.info .location .label{
		color: #999999;
		font-size: 11px;
	}
	.button-wrap{
		width: 200upx;
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); 
		box-shadow: 0px 0px 10px #fe8dc8;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-wrap image{
		width: 60upx;
	}
	.button-wrap text{
		color: white;
		font-weight: normal;
	}
	
	.more-wrap{
		display: flex;
		justify-content: center;
		margin-bottom: 40upx;
	}
	
</style>
