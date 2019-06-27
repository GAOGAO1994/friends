<template>
	<view class="content">
		<view class="padding-h">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="black" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="text">相亲会</text>
				<!-- <view class="right">
					<text class="label">我的活动</text>
					<switch color="#7667a5" @change="switchChange"/>
				</view> -->
			</view>
			
			<view class="tag-wrap">
				<view class="tag-scroll-wrap">
					<scroll-view class="tag-scroll" scroll-x="true" scroll-left="0">
						<view class="tag" v-for="(tag, index) in tags" :class="(tag.selected)?'tag-selected':'lable'" @click="bindTag(index)">
							<text>{{tag.name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
			
		<view v-if="selectedTab == 0" class="activity-wrap padding-h">	
			<view class="activity-box" v-for="(activity, index) in activities" @click="enterActivity(activity)">
				<image style="aspectFill" :src="activity.thumbnail"></image>
				<view class="title-wrap">
					<text class="title">{{activity.title}}</text>
					<view class="date-box">
						<text>{{activity.activityDate}}</text>
					</view>
					<view style="clear: both;"></view>
				</view> 
				
				<view class="join-wrap">
					<view class="members">
						<view class="member" v-for="(activityMember, memberIndex) in activity.activityMemberList" v-if="memberIndex<5" :key="memberIndex">
							<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
						</view>
					</view>
					<view class="text-box">
						<view>已有<text>{{activity.activityMemberList.length}}人</text>报名</view>
					</view>
				</view>
			</view>
			<view v-if="activities.length == 0" class="empty">
				<image mode="scaleToFill" src="../../static/img/empty.png"></image>
				<text>暂无开放的活动,去别处转转吧</text>
			</view>
			
			<view class="more-wrap margin-top">
				<text v-if="activityPage.current < activityPage.pages" @click="loadData">加载更多</text>
				<text v-else-if="activityPage.current > 1" class="label">没有更多</text>
			</view>
		</view>
		
		<view v-if="selectedTab == 1" class="activity-wrap padding-h">	
			<view class="activity-box" v-for="(activity, index) in myActivities" @click="enterActivity(activity)">
				<image style="aspectFill" :src="activity.thumbnail"></image>
				<view class="title-wrap">
					<text class="title">{{activity.title}}</text>
					<view class="date-box">
						<text>{{activity.activityDate}}</text>
					</view>
					<view style="clear: both;"></view>
				</view> 
				
				<view class="join-wrap">
					<view class="members">
						<view class="member" v-for="(activityMember, memberIndex) in activity.activityMemberList" v-if="memberIndex<5" :key="memberIndex">
							<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
						</view>
					</view>
					<view class="text-box">
						<view>已有<text>{{activity.activityMemberList.length}}人</text>报名</view>
					</view>
				</view>
			</view>
			<view v-if="myActivities.length == 0" class="empty">
				<image mode="scaleToFill" src="../../static/img/empty.png"></image>
				<text>您尚未参加活动</text>
			</view>
			
			<view class="more-wrap margin-top">
				<text v-if="myActivityPage.current < myActivityPage.pages" @click="loadMyActivities">加载更多</text>
				<text v-else-if="myActivityPage.current > 1" class="label">没有更多</text>
			</view>
		</view>
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<view class="item" @click="enter('/pages/member/invite')">
						<f-icon type="invite" color="#7558ff" size="28"></f-icon>
						<text>我的邀请</text>
					</view>
					<view class="item" @click="navigateTo('activityPictures')">
						<f-icon type="attention" color="#7558ff" size="28"></f-icon>
						<text>往期精彩</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		
		<login-modal :show="showLogin" @close="closeLoginModal" ></login-modal>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import memberSvc from '@/services/member/member.js';
	import dateUtil from '@/services/util/dateUtil.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon,loginModal},
		data() {
			return{
				getMy:false,
				showLogin:false,
				parameter: {
					status:'1',
					activityStatus:'sign',				//报名中的活动
					payStatus:'TRADE_SUCCESS'			//报名支付状态
					// activityStatusExclude:'end'		//没有结束的活动
				},
				activities:[],
				activityPage:{
					pages:0,
					current:0,
					total:0
				},
				myActivities:[],
				myActivityPage:{
					pages:0,
					current:0,
					total:0
				},
				memberActivityTags:[],		//会员感兴趣的活动类型
				tags:[{
					id:1,
					name:'全部',
					selected:true,
					init:false
				},{
					id:2,
					name:'我的',
					selected:false,
					init:false
				}]
			}
		},
		computed: {
			...mapState(['hasLogin', 'account']),
			...mapGetters(['loginCheck', 'agentMember']),
			selectedTab:function(){
				return this.tags[0].selected?0:1;
			}
		},
		methods:{
			...mapMutations(['targetActivity','redirect']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			enterActivity:function(activity){
				this.targetActivity(activity);
				if(this.hasLogin){
					// this.enter('/pages/activity/activity?id='+activity.id+'&shareOrigin='+this.account.id+'&shareFrom='+this.account.id);
					this.enter('/pages/activity/activity?id='+activity.id);
				}else{
					this.showLogin = true;
				}
			},
			enter:function(url){
				this.showLogin = this.$croute.enter(this.loginCheck(url));
			},
			navigateTo:function(url){
				uni.navigateTo({
					url:url
				})
			},
			loadMyActivities(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'activity/queryMyPageAttachMember',
					method:'POST',
					data:{
						query:{
							status:'1',
							payStatus:'TRADE_SUCCESS',
							// accountId:this.account.id
							agentAccountId:this.agentMember.agentAccountId		//查询代理所有会员的活动
							//memberId:this.agentMember.id
						},
						current:this.myActivityPage.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							that.myActivityPage = {
								pages:res.data.data.pages,
								current:res.data.data.current,
								total:res.data.data.total
							};
							res.data.data.records.forEach(item =>{
								let a = item.activityDate.split('-');
								item.activityDate = a[1]+'/'+a[2]+'  '+dateUtil.getDay(item.activityDate);
							})
							that.myActivities = that.myActivities.concat(res.data.data.records);
						}
					}
				});
			},
			loadData(){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'activity/queryPageAttachMember',
					method:'POST',
					data:{
						query:{
							...this.parameter
						},
						current:this.activityPage.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							that.activityPage = {
								pages:res.data.data.pages,
								current:res.data.data.current,
								total:res.data.data.total
							};
							res.data.data.records.forEach(item =>{
								let a = item.activityDate.split('-');
								item.activityDate = a[1]+'/'+a[2]+'  '+dateUtil.getDay(item.activityDate);
							})
							that.activities = that.activities.concat(res.data.data.records);
						}
					}
				});
			},
			bindTag:function(selectedIndex){
				this.tags.forEach((tag,index) =>{
					if(selectedIndex === index){
						tag.selected = true;
					}else{
						tag.selected = false;
					}
				})
				this.initTab(selectedIndex);
			},
			initTab:function(index){
				if(this.tags[index].init)return;
				this.tags[index].init = true;
				if(index == 0){
					this.loadData();
				}else if(index == 1){
					if(this.hasLogin){
						this.loadMyActivities();
					}else{
						this.redirect('/pages/activity/activities');
						this.showLogin = true;
					}
				}
			}
		},
		
		onLoad(option) {
			this.initTab(0);
		},
		onShow() {
			if(this.hasLogin && this.agentMember.purpose != 'everybody' && this.memberActivityTags.length == 0){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/member-tag/list',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						category:'activity',
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data.length == 0){
								uni.navigateTo({
									url:'/pages/user/attentionActivity'
								})
							}else{
								that.memberActivityTags = res.data.data;
							}
						}
					}
				});
			}
		}
	}
