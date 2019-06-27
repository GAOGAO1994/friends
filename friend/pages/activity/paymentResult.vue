<template>
	<view class="content">
		<view>支付结果</view>
		<view class="padding-h margin-top">
			<button class="primary" @click="doSubmit">立即支付</button>
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'

	export default {
		components: {fIcon},
		data() {
			return{
				payType:'wxpay',
				activity:{
					id:0,
					entryFee:0
				},
				member:{
					
				},
				
			}
		},
		computed: {
			
		},
		methods:{
			radioChange: function(evt) {
				this.payType = evt.target.value;
			},
			doSubmit:function(){
				if(this.payType == 'alipay'){
					uni.navigateTo({
						url:'alipay'
					})
				}else if(this.payType == 'wxpay'){
					uni.navigateTo({
						url:'wxpay'
					})
				}
			}
		},
		onLoad(option) {
			
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
	.row-wrap{
		display: flex;
		align-items: center;
	}
	.row-wrap text{
		margin-left: 20upx;
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
