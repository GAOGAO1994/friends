<template>
    <view class="content">
        <view class="title-nav">
			<view class="title">
				<text class="text">验证</text>
				<text class="sub">验证您{{name}}的信息</text>
			</view>
			<image class="image-content" mode="widthFix" :src="bg" ></image>
		</view>
		
		<view class="content padding">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">手机号：</text>
					<m-input class="m-input" type="text" clearable v-model="member.mobile" :placeholder="'请输入您'+(name)+'的手机号'"></m-input>
				</view>
				<view class="input-row border">
					<text class="title">验证码：</text>
					<m-input class="m-input" type="text" clearable v-model="code" placeholder="请输入验证码"></m-input>
					<text v-if="!shortCodeBtn.disabled" class="link active" @click="getShortCode">点击获取验证码</text>
					<text v-else class="link label">倒计时:{{shortCodeBtn.countdown}}</text>
				</view>
			</view>
			<view class="term-row">
				<view class="statement">
					<text class="label">注册代表你同意</text>
					<navigator url="/pages/statement/serviceAgreement"><text class="link">服务条款</text></navigator>
					<text class="label">和</text>
					<navigator url="/pages/statement/privacyPolicy"><text class="link">隐私政策</text></navigator>
				</view>
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
		computed: {
			...mapState(['forcedLogin','account', 'redirect','target']),
			name:function(){
				if(this.member.purpose == 'children'){
					return '子女';
				}else if(this.member.purpose == 'friend'){
					return '朋友';
				}else if(this.member.purpose == 'parent'){
					return '父母';
				}else{
					return '';
				}
			}
		},
        data() {
            return {
				bg:this.$http.imgPath + "manage/register-bg.png",
				member:{
					mobile:''
				},
				code:'',
                shortCode: {},
				shortCodeBtn:{
					disabled:false,
					countdown:0			//倒计时
				}
            }
        },
        methods: {
			...mapMutations(['saveMember']),
			getPhoneNumber(e){
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
			},
			getShortCode:function(){
				if (this.member.mobile.length != 11) {
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
						mobile:this.member.mobile
					},
					success: (res) => {
						if(that.$http.success(res)){
							that.shortCode = res.data.data;
							uni.showToast({
								title:'验证码：'+that.shortCode.code
							})
						}
					}
				})
			},
			verify(){
				if (this.member.mobile.length != 11) {
				    uni.showToast({
				        icon: 'none',
				        title: '手机号有误'
				    });
				    return false;
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
				let that = this;
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if(!this.verify)return;
				//校验手机验证码
				if(!this.verifyCode(this.member.mobile, this.code)){
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
					...this.member,
					agentAccountId:this.account.id
				};
				uni.request({
					url: this.$http.contextPath + 'blind/save',
					method: 'POST',
					data:param,
					success: (res) => {
						if(that.$http.success(res)){
							//更新本地member
							that.saveMember(res.data.data);
							//上传头像
							uni.redirectTo({
								url: '/pages/reg/avatarUpload?purpose='+that.member.purpose+'&memberId='+res.data.data.id
							});
						}/* else{
							uni.showToast({
							    icon: 'none',
							    title: '提交失败，请稍后再试'
							});
						} */
					},
					fail: (e) => {
						uni.showToast({
							title:"服务器响应错误"
						})
					}
				})
            }
        },
		onLoad: function (option) { 
			Object.assign(this.member, this.target.member);
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
	.title-nav .title{
		align-self:flex-end;
		margin-bottom:60px;
		flex-grow:1;
		padding-left:60upx;
		display: flex;
		flex-direction: column;
	}
	.title-nav .text{
		font-size: 2em;
		font-weight: bold;
		text-align: left;
	}
	.title-nav .sub{
		font-size: 1.2em;
		text-align: left;
		margin-top: 10upx;
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
	
	.statement{
		display: flex;
		margin-top: 30upx;
		justify-content: center;
	}
	.statement .link{
		text-decoration: underline;
	}
	
</style>
