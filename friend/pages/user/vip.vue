<template>
	<view class="content mvpue-picker">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="black" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text>会员中心</text>
			</view>
		</view>	
			
		<view class="padding-h">		
			<view class="notify">
				<image class="discount" mode="scaleToFill" src="../../static/img/discount.png"></image>
				<view class="split">|</view>
				<view class="text">加入会员，享受更多贴心服务！</view>
			</view>
			
			<view class="tab-wrap">
				<view class="tab">一对一约见</view>
			</view>
			<view class="tab-content">
				<view class="box-wrap" v-for="(item,index) in appointments" :class="{last:index===appointments.length-1}">
					<view class="box" :class="{picked:item.picked, disabled:item.disabled}" @click="pick(appointments,item,index)">
						<view class="title">{{item.title}}</view>
						<view class="price-wrap">
							<view class="price">￥{{item.price}}</view>
							<view class="split">/</view>
							<view class="num" v-if="item.num > 1">{{item.num}}</view>
							<view class="unit">{{item.unit}}</view>
						</view>
						<view class="tag-price">{{item.tagPrice}}</view>
						<view class="save">{{item.save}}</view>
					</view>
					<view v-if="item.tip" class="tip">超值</view>
				</view>
			</view>
			
			<view class="tab-wrap">
				<view class="tab">相亲活动</view>
			</view>
			<view class="tab-content">
				<view class="box-wrap" v-for="(item,index) in activities" :class="{last:index===activities.length-1}">
					<view class="box" :class="{picked:item.picked, disabled:item.disabled}" @click="pick(activities,item,index)">
						<view class="title">{{item.title}}</view>
						<view class="price-wrap">
							<view class="price">￥{{item.price}}</view>
							<view class="split">/</view>
							<view class="num" v-if="item.num > 1">{{item.num}}</view>
							<view class="unit">{{item.unit}}</view>
						</view>
						<view class="tag-price">{{item.tagPrice}}</view>
						<view class="save">{{item.save}}</view>
					</view>
					<view v-if="item.tip" class="tip">超值</view>
				</view>
			</view>
			
			<button class="primary submit" @click="submit">立即开通</button>
			
			<view class="statement">
				<navigator url="/pages/statement/serviceAgreement"><text class="label">开通即表明您同意我们的</text><text class="link">服务条款</text></navigator>
			</view>
			
		</view>
		
		<view class="bottom-space"></view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mpWeixin from '@/static/data/mp-weixin.js';
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {fIcon},
		data() {
			return{
				from:'',
				outTradeNo:'',
				appointments:[{
					title:'非会员',
					price:100,
					num:1,
					unit:'人',
					tagPrice:'￥100',
					save:'无优惠',
					tip:false,
					picked:false,
					disabled:true
				},{
					title:'月会员',
					price:380,
					num:5,
					unit:'人',
					tagPrice:'￥500',
					save:'立省120元',
					tip:false,
					picked:true,
					disabled:false
				},{
					title:'年会员',
					price:1314,
					num:20,
					unit:'人',
					tagPrice:'￥2000',
					save:'立省686元',
					tip:true,
					picked:false,
					disabled:false
				}],
				activities:[{
					title:'非会员',
					price:100,
					num:1,
					unit:'场',
					tagPrice:'￥100',
					save:'无优惠',
					tip:false,
					picked:false,
					disabled:true
				},{
					title:'月会员',
					price:380,
					num:5,
					unit:'场',
					tagPrice:'￥500',
					save:'立省120元',
					tip:false,
					picked:true,
					disabled:false
				},{
					title:'年会员',
					price:1314,
					num:20,
					unit:'场',
					tagPrice:'￥2000',
					save:'立省686元',
					tip:true,
					picked:false,
					disabled:false
				}]
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			//...mapMutations(['saveMemberTags']),
			pick:function(list, item, index){
				if(index == 0)return;
				if(item.picked){
					item.picked = false;
					return;
				}
				list.forEach(entity=>{
					if(entity.picked){
						entity.picked = false;
					}
				})
				item.picked = true;
			},
			getOrderData:function(){
				let items = [];
				let total = 0;
				this.appointments.forEach(entity=>{
					if(entity.picked){
						items.push({
							serviceName:'appointment',
							num:entity.num,
							subtotal:entity.price
						});
						total += entity.price;
					}
				})
				this.activities.forEach(entity=>{
					if(entity.picked){
						items.push({
							serviceName:'activity',
							num:entity.num,
							subtotal:entity.price
						});
						total += entity.price;
					}
				})
				return {
					memberId:this.agentMember.id,
					accountId:this.account.id,
					agentAccountId:this.agentMember.agentAccountId,
					total:total*100,					//转化为分
					items:JSON.stringify(items)
				}
			},
			submit:function(){
				let data = this.getOrderData();
				if(data.total == 0){
					uni.showToast({
						icon:'none',
						title:'请选择开通的会员'
					})
					return;
				}
				
				//测试代码
				data.total = 1;
				
				//先保存，返回商户订单号
				this.preSaveOrder(data);
			},
			preSaveOrder:function(data){	//预先保存会员订单
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/order/save',
					method:'POST',
					data:data,
					success(res) {
						if(that.$http.success(res)){
							that.outTradeNo = res.data.data.outTradeNo;
							// #ifdef  H5
							window.location.href = that.$http.contextPath + 'payment/common/index?outTradeNo='+res.data.data.outTradeNo
							// #endif
							// #ifndef  H5
							uni.navigateTo({
								url:'/pages/payment/payment?from='+that.from+'&outTradeNo='+res.data.data.outTradeNo
							})
							// #endif
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '下单失败，请稍后再试'
							});
						}
					}
				})
			},
			saveOrder:function(data, outTradeNo){	//支付成功后，保存会员订单
				let that = this;
				that.outTradeNo = outTradeNo;
				data.outTradeNo = outTradeNo;
				uni.request({
					url:this.$http.contextPath + 'member/order/save',
					method:'POST',
					data:data,
					success(res) {
						if(that.$http.success(res)){
							uni.showModal({
								title: '提示',
								content: '支付成功！请确认返回',
								showCancel:false,
								success: function (res) {
									if (res.confirm) {
										uni.navigateBack();
									} 
								}
							})
							// window.location.href = that.$http.contextPath + 'payment/common/index?outTradeNo='+res.data.data.outTradeNo
						}else{
							uni.showToast({
							    icon: 'none',
							    title: '下单失败，请稍后再试'
							});
						}
					}
				})
			},
			payment:function(data){
				console.log("发起支付");
				let that = this;
				uni.login({
					success: (e) => {
						uni.request({
							url: mpWeixin.openIdUrl + e.code,
							method: 'GET',
							success: (sess) =>{
								console.log("获取openId");
								console.log(sess.data.openid);
								console.log("报名费: " + data.total);
								//
								uni.request({
									url: mpWeixin.orderUrl, //统一下单
									method:'POST',
									 header: {
										"Content-Type": "application/x-www-form-urlencoded"  // 默认值
									},
									data:{
										body: '阅见会员费',
										total_fee: data.total,
										trade_type: 'JSAPI',
										openid: sess.data.openid
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
											success: () => {
												that.saveOrder(data, res.data.out_trade_no);
											},
											fail: (res) => {
												uni.showModal({
													content: "支付失败,原因为: " + res
														.errMsg,
													showCancel: false
												})
											},
											complete: () => {
												// this.loading = false;
											}
										})
									},
									fail: (e) => {
										console.log("fail", e);
										// this.loading = false;
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
						// this.loading = false;
						uni.showModal({
							content: "支付失败,原因为: " + e.errMsg,
							showCancel: false
						})
					}
				})
			},
		},
		onLoad(option) {
			this.from = option.from;
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
	.bottom-space{
		height: 80upx;
	}
	
	.notify{
		display: flex;
		align-items: center;
	}
	.notify .discount{
		width: 119upx;
		height: 29upx;
	}
	.notify .split{
		margin: 0 10upx;
	}
	.tab-wrap{
		display: flex;
		justify-content: center;
		margin-top: 60upx;
		margin-bottom: 40upx;
	}
	.tab-wrap .tab{
		/* border-radius: 60upx;
		background-color: #ded4ff;
		color: #7667a5; */
		font-size: 18px;
		font-weight: 900;
		padding: 15upx 40upx;
	}
	.tab-content{
		display: flex;
		justify-content: center;
	}
	.tab-content .box-wrap{
		position: relative;
		margin-right: 15upx;
	}
	.tab-content .last{
		margin-right: 0;
	}
	.tab-content .box-wrap .box{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx;
		border: 1px solid #d2d2d2;
		border-radius: 20upx;
	}
	.tab-content .box-wrap .picked{
		border: 1px solid #aa72ff;
		background-color: #f2eeff;
	}
	.tab-content .box-wrap .disabled{
		background-color: #f2f2f2;
	}
	.tab-content .box-wrap .box .title{
		font-size: 18px;
		font-weight: 900;
	}
	.tab-content .box-wrap .box .price-wrap{
		display: flex;
		align-items: flex-end;
		color: #7667a5;
		margin: 20upx 0;
	}
	.tab-content .box-wrap .box .price{
		font-size: 20px;
		font-weight: 900;
	}
	.tab-content .box-wrap .box .tag-price{
		font-size: 16px;
		color: #a09fa1;
		text-decoration: line-through;
	}
	.tab-content .box-wrap .box .save{
		border-radius: 80upx;
		color: white;
		background-color: #ded4ff;
		padding: 5upx 20upx;
		margin-top: 20upx;
	}
	.tab-content .box-wrap .tip{
		height: 32upx;
		line-height: 32upx;
		position: absolute;
		top: -16upx;
		right: 20upx;
		color: white;
		font-size:11px;
		border-radius: 30upx;
		padding: 2upx 20upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b);
	}
	
	.submit{
		margin-top: 60upx;
		margin-bottom: 20upx;
	}
	
	.statement{
		display: flex;
		justify-content: center;
	}
	.statement .link{
		text-decoration: underline;
	}
</style>