</script>

<style>
	.content{
		/* background: linear-gradient(to bottom, #fd6e99, #d498e1); */
	}
	.header{
		display: flex;
		justify-content: space-between;
	}
	.header .text{
		/* color: white; */
	}
	.header .right{
		display: flex;
		align-items: center;
	}
	.header .right text{
		font-size:16px;
		color: #8F8F94;
		margin-right: 10upx;
	}
	
	.tag-wrap{
		margin-right: 40upx;
		margin-top: 20upx;
		margin-bottom: 40upx;
	}
	.tag-scroll-wrap{
	
	}
	.tag-scroll{
		width: 100%;
		display: flex;
		white-space: nowrap;
	}
	.tag-scroll .tag{
		margin-right: 20upx;
		padding: 20upx 20upx;
		display: inline-flex;
		width: 25%;
		justify-content: center;
		font-size: 16px;
		font-weight: 900;
	}
	.tag-selected{
		border-radius: 60upx;
		background-color: #ded4ff;
		color: #7667a5;
	}
	
	.activity-wrap{
		
	}
	.activity-box{
		border-radius: 15upx;
		padding-bottom: 20upx;
		box-shadow:0 5upx 50upx 5upx #f2f2f2;
		margin-bottom: 40upx;
		background-color: white;
	}
	.activity-box image{
		border-radius:15upx 15upx 0 0;
		width: 100%;
		height:300upx;
	}
	.title-wrap{
		width: 100%;
		position: relative;
	}
	.title-wrap .title{
		font-weight: 900;
		position: absolute;
		top: 20upx;
		left: 20upx;
	}
	.title-wrap .date-box{
		height: 70upx;
		position: absolute;
		top: -55upx;
		right: 20upx;
		font-size: 13px;
		padding:0 40upx;
		border-radius: 60upx;
		background-color: #FFFFFF;
		box-shadow:0 12upx 20upx 0 #f2f2f2;
	}
	.title-wrap .date-box text{
		line-height: 70upx;
	}
	
	.join-wrap{
		width: 100%;
		margin-top: 80upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.join-wrap .members{
		display: flex;
		flex-direction: row;
		margin-left: 20upx;
	}
	.join-wrap .member{
		width: 80upx;
		height: 80upx;
		margin-right: 15upx;
	}
	.join-wrap .members image{
		width: 100%;
		height: 100%;
		border-radius: 40upx;
	}
	.join-wrap .text-box{
		margin-right: 20upx;
	}
	.join-wrap .text-box text{
		color: #7558ff;
		font-weight: 800;
	}
	
	.member-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 40upx;
		position: relative;
		padding-bottom: 40upx;
	}
	.member-wrap::after {
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
	.member-wrap-last::after {
		display:none;
	}
	
	.member-wrap .member-box{
		flex-grow: 1;
	}
	.avatar-wrap{
		position: relative;
	}
	.avatar-wrap .identification{
		position: absolute;
		top: 0;
		left: 100upx;
		border-radius: 20upx;
		padding: 5upx 10upx;
		color: white;
		font-size: 10px;
		background: linear-gradient(to bottom, #ae74ff, #7558ff);
	}
	.avatar-wrap .vip{
		width: 36upx;
		height: 36upx;
		position: absolute;
		top: 0;
		left: 215upx;
	}
	.member-wrap .member-box .avatar-wrap .avatar{
		width: 150upx;
		height: 150upx;
		border-radius: 75upx;
	}
	.member-wrap .member-box .name-wrap{
		margin-top:20upx;
		font-size: 19px;
		font-weight: 900;
	}
	.member-wrap .member-box .name-wrap .male{
		background: linear-gradient(to right, #00c0ff, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	.member-wrap .member-box .name-wrap .female{
		background: linear-gradient(to right, #ff527f, #7558ff); /* 标准的语法 */
	    -webkit-background-clip: text;
	    color: transparent;
	}
	.member-wrap .member-box .name-wrap .point{
		padding: 0 5upx;
		font-size: 12px;
	}
	.member-box .name-wrap .sex, .member-box .name-wrap .age{
		font-size: 14px;
	}
	.member-box .name-wrap .sex{
		margin-left: 10upx;
	}
	.member-wrap .photo-box-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.member-wrap .photo-box{
		width: 260upx;
		height: 315upx;
		display: flex;
		justify-content: center;
		position: relative; 
	}
	.member-wrap .photo-box .photo-bg, .member-wrap .photo-box .photo{
		width: 90%;
		height: 90%;
		position:absolute;
	}
	.member-wrap .photo-box .photo-bg{
		/* align-items: flex-start; */
		top: 0;
		left: 0;
	}
	.member-wrap .photo-box .photo{
		/* align-items: flex-end; */
		bottom: 0;
		right: 0;
		border-radius: 15upx;
	}
	.member-wrap .btn-invate{
		margin-top: 40upx;
	}
	
	.member-wrap .member-box .tags{
		display: flex;
		flex-direction: row;
		margin-top: 20upx;
	}
	.member-wrap .member-box .tags-female .tag{
		border-radius: 50upx;
		padding: 5upx 10upx;
		border: 1px solid #ffc7d5;
		background-color: #ffedf3;
		color: #ff4b7d;
		margin-right: 10upx;
	}
	.member-wrap .member-box .tags-male .tag{
		border-radius: 50upx;
		padding: 5upx 10upx;
		border: 1px solid #88dfff;
		background-color: #e5f7fe;
		color: #00a9ee;
		margin-right: 10upx;
	}
	
	.member-wrap .member-box .location-wrap{
		margin-top: 70upx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}
	.member-wrap .member-box .location-wrap .icon-location{
		width: 25upx;
		height: 35upx;
		margin-right: 20upx;
	}
	.member-wrap .member-box .location-wrap text{
		color: #8F8F94;
	}
	
	.bottom-bar-block{
		height: 100upx;
		align-items: flex-end;
	}
	.bottom-bar-wrap{
		width: 100%;
		position:fixed;
		left: 0;
		bottom: 0;
		height: 100upx;
		background-color: white;
		opacity: 0.95;
		box-shadow: 0px -2px 30px 2px #f8f8f8;
	}
	
	.bottom-bar{
		position:fixed;
		left: 40upx;
		right: 40upx;
		bottom: 0;
		height: 100upx;
		display: flex;
		flex-direction: row;
	}
	.bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.bottom-bar .bar-box .item{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
	}
	.bottom-bar .bar-box .item text{
		margin-left: 10upx;
	}
	
	.more-wrap{
		display: flex;
		justify-content: center;
		margin-bottom: 40upx;
	}
	
</style>
