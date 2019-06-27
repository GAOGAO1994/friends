<template>
	<view class="content">
		<view class="padding-l">	
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="black" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text>设置</text>
			</view>
			
			<view class="list">
				<view class="item border" @click="enter('/pages/user/qrcode')">
					<view class="left">
						<f-icon type="qrcode" color="#fe8dc8" size="28"></f-icon>
						<text>二维码</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>	
				<view class="item border" @click="enter('/pages/user/feedback')">
					<view class="left">
						<f-icon type="edit" color="#fe8dc8" size="28"></f-icon>
						<text>意见反馈</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>
				<view class="item border" @click="enter('/pages/user/about')">
					<view class="left">
						<f-icon type="about" color="#fe8dc8" size="28"></f-icon>
						<text>关于</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>	
				<view class="item border" @click="exit">
					<view class="left">
						<f-icon type="exit" color="#fe8dc8" size="28"></f-icon>
						<text>退出</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>	
				<view class="item" @click="enter('/pages/manage/manage')" v-if="isAdmin">
					<view class="left">
						<f-icon type="exit" color="#fe8dc8" size="28"></f-icon>
						<text>管理</text>
					</view>
					<view class="right">
						<f-icon type="arrow-right" color="#dcdcdc" size="28"></f-icon>
					</view>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon},
		data() {
			return{
				roles:[]
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['agentMember']),
			isAdmin:function(){
				for(let i=0; i<this.roles.length; i++){
					if(this.roles[i].role == 'admin'){
						return true;
					}
				}
				return false;
			}
		},
		methods:{
			...mapMutations(['logout']),
			exit:function(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确定退出应用？',
					success: function (res) {
						if (res.confirm) {
							that.logout();
							uni.reLaunch({
								url:'/pages/index/index'
							})
						} 
					}
				});
			},
			enter:function(url){
				uni.navigateTo({
					url:url
				})
			},
			getAccountRole:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/account-role/list',
					method:'POST',
					data:{
						status:'1',
						accountId:this.account.id
					},
					success(res) {
						if(that.$http.success(res)){
							that.roles = res.data.data;
						}
					}
				})
			}
		},
		onLoad() {
			if(this.hasLogin){
				this.getAccountRole();
			}
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
	
	.list{
		margin-top: 20upx;
		position: relative;
	}
	.list .item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx 0;
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
	
</style>
