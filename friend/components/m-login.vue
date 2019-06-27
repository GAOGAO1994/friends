<template>
	<view class="dialog">
		<view class="close-wrap" @click="close">
			<f-icon type="close" color="#8F8F94" size="28"></f-icon>
		</view>
		
		<view class="oauth-login">
			<view class="other-login">
				<view class="line"></view>
				<text class="text">快速登录</text>
			</view>
		</view>
		<view class="oauth-row">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
			</view>
		</view>
		
		<view class="btn-row">
			<navigator url="/pages/login/login">
				<button type="primary" class="primary" @tap="bindLogin">手机号登录</button>
			</navigator>
		</view>
		<view class="action-row">
			<navigator url="/pages/reg/reg"><text class="primary">注册账号</text></navigator>
		</view>	
		<view class="term">
			<text class="label">登录代表你同意</text>
			<navigator url="/pages/reg/reg"><text class="title">阅见交友服务和隐私条款</text></navigator>
		</view>	
		
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	
	export default {
		components: {
		    fIcon
		},
		data() {
			return {
				providerList: [],
				hasProvider:false
			};
		},
		methods:{
			initProvider() {
			    const filters = ['weixin', 'qq', 'weibo'];
			    uni.getProvider({
			        service: 'oauth',
			        success: (res) => {
			            if (res.provider && res.provider.length) {
			                for (let i = 0; i < res.provider.length; i++) {
			                    if (~filters.indexOf(res.provider[i])) {
			                        this.providerList.push({
			                            value: res.provider[i],
			                            image: '/static/img/logos/' + res.provider[i] + '.png'
			                        });
			                    }
			                }
			                this.hasProvider = true;
			            }
			        },
			        fail: (err) => {
			            console.error('获取服务供应商失败：' + JSON.stringify(err));
			        }
			    });
			},
			oauth(value) {
			    uni.login({
			        provider: value,
			        success: (res) => {
			            uni.getUserInfo({
			                provider: value,
			                success: (infoRes) => {
			                    /**
			                     * 实际开发中，获取用户信息后，需要将信息上报至服务端。
			                     * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
			                     */
			                    //this.toMain(infoRes.userInfo.nickName);
			                }
			            });
			        },
			        fail: (err) => {
			            console.error('授权登录失败：' + JSON.stringify(err));
			        }
			    });
			},
			close(){
				this.$emit("close");
			}
		},
		onLoad() {
		    this.initProvider();
		}
	}
</script>

<style>
	.dialog{
		width:540upx;
		height:540upx;
		background-color: rgba(255,255,255,1);
		position: relative;
		border-radius: 15upx;
		padding-top: 80upx;
		padding-left: 40upx;
		padding-right: 40upx;
		padding-bottom: 40upx;
		display: flex;
		flex-direction: column;
	}
	.close-wrap{
		position:absolute;
		top: 10upx;
		right: 10upx;
		padding: 10upx;
	}
	
	.oauth-login{
		width: 100%;
		align-self: flex-end;
	}
	.other-login{
		position: relative;
		height: 50upx;
		margin: 0 40upx;
	}
	.other-login .text {
		color:#8F8F94;
		position: absolute;
		width:180px;
		line-height: 50upx;
		left: 0px;
		right: 0px;
		top: 0px;
		background-color: #FFFFFF;
		margin: auto;
		text-align: center;
	}
	.other-login .line{
		position: absolute;
		width:100%;
		height: 1upx;
		left: 0px;
		top: 25upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	
	.oauth-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;   
	    width: 100%;
		padding-top:50px;
	}
	
	.oauth-image {
	    width: 100px;
	    height: 100px;
	    border-radius: 100px;
	    margin: 0 40px;
		background-color: #ffffff;
		box-shadow:5px 5px 30px 5px #efecf4;
	}
	
	.oauth-image image {
	    width: 60px;
	    height: 60px;
	    margin: 20px;
	}
	
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
		margin-top: 20upx;
	}
	
	.term{
		display: flex;
		flex-direction: row;
		justify-content: center;
		position:absolute;
		bottom: 40upx;
		font-size: 0.9em;
	}
	.term .label{
		color: #8F8F94;
	}
	.term .title{
		font-weight: bold;
		text-decoration: underline;
	}
</style>
