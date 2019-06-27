<template>
	<view class="content mvpue-picker">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="left">工作信息</text>
				<view class="right" @click="toggle()">
					<f-icon type="conceal" color="#8F8F94" size="32"></f-icon>
				</view>
			</view>
			
			<view class="">
				<view class="item-wrap input-row border">
					<text class="label">行业</text>
					<view class="input-wrap" @click="pickIndustry">
				        <view class="picker-place" v-if="member.jobIndustryName == ''">
				        	<text class="label">选择</text>
				        </view>
				        <view class="picker-place" v-else>
				        	<text class="input-text">{{member.jobIndustryName}}</text>
				        </view>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">职位</text>
					<view class="input-wrap" @click="pickPosition">
				        <view class="picker-place" v-if="member.jobPositionName == ''">
				        	<text class="label">选择</text>
				        </view>
				        <view class="picker-place" v-else>
				        	<text class="input-text">{{member.jobPositionName}}</text>
				        </view>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">年薪</text>
					<!-- <view class="input-wrap">
						<picker :range="category.income" @change="bindIncomeChange">
							<text v-if="member.income == ''" class="label">选择</text>
							<text v-else class="input-text">{{member.income}}</text>
						</picker>
					</view> -->
					<view class="input-wrap">
						<picker mode="selector" :range="category.income" range-key="name" @change="bindIncomeChange">
							<text v-if="member.income" class="input-text">{{member.income}}万</text>
							<text v-else class="label">选择</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">单位</text>
					<view class="input-wrap">
						<m-input v-if="!showConceal" class="m-input" type="text" clearable v-model="member.companyName" placeholder="请输入单位名称"></m-input>
					</view>
				</view>
				<view class="btn-row">
					<button v-if="member.purpose == 'self' || member.purpose == 'children'" type="primary" class="primary" @tap="bindSubmit">提交</button>
					<button v-else type="primary" class="primary" @tap="next">下一步</button>
				</view>
			</view>
			
			<view v-if="showConceal" class="conceal-wrap">
				<view class="mask" @click="hide()"></view>
				<view class="container">
					<view class="conceal-content">
						<view class="conceal-header">
							<text class="left">隐私设置</text>
							<view class="right">
								<switch color="#7667a5" :checked="concealChecked" @change="switchChangeAll"/>
								<text class="label">全选</text>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">行业</text>
							<view class="input-wrap">
								<text v-if="conceal.jobIndustryCode" class="margin-right">不公开</text>
						        <switch color="#7667a5" :checked="conceal.jobIndustryCode" @change="switchChange('jobIndustryCode', $event)"/>
						    </view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">职位</text>
							<view class="input-wrap">
								<text v-if="conceal.jobPositionCode" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.jobPositionCode" @change="switchChange('jobPositionCode', $event)"/>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">年薪</text>
							<view class="input-wrap">
								<text v-if="conceal.income" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.income" @change="switchChange('income', $event)"/>
							</view>
						</view>
						<view class="item-wrap input-row">
							<text class="label">单位</text>
							<view class="input-wrap">
								<text v-if="conceal.companyName" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.companyName" @change="switchChange('companyName', $event)"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<mpvue-picker ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :themeColor="themeColor" :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '@/components/m-input-right.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import jobIndustryData from '@/static/data/job-industry.js';
	import jobPositionData from '@/static/data/job-position.js';
	import category from '@/static/data/category.js'
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput, mpvuePicker},
		computed: mapState(['account','redirect','target']),
		data() {
			return{
				submitButton:{disabled:false},
				showConceal:false,
				mode:'multiLinkageSelector',
				deepLength:2,
				pickerValueDefault: [0,0], // 初始化值
				pickerValueArray: [], // picker 数组值
				picker: '',
				themeColor: '', // 颜色主题
				category:category,
				jobIndustryValue:[0,0],
				jobPositionValue:[0,0],
				member:{
					sex:'',
					birthday:'',
					maritalStatus:'',
					education:'',
					residence:'',
					work:'',
					jobIndustryCode:'',
					jobIndustryName:'',
					jobPositionCode:'',
					jobPositionName:'',
					income:'',
					companyName:'',
				},
				concealChecked:false,
				conceal:{
					jobIndustryCode:false,
					jobPositionCode:false,
					income:false,
					companyName:false
				}
			}
		},
		methods:{
			...mapMutations(['targetMember','saveMember','savePurpose']),
			toggle:function(){
				this.showConceal = !this.showConceal;
			},
			hide:function(){
				this.showConceal = false;
			},
			switchChangeAll:function(e){
				this.concealChecked = e.target.value;
				this.conceal.jobIndustryCode = e.target.value;
				this.conceal.jobPositionCode = e.target.value;
				this.conceal.income = e.target.value;
				this.conceal.companyName = e.target.value;
			},
			switchChange:function(attr, e){
				this.conceal[attr] = e.target.value;
			},
			verify:function(){
				if (this.member.jobIndustryCode == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您工作的行业'
				    });
				    return;
				}
				if (this.member.jobPositionCode == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您工作的职业'
				    });
				    return;
				}
				if (this.member.income == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的年薪'
				    });
				    return;
				}
