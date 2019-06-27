<template>
	<view class="content">
		<view class="padding-h">			
			<view class="header">
				<text class="" v-if="kind == 'secretary'">阅见小秘书</text>
				<text class="" v-if="kind == 'invite'">阅见邀请</text>
			</view>
			
			<view class="unread-wrap">
				<text class="emphasize">{{message.unread}}</text>
				<text class="text">条未读消息</text>
			</view>
			
			<!-- <view class="search-wrap">
				<image mode="widthFix" src="../../static/img/icons/icon-search-left.png"></image>
				<view class="input-row">
					<m-input class="m-input" type="text" clearable v-model="searchText" placeholder=""></m-input>
				</view>
			</view> -->
		</view>	
		
		<view class="padding-l margin-top">	
			<view class="message-wrap">
				<view class="message-row border" v-for="(item, index) in message.page.records" :class="(index == message.page.records.length-1)?'message-row-last':''" @click="read(item, index)">
					<view class="first-layer">
						<view class="second-layer">
							<image mode="scaleToFill" :src="item.member.avatarUrl"></image>
							<view class="content-cell">
								<view class="sub-title">
									<text>{{item.message}}</text>
								</view>
								<view class="content-under">
									<text class="label">{{item.createTime.substring(0,10)}}</text>
									<text :class="{unread:item.readStatus=='0'}">{{item.readStatus=='1'?'已读':'未读'}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="more-wrap margin-top">
					<text v-if="message.page.current < message.page.pages" @click="loadData(false)">加载更多</text>
					<text v-else-if="message.page.current > 1" class="label">没有更多</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input.vue'
	import {mapState, mapGetters} from 'vuex'
	
	export default {
		components: {fIcon, mInput},
		data() {
			return{
				kind:'',
				searchText:'',
				message:{
					unread:'',
					page:{
						size:10,
						current:0,
						total:0,
						pages:0,
						records:[]
					},
					members:[]
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			read:function(msg, index){
				let url = '';
				if(msg.messageType == 'invite' || msg.messageType == 'appointment'){
					url = '/pages/member/invite';
				}else if(msg.messageType == 'follow' || msg.messageType == 'thumbsup'){
					url = '/pages/member/follow';
				}else if(msg.messageType == 'activity_sign'){
					//活动报名通知
					url = '/pages/activity/activity?id='+msg.relativeId;
				}
				//
				if(msg.readStatus == '0'){
					this.updateReadStatus(msg);
				}
				//
				uni.navigateTo({
					url:url
				})
			},
			updateReadStatus:function(msg){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/message/updateById',
					method:'POST',
					data:{
						id:msg.id,
						readStatus:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							msg.readStatus = '1';
						}
					}
				});
			},
			getMessages:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'message/list',
					method:'POST',
					data:{
						kind:this.kind,
						agentAccountId:this.agentMember.agentAccountId,
						status:'1',
						pageStart:this.message.page.current+1,
						pageSize:this.message.page.size
					},
					success(res) {
						if(that.$http.success(res)){
							let member = {};
							res.data.data.members.forEach(item =>{
								member[item.id] = item;
							})
							res.data.data.page.records.forEach(item =>{
								item.member = member[item.fromMemberId];
								item.message = item.message.replace('&nickname', member[item.fromMemberId].nickname);
							})
							
							that.message = res.data.data;
						}
					}
				});
			}
		},
		onLoad(option) {
			if(this.hasLogin){
				this.kind = option.kind;
				this.getMessages();
			}else{
				
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
	.message-row image {
		width:120upx;
		height:120upx;
		border-radius: 60upx;
		margin-right: 20upx;
	}
	.message-row .sub-title {
		font-size: 16px;
		display: flex;
		justify-content: space-between;
	}
	.message-row .content-under {
		flex-grow: 1;
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.message-row .content-under .unread{
		color: #fc597b;
	}
	
	.more-wrap{
		display: flex;
		justify-content: center;
		margin-bottom: 40upx;
	}
	
	
	
</style>
