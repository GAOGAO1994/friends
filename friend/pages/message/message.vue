<template>
	<view class="content">
		<view class="padding-h">			
			<view class="header">
				<text class="">消息</text>
			</view>
			
			<view class="unread-wrap">
				<text class="emphasize">{{unread}}</text>
				<text class="text">条未读消息</text>
			</view>
			
			<view class="search-wrap">
				<image mode="widthFix" src="../../static/img/icons/icon-search.png"></image>
				<view class="input-row">
					<m-input class="m-input" type="text" clearable v-model="searchText" placeholder=""></m-input>
				</view>
			</view>
		</view>	
		
		<view class="padding-l">	
			<view class="message-wrap">
				<view class="message-row border" v-for="(message, index) in messages" :class="(index == messages.length-1)?'message-row-last':''" @click="view(message)">
					<view class="first-layer">
						<view class="second-layer">
							<view class="icon">
								<image mode="widthFix" :src="message.icon"></image>
							</view>
							<view class="content-cell">
								<view class="sub-title">
									<view class="title-wrap">
										<text>{{message.title}}</text>
										<view v-if="message.unread>0" class="marker">{{message.unread}}</view>
									</view>
									<view class="date">
										<text class="label">{{message.last.createTime.substring(0,10)}}</text>
									</view>
								</view>
								<view class="content">
									<text :class="message.last.id>0?'active':'label'">{{message.last.message}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import {mapState, mapGetters} from 'vuex'
	
	export default {
		components: {fIcon, mInput, loginModal},
		data() {
			return{
				showLogin:false,
				searchText:'',
				unread:0,
				messages:[{
					kind:'secretary',
					"icon": "../../static/img/icons/icon-notice-yj.png",
					"title": "阅见小秘书",	
					// "content": "亲关注下您的手机哦，我们给您发哦是...",
					// "date": "02-01",
					"url": "",
					last:{
						id:0,
						message:'暂无消息',
						createTime:'',
						readStatus:'',
						relativeId:0
					},
					unread:0
				},{
					kind:'invite',
					"icon": "../../static/img/icons/icon-notice-hn.png",
					"title": "阅见邀请",
					// "content": "快来看看有没有你喜欢的让无数网友表...",
					// "date": "02-01",
					"url": "",
					last:{
						id:0,
						message:'暂无消息',
						createTime:'',
						readStatus:'',
						relativeId:0
					},
					unread:0
				}/*,{
					"icon": "../../static/img/icons/icon-notice-praise.png",
					"title": "赞",
					"content": "",
					"date": "02-01",
					"url": ""
				} ,{
					"icon": "../../static/img/icons/icon-notice-invite.png",
					"title": "邀请",
					"content": "",
					"date": "02-01",
					"url": ""
				},{
					"icon": "../../static/img/icons/icon-notice-recommendation.png",
					"title": "推荐",
					"content": "",
					"date": "02-01",
					"url": ""
				} */]
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			closeLoginModal:function(){
				this.showLogin = false;
			},
			view:function(message){
				if(message.last.id == 0){
					uni.showToast({
						icon:'none',
						title:'暂无消息'
					})
					return;
				}
				uni.navigateTo({
					url:'messageList?kind='+message.kind
				})
			},
			getMessages:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'message/last',
					method:'POST',
					data:{
						agentAccountId:this.agentMember.agentAccountId,
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							//未读数
							that.messages[0].unread = res.data.data[0].unread;
							that.messages[1].unread = res.data.data[1].unread;
							//会员
							let member = {};
							res.data.data[0].members.forEach(item =>{
								member[item.id] = item;
							})
							
							if(res.data.data[0].messages.length > 0){
								that.messages[0].last = res.data.data[0].messages[0];
								that.messages[0].last.message = that.messages[0].last.message.replace('&nickname', member[that.messages[0].last.fromMemberId].nickname);
							}
							if(res.data.data[1].messages.length > 0){
								that.messages[1].last = res.data.data[1].messages[0];
								that.messages[1].last.message = that.messages[1].last.message.replace('&nickname', member[that.messages[1].last.fromMemberId].nickname);
							}
							that.messages.forEach(item =>{
								that.unread += item.unread;
							})
						}
					}
				});
			}
		},
		onLoad() {
			if(this.hasLogin){
				this.getMessages();
			}else{
				this.showLogin = true;
			}
		}
	}
</script>

<style>
	.unread-wrap{
		
	}
	.unread-wrap .emphasize{
		color: #FC597B;
		padding-right: 5upx;
	}
	.search-wrap{
		height: 100upx;
		border-radius: 80upx;
		padding: 0upx 40upx;
		box-shadow: 0 0upx 30upx 2upx #dcdcdc;
		margin: 60upx 0;
		display: flex;
		align-items: center;
	}
	.search-wrap image{
		width: 80upx;
		height: 80upx;
		margin-right: 15upx;
	}
	
	.message-wrap{
		display: flex;
		flex-direction: column;
	}
	.message-row{
		width: 100%;
		display: flex;
		flex-direction:column;
		position: relative;
		padding: 20upx 0;
	}
	.message-row::after {
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
	.message-row-last:after {
		display:none;
	}
	.message-row .first-layer{
		display: flex;
		flex-direction:row;
		justify-content: space-between;
		align-items: flex-start;
		margin-right: 40upx;
	}
	.message-row .second-layer{
		display: flex;
		flex-direction:row;
		align-items: center;
		flex-grow: 1;
	}
	.message-row .date {
		white-space : nowrap;
	}
	.message-row .content-cell{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.message-row .icon {
		width:140upx;
		height:140upx;
		margin-right: 20upx;
	}
	.message-row image {
		width:140upx;
		height:140upx;
	}
	.message-row .sub-title {
		font-size: 16px;
		display: flex;
		justify-content: space-between;
	}
	.message-row .sub-title .title-wrap{
		display: flex;
	}
	.message-row .sub-title .marker{
		width: 30upx;
		height: 30upx;
		border-radius: 15upx;
		background-color: #fc597b;
		font-size: 10px;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10upx;
	}
	.message-row .content {
		margin-top: 15upx;
	}
	
	.message-row .content .active{
		
	}
	
	
	
	
</style>
