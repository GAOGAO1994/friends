<template>
	<view class="content">
		<view class="padding-h">
			<view class="header">
				<text class="">您为谁相亲</text>
			</view>
			
			<view class="button-wrap">
				<view class="button-box" v-for="(menu, index) in menus" @click="bindClick(menu.path)">
					<view class="button-box-inner">
						<text>{{menu.name}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input.vue'
	
	export default {
		components: {mIcon, fIcon, mInput},
		data() {
			return{
				menus:[{
					name:'为自己',
					path:'/pages/blind/self'
				},{
					name:'为子女',
					path:'/pages/blind/children'
				},{
					name:'为朋友',
					path:'/pages/blind/friend'
				},{
					name:'为父母',
					path:'/pages/blind/parent'
				}]
			}
		},
		computed: {
			
		},
		methods:{
			bindClick:function(path){
				uni.navigateTo({
					url:path
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.button-wrap{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 80upx;
		margin-top: 80upx;
	}
	.button-wrap .button-box{
		width: 45%;
		margin-bottom: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-wrap .button-box-inner{
		width: 200upx;
		height: 200upx;
		border-radius: 100upx;
		box-shadow: 0px 0px 30upx 5upx #dcdcdc;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	
</style>
