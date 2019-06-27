<template>
	<view class="login-modal" @touchmove.stop="bindTouchmove" v-if="isOpen === true || isOpen === 'true'">	
		<view class="login-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'login-modal--show' : ''" @click="closeModal"></view>
		<view class="login-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'login-modal--show' : ''">
			<view class="modal-content">
				<view class="close-wrap" @click="closeModal">
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
					<button type="primary" class="primary" @tap="bindLogin">手机号登录</button>
				</view>
				<view class="action-row">
					<text class="">还没有账号，去</text>
					<text class="primary" @click="bindReg">注册</text>
				</view>	
				<view class="model-statement">
					<text class="label">登录代表你同意</text>
					<navigator url="/pages/statement/serviceAgreement"><text class="link">服务条款</text></navigator>
					<text class="label">和</text>
					<navigator url="/pages/statement/privacyPolicy"><text class="link">隐私政策</text></navigator>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mpWeixin from '@/static/data/mp-weixin.js';
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {
		    fIcon
		},
		name: 'login-modal',
		props: {
		    title: { //标题
		        type: String,
		        default: ''
		    },
		    content: String, //提示的内容
		    align: { //content 的对齐方式left/center/right
		        type: String,
		        default: 'left'
		    },
		    cancelText: { //取消按钮的文字，默认为"取消"
		        type: String,
		        default: '取消'
		    },
		    cancelColor: { //取消按钮颜色
		        type: String,
		        default: '#333333'
		    },
		    confirmText: { //确定按钮的文字，默认为"确定"
		        type: String,
		        default: '确定'
		    },
		    confirmColor: { //确认按钮颜色
		        type: String,
		        default: '#007aff'
		    },
		    showCancel: { //是否显示取消按钮，默认为 true
		        type: [Boolean, String],
		        default: true
		    },
		    show: { //是否显示模态框
		        type: [Boolean, String],
		        default: false
		    }
		},
		data() {
			return {
				providerList: [],
				hasProvider:false,
				
				isOpen: false,
				showAnimation:false,
				inWatchTimeout:false,
				inMethodsTimeout:false
			};
		},
		computed: {
			...mapState(['redirect']),
			...mapGetters(['loginCheck'])
		},
		watch: {
		    show(val) {
		        if(this.inWatchTimeout){
		            return
		        }
		        if (val) {
		        	this.isOpen = val
		            setTimeout(() => {
		            	this.showAnimation = val
		            }, 50)
		        } else {
		            this.showAnimation = val
		            this.inWatchTimeout = true
		        	setTimeout(() => {
		        		this.isOpen = val
		                this.inWatchTimeout = false
		        	}, 200)
		        }
		    }
		},
		created() {
			this.isOpen = this.show
			setTimeout(() => {
				this.showAnimation = this.show
			}, 50)
		},
		methods:{
			...mapMutations(['loginSuccess']),
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
			oauth(provider) {
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
							that.$route.enter(that.loginCheck(that.redirect));
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							});
						}
					}
				})
			},
			bindTouchmove() {},
			closeModal() {
			    this.showAnimation = false
			    this.inMethodsTimeout = true
			    setTimeout(() => {
			    	this.isOpen = false
			        this.inMethodsTimeout = false
			        this.$emit('close')
			    }, 200)
			},
			bindLogin() {
				this.closeModal();
				uni.navigateTo({
					url:"../../pages/login/login"
				});
			},
			bindReg() {
				this.closeModal();
				uni.navigateTo({
					url:"../../pages/reg/reg"
				})
			}
		},
		onLoad() {
		    this.initProvider();
		}
	}
</script>

<style lang="scss">
    $bg-color-mask:rgba(0, 0, 0, 0.5); //遮罩颜色
    $bg-color-hover:#f1f1f1; //点击状态颜色

    .login-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1000;

        &__header {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 18upx 24upx;
            line-height: 1.5;
            color: #333;
            font-size: 32upx;
            text-align: center;

            &::after {
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                height: 1px;
                border-top: 1px solid #e5e5e5;
                transform-origin: 0 0;
                transform: scaleY(.5);
            }
        }

        &__container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) ;
            transition: transform 0.3s;
            width: 540upx;
            border-radius: 20upx;
            background-color: #fff;
            overflow: hidden;
            opacity: 0;
            transition: opacity 200ms ease-in;
        }

        &__content {
            position: relative;
            color: #333;
            font-size: 28upx;
            box-sizing: border-box;
            line-height: 1.5;

            &::after {
                content: " ";
                position: absolute;
                left: 0;
                bottom: -1px;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #e5e5e5;
                transform-origin: 0 0;
                transform: scaleY(.5);
            }
        }

        &__footer {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            font-size: 32upx;
            display: flex;
            flex-direction: row;

            &-left,
            &-right {
                position: relative;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 88upx;
                font-size: 28upx;
                line-height: 88upx;
                text-align: center;
                background-color: #fff;
                color: #333;
            }

            &-right {
                color: #007aff;
            }

            &-left::after {
                content: " ";
                position: absolute;
                right: -1px;
                top: 0;
                width: 1px;
                bottom: 0;
                border-right: 1px solid #e5e5e5;
                transform-origin: 0 0;
                transform: scaleX(.5);
            }

            &-hover {
                background-color: $bg-color-hover;
            }
        }

        &__mask {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: $bg-color-mask;
            opacity: 0;
            transition: opacity 200ms ease-in;
        }

        &--padding {
            padding: 32upx 24upx;
            min-height: 90upx;
        }
        &--show{
            opacity: 1;
        }
    }
</style>

<style>
	.modal-content{
		/* width:540upx;*/
		height:540upx; 
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
		width:180upx;
		line-height: 50upx;
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
		padding-top:50upx;
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
	
	.action-row {
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
		margin-top: 20upx;
	}
	
	.model-statement{
		display: flex;
		flex-direction: row;
		justify-content: center;
		position:absolute;
		bottom: 40upx;
		font-size: 13px;
	}
	.model-statement .link{
		text-decoration: underline;
	}
</style>
