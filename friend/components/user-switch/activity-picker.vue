<!-- 列表选择 -->
<template>
	<view class="activity-modal" v-if="isOpen === true || isOpen === 'true'">	
		<view class="activity-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'activity-modal--show' : ''" @click="closeModal()"></view>
		<view class="activity-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'activity-modal--show' : ''">
			
			<view class="activity-container padding-l">
				<view class="title">我的活动</view>
				
				<view class="activity-wrap">
					<view class="activity-box" v-for="(activity, index) in activities" :class="{'border':index<activities.length-1}" @click="doPick(activity)">
						<image class="image" mode="scaleToFill" :src="activity.thumbnail"></image>
						<text class="name">{{activity.title}}</text>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapGetters} from 'vuex'
	
	export default {
		components: {fIcon},
		name: 'activity-picker',
		props: {
			title:{ //标题
		        type: String,
		        default: ''
		    },
			activities: { //活动列表
			    type: Array,
			    default: []
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
		computed: {
			...mapGetters(['agentMember'])
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
			closeModal(activity) {
			    this.showAnimation = false
			    this.inMethodsTimeout = true
			    setTimeout(() => {
			    	this.isOpen = false
			        this.inMethodsTimeout = false
			        this.$emit('close', activity);
			    }, 200)
			},
			doPick:function(activity){
				this.closeModal(activity);
			}
		},
		onShow() {
			
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss">
    $bg-color-mask:rgba(0, 0, 0, 0.5); //遮罩颜色
    $bg-color-hover:#f1f1f1; //点击状态颜色

    .activity-modal {
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
			flex-direction: column;
			justify-content: center;
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
        &--show{
            opacity: 1;
        }
    }
</style>
	
<style>
	.activity-container{
		padding-top: 40upx;
		padding-bottom: 40upx;
	}
	.activity-container .title{
		font-size:21px;
		font-weight: 900;
		margin-bottom: 20upx;
	}
	.activity-container .activity-wrap{
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.activity-container .activity-wrap .activity-box{
		display: flex;
		align-items: center;
		padding: 20upx 0;
	}
	.activity-container .activity-wrap .activity-box.border::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }
	.activity-container .activity-wrap .activity-box image{
		width: 160upx;
		height: 120upx;
	}
	.activity-container .activity-wrap .activity-box .name{
		margin-left: 20upx;
		line-height: 16px;
	}
	
	
</style>
