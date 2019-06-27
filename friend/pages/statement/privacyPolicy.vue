<template>
	<view class="content">
		<view class="padding-h">			
			<view class="header">
				<text class="">隐私政策</text>
			</view>
			
			<view class="statement-wrap">
				{{statement}}
			</view>
			
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	export default {
		components: {fIcon},
		data() {
			return{
				statement:''
			}
		},
		methods:{
			
		},
		onLoad() {
			uni.request({
				url: this.$http.contextPath + 'base/company-statement/getOne',
				method: 'POST',
				data:{
					status:'1',
					category:'PrivacyPolicy'
				},
				success: (res) => {
					if(this.$http.success(res)){
						this.statement = res.data.data.statementText;
					}
				}
			})
		}
	}
</script>

<style>

	.header{
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.header text{
		color: black;
	}
	.statement-wrap{
		line-height: 24px;
		padding-bottom: 40upx;
	}
	
	
</style>
