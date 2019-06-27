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
				<text>会员推荐</text>
			</view>
		</view>	
			
		<view class="content-wrap" v-if="isAdmin">
			
			<view class="padding-h">
				<view class="search-wrap">
					<view class="input-row">
						<m-input class="m-input" type="text" v-model="mobile" placeholder="输入手机号或昵称"></m-input>
					</view>
					<image mode="scaleToFill" src="../../static/img/icons/icon-search.png" @click="search"></image>
				</view>
			</view>
			
			<view class="list padding-l">
				<view class="item border" v-for="(member,index) in list" @click="viewMember(member)">
					<view class="left">
						<image class="img" mode="scaleToFill" :src="member.avatarUrl"></image>
						<text>{{member.nickname}}</text>
					</view>
					<view class="right">
						<button class="male" @click.stop="check(member)">{{member.recommend == '1'?'取消':'推荐'}}</button>
					</view>
				</view>	
			</view>
		</view>
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon, mInput, loginModal},
		data() {
			return{
				showLogin:false,
				roles:[],
				list:[],
				mobile:''
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
			...mapMutations(['targetMember']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			enter:function(url){
				uni.navigateTo({
					url:url
				})
			},
			viewMember:function(member){
				this.targetMember(member);
				this.enter('/pages/member/detail');
			},
			check:function(member){
				let that = this;
				uni.showModal({
					title: '确定',
					content: '确定执行操作？',
					success: function (res) {
						if (res.confirm) {
							that.update(member);
						} 
					}
				});
			},
			update:function(member){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data:{
						id:member.id,
						recommend:(member.recommend == '1')?'0':'1'
					},
					success(res) {
						if(that.$http.success(res)){
							member.recommend = (member.recommend == '1')?'0':'1';
						}
					}
				})
			},
			search:function(){
				// if(this.mobile == ''){
				// 	uni.showToast({
				// 		icon:'none',
				// 		title:'请输入手机号'
				// 	})
				// 	return;
				// }
				this.getMembers();
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
			},
			getMembers:function(){
				let that = this;
				let data = {
					status:'1'
				};
				if(this.mobile != ''){
					data.mobile = this.mobile;
				}else{
					data.recommend = "1";
				}
				uni.request({
					url:this.$http.contextPath + 'member/simpleQuery',
					method:'POST',
					data:data,
					success(res) {
						if(that.$http.success(res)){
							that.list = res.data.data;
						}
					}
				})
			}
		},
		onLoad() {
			if(this.hasLogin){
				this.getAccountRole();
				this.getMembers();
			}else{
				this.showLogin = true;
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
	
	.search-wrap{
		height: 80upx;
		border-radius: 80upx;
		padding: 0upx 40upx;
		box-shadow: 0 0upx 30upx 2upx #dcdcdc;
		margin: 60upx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.search-wrap image{
		width: 60upx;
		height: 60upx;
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
		align-items: center;
	}
	.list .item .left text{
		margin-left: 20upx;
		font-size: 16px;
	}
	.list .item .img{
		width: 100upx;
		height:100upx;
		border-radius: 50upx;
	}
	.list .item .right{
		margin-right: 40upx;
	}
	.list .item .right .button{
		
	}
	
</style>
