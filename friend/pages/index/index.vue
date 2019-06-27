<template>
    <view class="content">
        <swiper indicator-dots="true" indicator-color="rgba(255, 255, 255, .5)" indicator-active-color="#ffffff">
			<swiper-item v-for="(img,key) in imgUrls" :key="key">
				<image style="widthFix" :src="img" />
			</swiper-item>
		</swiper>
		
		<view class="nav-menu">
			<view v-for="(menu,menuId) in menus" :key="menuId">
				<navigator class="menu-box" :url="menu.url">
					<image style="aspectFit" :src="menu.icon" />
					<text class="">{{menu.title}}</text>
				</navigator>
			</view>
		</view>
		
		<view class="padding-h">
			<view class="title-bar">
				<text class="title">相亲会</text>
				<navigator class="more" url="../activity/activities">更多></navigator>
			</view>
			<view class="activity-box" v-for="(activity, index) in activities">
				<image style="aspectFill" :src="activity.thumbnail" @click="enterActivity(activity)"></image>
				<view class="title-wrap" @click="enterActivity(activity)">
					<text class="title">{{activity.title}}</text>
					<view class="date-box">
						<text>{{activity.activityDate}}</text>
					</view>
					<view style="clear: both;"></view>
				</view> 
				
				<view class="join-wrap">
					<view class="members">
						<view class="member" v-for="(activityMember, memberIndex) in activity.activityMemberList" v-if="memberIndex<5" :key="memberIndex"  @click="enter('/pages/member/member?from=remote&id='+activityMember.memberId)">
							<image mode="scaleToFill" :src="activityMember.avatarUrl"></image>
						</view>
					</view>
					<view class="text-box">
						<view>已有<text>{{activity.activityMemberList.length}}人</text>报名</view>
					</view>
				</view>
			</view>
			
			<view class="title-bar padding-top">
				<text class="title">相亲角</text>
				<navigator class="more" url="../member/members">更多></navigator>
			</view>
			<view v-for="(member, index) in members" class="member-wrap" :class="index===members.length-1?'member-wrap-last':''">
				<view class="member-box">
					<view class="avatar-wrap" @click="viewMember(member)">
						<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
						<!-- <view class="identification"><text>实名认证</text></view>
						<image v-if="member.vipStatus != 'non'" class="vip" mode="scaleToFill" :src="member.vipStatus == 'vip'?'../../static/img/icons/icon-vip.png':'../../static/img/icons/icon-vip-expiry.png'"></image> -->
					</view>
					<view class="name-wrap" @click="viewMember(member)">
						<text :class="member.sex=='女'?'female':'male'">{{member.nickname}}</text>
						<text class="sex gray">{{member.sex}}</text>
						<text class="point gray">•</text>
						<text class="age gray">{{member.age}}岁</text>
					</view>
					<view class="tags" :class="member.sex=='女'?'tags-female':'tags-male'">
						<view class="tag" v-for="(tag, tagIndex) in member.tags" :key="tagIndex">
							<text>{{tag.name}}</text>
						</view>
					</view>
					<view class="location-wrap">
						<image class="icon-location" style="aspectFit" src="../../static/img/icons/icon-location.png"></image>
						<text>{{member.cityAndCounty}}</text>
					</view>
				</view> 
				<view class="photo-box-wrap">
					<view class="photo-box">
						<image class="photo-bg" style="aspectFill" :src="member.sex == '女'?femaleBg:maleBg"></image>
						<image class="photo" style="aspectFill" :src="member.avatarUrl" @click.stop="preview(member.avatarUrl)"></image>
					</view>	
					<!-- <button v-if="activityId" class="btn-invate" :class="member.sex == '女'?'female':'male'">邀请{{member.sex == '女'?'她':'他'}}</button> -->
					<button class="btn-invate" :class="member.sex == '女'?'female':'male'" @click.stop="appointment(member)">{{member.inviteLabel}}</button>
					<!-- <button v-else class="btn-invate" :class="member.sex == '女'?'female-disable':'male-disable'" @click.stop="appointment(member)">{{member.inviteLabel}}</button> -->
				</view>	
			</view>
			
			<!-- <view class="title-bar">
				<text class="title">恋爱学院</text>
				<navigator class="more" url="../reg/reg">更多></navigator>
			</view>
			
			<view class="lecture-scroll">
				<scroll-view class="lecture-wrap" scroll-x="true" scroll-left="0">
					<view class="lecture-box" v-for="(lecture, index) in lectures" :class="index < lectures.length-1?'space':'last'">
						<view style="width: 100%;" :class="lecture.style">
							<view class="lecture-header">
								<text class="title">{{lecture.title}}</text>
							</view>
							<view class="cover">
								<image mode="widthFix" :src="lecture.thumbnail"></image>
							</view>
							<view class="enrollment">
								<view class="date-box">
									<text>11/20 周日</text>
								</view>
								<view class="title">
									已有<text class="primary">{{lecture.enrollment}}人</text>报名
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view> -->
			
			<view class="title-bar">
				<text class="title">幸福资讯</text>
				<navigator class="more" url="../article/articles">更多></navigator>
			</view>			
			<view class="article-wrap">
				<view class="article-colunm">
					<view class="article-box" v-for="(article, index) in articles" v-if="index%2===0" @click="viewArticle(article)">
						<view class="thumbnail-box">
							<image mode="widthFix" :src="article.thumbnail"></image>
							<view v-if="article.video == '1'" class="video">
								<f-icon type="video" color="#333" size="64"></f-icon>	
							</view>
						</view>
						<view class="title">
							<text>{{article.title}}</text>
						</view>
						<view class="text-wrap">
							<text class="author">{{article.author}}</text>
							<text class="time">{{article.time}}</text>
						</view>
					</view>
				</view>
				<view class="article-colunm">
					<view class="article-box" v-for="(article, index) in articles" v-if="index%2===1" @click="viewArticle(article)">
						<view class="thumbnail-box">
							<image mode="widthFix" :src="article.thumbnail"></image>
							<view v-if="article.video == '1'" class="video">
								<f-icon type="video" color="#333" size="64"></f-icon>	
							</view>
						</view>
						<view class="title">
							<text>{{article.title}}</text>
						</view>
						<view class="text-wrap">
							<text class="author">{{article.author}}</text>
							<text class="time">{{article.time}}</text>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<!-- <view class="main-bottom-bar-wrap">
			<view class="circle">
				
			</view>
		</view>
		<view class="main-bottom-bar-block"></view> -->
		
		<login-modal :show="showLogin" @close="closeLoginModal"></login-modal>
		<image-preview :show="previewOpen" :src="previewSrc" @close="closePreview"></image-preview>
    </view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import imagePreview from '@/components/preview/image-preview.vue';
	import memberSvc from '@/services/member/member.js';
	import dateUtil from '@/services/util/dateUtil.js';
    import {mapState, mapGetters, mapMutations} from 'vuex'

    export default {
		components: {fIcon,loginModal,imagePreview},
        computed: {
			...mapState(['forcedLogin', 'hasLogin', 'account']),
			...mapGetters(['loginCheck','agentMember'])
		},
		data() {
			return {
				agentMemberId:0,
				showLogin:false,
				previewOpen:false,
				previewSrc:'',
				imgUrls: [
					this.$http.imgPath + "manage/banner1.jpg",
					this.$http.imgPath + "manage/banner2.jpg",
					this.$http.imgPath + "manage/banner3.jpg",
				],
				maleBg:this.$http.imgPath + "manage/photot-male.png",
				femaleBg:this.$http.imgPath + "manage/photot-female.png",
				menus:[{
					"icon": "../../static/img/icons/icon-xqh.png",
					"title": "相亲会",
					"url":"../activity/activities"
				},{
					"icon": "../../static/img/icons/icon-xqj.png",
					"title": "相亲角",
					"url":"../member/members"
				},{
					"icon": "../../static/img/icons/icon-laxy.png",
					"title": "情商学院",
					"url":"../college/college"
				},{
					"icon": "../../static/img/icons/icon-lazx.png",
					"title": "幸福资讯",
					"url":"../article/articles"
				}],
				activities:[],
				members:[],
				articles:[],
				lectures: [{
					"title": "情侣之间如何避 免冷暴力？",
					"thumbnail": "../../static/img/photo/cover-1.png",
					"time": "11/20 周日",
					"enrollment": 21,
					"style": "pink"
				},{
					"title": "情侣之间如何避 免冷暴力？",
					"thumbnail": "../../static/img/photo/cover-1.png",
					"time": "11/20 周日",
					"enrollment": 21,
					"style": "pink"
				},{
					"title": "情侣之间如何避 免冷暴力？",
					"thumbnail": "../../static/img/photo/cover-1.png",
					"time": "11/20 周日",
					"enrollment": 21,
					"style": "pink"
				}]
			}
		},
		watch: {
		 //    agentMemberId(newAccount, oldAccount) {
			// 	alert(newAccount + ':' + oldAccount);
			// 	if(newAccount != oldAccount){
			// 		this.getTop();
			// 	}
			// }
		},
		methods:{
			...mapMutations(['saveShareFrom','targetMember', 'targetActivity', 'targetArticle', 'loginSuccess', 'logout']),
			...mapMutations('all', ['topActivities']),
			preview:function(url){
				this.previewSrc = url;
				this.previewOpen = true;
			},
			closePreview:function(){
				this.previewOpen = false;
			},
			enter:function(url){
				this.showLogin = this.$croute.enter(this.loginCheck(url));
			},
			enterActivity:function(activity){
				this.targetActivity(activity);
				if(this.hasLogin){
					this.enter('/pages/activity/activity?id='+activity.id+'&shareOrigin='+this.account.id+'&shareFrom='+this.account.id);
				}else{
					this.showLogin = true;
				}
				// // #ifdef  H5
				// 	let result = this.loginCheck('/pages/index/index');
				// 	if(result.isPass){
				// 		window.location.href = window.location.href.split('#')[0] + '?' + '&time='+new Date().getTime() + '#/pages/activity/activity?id='+activity.id+'&shareOrigin='+this.account.id+'&shareFrom='+this.account.id;
				// 		// if(this.agentMember.purpose == 'everybody'){
				// 		// 	window.location.href = window.location.href.split('#')[0] + '?' + '&time='+new Date().getTime() + '#/pages/activity/activity?id='+activity.id+'&shareOrigin='+this.account.id+'&shareFrom='+this.account.id;
				// 		// }else{
				// 		// 	uni.navigateTo({
				// 		// 		url:'/pages/activity/activity?id='+activity.id
				// 		// 	})
				// 		// }
				// 	}else{
				// 		this.showLogin = this.$croute.enter(result);
				// 	}
				// // #endif
				// // #ifndef  H5
				// 	this.enter('/pages/activity/activity?id='+activity.id);
				// // #endif
			},
			viewMember:function(member){
				this.targetMember(member);
				this.enter('/pages/member/member?from=local&id='+member.id);
			},
			viewArticle:function(article){
				// #ifdef H5
					window.location.href = article.link;
				// #endif
				// #ifndef H5
				this.targetArticle(article);
				uni.navigateTo({
					url:'article?id='+article.id
				})
				// #endif
			},
			appointment:function(targetMember){
				if(!this.hasLogin){
					this.enter('/pages/index/index');
				}else{
					//同一代理账号下的会员不可申请
					if(targetMember.agentAccountId === this.account.id){
						uni.showToast({
							icon:'none',
							title:'和自己约会不需要申请哦'
						})
						return;
					}
					if(targetMember.inviteStatus == 'inviting'){
						uni.showToast({
							icon:'none',
							title:'已提交约见申请，请耐心等待'
						})
						return;
					}
					
					//
					this.targetMember(targetMember);
					//跳转申请页面
					uni.navigateTo({
						url:'/pages/form/apply?from=index&targetMemberId='+targetMember.id
					})
					
					//检查会员账户
					// let that = this;
					// uni.request({
					// 	url: this.$http.contextPath + 'base/member-account/getOne',
					// 	method:'POST',
					// 	data:{
					// 		// memberId:this.agentMember.id,
					// 		agentAccountId:this.agentMember.agentAccountId,
					// 		status:'1'
					// 	},
					// 	success(res) {
					// 		if(that.$http.success(res)){
					// 			that.targetMember(targetMember);
					// 			if(res.data.data && res.data.data.appointmentRemain > 0){
					// 				//跳转申请页面
					// 				uni.navigateTo({
					// 					url:'/pages/form/apply?targetMemberId='+targetMember.id
					// 				})
					// 			}else{
					// 				//跳转会员付费页面
					// 				uni.navigateTo({
					// 					url:'/pages/user/vip?from=index'
					// 				})
					// 			}
					// 		}
					// 	}
					// });
				}
			},
			closeLoginModal:function(){
				this.showLogin = false;
			},
			async getTop(){
				let member = {
					
				};
				if(this.hasLogin){
					member.id = this.agentMember.id;
					if(this.agentMember.sex == '男'){
						member.sex = '女';
					}else{
						member.sex = '男';
					}
				}
				var [error, res] = await uni.request({
					url: this.$http.contextPath + 'getTop',
					method:'POST',
					data:member
				});
				if(this.$http.success(res)){
					res.data.data.activities.forEach(item =>{
						let a = item.activityDate.split('-');
						item.activityDate = a[1]+'/'+a[2]+'  '+dateUtil.getDay(item.activityDate);
					})
					this.activities = res.data.data.activities;
					
					this.members = memberSvc.inviteHandler('appointment', res.data.data.members, res.data.data);
				}
			},
			getArticles:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'base/article/list',
					method:'POST',
					data:{
						status:'1',
						releaseStatus:'release'
					},
					success(res) {
						if(that.$http.success(res)){
							res.data.data.forEach(item =>{
								item.time = item.createTime.substring(5,10);
							});
							that.articles = res.data.data;
						}
					}
				})
			},
			autoLogin() {
				let that = this;
				//远程登陆校验
				uni.request({
					url: this.$http.contextPath + 'account/login',
					method: 'POST',
					data:{
						provider: 'mobile',
						username: this.account.mobile,
						password: this.account.password
					},
					success: (res) => {
						if(this.$http.success(res)){
							res.data.data.password = this.account.password;
							that.loginSuccess(res.data.data);
						}else{
							//登陆失败：退出登录，清除缓存数据
							that.logout();
						}
					}
				})
			}
		},
		onShow() {
			this.showLogin = false;
			//判断默认会员是否变换
			if(this.agentMemberId != 0 && this.agentMemberId != this.account.agentMemberId){
				this.agentMemberId = this.account.agentMemberId;
				this.getTop();
			}
		},
        onLoad(option) {
			//访问来源
			if(option.fromAccountId){
				this.saveShareFrom({
					accountId:option.fromAccountId,
					memberId:option.fromMemberId
				});
			}
			
			//已登录，自动重新登陆刷新
			if(this.hasLogin){
				this.autoLogin();
				//
				this.agentMemberId = this.account.agentMemberId;
			}
			
			//
			this.getTop();
			this.getArticles();
			
            if (this.forcedLogin && !this.hasLogin) {
                uni.showModal({
                    title: '未登录',
                    content: '您未登录，需要登录后才能继续',
                    /**
                     * 如果需要强制登录，不显示取消按钮
                     */
                    showCancel: !this.forcedLogin,
                    success: (res) => {
                        if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
                            if (this.forcedLogin) {
                                uni.reLaunch({
                                    url: '../login/login'
                                });
                            } else {
                                uni.navigateTo({
                                    url: '../login/login'
                                });
                            }
                        }
                    }
                });
            }
        }
    }
