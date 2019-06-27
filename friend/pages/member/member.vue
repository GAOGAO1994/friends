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
			<view class="member-wrap">
				<view class="avatar-wrap">
					<image class="avatar" mode="scaleToFill" :src="member.avatarUrl" @click="detail"></image>
					<!-- <view class="identification"><text>实名认证</text></view>
					<image v-if="member.vipStatus != 'non'" class="vip" mode="scaleToFill" :src="member.vipStatus == 'vip'?'../../static/img/icons/icon-vip.png':'../../static/img/icons/icon-vip-expiry.png'"></image> -->
				</view>
				<view class="name-wrap">
					<text class="name-female">{{member.nickname}}</text>
					<!-- <text class="label">{{member.sex}} • {{member.age}}</text>
					<f-icon type="vip" color="#7558ff" size="24"></f-icon> -->
				</view>
				<!-- <view class="row">
					<text class="label">{{member.address}}</text>
				</view> -->
				<view v-if="member.slogan" class="row">
					<f-icon type="heart" color="#7558ff" size="20"></f-icon>
					<text class="slogan">{{member.slogan}}</text>
				</view>
				
				<view class="gain-wrap margin-top">
					<text class="label">粉丝</text>
					<text class="text">{{member.followGet}}</text>
					<text class="space"></text>
					<text class="label">获赞</text>
					<text class="text">{{member.thumbsUpGet}}</text>
					<text class="space"></text>
					<text class="label">获邀</text>
					<text class="text">{{member.inviteGet}}</text>
				</view>
				
				<!-- <view class="line margin-top"></view> -->
				<view class="interactive-wrap margin-top">
					<view class="follow" @click="attention()" :class="isAttention?'active':''">
						<f-icon type="attention" size="20" :color="isAttention?'#ffffff':'#999999'"></f-icon>
						<text>{{isAttention?'已':''}}关注</text>
					</view>
					<view class="thumbs-up" @click="thumbsup()" :class="isThumbsup?'active':''">
						<f-icon type="thumbs-up" size="20" :color="isThumbsup?'#ffffff':'#999999'"></f-icon>
						<text>{{isThumbsup?'已':''}}点赞</text>
					</view>
				</view>
				
				<view class="information-wrap margin-top">
					<scroll-view class="scroll-wrap" scroll-x="true" scroll-left="0">
						<view class="item">
							<text class="text">{{member.sex}}</text>
							<text class="label">性别</text>
						</view>
						<view class="space"></view>
						<view class="item">
							<text class="text">{{member.age}}</text>
							<text class="label">年龄</text>
						</view>
						<view class="space"></view>
						<view class="item">
							<text class="text">{{member.maritalStatusName}}</text>
							<text class="label">婚姻状况</text>
						</view>
						<view class="space"></view>
						<view class="item">
							<text class="text">{{member.education}}</text>
							<text class="label">学历</text>
						</view>
						<view class="space"></view>
						<view class="item">
							<text class="text">{{member.city}}</text>
							<text class="label">城市</text>
						</view>
						<view class="space"></view>
						<view class="item box-more" @click="detail">
							<text class="text">...</text>
							<text class="label">更多</text>
						</view>
						<!-- <view class="item box-more last">更多</view> -->
						<!-- <view v-if="member.height" class="item">
							<f-icon v-if="conceal.height" type="lock" color="#8F8F94" size="26"></f-icon>
							<text v-else class="text">{{member.height?member.height+'cm':'--'}}</text>
							<text class="label">身高</text>
						</view>
						<view v-if="member.weight" class="item">
							<f-icon v-if="conceal.weight" type="lock" color="#8F8F94" size="26"></f-icon>
							<text v-else class="text">{{member.weight?member.weight+'kg':'--'}}</text>
							<text class="label">体重</text>
						</view> 
						<view v-if="member.industry" class="item last">
							<text class="text">{{member.industry}}</text>
							<text class="label">行业</text>
						</view>
						-->
					</scroll-view>
				</view>
				
				<!-- 相册 -->
				<!-- <view v-if="member.photos.length>0" class="phtoto-wrap margin-top">
					<scroll-view class="scroll-wrap" scroll-x="true" scroll-left="0">
						<view class="phtoto-box item" v-for="(phtoto, index) in member.photos" :class="{last:index == member.photos.length-1}">
							<image mode="scaleToFill" :src="phtoto.url" @click="preview(phtoto)"></image>
							<view v-if="index < member.photos.length-1" class="space"></view>
						</view>
					</scroll-view>
				</view> -->
				
				<view v-if="member.hobbies.length > 0" class="tag-wrap margin-top">
					<view class="left red">
						<text class="sub-title">{{he}}的</text>
						<text class="title">爱好</text>
					</view>
					<view class="right">
						<view class="tag" v-for="tag in member.hobbies">{{tag.tagName}}</view>
					</view>
				</view>
				<view v-if="member.impression.length > 0" class="tag-wrap margin-top">
					<view class="left blue">
						<text class="sub-title">朋友</text>
						<text class="title">印象</text>
					</view>
					<view class="right">
						<view class="tag" v-for="tag in member.impression">{{tag}}</view>
					</view>
				</view>
				<view v-if="member.requirements.length > 0" class="tag-wrap margin-top">
					<view class="left light">
						<text class="sub-title">择偶</text>
						<text class="title">标准</text>
					</view>
					<view class="right">
						<view class="tag" v-for="tag in member.requirements">{{tag.tagName}}</view>
					</view>
				</view>
				
				<view class="tab-wrap margin-top">
					<text class="tab" :class="{selected:activityTab.selectIndex == 0}" @click="select(0)">{{he}}的活动</text>
					<text class="tab last" :class="{selected:activityTab.selectIndex == 1}" @click="select(1)">{{he}}的相册</text>
				</view>
				<view class="tab-content" v-if="activityTab.selectIndex == 0">
					<view class="activity-box" v-for="(activityMember, index) in member.activityMembers">
						<image style="aspectFill" :src="activityMember.activity.thumbnail" @click="enter('/pages/activity/activity?id=' + activityMember.activity.id)"></image>
						<view class="title-wrap" @click="enter('/pages/activity/activity?id=' + activityMember.activity.id)">
							<text class="title">{{activityMember.activity.title}}</text>
							<view class="date-box">
								<text>{{activityMember.activity.activityDate}}</text>
							</view>
							<view style="clear: both;"></view>
						</view> 
						<view class="join-wrap">
							<view class="members">
								<view class="member" v-for="(activityMember, memberIndex) in activityMember.activity.activityMemberList" v-if="memberIndex<5" :key="memberIndex">
									<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
								</view>
							</view>
							<view class="text-box">
								<view>已有<text>{{activityMember.activity.activityMemberList.length}}人</text>报名</view>
							</view>
						</view>
						<view v-if="userActivity[activityMember.activity.id]" class="sign-wrap border">
							<view v-if="!userActivity[activityMember.activity.id].likes || userActivity[activityMember.activity.id].likes2.indexOf(activityMember.id+',') < 0" class="like-wrap">
								<text class="">你们都已报名活动，中意{{he}}？</text>
								<!-- <view class="button" @click="like(userActivity[activityMember.activity.id], activityMember)">中意{{he}}</view> -->
								<f-icon type="heart" color="#8F8F94" size="28" @click="like('like', activityMember)"></f-icon>
							</view>
							<view v-else class="like-wrap">
								<text class="">你们都已报名活动</text>
								<f-icon type="heart" color="#fc597b" size="28" @click="like('unlike', activityMember)"></f-icon>
							</view>
						</view>
						<view v-else class="sign-wrap border">
							<text class="">中意{{he}}？去报名和{{he}}一起参加活动</text>
							<view class="button" @click="enter('/pages/activity/activity?id=' + activityMember.activity.id)">去报名</view>
						</view>
					</view>
					<view v-if="member.activityMembers.length == 0" class="invite-wrap margin-top-40">
						<text>{{he}}还没有参加任何活动，邀请{{he}}</text>
						<view class="button-wrap" @click="inviteApply('invite')">
							<image mode="aspectFit" src="../../static/img/icons/bird.png"></image>
							<text>{{member.inviteStatus=='inviting'?'邀请中':'邀请'+he}}</text>
						</view>
					</view>
				</view>
				<view class="tab-content" v-if="activityTab.selectIndex == 1">
					<view class="phtoto-wrap">
						<view class="phtoto-box" v-for="(phtoto, index) in member.photos" :class="{marginleft:index%2==0}">
							<image mode=" aspectFit" :src="phtoto.url" @click="preview(phtoto)"></image>
						</view>
					</view>
					<view class="invite-wrap margin-top-40 no-more" v-if="member.photos.length==0">没有照片</view>
				</view>
				
			</view>
			
			
		</view>
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<view class="item" @click="inviteApply('appointment')">
						<f-icon type="contact" color="#7558ff" size="28"></f-icon>
						<text>一对一约见</text>
					</view>
					<!-- <view class="item" @click="operate('matchmaking')">
						<f-icon type="contact" color="#7558ff" size="28"></f-icon>
						<text>牵线</text>
					</view> -->
					<view class="item" @click="consult">
						<f-icon type="consult" color="#7558ff" size="28"></f-icon>
						<text>咨询</text>
					</view>
					<!-- <view class="item" @click="inviteApply('invite')">
						<button open-type="share"><f-icon type="share" color="#7558ff" size="28"></f-icon>邀请</button>
					</view> -->
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		<image-preview :show="previewOpen" :src="previewSrc" @close="closePreview"></image-preview>
		<activity-picker :show="showActivityPicker" :activities="userActivities" @close="closeActivityPicker"></activity-picker>
	</view>
