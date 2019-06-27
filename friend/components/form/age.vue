<template>
	<view class="enroll-modal" v-if="isOpen === true || isOpen === 'true'">	
		<view class="enroll-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'enroll-modal--show' : ''" @click="closeModal"></view>
		<view class="enroll-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'enroll-modal--show' : ''">
			
			<view class="container">
				<view class="enroll-header-wrap">
					<text class="title">{{title}}</text>
				</view>
				
				<view class="content-wrap">
					<view class="filed-wrap">
						<input class="filed" type="number" v-model="fromValue" />
						<text>——</text>
						<input class="filed" type="number" v-model="toValue" />
					</view>
					
					<view class="btn-submit" @click="submit">确认</view>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: 'age-form',
		props: {
			title: { //标题
			    type: String,
			    default: ''
			},
		    show: { //是否显示模态框
		        type: [Boolean, String],
		        default: false
		    },
			fieldTag:{
				type: Object
			},
			fieldSuperTag:{
				type: Object
			}
		},
		data() {
			return {
				fromValue:'',
				toValue:'',
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
				this.closeModal();
				this.$emit('confirm', {
					fromValue: this.fromValue,
					toValue: this.toValue,
					tag:this.fieldTag,
					superTag:this.fieldSuperTag
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
        z-index: 1000;

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
		font-size: 24px;
		color: white;
		font-weight: 900;
	}
	.enroll-header-wrap .sub-title{
		font-size: 16px;
		color: white;
		margin-left: 20upx;
	}
	
	.content-wrap{
		padding: 60upx;
		display: flex;
		flex-direction: column;
	}
	.filed-wrap{
		display: flex;
	}
	.filed-wrap .filed{
		width: 120upx;
		padding: 10upx;
		border: 1px solid #cdcdcd;
	}
	.filed-wrap text{
		margin: 0 20upx;
	}
	
	.btn-submit{
		margin-top: 60upx;
		color: white;
		font-size:14px;
		font-weight: 900;
		border-radius: 60upx;
		background: linear-gradient(to bottom, #ae74ff, #7b58ff); /* 标准的语法 */
		box-shadow: 0px 0px 30px #ae74ff;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: flex-end;
		padding: 20upx 80upx;
	}
	
	
</style>
