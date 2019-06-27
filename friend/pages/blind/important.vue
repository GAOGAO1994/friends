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
				<text class="left">重要信息</text>
				<view class="right" @click="toggle()">
					<f-icon type="conceal" color="#8F8F94" size="32"></f-icon>
				</view>
			</view>
			
			<view class="">
				<view class="item-wrap input-row border">
					<text class="label">身高</text>
					<view class="input-wrap">
				        <m-input v-if="!showConceal" class="m-input" type="number" clearable v-model="member.height" placeholder="cm"></m-input>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">体重</text>
					<view class="input-wrap">
						<m-input v-if="!showConceal" class="m-input" type="number" clearable v-model="member.weight" placeholder="kg"></m-input>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">财产</text>
					<view class="input-wrap">
						<picker :range="assetsArray" range-key="name" @change="bindAssetsChange">
							<text v-if="member.assets == ''" class="label">房车</text>
							<text v-else class="input-text">{{member.assets}}</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">籍贯</text>
					<view class="input-wrap" @click="pickNativePlace">
				        <view class="picker-place" v-if="member.nativePlace">
				        	<text class="input-text">{{member.nativePlace}}</text>
				        </view>
						<view class="picker-place" v-else>
							<text class="label">选择</text>
						</view>
				    </view>
				</view>
				<!-- <view class="item-wrap input-row border">
					<text class="label">籍贯</text>
					<view class="input-wrap">
						<picker mode="region" :value="[9,0,0]" @change="bindNativeChange">
							<view class="picker-place">
								<text class="input-text">{{member.nativePlace}}</text>
							</view>
						</picker>
					</view>
				</view> -->
				<view class="item-wrap input-row border">
					<text class="label">家庭</text>
					<view class="input-wrap">
						<picker mode="selector" range-key="name" :range="familyArray" @change="bindFamilyChange">
							<view class="picker-place" v-if="member.family == ''">
								<text class="label">兄弟姐妹</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.family}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="btn-row">
					<button type="primary" :loading="loading" class="primary" @tap="next">下一步</button>
				</view>
				<!-- <view class="skip-wrap">
					<text class="skip label" @click="skip">跳过</text>
				</view> -->
				
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
							<view>
								<text class="label">身高</text>
							</view>
							<view class="input-wrap">
								<text v-if="conceal.height" class="margin-right">不公开</text>
						        <switch color="#7667a5" :checked="conceal.height" @change="switchChange('height', $event)"/>
						    </view>
						</view>
						<view class="item-wrap input-row border">
							<view>
								<text class="label">体重</text>
							</view>
							<view class="input-wrap">
								<text v-if="conceal.weight" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.weight" @change="switchChange('weight', $event)"/>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<view>
								<text class="label">财产</text>
							</view>
							<view class="input-wrap">
								<text v-if="conceal.assets" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.assets" @change="switchChange('assets', $event)"/>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<view>
								<text class="label">籍贯</text>
							</view>
							<view class="input-wrap">
								<text v-if="conceal.nativePlace" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.nativePlace" @change="switchChange('nativePlace', $event)"/>
							</view>
						</view>
						<view class="item-wrap input-row">
							<view>
								<text class="label">家庭</text>
							</view>
							<view class="input-wrap">
								<text v-if="conceal.family" class="margin-right">不公开</text>
								<switch color="#7667a5" :checked="conceal.family" @change="switchChange('family', $event)"/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<mpvue-picker ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :themeColor="picker.themeColor" :pickerValueDefault="picker.valueDefault" @onConfirm="doPick" :pickerValueArray="picker.valueArray"></mpvue-picker>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '@/components/m-input-right.vue'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
	// import region from '@/static/data/region.js'
	import category from '@/static/data/category.js'
	import jobIndustryData from '@/static/data/job-industry.js'
	import cityData from '@/components/mpvue-picker/city-data/city.data.js'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput,mpvuePicker},
		data() {
			return{
				picker:{
					mode:'multiLinkageSelector',
					deepLength:2,
					valueDefault: [9,0], // 初始化值
					valueArray: cityData, // picker 数组值
					name: 'region',
					themeColor: '', // 颜色主题
				},
				loading:false,
				showConceal:false,
				concealChecked:false,
				conceal:{
					height:false,
					weight:false,
					income:false,
					assets:false,
					family:false,
					nativePlace:false
				},
				member:{
					height:'',
					weight:'',
					assets:'',
					family:'',
					nativePlace:'南京市',
					nativePlaceValue:'9,0'
				},	
				assetsArray:category.assets,
				familyArray: category.family
			}
		},
		computed: {
			...mapState(['account','target']),
			...mapGetters(['agentMember'])
		},
		methods:{
			...mapMutations(['targetMember']),
			toggle:function(){
				this.showConceal = !this.showConceal;
			},
			hide:function(){
				this.showConceal = false;
			},
			switchChange:function(attr, e){
				this.conceal[attr] = e.target.value;
			},
			switchChangeAll:function(e){
				this.concealChecked = e.target.value;
				this.conceal.height = e.target.value;
				this.conceal.weight = e.target.value;
				this.conceal.assets = e.target.value;
				this.conceal.family = e.target.value;
				this.conceal.nativePlace = e.target.value;
			},
			checkNumber:function(num){
				var re = /^[0-9]+$/;
				return re.test(num)
			},
			verify:function(){
				if (this.member.height == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的身高'
				    });
				    return;
				}else if(!this.checkNumber(this.member.height)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写有效的身高'
					});
					return;
				}
				if (this.member.weight == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的体重'
				    });
				    return;
				}else if(!this.checkNumber(this.member.weight)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写有效的体重'
					});
					return;
				}
				if (this.member.assets == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的财产'
				    });
				    return;
				}
				if (this.member.family == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的家庭'
				    });
				    return;
				}
				return true;
			},
			next:function(){
				if(this.verify()){
					let that = this;
					this.member.conceal = JSON.stringify(this.conceal);
					console.log(this.member);
					this.targetMember(this.member);
					uni.navigateTo({
						url:'work'
					});
				}
			},
			skip:function(){
				uni.showModal({
					title: '提示',
					content: '完善的个人信息有助于提高成功几率哦~。确定跳过？',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:'work'
							});
						} 
					}
				});
			},
			pickNativePlace: function(){
				this.$refs.mpvuePicker.show();
			},
			doPick(e) {
				this.picker.valueDefault = e.index;
				this.member.nativePlaceValue = e.index[0] + ',' + e.index[1];
				this.member.nativePlace = this.picker.valueArray[e.index[0]].children[e.index[1]].label;
			},
			bindAssetsChange: function(e) {
				this.member.assets = this.assetsArray[e.target.value].name;
			},
			bindNativeChange:function(e){
				this.member.nativePlace = e.target.value[1];
			},
			bindFamilyChange: function(e) {
				// this.member.familyCode = this.familyArray[e.target.value].key;
				this.member.family = this.familyArray[e.target.value].name;
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
		onLoad() {
			Object.assign(this.member, this.target.member);
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
	.input-wrap text{
	    font-size:18px;
	}
	.picker-place{
		min-width:500upx;
		display: flex;
		justify-content: flex-end;
	}
	.input-text {
	    font-size:18px;
		font-weight: bold;
	}
	.m-input-input {
		padding-right: 0upx;
		font-size:18px;
	}
	.skip-wrap{
		display: flex;
		justify-content: center;
		margin-top: 30upx;
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
