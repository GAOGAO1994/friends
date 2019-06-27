<template>
    <view class="content">
        <view class="title-nav">
			<text class="text">注册</text>
			<image class="image-content" mode="widthFix" :src="bg" ></image>
		</view>
		
		<view class="content padding">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">手机号：</text>
					<m-input class="m-input" type="text" clearable v-model="mobile" placeholder="请输入手机号"></m-input>
				</view>
				<view class="input-row border">
					<text class="title">验证码：</text>
					<m-input class="m-input" type="text" clearable v-model="shortCode" placeholder="请输入验证码"></m-input>
					<text class="link">获取验证码</text>
				</view>
			</view>
			<view class="term-row">
				<navigator url="../login/login"><checkbox value="cb" checked="true" /><label class="text">我已阅读并同意相关服务条款和隐私政策</label></navigator>
			</view>	
			<view class="btn-row">
				<button type="primary" class="primary" @tap="bindRegister">完成注册</button>
			</view>	
		</view>
    </view>
</template>

<script>
    import mInput from '../../components/m-input.vue';
	import {mapState, mapMutations} from 'vuex'
	

    export default {
        components: {
            mInput
        },
		computed: mapState(['forcedLogin','accounts', 'redirect']),
        data() {
            return {
				bg:this.$http.imgPath + "manage/register-bg.png",
				provider:'',
				nickname:'',
				password:null,
				openId:null,
				avatarUrl:null,
                mobile: '',
                shortCode: ''
            }
        },
        methods: {
			...mapMutations(['register']),
			getPhoneNumber(e){
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
			},
			verify(){
				return true;
				if (this.mobile.length < 2) {
				    uni.showToast({
				        icon: 'none',
				        title: '昵称最短为 2 个字符'
				    });
				    return;
				}
				if (this.shortCode.length < 6) {
				    uni.showToast({
				        icon: 'none',
				        title: '密码最短为 6 个字符'
				    });
				    return;
				}
				return true;
			},
			verifyCode(mobile, shortCode){
				return true;
			},
            bindRegister() {
				let that = this;
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if(!this.verify)return;
				//校验手机验证码
				if(!this.verifyCode(this.mobile, this.shortCode)){
					uni.showToast({
					    icon: 'none',
					    title: '手机验证码有误'
					});
					return;
				}
				//
// 				const data = {
// 				    mobile: this.mobile,
// 					password: this.$data.password
// 				}
				//
				let param = {
					nickname:this.$data.nickname,
					password:this.$data.password,
					avatarUrl:this.$data.avatarUrl,
					mobile: this.$data.mobile,
					'open_id_${this.$data.provider}': this.$data.openId
				};
				uni.request({
					url: this.$http.contextPath + 'account/register',
					method: 'POST',
					data:param,
					success: (res) => {
						console.log(res);
						if(this.$http.success(res)){
							that.success(res.data.data);
						}
					},
					fail: (e) => {
						uni.showToast({
							title:"服务器响应错误"
						})
					}
				})
            },
			success(account){
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
		onLoad: function (option) { 
			this.$data.nickname = option.nickname;
			this.$data.provider = option.provider;
			this.$data.password = option.password;
			this.$data.openId = option.openId;
			this.$data.avatarUrl = option.avatarUrl;
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
		margin-bottom:60px;
		font-size: 2em;
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
	
	.input-row .link {
	    height: 50upx;
	    min-height: 50upx;
	    padding: 15upx 0;
	    padding-left: 20upx;
	    line-height: 50upx;
		text-align: right;
		color: #7558ff;
	}
	
	.term-row{
		margin-top:50px;
		text-align: center;
	}
	.term-row .text{
		font-size: 0.9em;
		color:#C8C7CC;
	}
	.btn-row {
	    margin-top: 20upx;
	}
	
</style>
