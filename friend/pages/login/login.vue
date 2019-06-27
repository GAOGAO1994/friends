<template>
    <view class="content">
        <view class="title-nav">
			<text class="text">登录</text>
			<image class="image-content" mode="widthFix" :src="bg" ></image>
			<!-- <image class="image-content" mode="widthFix" src="../../static/img/login/login-bg.png" ></image> -->
		</view>
		
		<view class="content padding">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">账号：</text>
					<m-input class="m-input" type="text" clearable v-model="username" placeholder="请输入手机号"></m-input>
				</view>
				<view class="input-row border">
					<text class="title">密码：</text>
					<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
				</view>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="bindLogin">登录</button>
			</view>
			<view class="action-row">
				<navigator url="../reg/reg">注册账号</navigator>
				<text class="split-line">|</text>
				<navigator url="pwd">忘记密码</navigator>
			</view>		
			<view class="statement">
				<text class="label">登录代表你同意</text>
				<navigator url="/pages/statement/serviceAgreement"><text class="link">服务条款</text></navigator>
				<text class="label">和</text>
				<navigator url="/pages/statement/privacyPolicy"><text class="link">隐私政策</text></navigator>
			</view>
		</view>
		
		<view class="oauth-login" v-if="hasProvider">
			<view class="other-login">
				<view class="line"></view>
				<text class="text">其它登录方式</text>
			</view>
			<view class="oauth-row">
				<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
					<view v-if="provider.value == 'weixin'">
						<!-- #ifdef MP-WEIXIN -->
						<!-- <button class="oauth-button" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true"></button> -->
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<!-- <image :src="provider.image" @tap="oauth(provider.value)"></image> -->
						<!-- #endif -->
						<image :src="provider.image" @tap="oauth(provider.value)"></image>
					</view>
					<view v-else>
						<!-- <image :src="provider.image" @tap="oauth(provider.value)"></image> -->
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
	import mpWeixin from '@/static/data/mp-weixin.js';
    import {mapState, mapGetters, mapMutations} from 'vuex'
    import mInput from '../../components/m-input.vue'

    export default {
        components: {
            mInput
        },
        data() {
            return {
				bg:this.$http.imgPath + "manage/login-bg.png",
                providerList: [],
                hasProvider: false,
                username: '',
                password: '',
                positionTop: 0
            }
        },
        computed: {
			...mapState(['account','hasLogin','redirect']),
			...mapGetters(['purposes','loginCheck'])
		},
        methods: {
            ...mapMutations(['login','loginSuccess']),
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
            bindLogin() {
				let that = this;
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.username.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                
                let param = {
					provider: 'mobile',
                    username: this.username,
                    password: this.password
                };
				// this.login(param);
				// if(!this.hasLogin){
					//远程登陆校验
					uni.request({
						url: this.$http.contextPath + 'account/login',
						method: 'POST',
						data:param,
						success: (res) => {
							console.log(res);
							if(this.$http.success(res)){
								// console.log(res);
								res.data.data.password = this.password;
								that.loginSuccess(res.data.data);
								that.$croute.enter({
									...that.loginCheck(that.redirect),
									fromUrl:'/pages/login/login'
								});
							}else{
								uni.showToast({
								    icon: 'none',
								    title: res.data.msg,
								});
							}
						},
						fail: (e) => {
							uni.showToast({
								title:"服务器响应错误"
							})
						}
					})
// 				}else{
// 					this.toMain();
// 				}
            },
            oauth(provider) {
				console.log("provider："+provider);
            	let that = this;
                uni.login({
                    provider: provider,
                    success: (e) => {
                        if(provider == 'weixin'){
                        	//获取openID
                        	uni.request({
                        		url: mpWeixin.openIdUrl + e.code,
                        		method: 'GET',
                        		success: (sess) =>{
                        			that.fastLogin(provider, sess.data.openid);
                        		},
                        		fail(e) {
                        			uni.showToast({
                        				title:'获取信息错误'
                        			})
                        		}
                        	})
                        }
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            fastLogin(provider, openId){
            	let param = {
            		provider:provider
            	};
            	if(provider == 'weixin'){
            		param.openIdWeixin = openId;
            	}else if(provider == 'weibo'){
            		param.openIdWeibo = openId;
            	}else if(provider == 'qq'){
            		param.openIdQq = openId;
            	}else{
            		return;
            	}
            	let that = this;
            	uni.request({
            		url:this.$http.contextPath + 'account/login',
            		method:'POST',
            		data:param,
            		success(res) {
            			if(that.$http.success(res)){
            				that.loginSuccess(res.data.data);
							// console.log(that.redirect);
            				that.$croute.enter(that.loginCheck(that.redirect));
            			}else{
            				uni.showToast({
            					icon: 'none',
            					title: res.data.msg,
            				});
            			}
            		}
            	})
            },
			getuserinfo(res){
				console.log(11111);
				console.log(res);
				uni.login({
					provider: 'weixin',
					success(loginRes) {
						 console.log(loginRes);
						 
					}
				})
				
				let userInfo = res.detail.userInfo;
				uni.navigateTo({
					url:'mobileVerify?provider=weixin&nickname='+userInfo.nickname+'&openId='+userInfo.openId+"&avatarUrl="+userInfo.avatarUrl
				})
			},
            toMain() {
				this.$croute.enter(this.loginCheck(this.redirect));
				
// 				console.log(this.account);
// 				console.log(this.purposes);
// 				//没有填写注册意图
// 				if(this.purposes.length == 0){
// 					uni.switchTab({
// 						url: '/pages/blind/blind'
// 					});
// 				}
// 				//为自己相亲，没有上传头像
// 				else if(this.purposes.toString().indexOf('self') > -1 && this.account.member['self'].avatarUrl == null){
// 						uni.redirectTo({
// 							url: '/pages/reg/avatarUpload'
// 						});
// 					}
// 				else{
// 					this.$croute.comeback(this.redirect);
// 				}
            }
        },
        onLoad() {
            this.initProvider();
        }
    }
</script>

<style>
	.login{
		flex: 1;
		padding:0px;
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
	
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
		color: #7558ff;
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
</style>
