<template>
	<view class="login-modal" @touchmove.stop="bindTouchmove" v-if="isOpen === true || isOpen === 'true'">	
		<view class="login-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'login-modal--show' : ''" @click="closeModal"></view>
		<view class="login-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'login-modal--show' : ''">
			<view class="modal-content">
				
				
				
				
			</view>	
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	
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
            width: 100%;
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
            top: 250upx;
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
	
</style>
