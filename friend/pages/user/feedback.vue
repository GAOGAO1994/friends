<template>
	<view class="content">
		<view class="padding-l">
			<!-- #ifndef H5 -->
			<view class="header">
				<text>意见反馈</text>
			</view>
			<!-- #endif -->
		</view>
		
		<view class="padding-h margin-top">
			<view class="remind">
				<f-icon type="info" color="#fc597b" size="30"></f-icon>	
				<text>感谢您的反馈,我们将不断完善自己</text>
			</view>
			
			<view class="textarea-wrap">
				<textarea maxlength="1000" style="height: 500upx;" v-model="message" placeholder="输入您的反馈意见"/>
			</view>
				
			<view class="submit-wrap">
				<button class="primary" @click="doSubmit">提交</button>
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
				message:''
			}
		},
		computed: {
			...mapGetters(['agentMember'])
		},
		methods:{
			doSubmit:function(){
				if(this.message == ''){
					uni.showToast({
						icon:'none',
						title:'请输入您的反馈意见'
					})
					return;
				}
				if(this.message.length < 5){
					uni.showToast({
						icon:'none',
						title:'反馈意见限定不少于5个字符'
					})
					return;
				}
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/feedback/save',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						accountId:this.agentMember.accountId,
						message:this.message
					},
					success(res) {
						if(that.$http.success(res)){
							uni.showModal({
								title: '提示',
								content: '您的意见已提交,感谢您的反馈。请返回',
								showCancel:false,
								success: function (res) {
									if (res.confirm) {
										uni.navigateBack();
									}
								}
							})
						}
					}
				})
			}
		},
		onLoad() {
			
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
	
	.remind{
		display: flex;
		align-items: center;
	}
	.remind text{
		margin-left: 10upx;
	}
	.textarea-wrap{
		margin: 40upx 0upx;
		display: flex;
	}
	textarea{
		flex-grow: 1;
		border-radius: 15upx;
		border: 1px solid #dcdcdc;
		padding: 20upx;
	}
	
</style>
