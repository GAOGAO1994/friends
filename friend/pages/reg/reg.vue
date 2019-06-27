<template>
    <view class="content">
        <view class="title-nav">
			<text class="text">注册</text>
			<image class="image-content" mode="widthFix" :src="bg" ></image>
			<!-- <image class="image-content" mode="widthFix" src="../../static/img/login/register-bg.png" ></image> -->
		</view>
		
		<view class="content padding">
			<view class="input-group">
				<!-- #ifdef APP-PLUS -->
				<view class="input-row border">
					<text class="title">昵称：</text>
					<m-input class="m-input" type="text" clearable v-model="nickname" placeholder="请输入昵称"></m-input>
				</view>
				<!-- #endif -->
				<view class="input-row border">
					<text class="title">手机号：</text>
					<m-input class="m-input" type="text" v-model="mobile" placeholder="请输入手机号"></m-input>
				</view>
				<view class="input-row border">
					<text class="title">密码：</text>
					<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
				</view>
				<!-- <view class="input-row border">
					<text class="title">重复密码：</text>
					<m-input type="password" displayable v-model="passwordRepeat" placeholder="请重复输入密码"></m-input>
				</view> -->
				<view class="input-row border">
					<text class="title">验证码：</text>
					<m-input class="m-input" type="text" v-model="code" placeholder="请输入验证码"></m-input>
					<text v-if="!shortCodeBtn.disabled" class="link active" @click="getShortCode">点击获取验证码</text>
					<text v-else class="link label">倒计时:{{shortCodeBtn.countdown}}</text>
				</view>
			</view>
			
			<view class="btn-row">
				<!-- #ifdef MP-WEIXIN -->
				<button type="primary" class="primary" open-type="getUserInfo" @getuserinfo="getuserinfo">确定</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<button type="primary" class="primary" @tap="bindRegister">确定</button>
				<!-- #endif -->
			</view>
			<view class="action-row">
				<navigator url="../login/login">已注册，登录</navigator>
			</view>	
			<view class="statement">
				<text class="label">注册代表你同意</text>
				<navigator url="/pages/statement/serviceAgreement"><text class="link">服务条款</text></navigator>
				<text class="label">和</text>
				<navigator url="/pages/statement/privacyPolicy"><text class="link">隐私政策</text></navigator>
			</view>
				
		</view>
		
		<view class="oauth-login" v-if="hasProvider">
			<view class="other-login">
				<view class="line"></view>
				<text class="text">快速注册</text>
			</view>
			<view class="oauth-row">
				<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
					<view v-if="provider.value == 'weixin'">
						<!-- #ifdef MP-WEIXIN -->
						<button class="oauth-button" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true"></button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<image :src="provider.image" @tap="oauth(provider.value)"></image>
						<!-- #endif -->
					</view>
					<view v-else>
						<image :src="provider.image" @tap="oauth(provider.value)"></image>
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
	import mpWeixin from '@/static/data/mp-weixin.js';
    import mInput from '../../components/m-input.vue';
	import {mapState, mapMutations} from 'vuex'
	
    export default {
        components: {mInput},
        data() {
			return {
				bg:this.$http.imgPath + "manage/register-bg.png",
			    providerList: [],
			    hasProvider: false,
				provider:'',
				openId:'',
			    nickname: '',
				avatarUrl:'',
				mobile: '',
				code: '',
			    password: '',
			    passwordRepeat: '',
				shortCodeBtn:{
					disabled:false,
					countdown:0			//倒计时
				},
				shortCode:{},
				submitBtn:{disabled:false}
			}
        },
		computed: {
			...mapState(['shareFrom'])
		},
        methods: {
			...mapMutations(['register']),
			getShortCode:function(){
				if (this.mobile.length != 11) {
				    uni.showToast({
				        icon: 'none',
				        title: '手机号有误'
				    });
				    return;
				}
				//
				let interval = 0;
				setTimeout(() => { 
					this.shortCodeBtn.disabled = false;
					if(interval > 0){
						clearInterval(interval);
					}
				}, 60000)
				
				if(this.shortCodeBtn.disabled){
					return;
				}else{
					this.shortCodeBtn.disabled = true;
					this.shortCodeBtn.countdown = 60;
					interval = setInterval(() =>{
						this.shortCodeBtn.countdown--;
					}, 1000)
					
				}
				
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'account/sendShortCode',
					method: 'POST',
					data:{
						mobile:this.mobile
					},
					success: (res) => {
						if(that.$http.success(res)){
							that.shortCode = res.data.data;
							uni.showToast({
								duration:3000,
								title:'验证码：'+that.shortCode.code
							})
						}
					}
				})
			},
			verify(){
				// #ifdef  APP-PLUS	
				if (this.nickname.length < 2) {
				    uni.showToast({
				        icon: 'none',
				        title: '昵称最短为 2 个字符'
				    });
				    return;
				}
				// #endif
				if (this.password.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: '密码最短为 6 个字符'
				    });
				    return;
				}
				// if (this.password != this.passwordRepeat) {
				//     uni.showToast({
				//         icon: 'none',
				//         title: '密码不一致'
				//     });
				//     return;
				// }
				if (this.mobile.length != 11) {
				    uni.showToast({
				        icon: 'none',
				        title: '手机号有误'
				    });
				    return;
				}
				//校验手机验证码
				if(!this.verifyCode(this.mobile, this.code)){
					return;
				}
				
				return true;
			},
			verifyCode(mobile, code){
				let title = '';
				if(code == ''){
					title = '请输入验证码';
				}else if(this.shortCode.mobile == mobile && this.shortCode.code == code){
					return true;
				}else{
					title = '验证码有误';
				}
				uni.showToast({
					icon: 'none',
					title:title
				})
				return false;
			},
            bindRegister() {
				if(!this.verify())return;
				
				//
				setTimeout(() => { 
					this.submitBtn.disabled = false;
				}, 1000)
				
				if(this.submitBtn.disabled){
					return;
				}else{
					this.submitBtn.disabled = true;
				}
				
				this.submit();
// 				uni.redirectTo({
// 					url:'mobileVerify?provider=mobile&nickname='+data.nickname+'&mobile='+data.mobile+'&password='+data.password
// 				})
            },
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
			                            image: '../../static/img/logos/' + res.provider[i] + '.png'
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
								console.log(infoRes);
								uni.navigateTo({
									url:'mobileVerify?provider='+value+'&nickname='+infoRes.userInfo.nickName+'&openId='+infoRes.userInfo.openId+"&avatarUrl="+infoRes.userInfo.avatarUrl
								})
			                },
							fail(res) {
								console.log(res);
							}
			            });
			        },
			        fail: (err) => {
			            console.error('授权登录失败：' + JSON.stringify(err));
			        }
			    });
			},
			getuserinfo(res){
				if(!this.verify())return;
				
				let that = this;
				uni.login({
					provider: 'weixin',
					success(e) {
						//获取openID
						uni.request({
							url: mpWeixin.openIdUrl + e.code,
							method: 'GET',
							success: (sess) =>{
								let userInfo = res.detail.userInfo;
								that.provider = 'Weixin';
								that.nickname = userInfo.nickName;
								that.avatarUrl = userInfo.avatarUrl;
								that.openId = sess.data.openid;
								console.log("openId:"+that.openId);
								that.submit();
// 								uni.redirectTo({
// 									url:'mobileVerify?provider=weixin&nickname='+userInfo.nickName+'&openId='+sess.data.openid+"&avatarUrl="+userInfo.avatarUrl
// 								})
							},
							fail(e) {
								uni.showToast({
									title:'获取信息错误'
								})
							}
						})
					},
					fail(e) {
						uni.showToast({
							title:'登陆错误'
						})
					}
				})
			},
			submit:function(){
				//
				let param = {
					nickname:this.nickname,
					password:this.password,
					avatarUrl:this.avatarUrl,
					mobile: this.mobile,
					// fromMemberId:this.shareFrom.memberId,
					fromAccountId:this.shareFrom.accountId
				};
				if(this.openId != ''){
					param['openId'+this.provider] = this.openId;
				}
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'account/register',
					method: 'POST',
					data:param,
					success: (res) => {
						if(that.$http.success(res)){
							that.regSuccess(res.data.data);
						}
					},
					fail: (e) => {
						uni.showToast({
							title:"服务器响应错误"
						})
					}
				})
			},
			regSuccess(account){
				this.register(account);
				uni.showToast({
				    title: '注册成功'
				});
				//跳转登录
				uni.redirectTo({
					url: '../login/login'
				});
			}
        },
		onLoad() {
			// this.initProvider();
		}
    }
