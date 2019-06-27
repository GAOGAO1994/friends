<template>
	<view class="swtich-modal" v-if="isOpen === true || isOpen === 'true'">	
		<view class="swtich-modal__mask" :class="showAnimation === true || showAnimation === 'true' ? 'swtich-modal--show' : ''" @click="closeModal(false)"></view>
		<view class="swtich-modal__container" :class="showAnimation === true || showAnimation === 'true' ? 'swtich-modal--show' : ''">
			
			<view class="member-wrap">
				<view class="member-box" v-for="(member, index) in account.members" :class="{'margin-right':index<account.members.length-1}" @click="doSwitch(member)">
					<view class="member">
						<text :class="{primary:agentMember.id === member.id}">{{role[member.purpose]}}</text>
						<image class="image" mode="scaleToFill" :src="member.avatarUrl"></image>
						<text class="name">{{member.nickname}}</text>
					</view>
				</view>
				<!-- 添加 -->
				<view class="member-box margin-left" v-if="account.members.length == 1" @click="addMember">
					<view class="member">
						<text></text>
						<view class="image circle-wrap">
							<f-icon type="add" color="#dcdcdc" size="28"></f-icon>
						</view>
						<text class="name"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon},
		name: 'user-swtich',
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
				inMethodsTimeout:false,
				role:{
					self:'自己',
					children:'子女',
					friend:'朋友',
					parent:'父母',
					everybody:'红娘'
				}
			};
		},
		computed: {
			...mapState(['account']),
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
			...mapMutations(['changeAgentMember']),
			closeModal(changed) {
			    this.showAnimation = false
			    this.inMethodsTimeout = true
			    setTimeout(() => {
			    	this.isOpen = false
			        this.inMethodsTimeout = false
			        this.$emit('close', changed);
			    }, 200)
			},
			doSwitch:function(member){
				if(member.id === this.agentMember.id)return;
				this.changeAgentMember(member);
				this.closeModal(true);
			},
			addMember:function(){
				this.closeModal(true);
				uni.switchTab({
					url:'/pages/blind/blind'
				})
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

    .swtich-modal {
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
        &--show{
            opacity: 1;
        }
    }
</style>
	
<style>
	.member-wrap{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin: 40upx;
		margin-bottom: 0;
		align-items: center;
	}
	.member-wrap .member-box{
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		width: 120upx;
		margin-bottom: 40upx;
	}
	
	.member-wrap .margin-right{
		margin-right: 20upx;
	}
	.member-wrap .margin-left{
		margin-left: 20upx;
	}
	
	.member-wrap .member-box .member{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.member-wrap .member-box .image{
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
		margin: 15upx 0;
	}
	.member-wrap .member-box .member .name{
		width: 120upx;
		overflow: hidden;
		white-space:nowrap;
		text-overflow: ellipsis;
		text-align: center;
	}
	.member-wrap .member-box .primary{
		font-weight: 900;
	}	
	.circle-wrap{
		border:1px dashed #dcdcdc;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
