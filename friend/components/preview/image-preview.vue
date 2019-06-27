<template>
	<view class="preview-modal" v-if="isOpen === true || isOpen === 'true'">	
		<view class="preview-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'preview-modal--show' : ''" @click="closeModal"></view>
		<view class="preview-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'preview-modal--show' : ''">
			<image class="img" :src="src" mode="widthFix" @click="closeModal"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'image-preview',
		props: {
			src: { //图片地址
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
			}
		},
		onLoad() {
		    
		}
	}
</script>

<style lang="scss">
    $bg-color-mask:rgba(0, 0, 0, 0.5); //遮罩颜色
    $bg-color-hover:#f1f1f1; //点击状态颜色

    .preview-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1000;

        &__container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) ;
            transition: transform 0.3s;
            width: 100%;
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
	.img{
		width:100%;
	}	
</style>
