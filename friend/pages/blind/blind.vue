<template>
	<view class="content">
		<view class="padding-h">			
			<!-- <view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view> -->
			<view class="header">
				<text class="">您为谁相亲</text>
			</view>
		</view>
		
		<view>	
			<view class="banner">
				<image mode="scaleToFill" :src="barnnerImg" @click="enterEverybody"></image>
			</view>
			
			<view class="button-wrap">
				<view class="button-box" v-for="(menu, index) in menus" @click="bindClick(menu)">
					<view class="button-box-inner">
						<text :class="{checked:menu.checked}">{{menu.name}}</text>
					</view>
				</view>
			</view>
		</view>
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, loginModal},
		data() {
			return{
				barnnerImg:this.$http.imgPath + "manage/matchmaker-2.png",
				showLogin:false,
				menus:[{
					name:'为自己',
					purpose:'self',
					checked:false
				},{
					name:'为子女',
					purpose:'children',
					checked:false
				}/* ,{
					name:'为朋友',
					purpose:'friend',
					checked:false
				},{
					name:'为父母',
					purpose:'parent',
					checked:false
				} *//* ,{
					name:'人人红娘',
					purpose:'everybody',
					checked:false
				} */]
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['purposes'])
		},
		methods:{
			...mapMutations(['redirect']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			hasPurpose:function(purpose){
				let b = false;
				this.purposes.forEach(item =>{
					if(purpose == item)b = true;
				})
				return b;
			},
			bindClick:function(menu){
				if(this.hasLogin){
					// if(menu.checked)return;
					if(menu.purpose == 'self' || menu.purpose == 'children'){
						if(this.hasPurpose(menu.purpose)){
							uni.showModal({
								title:'提示',
								content: '您已经注册绑定，请不要重复绑定。',
								showCancel:false
							})
						}else{
							uni.navigateTo({
								url:'self?purpose='+menu.purpose
							})
						}
					}
					else if(menu.purpose == 'everybody'){
						if(this.hasPurpose(menu.purpose)){
							uni.showModal({
								title:'提示',
								content: '您已经注册人人红娘，请不要重复注册。',
								showCancel:false
							})
						}else{
							uni.navigateTo({
								url:'everybody?purpose='+menu.purpose
							})
						}
					}else{
						uni.navigateTo({
							url:'self?purpose='+menu.purpose
						})
					}
				}else{
					this.redirect('/pages/blind/blind');
					this.showLogin = true;
				}
			},
			enterEverybody:function(){
				uni.navigateTo({
					url:'everybodyIntro'
				})
			}
		},
		onShow() {
			if(this.hasLogin){
// 				this.purposes.forEach(item =>{
// 					this.menus.forEach(menu =>{
// 						if(menu.purpose == item){
// 							menu.checked = true;
// 						}
// 					})
// 				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.header text{
		color: black;
	}
	.banner{
		
	}
	.banner image{
		width: 750upx;
		height: 269upx
	}
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
	.checked{
		font-weight: 900;
		background: linear-gradient(to right, #00c0ff, #7558ff); /* 标准的语法 */
		-webkit-background-clip: text;
		color: transparent;
	}
	
</style>
