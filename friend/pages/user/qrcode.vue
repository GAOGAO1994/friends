<template>
	<view class="content">
		<view class="padding-l">
			<!-- <view class="header">
				<text>二维码</text>
			</view> -->
			
			<view class="avatar-wrap">
				<image mode="scaleToFill" :src="member.avatarUrl"></image>
				<text class="name">{{member.nickname}}</text>
			</view>
			
			<view class="logo-wrap">
				<image v-if="qrcode != ''" class="qrcode" mode="scaleToFill" :src="qrcode"></image>
				<f-icon v-else color="#909090" size="64" type="qrcode"></f-icon>
				<text class="text">您的专属二维码，分享给朋友吧</text>
			</view>
			
		</view>	
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState, mapGetters} from 'vuex'
	
	export default {
		components: {fIcon},
		data() {
			return{
				member:{
					id:0,
					name:'',
					avatarUrl:''
				},
				// qrcode:'data:image/jpeg;base64,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',
				qrcode:''
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			enter:function(url){
				uni.navigateTo({
					url:'../statement/'+url
				})
			},
			getQrcode:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'account/qrcode',
					method:'POST',
					data:{
						id:this.agentMember.id,
						accountId:this.account.id
					},
					success(res) {
						if(that.$http.success(res)){
							that.qrcode = 'data:image/jpeg;base64,'+res.data.msg.replace(/[\r\n]/g, "");
							console.log(that.qrcode);
						}
					}
				})
			}
		},
		onLoad() {
			Object.assign(this.member, this.agentMember);
			this.getQrcode();
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.header{
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.header text{
		color: black;
	}
	
	.avatar-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 80upx;
	}
	.avatar-wrap image{
		width: 200upx;
		height: 200upx;
		border-radius: 100upx;
	}
	.avatar-wrap .name{
		margin-top: 20upx;
	}
	
	.logo-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo-wrap .qrcode{
		width: 520upx;
		height: 520upx;
		margin-top:20upx;
	}
	.logo-wrap .title{
		font-size:18px;
		font-weight:900;
		margin-top:60upx;
	}
	.logo-wrap .text{
		margin-top:20upx;
	}
	
	.list{
		position: relative;
		margin-top: 40upx;
	}
	.list .item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		position: relative;
	}
	.list .border::after {
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
	.list .item .left{
		display: flex;
	}
	.list .item .left text{
		margin-left: 20upx;
		font-size: 16px;
	}
	.list .item .right{
		margin-right: 20upx;
	}
	
	.copy-right{
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 24px;
		margin-top: 100upx;
	}
	
</style>