</template>

<script>
	import Vue from 'vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import imagePreview from '@/components/preview/image-preview.vue';
	import activityPicker from '@/components/user-switch/activity-picker.vue';
	import memberSvc from '@/services/member/member.js';
	import dateUtil from '@/services/util/dateUtil.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon,imagePreview,activityPicker},
		data() {
			return{
				interactive:{
					attention:{
						disabled:false
					},
					thumbsup:{
						disabled:false
					}
				},
				isAttention:false,
				isThumbsup:false,
				followId:0,
				thumbsupId:0,
				member:{
					id:0,
					account:{},
					thumbsUpGet:0,
					followGet:0,
					inviteGet:0,
					conceal:'{}',
					hobbies:[],
					impression:[],
					requirements :[],
					activityMembers:[],
					activities:[],
					photos:[]
				},
				activityTab:{
					selectIndex:0
				},
				previewOpen:false,
				previewSrc:'',
				userActivity:{},			//登陆用户参加的活动{id:activity}
				userActivities:[],			//登陆用户参加的活动
				showActivityPicker:false	//用户已经参加的活动选择
			}
		},
		computed: {
			...mapState(['account', 'target']),
			...mapGetters(['agentMember']),
			he:function(){
				return this.member.sex == '女'?'她':'他';
			},
			conceal:function(){
				return JSON.parse(this.member.conceal);
			}
		},
		methods:{
			...mapMutations(['targetActivity', 'targetMember']),
			enter:function(url){
				uni.navigateTo({
					url:url
				})
			},
			detail:function(){
				this.targetMember(this.member);
				this.enter('detail');
			},
			enterActivity:function(activity){
				this.targetActivity(activity);
				this.enter('/pages/activity/activity?id=' + activity.id);
			},
			closeActivityPicker:function(activity){
				this.showActivityPicker = false;
				if(activity){
					for(let i=0; i<this.member.activityMembers.length; i++){
						if(this.member.activityMembers[i].activityId == activity.id){
							uni.showModal({
								title: '提示',
								content: this.he + '已经参加该活动，中意'+this.he+'？',
								cancelText:'再看看',
								confirmText:'中意',
								success: function (res) {
									if (res.confirm) {
										
									} 
								}
							});
							return;
						}
					}
					
					let that = this;
					uni.showModal({
						title: '确定',
						content: '提交邀请？',
						success: function (res) {
							if (res.confirm) {
								that.invateSave(activity.id);
							} 
						}
					});
				}
			},
			consult:function(){
				uni.navigateTo({
					url: '/pages/form/kefu'
				});
			},
			inviteApply:function(kind){
				let targetMember = this.member;
				if(targetMember.agentAccountId === this.account.id){
					uni.showToast({
						icon:'none',
						title:kind=='appointment'?'和自己约会不需要申请哦':'无需邀请自己'
					})
					return;
				}
				if(targetMember.inviteStatus == 'inviting'){
					uni.showToast({
						icon:'none',
						title:kind=='appointment'?'已提交约见申请，请耐心等待':'已邀请，请耐心等待'
					})
					return;
				}
				if(kind == 'appointment'){
					this.appointment(targetMember);
				}else if(kind == 'invite'){
					this.invite(targetMember);
				}
			},
			appointment:function(targetMember){
				//检查会员账户
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/member-account/getOne',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							if(res.data.data && res.data.data.appointmentRemain > 0){
								//跳转申请页面
								that.targetMember(targetMember);
								uni.navigateTo({
									url:'/pages/form/apply?targetMemberId='+targetMember.id
								})
							}else{
								//跳转会员付费页面
								uni.navigateTo({
									url:'/pages/user/vip'
								})
							}
						}
					}
				});
			},
			invite:function(targetMember){
				if(this.userActivities.length > 0){
					this.showActivityPicker = true;
				}else{
					//获取用户已经参加的活动
					uni.showModal({
						title: '提示',
						content: '您当前没有报名任何活动，您需要先报名再邀请'+this.he,
						confirmText:'去报名',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/activity/activities'
								})
							} 
						}
					});
				}
			},
			invateSave:function(activityId){
				let that = this;
				let targetMember = this.member;
				uni.request({
					url: this.$http.contextPath + 'invite/save',
					method:'POST',
					data:{
						agentAccountId:this.agentMember.agentAccountId,
						memberId:this.agentMember.id,
						accountId:this.agentMember.accountId,
						targetMemberId:targetMember.id,
						targetAgentAccountId:targetMember.agentAccountId,
						activityId:activityId,
						kind:'invite',
						inviteStatus:'inviting',
						nickname:this.agentMember.nickname
					},
					success(res) {
						if(that.$http.success(res)){
							// targetMember.inviteStatus = 'inviting';
							// targetMember.inviteLabel = '邀请中';
							// that.member.inviteStatus = 'inviting';
							// that.member.inviteLabel = '邀请中';
							Vue.set(that.member, 'inviteStatus', 'inviting');
						}
					}
				});
			},
			like:function(type, activityMember){
				//userActivityMember:用户的报名记录
				//activityMember:中意会员的报名记录
				let likes = '';
				let userActivityMember = this.userActivity[activityMember.activity.id];
				if(type == 'like'){
					likes = (userActivityMember.likes)?userActivityMember.likes+','+activityMember.id:activityMember.id
				}else{
					if(userActivityMember.likes){
						let a = new String(userActivityMember.likes).split(',');
						for(let i=0; i<a.length; i++){
							if(a[i] != activityMember.id){
								likes += ',' + a[i];
							}
						}
						if(likes.length > 0){
							likes = likes.substring(1);
						}
					}
				}
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'base/activity-member/updateById',
					method:'POST',
					data:{
						id: userActivityMember.id,
						likes: likes
					},
					success(res) {
						if(that.$http.success(res)){
							let obj = Object.assign({}, that.userActivity);
							obj[activityMember.activity.id].likes = likes;
							obj[activityMember.activity.id].likes2 = likes+",";
							that.userActivity = obj;
						}
					}
				});
			},
			attention:function(){
				setTimeout(() => { 
					this.interactive.attention.disabled = false;
				}, 1000)
				
				if(this.interactive.attention.disabled){
					return;
				}else{
					this.interactive.attention.disabled = true;
				}
				
				//判断是否是自己
				if(this.member.id === this.agentMember.id){
					uni.showToast({
						icon:'none',
						title: '无法关注自己'
					});
					return;
				}
				
				this.isAttention = !this.isAttention;
				if(this.isAttention){
					this.member.followGet++;
				}else{
					this.member.followGet--;
				}
				this.interactiveSubmit({
					id: this.followId,
					kind: 'follow', 
					workStatus: (this.isAttention)?'active':'cancel'
				});
			},
			thumbsup:function(){
				setTimeout(() => { 
					this.interactive.thumbsup.disabled = false;
				}, 1000)
				
				if(this.interactive.thumbsup.disabled){
					return;
				}else{
					this.interactive.thumbsup.disabled = true;
				}
				
				this.isThumbsup = !this.isThumbsup;
				if(this.isThumbsup){
					this.member.thumbsUpGet++;
				}else{
					this.member.thumbsUpGet--;
				}
				this.interactiveSubmit({
					id: this.thumbsupId,
					kind: 'thumbsup', 
					workStatus: (this.isThumbsup)?'active':'cancel'
				});
			},
			select:function(index){
				this.activityTab.selectIndex = index;
			},
			preview:function(photo){
				this.previewSrc = photo.url;
				this.previewOpen = true;
			},
			closePreview:function(){
				this.previewOpen = false;
			},
			async getUserActivities(){
				let that = this;
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'member/getActivities',
					method:'POST',
					data:{
						id:this.agentMember.id
					}
				});
				if(this.$http.success(res)){
					res.data.data.activityMembers.forEach(item =>{
						if(item.likes){
							item.likes2 = item.likes+',';
						}
						that.userActivity[item.activityId] = item;
					})
					res.data.data.activities.forEach(item =>{
						if(that.userActivity[item.id]){
							that.userActivities.push(item);
						}
					})
				}
			},
			async getInfo(id, from){
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'member/getInfo',
					method:'POST',
					data:{
						id:id
					}
				});
				if(this.$http.success(res)){
					if(from != 'local'){
						Object.assign(this.member, res.data.data.member);
						this.member.city = memberSvc.getCity(this.member.residence);
						this.member.maritalStatusName = memberSvc.getMaritalStatusName(this.member.maritalStatus);
					}
					
					if(res.data.data.memberIndex){
						this.member.followGet = res.data.data.memberIndex.followGet;
						this.member.thumbsUpGet = res.data.data.memberIndex.thumbsUpGet;
						this.member.inviteGet = res.data.data.memberIndex.inviteGet;
					}
					
					let hobbies =[];
					let requirements =[];
					res.data.data.tags.forEach(item =>{
						if(item.category == 'hobby'){
							hobbies.push(item);
						}
						else if(item.category == 'requirement'){
							requirements.push(item);
						}
					})
					this.member.hobbies = hobbies;
					this.member.requirements = requirements;
					
					//活动
					let myActivity = {};
					res.data.data.activityMembers.forEach(item =>{
						myActivity[item.activityId] = item;
					})
					
					let activities = [];
					res.data.data.activities.forEach(item =>{
						if(myActivity[item.id]){
							let a = item.activityDate.split('-');
							item.activityDate = a[1]+'/'+a[2]+'  '+dateUtil.getDay(item.activityDate);
							myActivity[item.id].activity = item;
						}else{
							activities.push(item);
						}
					})
					this.member.activityMembers = res.data.data.activityMembers;
					this.member.activities = activities;
				}
			},
			async getInteractive(id){
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'member/interactive/list',
					method:'POST',
					data:{
						memberId:this.agentMember.id,
						targetMemberId:id
					}
				});
				if(this.$http.success(res)){
					res.data.data.forEach(item => {
						if(item.kind == 'follow'){
							this.isAttention = (item.workStatus == 'active');
							this.followId = item.id;
						}
						else if(item.kind == 'thumbsup'){
							this.isThumbsup = (item.workStatus == 'active');
							this.thumbsupId = item.id;
						}
					});
				}
			},
			interactiveSubmit:function(param){
				if(param.id == 0)delete param.id;
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/interactive/saveOrUpdate',
					method:'POST',
					data:{
						...param,
						memberId:this.agentMember.id,
						agentAccountId:this.agentMember.agentAccountId,
						targetMemberId:this.member.id,
						targetAgentAccountId:this.member.agentAccountId
					},
					success(res) {
						if(that.$http.success(res)){
							if(param.kind == 'follow'){
								that.followId = res.data.data.id;
							}else if(param.kind == 'thumbsup'){
								that.thumbsupId = res.data.data.id;
							}
						}
					}
				});
			},
			getPhotos:function(id){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/album/list',
					method:'POST',
					data:{
						memberId:id,
						status:'1'
					},
					success(res) {
						if(that.$http.success(res)){
							that.member.photos = res.data.data;
						}
					}
				});
			},
			init:function(id){
				if(id == parseInt(this.target.member.id)){
					Object.assign(this.member, this.target.member);
					this.member.city = memberSvc.getCity(this.member.residence);
					this.member.maritalStatusName = memberSvc.getMaritalStatusName(this.member.maritalStatus);
				}
			}
		},
		onLoad(option) {
			let id = option.id;
			if(option.from == 'local'){
				this.init(id);
			}
			this.getInfo(id, option.from);
			this.getInteractive(id);
			this.getPhotos(id);
			//
			this.getUserActivities();
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			    return {
			      title: '为你推荐 ' + this.member.nickname + " 【阅见分享】",
			      imageUrl:this.member.avatarUrl,
			      path: '/pages/member/member?from=remote&id='+this.member.id
			    }
			}
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.margin-top{
		margin-top: 60upx;
	}
	.margin-top-40{
		margin-top: 40upx;
	}
	.member-wrap{
		width:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* #ifdef H5 */
		margin-top: 80upx;
		/* #endif */
		/* #ifndef H5 */
		margin-top: 160upx;
		/* #endif */
	}
	.avatar-wrap{
		width: 100%;
		height: 240upx;
		position: relative;
		align-self: center;
		display: flex;
		justify-content: center;
	}
	.avatar-wrap .avatar{
		width: 240upx;
		height: 240upx;
		border-radius: 120upx;
	}
	.avatar-wrap .identification{
		position: absolute;
		top: 0;
		left: 380upx;
		border-radius: 20upx;
		padding: 5upx 10upx;
		color: white;
		font-size: 10px;
		background: linear-gradient(to bottom, #ae74ff, #7558ff); /* 标准的语法 */
	}
	.avatar-wrap .vip{
		width: 58upx;
		height: 33upx;
		position: absolute;
		top: 0;
		left: 490upx;
	}
	.member-wrap .name-wrap{
		margin-top: 30upx;
	}
	.member-wrap .name-wrap .label{
		margin: 0 10upx;
	}
	.name-female, name-male{
		font-size:1.6em;
	}
	.member-wrap .row{
		width: 100%;
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.member-wrap .row .label{
		margin-left: 10upx;
	}
	/* .slogan{
		line-height: 24px;
	} */
	.gain-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.gain-wrap .label{
		color: #8F8F94;
	}
	.gain-wrap .text{
		font-size: 1.6em;
		font-weight: 900;
		margin-left: 10upx;
	}
	.gain-wrap .space{
		width: 80upx;
	}
	
	/* .activity-wrap{
		position: relative;
		display: flex;
		width: 100%;
		color: white;
		background: url(../../static/img/banner/banner-sign.png) no-repeat center;
		background-size:100% 100%;
	}
	.activity-wrap image{
		width:100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	.activity-wrap .left{
		width: 65%;
		display: flex;
		flex-direction: column;
		padding: 40upx;
	}
	.activity-wrap .right{
		width: 35%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.activity-wrap .left .status{
		font-size:1.4em;
		font-weight: 900;
	}
	.activity-wrap .left .text{
		margin-top: 20upx;
	}
	.activity-wrap .right .button{
		border-radius: 50upx;
		border: 1px solid white;
		padding: 15upx 30upx;
	} */
	
	.phtoto-wrap{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding-bottom: 40upx;
		padding-top:10upx;
	}
	/* .phtoto-wrap .scroll-wrap .item{
		display: inline-flex;
	}
	.phtoto-wrap image{
		width:150upx;
		height: 150upx;
	}
	.phtoto-wrap .space{
		width:30upx;
	} */
	
	.phtoto-box{
		display: flex;
		margin-top: 10upx;
	}
	.phtoto-box image{
		width:330upx;
		height: 330upx;
		border-radius: 15upx;
	}
	.phtoto-wrap .marginleft{
		padding-right: 10upx;
	}
	
	.tag-wrap{
		display: flex;
		width: 100%;
		border-radius: 20upx;
		box-shadow:0 0 30upx 15upx #f8f8f8;
	}
	.tag-wrap .left{
		width:140upx;
		min-width:140upx;
		min-height: 180upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color:white;
		border-top-left-radius: 20upx;
		border-bottom-left-radius: 20upx;
	}
	.tag-wrap .right{
		display:flex;
		flex-wrap: wrap;
		flex-grow: 1;
		padding-left: 10upx;
		padding-top: 10upx;
		padding-right: 30upx;
		padding-bottom: 30upx;
	}
	.tag-wrap .red{
		background: linear-gradient(to bottom right, #fe61a0, #fe9474);
	}
	.tag-wrap .blue{
		background: linear-gradient(to bottom right, #7a6efe, #c07dfe);
	}
	.tag-wrap .light{
		background: linear-gradient(to bottom right, #5676ff, #5cdeff);
	}
	.tag-wrap .left .title{
		font-size: 20px;
		font-weight: bold;
		margin-top: 12upx;
	}
	.tag-wrap .left .sub-title{
		font-size: 12px;
	}
	.tag-wrap .tag{
		height: 32upx;
		line-height: 32upx;
		padding: 10upx 30upx;
		border: 1px solid #C8C7CC;
		background-color: #F2F2F2;
		color: #777777;
		border-radius: 80upx;
		margin-left: 20upx;
		margin-top: 20upx;
	}
	
	.tab-wrap{
		display: flex;
		justify-content: center;
	}
	.tab-wrap .tab{
		padding: 15upx 40upx;
		color: #999999;
		font-size: 18px;
		border-radius: 100upx;
		margin-right: 40upx;
	}
	.tab-wrap .selected{
		color: #7667a5;
		font-weight: 900;
		background-color: #ded4ff;
		border-radius: 100upx;
	}
	.tab-wrap .last{
		margin-right: 0;
	}
	
	.interactive-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.interactive-wrap .follow, .interactive-wrap .thumbs-up{
		display: flex;
		justify-content: center;
		align-items: center;
		border:1px solid #999999;
		border-radius: 100upx;
		padding:15upx 40upx;
	}
	.interactive-wrap .active{
		border:1px solid #fe8dc8;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b);
	}
	.interactive-wrap .follow{
		margin-right: 40upx;
	}
	.interactive-wrap text{
		font-size: 12px;
		color: #999999;
		margin-left: 10upx;
	}
	.interactive-wrap .active text{
		font-size: 12px;
		color: #ffffff;
		margin-left: 10upx;
	}
		
	.information-wrap{
		width: 100%;
	}	
	.scroll-wrap{
		width: 670upx;
		display: flex;
		white-space: nowrap;
		align-items: center;
	}
	.information-wrap .scroll-wrap .item{
		display: inline-flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.scroll-wrap .last{
		margin-right: 0;
	}
	.information-wrap .item .label{
		color: #8F8F94;
		margin-top: 20upx;
	}
	.information-wrap .item .text{
		font-size: 1.2em;
		font-weight: 900;
	}
	.information-wrap .space{
		width: 60upx;
		display: inline-flex;
	}
	.information-wrap .box-more{
		display: flex;
		justify-content: center;
	}
	
	.tab-content{
		width:100%;
		display: flex;
		flex-direction: column;
	}
	.activity-box{
		width: 100%;
		border-radius: 15upx;
		padding-bottom: 20upx;
		box-shadow:0 12upx 50upx 10upx #f2f2f2;
		margin-top: 20upx;
		margin-bottom: 40upx;
	}
	.activity-box image{
		border-radius:15upx 15upx 0 0;
		width: 100%;
		height:300upx;
	}
	.no-more{
		margin-bottom: 40upx;
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
		top: -35upx;
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
		margin-top: 90upx;
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
		width: 60upx;
		height: 60upx;
		margin-right: 15upx;
	}
	.join-wrap .members image{
		width: 100%;
		height: 100%;
		border-radius: 30upx;
	}
	.join-wrap .text-box{
		margin-right: 20upx;
	}
	.join-wrap .text-box text{
		color: #7558ff;
		font-weight: 800;
	}
	.activity-box .sign-wrap{
		margin-left: 20upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-right:20upx;
		padding-top: 20upx;
		padding-bottom: 20upx;
		position: relative;
	}
	.activity-box .sign-wrap.border::before {
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        height: 1upx;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #c8c7cc;
    }
	
	.activity-box .sign-wrap .like-wrap{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.activity-box .sign-wrap .button{
		color: white;
		border-radius: 80upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
		height: 60upx;
		line-height: 60upx;
		display: flex;
		align-items: center;
		padding: 0 30upx;
	}
	
	.invite-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.button-wrap{
		border-radius: 50upx;
		background: linear-gradient(to bottom, #fe8dc8, #fc597b); /* 标准的语法 */
		box-shadow: 0px 0px 10px #fe8dc8;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
		margin-top: 20upx;
	}
	.invite-wrap .button-wrap image{
		width: 60upx;
	}
	.invite-wrap .button-wrap text{
		color: white;
		font-weight: normal;
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
	.bottom-bar .bar-box .item button{
		background-color: white;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
	
	.bottom-bar .bar-box .item button::after{ 
		border: none;
	} 
	
</style>