</script>

<style>	
    swiper {
		width: 100%;
		height: 445upx;
	}
	swiper image{
		width: 100%;
	}
	.padding-top{
		padding-top:40upx;
	}
	.nav-menu{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin: 40upx 0;
	}
	.nav-menu .menu-box{
		width: 180upx;
		height: 180upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.nav-menu .menu-box image{
		width: 140upx;
		height: 140upx;
	}
	.nav-menu .menu-box text{
		
	}
	
	.title-bar{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items:flex-end;
		margin: 40upx 0;
	}
	.title-bar .title {
		font-size: 21px;
		font-weight: 900;
	}
	.title-bar .more {
		color: #8F8F94;
	}
	
	.activity-box{
		border-radius: 15upx;
		padding-bottom: 20upx;
		box-shadow:0 12upx 50upx 10upx #f2f2f2;
		margin-bottom: 40upx;
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
		width: 58upx;
		height: 33upx;
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

	/* .member-wrap .member-box .header-wrap .header{
		width: 150upx;
		height: 150upx;
		border-radius: 200upx;
	}	 */
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
		color: white;
		font-size:14px;
		border-radius: 80upx;
		height: 70upx;
		line-height: 70upx;
		display: flex;
		align-items: center;
		padding: 0 50upx;
	}
	
	.member-wrap .member-box .tags{
		display: flex;
		flex-direction: row;
		margin-top: 20upx;
	}
	.member-wrap .member-box .tags-female .tag{
		border-radius: 50upx;
		padding: 10upx 20upx;
		border: 1px solid #ffc7d5;
		background-color: #ffedf3;
		color: #ff4b7d;
		margin-right: 10upx;
	}
	.member-wrap .member-box .tags-male .tag{
		border-radius: 50upx;
		padding: 10upx 20upx;
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
	
	.article-wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:space-between;
		align-items: flex-start;
	}
	.article-wrap .article-colunm{
		width: calc(50% - 20upx);
	}
	.article-wrap .article-box{
		width: 100%;
		margin-bottom: 40upx;
		border-radius:15upx;
		box-shadow: 0 10upx 20upx 8upx #f8f8f8;
	}
	.article-wrap .article-box .thumbnail-box{
		position: relative;
	}
	.article-wrap .article-box .thumbnail-box image{
		width: 100%;
		border-radius:15upx 15upx 0 0;
	}
	.article-wrap .article-box .thumbnail-box .video{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0.5;
	}
	.article-wrap .article-box .title{
		font-weight: 900;
		padding-left: 20upx;
		padding-top: 20upx;
		padding-right: 20upx;
	}
	.article-wrap .article-box .text-wrap{
		color: #8F8F94;
		padding: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.lecture-scroll{
		
	}
	.lecture-wrap{
		white-space: nowrap;
		width: 100%;
	}
	.lecture-wrap .lecture-box{
		display: inline-flex;
		width: 40%;
		border-radius: 15upx;
		box-shadow: 0 10upx 20upx 8upx #f8f8f8;
		margin-bottom: 40upx;
	}
	.lecture-wrap .space{
		margin-right: 40upx;
	}
	.lecture-wrap .last{
		margin-right: 20upx;
	}
	.lecture-wrap .lecture-box .title{
		font-weight: 900;
		font-size: 16px;
		
	}
	.lecture-wrap .lecture-box .lecture-header{
		padding: 20upx;
		border-radius: 15upx 15upx 0 0;
	}
	.lecture-wrap .lecture-box .cover{
		width: 100%;
	} 
	.lecture-wrap .lecture-box .enrollment{
		white-space:normal;
		padding: 20upx;
		padding-top: 50upx;
		border-radius: 0 0 15upx 15upx;
		position: relative;
	}
	.lecture-wrap .lecture-box .pink .lecture-header{
		white-space:normal;
		padding: 20upx;
		background-color: #fff3f3;
	}
	.lecture-wrap .lecture-box .pink .cover{
		width: 100%;
		background-color: #ffc3c4;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lecture-wrap .lecture-box .cover image{
		width:180upx;
		height: 180px;
		margin: 40upx 0;
	}
	.lecture-wrap .lecture-box .enrollment .date-box{
		height: 58upx;
		line-height: 58upx;
		position: absolute;
		top: -29upx;
		right: 20upx;
		font-size: 13px;
		padding:0 20upx;
		border-radius: 50upx;
		background-color: #FFFFFF;
		box-shadow:0 12upx 20upx 0 #f2f2f2;
	}
	
	.main-bottom-bar-block{
		height: 100upx;
		align-items: flex-end;
	}
	
	.main-bottom-bar-wrap{
		width: 100%;
		position:fixed;
		left: 0;
		bottom: -50upx;
		height: 120upx;
		background-color: white;
		box-shadow: 0 -2upx 30upx 2upx #f8f8f8;
		z-index: 9000;
		
	}
	.main-bottom-bar-wrap .circle{
		width: 150upx;
		height: 150upx;
		border: 1px solid red;
		border-radius: 75upx;
		position: absolute;
		z-index: 1000;
		
	}
	/* 
	.main-bottom-bar-wrap .bottom-bar{
		position:fixed;
		left: 40upx;
		right: 40upx;
		bottom: 0;
		height: 120upx;
		display: flex;
		flex-direction: row;
	}
	.main-bottom-bar-wrap .bottom-bar .bar-box{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.main-bottom-bar-wrap .bottom-bar .bar-box .item{
		display: flex;
		align-items: center;
		flex-grow: 1;
	} */
	
	
</style>
