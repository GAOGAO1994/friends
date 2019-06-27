<template>
    <view class="content padding-h">
        
		<view v-if="!showNewPassword">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">手机号：</text>
					<m-input type="text" focus v-model="mobile" placeholder="请输入手机号"></m-input>
				</view>
				
				<view class="input-row">
					<text class="title">验证码：</text>
					<m-input class="m-input" type="text" v-model="code" placeholder="请输入验证码"></m-input>
					<text v-if="!shortCodeBtn.disabled" class="link active" @click="getShortCode">点击获取验证码</text>
					<text v-else class="link label">倒计时:{{shortCodeBtn.countdown}}</text>
				</view>
				
			</view>

			<view class="btn-row">
				<button type="primary" class="primary" @tap="next">下一步</button>
			</view>
		</view>
		<view v-else>
			<view class="input-row border">
				<text class="title">新密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入新密码"></m-input>
			</view>
			<view class="input-row">
				<text class="label">密码为不少于6位的数字和字母组合</text>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="submit">提交</button>
			</view>
		</view>	
    </view>
</template>

<script>
    import mInput from '@/components/m-input.vue';

    export default {
        components: {mInput},
        data() {
            return {
                mobile: '',
				code: '',
				password: '',
				account:{},
				shortCodeBtn:{
					disabled:false,
					countdown:0			//倒计时
				},
				shortCode:{},
				showNewPassword:false
            }
        },
        methods: {
			sendShortCode:function(){
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
								title:'验证码：'+that.shortCode.code
							})
						}
					}
				})
			},
            getShortCode:function(){
            	//
				if (this.mobile.length != 11) {
            	    uni.showToast({
            	        icon: 'none',
            	        title: '手机号有误'
            	    });
            	    return;
            	}
				//
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'account/check',
					method:'POST',
					data:{
						mobile:this.mobile
					},
					success(res) {
						if(that.$http.success(res)){
							that.account = res.data.data;
							that.sendShortCode();
						}
					}
				})
            },
            next:function(){
				if(!this.verifyCode(this.mobile, this.code))return;
				this.showNewPassword = true;
			},
			submit:function(){
				if(!this.verifyPassword())return;
				if(!this.account.id)return;
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'account/modifyPassword',
					method:'POST',
					data:{
						id:this.account.id,
						password:this.password
					},
					success(res) {
						if(that.$http.success(res)){
							uni.showToast({
								title:'密码已修改'
							})
							uni.navigateBack({});
						}
					}
				})
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
			verifyPassword:function(){
				let patrn = /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/;
				let b = patrn.exec(this.password);
				if(!b){
					uni.showToast({
						icon:'none',
						title:'密码格式有误'
					})
				}
				return b;
			}
        }
    }
</script>

<style>
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
