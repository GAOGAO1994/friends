<template>
	<view class="content">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="left">成为VIP会员</text>
				<view class="right" @click="toggle()">
					<f-icon type="conceal" color="#8F8F94" size="32"></f-icon>
				</view>
			</view>
			
			<view class="">
				<view class="item-wrap input-row border">
					<text class="label">身高cm</text>
					<view class="input-wrap">
				        <m-input class="m-input" type="text" clearable v-model="theForm.height" placeholder=""></m-input>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">体重kg</text>
					<view class="input-wrap">
						<m-input class="m-input" type="text" clearable v-model="theForm.weight" placeholder=""></m-input>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">收入</text>
					<view class="input-wrap">
						<picker :range="category.income" @change="bindIncomeChange">
							<text v-if="theForm.income == ''" class="label">年薪</text>
							<text v-else class="input-text">{{theForm.income}}</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">财产</text>
					<view class="input-wrap">
						<picker :range="assetsArray" @change="bindAssetsChange">
							<text v-if="theForm.assets == ''" class="label">房车</text>
							<text v-else class="input-text">{{theForm.assets}}</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">籍贯</text>
					<view class="input-wrap">
						<picker mode="region" @change="bindNativeChange">
							<view class="picker-place">
								<text class="input-text">{{theForm.nativePlace}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">家庭</text>
					<view class="input-wrap">
						<picker mode="selector" range-key="name" :range="familyArray" @change="bindFamilyChange">
							<view class="picker-place" v-if="theForm.family == ''">
								<text class="label">兄弟姐妹</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{theForm.family}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">身份证号</text>
					<view class="input-wrap">
						<m-input class="m-input" type="text" clearable v-model="theForm.idNumber" placeholder=""></m-input>
					</view>
				</view>
				<view class="btn-row">
					<button type="primary" :loading="loading" class="primary" @tap="next">下一步</button>
				</view>
			</view>
			
			<view v-if="showConceal" class="conceal-wrap">
				<view class="mask" @click="hide()"></view>
				<view class="container">
					<view class="conceal-content">
						<view class="conceal-header">
							<text class="left">设置隐私（打开的状态为不公开）</text>
							<view class="right">
								<switch color="#7667a5" @change="switchChange"/>
								<text class="label">全选</text>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">身高</text>
							<view class="input-wrap">
						        <switch color="#7667a5" :checked="conceal.height" @change="switchChangeHeight"/>
						    </view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">体重</text>
							<view class="input-wrap">
								<switch color="#7667a5" :checked="conceal.weight" @change="switchChangeWeight"/>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">收入</text>
							<view class="input-wrap">
								<switch color="#7667a5" :checked="conceal.income" @change="switchChangeIncome"/>
							</view>
						</view>
						<view class="item-wrap input-row border">
							<text class="label">财产</text>
							<view class="input-wrap">
								<switch color="#7667a5" :checked="conceal.assets" @change="switchChangeAssets"/>
							</view>
						</view>
						<!-- <view class="item-wrap input-row border">
							<text class="label">籍贯</text>
							<view class="input-wrap">
								<switch color="#7667a5" @change="switchChange"/>
							</view>
						</view> -->
						<view class="item-wrap input-row border">
							<text class="label">家庭</text>
							<view class="input-wrap">
								<switch color="#7667a5" :checked="conceal.family" @change="switchChangeFamily"/>
							</view>
						</view>
						<view class="item-wrap input-row">
							<text class="label">身份</text>
							<view class="input-wrap">
								<switch checked="true" disabled="true" :checked="conceal.idNumber" color="#7667a5" @change="switchChangeIdNumber"/>
							</view>
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
	import mInput from '@/components/m-input-right.vue'
	import category from '@/static/data/category.js'
	import mpWeixin from '@/static/data/mp-weixin.js';
	import {mapState,mapGetters} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput},
		data() {
			return{
				loading:false,
				showConceal:false,
				conceal:{
					height:false,
					weight:false,
					income:false,
					assets:false,
					family:false,
					nativePlace:false,
					idNumber:true
				},
				theForm:{
					id:0,
					height:'',
					weight:'',
					income:'',
					incomeGrade:0,
					assets:'',
					family:'',
					nativePlace:'南京',
					idNumber:''
				},
				assetsArray:['有房有车','有房','有车','计划购房'],
				familyArray: [{
					'key':'single',
					'name':'独生子女'
				},{
					'key':'multiple',
					'name':'非独生子女'
				}]
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			toggle:function(){
				this.showConceal = !this.showConceal;
			},
			hide:function(){
				this.showConceal = false;
			},
			switchChangeHeight:function(e){
				this.conceal.height = e.target.value;
			},
			switchChangeWeight:function(e){
				this.conceal.weight = e.target.value;
			},
			switchChangeIncome:function(e){
				this.conceal.income = e.target.value;
			},
			switchChangeAssets:function(e){
				this.conceal.assets = e.target.value;
			},
			switchChangeFamily:function(e){
				this.theForm.family = e.target.value;
			},
			switchChangeIdNumber:function(e){
				this.conceal.idNumber = e.target.value;
			},
			switchChange:function(e){
				this.conceal.height = e.target.value;
				this.conceal.weight = e.target.value;
				this.conceal.income = e.target.value;
				this.conceal.assets = e.target.value;
				this.conceal.family = e.target.value;
				this.conceal.idNumber = e.target.value;
			},
			checkNumber:function(num){
				var re = /^[0-9]+$/;
				return re.test(num)
			},
			verify:function(){
				if (this.theForm.height == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的身高'
				    });
				    return;
				}else if(!this.checkNumber(this.theForm.height)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写有效的身高'
					});
				}
				if (this.theForm.weight == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的体重'
				    });
				    return;
				}else if(!this.checkNumber(this.theForm.weight)){
					uni.showToast({
					    icon: 'none',
					    title: '请填写有效的体重'
					});
				}
				if (this.theForm.income == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的收入'
				    });
				    return;
				}
				if (this.theForm.assets == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的财产'
				    });
				    return;
				}
				if (this.theForm.family == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的家庭'
				    });
				    return;
				}
				if (this.theForm.idNumber == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请填写您的身份证号'
				    });
				    return;
				}
				return true;
			},
			next:function(){
				if(this.verify()){
					let that = this;
					this.theForm.conceal = JSON.stringify(this.conceal);
					console.log(this.theForm);
					uni.request({
						url: this.$http.contextPath + 'base/member/updateById',
						method:'POST',
						data:this.theForm,
						success(res) {
							if(that.$http.success(res)){
								//跳转支付
								that.weixinPay();
							}
						}
					})
				}
			},
			bindIncomeChange:function(e){
				this.theForm.incomeGrade = e.target.value;
				 this.theForm.income = this.category.income[e.target.value];
			},
			bindAssetsChange: function(e) {
				this.theForm.assets = this.assetsArray[e.target.value];
			},
			bindNativeChange:function(e){
				this.theForm.nativePlace = e.target.value[1];
			},
			bindFamilyChange: function(e) {
				// this.theForm.familyCode = this.familyArray[e.target.value].key;
				this.theForm.family = this.familyArray[e.target.value].name;
			},
			weixinPay: function(){
                console.log("发起支付");
				this.loading = true;
                uni.login({
                    success: (e) => {
						uni.request({
							url: mpWeixin.openIdUrl + e.code,
							method: 'GET',
							success: (sess) =>{
								console.log("获取openId");
								console.log(sess.data.openid);
								//
								
								uni.request({
								    url: mpWeixin.orderUrl, //统一下单
									method:'POST',
									 header: {
										"Content-Type": "application/x-www-form-urlencoded"  // 默认值
									},
									data:{
										body: '报名费',
										total_fee: 1,
										trade_type: 'JSAPI',
										openid: sess.data.openid
										//openId:'oVhUf0V3pL4kY3d4up176qCvBHmM',
										// out_trade_no: "test"+String.valueOf(new Date().getTime())
									},
								    success: (res) => {
								        console.log("pay request success", res);
								        if (res.statusCode !== 200) {
								            uni.showModal({
								                content: "支付失败，请重试！",
								                showCancel: false
								            });
								            return;
								        }
										uni.requestPayment({
										    timeStamp: res.data.timeStamp,
										    nonceStr: res.data.nonceStr,
										    package: res.data.package,
										    signType: 'MD5',
										    paySign: res.data.paySign,
										    success: (res) => {
										        uni.navigateBack({});
										    },
										    fail: (res) => {
										        uni.showModal({
										            content: "支付失败,原因为: " + res
										                .errMsg,
										            showCancel: false
										        })
										    },
										    complete: () => {
										        this.loading = false;
										    }
										})
// 								        if (res.data.result_code == 'SUCCESS') {
// 								            
// 								        } else {
// 								            uni.showModal({
// 								                content: res.data.return_msg,
// 								                showCancel: false
// 								            })
// 								        }
								    },
								    fail: (e) => {
								        console.log("fail", e);
								        his.loading = false;
								        uni.showModal({
								            content: "支付失败,原因为: " + e.errMsg,
								            showCancel: false
								        })
								    }
								})
							}
						});
                    },
                    fail: (e) => {
                        console.log("fail", e);
						this.loading = false;
                        uni.showModal({
                            content: "支付失败,原因为: " + e.errMsg,
                            showCancel: false
                        })
                    }
                })
            }
		},
		onLoad() {
			this.theForm.id = this.agentMember.id;
		}
	}
</script>

<style>
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
