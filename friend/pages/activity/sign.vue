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
			<view class="header">
				<text class="">活动报名</text>
			</view>
			
			<view class="banner">
				<image mode="scaleToFill" :src="banner"></image>
			</view>
		</view>
		<view class="padding-l">
			<view class="title">
				<text class="primary">个人信息</text>
			</view>
			<!-- <view class="item-wrap input-row border">
				<text class="label">姓名</text>
				<view class="input-wrap">
					<m-input class="m-input" type="text" v-model="member.name" placeholder=""></m-input>
				</view>
			</view> -->
			<view class="item-wrap input-row border">
				<text class="label">性别</text>
				<view class="input-wrap">
			        <picker :value="sexIndex" :range="sexArray" @change="bindSexChange">
						<view class="picker-place" v-if="member.sex == ''">
							<text class="label">男/女</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.sex}}</text>
						</view>
					</picker>
			    </view>
			</view>
			<view class="item-wrap input-row border">
				<text class="label">出生</text>
				<view class="input-wrap">
					<picker mode="date" :value="currentDate" :start="startDate" :end="endDate" @change="bindBirthdayChange">
						<view class="picker-place" v-if="member.birthday == ''">
							<text class="label">0000-00-00</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.birthday}}</text>
						</view>
					</picker>
				</view>
			</view>
			<view class="item-wrap input-row border">
				<text class="label">婚姻状况</text>
				<view class="input-wrap">
					<picker mode="selector" range-key="name" :value="maritalStatusIndex" :range="maritalStatusArray" @change="bindMaritalStatusChange">
						<view class="picker-place" v-if="member.maritalStatusName == ''">
							<text class="label">未婚</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.maritalStatusName}}</text>
						</view>
					</picker>
				</view>
			</view>
			<view class="item-wrap input-row border">
				<text class="label">学历</text>
				<view class="input-wrap">
					<picker mode="selector" :value="educationIndex" :range="educationArray" @change="bindEducationChange">
						<view class="picker-place" v-if="member.education == ''">
							<text class="label">本科</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.education}}</text>
						</view>
					</picker>
				</view>
			</view>
			<view class="item-wrap input-row">
				<text class="label">常住地</text>
				<view class="input-wrap">
					<picker mode="region" :value="residences"  @change="bindResidenceChange">
						<view class="picker-place" v-if="member.residence == ''">
							<text class="label">南京</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.residence}}</text>
						</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<view class="item ">
						<f-icon type="consult" color="#8F8F94" size="30"></f-icon>
						<text>咨询</text>
					</view>
					<view class="item button">
						<view class="button-wrap" @click="bindSign">
							<image mode="widthFix" src="../../static/img/icons/bird.png"></image>
							<text>确定报名</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input-right.vue'
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState, mapMutations} from 'vuex'

	export default {
		components: {mInput,mIcon,fIcon},
		data() {
			return{
				banner:this.$http.imgPath + 'manage/xqh1.png',
				activityId:0,
				member:{
					sex:'',
					birthday:'',
					maritalStatus:'',
					maritalStatusName:'',
					education:'',
					residence:''
				},
				sexArray: ['男','女'],
				sexIndex: 0,
				currentDate: this.getDate({
					format: true
				}),
				maritalStatusArray: [{
					'key':'single',
					'name':'未婚'
				},{
					'key':'divorced',
					'name':'离婚'
				},{
					'key':'lose',
					'name':'丧偶'
				}],
				maritalStatusIndex: 0,
				educationArray:['高中以下','高中','大专','本科','硕士','博士'],
				educationIndex: 0,
				residences:['江苏省','南京市']
			}
		},
		computed: {
			...mapState(['activities', 'account']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			...mapMutations(['sign']),
			verify(){
				if (this.member.sex == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的性别'
				    });
				    return;
				}
				if (this.member.birthday == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的出生'
				    });
				    return;
				}
				if (this.member.maritalStatus == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的婚姻状况'
				    });
				    return;
				}
				if (this.member.education == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的学历'
				    });
				    return;
				}
				if (this.member.residence == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的常住地'
				    });
				    return;
				}
				return true;
			},
			bindSign:function(){
				if(!this.verify())return;
				let that = this;
				console.log('activityId:'+JSON.stringify(this.$data.member));
				uni.request({
					url:this.$http.contextPath + 'activity/sign',
					method:'POST',
					data:{
						'member':{
							...this.member,
							'accountId':that.account.id
						},
						'activityMember':{
							'activityId':that.activityId,
							'accountId':that.account.id,
							'nickname':that.account.nickname,
							'avatarUrl':that.account.avatarUrl
						},
					},
					success(res) {
						if(that.$http.success(res.data)){
							that.sign(that.activityId);
							uni.navigateTo({
								url:"activity?id="+that.activityId
							});
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '报名失败，请稍后再试'
							});
						}
					},
					fail(res) {
						 uni.showToast({
						    icon: 'none',
						    title: '网络错误，请稍后再试'
						});
					}
				})
			},
			bindSexChange:function(e){
				 this.member.sex = this.sexArray[e.target.value];
			},
			bindBirthdayChange: function(e) {
				this.member.birthday = e.target.value;
			},
			bindMaritalStatusChange:function(e){
				this.member.maritalStatus = this.maritalStatusArray[e.target.value].key;
				 this.member.maritalStatusName = this.maritalStatusArray[e.target.value].name;
			},
			bindEducationChange: function(e) {
				this.member.education = this.educationArray[e.target.value];
			},
			bindResidenceChange: function(e) {
				this.member.residence = e.target.value.join(',');
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 65;
				} else if (type === 'end') {
					year = year-20;
				} else if (type === 'current') {
					year = year - 20;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		},
		onLoad(option) {
			this.activityId = option.activityId;
		}
	}
	
	
</script>
	
<style>
	.banner {
		width: 100%;
	}
	.banner image{
		width: 100%;
		max-height: 300upx;
	}
	.title{
		font-size: 20px;
		font-weight: 900;
		margin-top: 40upx;
		margin-bottom: 20upx;
	}
	.item-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40upx 0;
		align-items: center;
	}
	.input-wrap{
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		margin-right: 40upx;
	}
	.picker-place{
		min-width:500upx;
		display: flex;
		justify-content: flex-end;
	}
	.input-wrap text{
	    font-size:18px;
	}
	.input-text, .m-input{
	    font-size:18px;
		font-weight: bold;
	}
	
	.bottom-bar-block{
		height: 140upx;
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
		align-items: center;
		flex-grow: 1;
	}
	.bottom-bar .bar-box .item text{
		margin-left: 10upx;
		/* font-weight:bold; */
	}
	.bottom-bar .bar-box .button{
		justify-content: flex-end;
	}
	.bottom-bar .button-wrap{
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
		box-shadow: 0px 0px 10px #fe8dc8;
		line-height: 80upx;
		height: 80upx;
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