</script>

<style>
	.login{
		flex: 1;
		padding:0;
		border: 1px solid blue;
	}
	.title-nav{
		display: flex;
		flex-direction: row;
		justify-content:flex-end;
	}
	.title-nav .text{
		align-self:flex-end;
		margin-bottom:60upx;
		font-size: 32px;
		font-weight: bold;
		flex-grow:1;
		text-align: left;
		padding-left:60upx;
	}
	.title-nav .image-content{
		width: 55%;
	}
	
	.btn-row {
		margin-top: 40upx;	
	    padding: 20upx;
	}
	
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
		color: #7558ff;
		margin-top: 30upx;	
	}
	
	.action-row navigator {
	    color: #007aff;
	    padding: 0 20upx;
	}
	
	.statement{
		display: flex;
		margin-top: 30upx;
		justify-content: center;
	}
	.statement .link{
		text-decoration: underline;
	}
	
	.split-line{
		color:#c8c7cc;
	}
	
	.oauth-login{
		width: 100%;
		align-self: flex-end;
	}
	
	.other-login{
		position: relative;
		height: 16px;
		margin: 0 40upx;
	}
	.other-login .text {
		color:#8F8F94;
		position: absolute;
		width:280upx;
		left: 0;
		right: 0;
		top: 0;
		background-color: #FFFFFF;
		margin: auto;
		text-align: center;
	}
	.other-login .line{
		position: absolute;
		width:100%;
		height: 1upx;
		left: 0;
		top: 6px;
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
		padding-top:50upx;
		padding-bottom:50upx;
	}
	
	.oauth-image {
	    width: 100upx;
	    height: 100upx;
	    border-radius: 100upx;
	    margin: 0 40upx;
		background-color: #ffffff;
		box-shadow:5upx 5upx 30upx 5upx #efecf4;
	}
	.oauth-image image {
	    width: 60upx;
	    height: 60upx;
	    margin: 20upx;
	}
	.oauth-button{
		width: 60upx;
		height: 60upx;
		margin: 20upx;
		background: url(../../static/img/logos/weixin.png) center no-repeat;
		background-size: 100%;
		border: 0;
	}
	/* 去掉自带边框 */
	.oauth-button::after{ border: none;} 
	
	.input-row .link {
		display: inline-block;
		width: 240upx;
	    height: 46upx;
	    padding: 13upx 0;
	    padding-left: 20upx;
	    line-height: 46upx;
		text-align: right;
	}
	.input-row .active{
		color: #7558ff;
	}

</style>
