<template>
	<view class="enroll-modal" v-if="isOpen === true || isOpen === 'true'">	
		<view class="enroll-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'enroll-modal--show' : ''" @click="closeModal"></view>
		<view class="enroll-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'enroll-modal--show' : ''">
			
			<view class="container">
				<view class="enroll-header-wrap">
					<text class="title">{{title}}</text>
					<text class="sub-title">{{subTitle}}</text>
				</view>
				
				<view class="content-wrap">
					
					<text class="">请留下您的手机号,我们将及时与您联系：</text>
					<view class="input-row border">
						<m-input class="m-input" type="text" v-model="name" placeholder="您的称呼"></m-input>
					</view>
					<view class="input-row border">
						<m-input class="m-input" type="text" v-model="mobile" placeholder="您的手机号"></m-input>
					</view>
				
					<view class="info-wrap">
						<text class="title">门店工作时间</text>
						<text class="text">平时：周一～周五，9:00-17:00</text>
						<text class="text">周末：周六～周日，9:30-17:30</text>
					</view>	
					
					<button class="btn-submit" @click="submit">确认提交</button>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue'
	
	export default {
		components: {mInput},
		name: 'enroll',
		props: {
			kind: { //类别
			    type: String,
			    default: ''
			},
			title: { //标题
			    type: String,
			    default: ''
			},
			subTitle: { //小标题
			    type: String,
			    default: ''
			},
		    show: { //是否显示模态框
		        type: [Boolean, String],
		        default: false
		    }
		},
		data() {
			return {
				name:'',
				mobile:'',
				isOpen: false,
				showAnimation:false,
				inWatchTimeout:false,
				inMethodsTimeout:false
			};
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
			closeModal() {
			    this.showAnimation = false
			    this.inMethodsTimeout = true
			    setTimeout(() => {
			    	this.isOpen = false
			        this.inMethodsTimeout = false
			        this.$emit('close')
			    }, 200)
			},
			submit:function(){
				if(this.name == ''){
					uni.showToast({
						icon:'none',
						title:'请输入您的称呼'
					})
					return;
				}
				if(this.name.length > 20){
					uni.showToast({
						icon:'none',
						title:'您的称呼内容超出（限制20个字符）'
					})
					return;
				}
				if(this.mobile == ''){
					uni.showToast({
						icon:'none',
						title:'请输入您的手机号'
					})
					return;
				}
				if(this.mobile.length != 11){
					uni.showToast({
						icon:'none',
						title:'请输入有效的手机号'
					})
					return;
				}
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/user-consult/save',
					method:'POST',
					data:{
						kind:this.kind,
						name:this.name,
						mobile:this.mobile
					},
					success(res) {
						if(that.$http.success(res)){
							uni.showToast({
								title:'您的请求已提交，稍后客服会跟您联系'
							})
							that.closeModal();
						}
					}
				});
			}
		},
		onLoad() {
		    
		}
	}
</script>

<style lang="scss">
    $bg-color-mask:rgba(0, 0, 0, 0.5); //遮罩颜色
    $bg-color-hover:#f1f1f1; //点击状态颜色

    .enroll-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 100;

        &__container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) ;
            transition: transform 0.3s;
            width: 85%;
            border-radius: 15upx;
            background-color: #fff;
            overflow: hidden;
            opacity: 0;
            transition: opacity 200ms ease-in;
			display: flex;
			justify-content: center;
			align-items: center;
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
	.container{
		width: 100%;
		border-radius: 15upx;
	}
	.enroll-header-wrap{
		display: flex;
		padding: 60upx;
		align-items: flex-end;
		background: linear-gradient(to right, #ae74ff, #7b58ff);
	}
	.enroll-header-wrap .title{
		font-size: 21px;
		color: white;
		font-weight: 900;
	}
	.enroll-header-wrap .sub-title{
		font-size: 14px;
		color: white;
		margin-left: 20upx;
	}
	
	.content-wrap{
		padding: 60upx;
	}
	.input-row{
		width: 100%;
		margin: 20upx 0;
		padding: 10upx 0;
	}
	.m-input{
		width: 100%;
	}
	.info-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 60upx 0;
	}
	.info-wrap .title{
		font-size: 20px;
		font-weight: 900;
		margin-bottom: 30upx;
	}
	.info-wrap .text{
		margin-bottom: 20upx;
	}
	.btn-submit{
		color: white;
		font-size:16px;
		font-weight: 900;
		border-radius: 80upx;
		background: linear-gradient(to bottom, #ae74ff, #7b58ff); /* 标准的语法 */
		/* box-shadow: 0px 0px 30px #ae74ff; */
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 12upx 0;
	}
	
	
</style>