// 				if (this.member.companyName == '') {
// 				    uni.showToast({
// 				        icon: 'none',
// 				        title: '请输入您的单位'
// 				    });
// 				    return;
// 				}
				return true;
			},
			next:function(){
				if(this.verify()){
					this.targetMember({
						...this.member,
						conceal:JSON.stringify(Object.assign(JSON.parse(this.member.conceal), this.conceal)),
						work:this.member.jobIndustryName + ' ' + this.member.jobPositionName,
						agentAccountId:this.account.id,
						nickname:this.account.nickname,
						mobile:this.account.mobile
					});
					uni.navigateTo({
						url:'mobileVerify'
					});
				}
			},
			buttonLock:function(){
				setTimeout(() => { 
					this.submitButton.disabled = false;
				}, 2000)
				
				if(this.submitButton.disabled){
					return false;
				}else{
					this.submitButton.disabled = true;
				}
				return true;
			},
			bindSubmit:function(){
				if(this.verify()){
					//
					if(!this.buttonLock())return;
					
					let that = this;
					uni.request({
						url:this.$http.contextPath + 'blind/save',
						method:'POST',
						data:{
							...this.member,
							conceal:JSON.stringify(Object.assign(JSON.parse(this.member.conceal), this.conceal)),
							work:this.member.jobIndustryName + ' ' + this.member.jobPositionName,
							agentAccountId:this.account.id,
							nickname:this.account.nickname,
							mobile:this.account.mobile
						},
						success(res) {
							console.log(res);
							if(that.$http.success(res)){
								//更新本地member
								that.saveMember(res.data.data);
								//上传头像
								uni.redirectTo({
									url: '/pages/reg/avatarUpload?purpose='+that.member.purpose+'&memberId='+res.data.data.id
								});
							}
						}
					})
				}
			},
			pickIndustry: function(){
				this.picker = 'job_industry';
				this.pickerValueDefault = this.jobIndustryValue;
				// if(this.member.jobIndustryValue){
				// 	let values = this.member.jobIndustryValue.split(',');
				// 	this.pickerValueDefault[0] = values[0];
				// 	this.pickerValueDefault[1] = values[1];
				// }
				this.pickerValueArray = jobIndustryData;
				this.$refs.mpvuePicker.show();
			},
			pickPosition: function(){
				this.picker = 'job_position';
				this.pickerValueDefault = this.jobPositionValue;
				// if(this.member.jobPositionValue){
				// 	let values = this.member.jobPositionValue.split(',');
				// 	this.pickerValueDefault[0] = values[0];
				// 	this.pickerValueDefault[1] = values[1];
				// }
				this.pickerValueArray = jobPositionData;
				this.$refs.mpvuePicker.show();
			},
			bindIncomeChange: function(e) {
				this.member.income = category.income[e.target.value].key;
			},
			onChange(e) {
			  // console.log(e);
			},
			onCancel(e) {
			  // console.log(e);
			},
			onConfirm(e) {
				// console.log(e);
				if(this.picker == 'job_industry'){
					this.jobIndustryValue = e.index;
					this.member.jobIndustryCode = e.value[1];
					this.member.jobIndustryValue = e.index[0] + ',' + e.index[1];
					this.member.jobIndustryName = this.pickerValueArray[e.index[0]].children[e.index[1]].label;
				}else{
					this.jobPositionValue = e.index;
					this.member.jobPositionCode = e.value[1];
					this.member.jobPositionValue = e.index[0] + ',' + e.index[1];
					this.member.jobPositionName = this.pickerValueArray[e.index[0]].children[e.index[1]].label;
				}
			},
			onBackPress() {
				if (this.$refs.mpvuePicker.showPicker) {
					this.$refs.mpvuePicker.pickerCancel();
					return true;
				}
			},
			onUnload() {
				if (this.$refs.mpvuePicker.showPicker) {
					this.$refs.mpvuePicker.pickerCancel()
				}
			}
		},
		onLoad(option) {
			Object.assign(this.member, this.target.member);
			// 前面传过来的是
			console.log(this.member);
		}
	}
</script>

<style>
	.margin-right{
		margin-right:30upx;
	}
	.header .left{
		color: black;
	}
	.header .right{
		margin-right: 40upx;
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
		align-items: center;
	}
	.picker-place{
		min-width:500upx;
		display: flex;
		justify-content: flex-end;
	}
	.input-wrap text{
	    font-size:18px;
	}
	.input-text {
	    font-size:18px;
		font-weight: bold;
	}
	.m-input-input {
		padding-right: 0upx;
		font-size:18px;
	}
	
	.conceal-wrap{
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.conceal-wrap .mask{
		flex-grow: 1;
		background: rgba(0, 0, 0, 0.5);
	}
	.conceal-wrap .container{
		padding-left: 40upx;
		background-color: white;
	}
	.conceal-wrap .conceal-content{
		position: relative;
	}
	.conceal-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 40upx;
		padding-bottom: 20upx;
	}
	.conceal-header .left{
		font-size: 16px;
		font-weight: 900;
	}
	.conceal-header .right{
		margin-right: 40upx;
	}
	
</style>
