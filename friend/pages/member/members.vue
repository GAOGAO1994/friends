<template>
	<view class="content">
		<view class="padding-h">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<f-icon type="back" color="white" size="30"></f-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="">{{activity.id>0?'邀请':'相亲角'}}</text>
				<view class="right">
					<f-icon type="filter" color="white" size="24" @click="bindFilter"></f-icon>
				</view>
			</view>
			
			<!-- <view class="tab-wrap margin-top">
				<text class="tab" :class="tabIndex == 0?'selected':''" @click="selectTab(0)">女神</text>
				<text class="tab" :class="tabIndex == 1?'selected':''" @click="selectTab(1)">男神</text>
			</view> -->
		</view>
		
		<view v-if="tabIndex==0" class="member-list padding-h margin-top">	
			<view v-for="(member, index) in females" class="member-wrap" :class="index===females.length-1?'member-wrap-last':''" @click="viewMember(member)">
				<view class="member-box">
					<view class="avatar-wrap">
						<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
						<!-- <view class="identification"><text>实名认证</text></view>
						<image v-if="member.vipStatus != 'non'" class="vip" mode="scaleToFill" :src="member.vipStatus == 'vip'?'../../static/img/icons/icon-vip.png':'../../static/img/icons/icon-vip-expiry.png'"></image> -->
					</view>
					<view class="name-wrap">
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
					<view v-if="activity.id>0">
						<view class="activity-button" v-if="member.activityMember && member.activityMember.signStatus == 'active'">已报名</view>
						<button v-else class="btn-invate" :disabled="member.inviteStatus?true:false" :class="{disabled:member.inviteStatus, female:member.sex == '女', male:member.sex == '男'}" @click.stop="inviteApply(member, index, 'invite')">{{member.inviteLabel}}</button>
					</view>
					<view v-else>
						<button class="btn-invate" :class="member.sex == '女'?'female':'male'" @click.stop="inviteApply(member, index, 'appointment')">{{member.inviteLabel}}</button>
						<!-- <button v-else class="btn-invate" :class="member.sex == '女'?'female-disable':'male-disable'" @click.stop="invite(member, 'appointment')">{{member.inviteLabel}}</button> -->
					</view>
				</view>	
			</view>
			<view v-if="females.length == 0" class="empty">
				<image mode="scaleToFill" src="../../static/img/empty.png"></image>
				<text>没有符合的,调整条件再看看</text>
			</view>
			
			<view class="more-wrap margin-top">
				<text v-if="femalePage.current < femalePage.pages" @click="loadData(false)">加载更多</text>
				<text v-else-if="femalePage.current > 1" class="label">没有更多</text>
			</view>
		</view>
			
		<!-- <view v-if="tabIndex==1" class="member-list padding-h margin-top">	
			<view v-for="(member, index) in males" class="member-wrap" :class="index===males.length-1?'member-wrap-last':''" @click="viewMember(member)">
				<view class="member-box">
					<view class="avatar-wrap">
						<image class="avatar" mode="scaleToFill" :src="member.avatarUrl"></image>
					</view>
					<view class="name-wrap">
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
						<image class="photo-bg" style="aspectFill" src="../../static/img/photo/photot-male.png"></image>
						<image class="photo" style="aspectFill" :src="member.avatarUrl" @click.stop="preview(member.avatarUrl)"></image>
					</view>	
					<view v-if="activityId">
						<view class="activity-button" v-if="member.activityMember && member.activityMember.signStatus == 'active'">已报名</view>
						<button v-else class="btn-invate" :disabled="member.inviteStatus?true:false" :class="{disabled:member.inviteStatus, female:member.sex == '女', male:member.sex == '男'}" @click.stop="invite(member, 'invite')">{{member.inviteLabel}}</button>
					</view>
					<view v-else>
						<button class="btn-invate" :class="member.sex == '女'?'female':'male'" @click.stop="invite(member, 'appointment')">{{member.inviteLabel}}</button>
					</view>
				</view>	
			</view>
			
			<view class="more-wrap margin-top">
				<text v-if="malePage.current < malePage.pages" @click="loadData(false)">加载更多</text>
				<text v-else-if="malePage.current > 1" class="label">没有更多</text>
			</view>
		</view> -->
		
		<view class="bottom-bar-wrap">
			<view class="bottom-bar">
				<view class="bar-box">
					<view class="item" @click="enter('/pages/member/follow')">
						<f-icon type="attention" color="#7558ff" size="28"></f-icon>
						<text>我的关注</text>
					</view>
					<view class="item" @click="enter('/pages/member/invite')">
						<f-icon type="invite" color="#7558ff" size="28"></f-icon>
						<text>我的邀请</text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar-block"></view>
		
		<view v-if="showFilter" class="filter-wrap" @click="hideFilter">
			<view class="content-wrap" @click.stop="">
				
				<view v-for="(filed, filedIndex) of selector" :key="filed.name">
					<view class="filed-wrap" v-if="filed.show">
						<view class="label">{{filed.label}}</view>
						<view class="tags">
							<view class="tag" v-for="(item, index) in filed.datas" :key="item.label" :class="item.selected?'tag-selected':''" @click="select(filed, item, $event)">
								<picker v-if="filed.name == 'residence' && item.active" @change="bindPickerChange(filed, item, index, $event)" :value="item.index" :range="item.range" range-key="label">
									<text>{{item.label}}</text>
								</picker>
								<text v-else>{{item.label}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="filed-wrap">
					<view class="label">年龄</view>
					<view class="tags age-wrap">
						<input type="number" v-model="ageMin" placeholder="最小"/>
						<text>—</text>
						<input type="number" v-model="ageMax" placeholder="最大"/>
						<!-- <RangeSlider :width='slideWidth' :height='slideHeight' :blockSize='slideBlockSize' :min='slideMin' :max='slideMax'
						 :values='rangeValues' @rangechange='onRangeChange'>
							<view slot='minBlock' class='range-slider-block'></view> //左边滑块的内容
							<view slot='maxBlock' class='range-slider-block'></view> //右边滑块的内容
						</RangeSlider>
						<view class="text-center">
							<text>{{(rangeValues[0]==slideMin || rangeValues[0]==slideMax)?'':rangeValues[0]}}</text>
							<text>~</text>
							<text>{{(rangeValues[1]==slideMax || rangeValues[1]==slideMin)?'':rangeValues[1]}}</text>
						</view> -->
					</view>
				</view>
				<view class="line"></view>
				<view class="filed-wrap">
					<view class="buttons">
						<button class="outline" @click="reset">重置</button>
						<button class="primary" @click="submit">确定</button>
					</view>
				</view>
			</view>
		</view>
		<!-- <mpvue-picker ref="mpvuePicker" mode="multiLinkageSelector" deepLength="3" :pickerValueDefault="pickerValueDefault" :pickerValueArray="pickerValueArray" @onConfirm="onConfirm"></mpvue-picker> -->
		<login-modal :show="showLogin" @close="closeLoginModal" ></login-modal>
		<image-preview :show="previewOpen" :src="previewSrc" @close="closePreview"></image-preview>
	</view>
</template>

<script>
	import fIcon from '@/components/m-icon/f-icon.vue'
	import loginModal from '@/components/login-modal/login-modal.vue';
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import imagePreview from '@/components/preview/image-preview.vue';
	import memberSvc from '@/services/member/member.js';
	import RangeSlider from '@/components/range-slider/range-slider.vue';
	import provinces from '@/components/mpvue-picker/city-data/province.js';
	import citys from '@/components/mpvue-picker/city-data/city.js';
	import areas from '@/components/mpvue-picker/city-data/area.js';
	import {mapState, mapGetters, mapMutations} from 'vuex'
	
	export default {
		components: {fIcon,loginModal,mpvuePicker,RangeSlider,imagePreview},
		data() {
			return{
				maleBg:this.$http.imgPath + "manage/photot-male.png",
				femaleBg:this.$http.imgPath + "manage/photot-female.png",
				login:false,			//本页登陆标识
				showLogin:false,
				showFilter:false,
				previewOpen:false,
				previewSrc:'',
				tabIndex:0,
				//固定参数
				parameter:{
					status:'1',
					byDesc:'recommend',
					kind:'appointment'				//默认显示约见状态
				},	
				//用户参数
				filter:{
				},			
				ageMin:'',
				ageMax:'',
				malePage:{
					pages:0,
					current:0,
					total:0
				},
				femalePage:{
					pages:0,
					current:0,
					total:0
				},
				// members:[],
				males:[],
				females:[],
				activity:{id:0},				//邀请参加的活动
				inviteMember:{id:0},			//邀请人
				labels:['省','市','区'],
				selector:{
					sex:{
						name:'sex',
						label:'性别',
						datas:[{
							label:'男',
							value:'男',
							selected:false
						},{
							label:'女',
							value:'女',
							selected:false
						}],
						show:true
					},
					maritalStatus:{
						name:'maritalStatus',
						label:'婚姻状况',
						datas:[{
							label:'未婚',
							value:'single',
							selected:false
						},{
							label:'离婚',
							value:'divorced',
							selected:false
						},{
							label:'丧偶',
							value:'lose',
							selected:false
						}],
						show:true
					},
					residence:{
						name:'residence',
						label:'地区',
						datas:[{
							label:'省',
							active:true,
							value:'省',
							range:provinces,
							index:0
						},{
							label:'市',
							active:false,
							value:'市',
							range:[],
							index:0
						},{
							label:'区',
							active:false,
							value:'区',
							range:[],
							index:0
						}],
						show:true
					}
				},
				slideWidth: 350, //宽度
				slideHeight: 80,  //高度
				slideBlockSize: 56, //圆形按钮大小
				slideMin: 23,  //slider最小值
				slideMax: 76,  //slider最大值
				rangeValues: [23, 76], //当前区间值
			}
		},
		computed: {
			...mapState(['hasLogin', 'account','target']),
			...mapGetters(['loginCheck','agentMember'])
		},
		methods:{
			...mapMutations(['targetMember','redirect']),
			closeLoginModal:function(){
				this.showLogin = false;
			},
			preview:function(url){
				this.previewSrc = url;
				this.previewOpen = true;
			},
			closePreview:function(){
				this.previewOpen = false;
			},
			// selectTab:function(index){
			// 	this.tabIndex = index;
			// 	if(index == 0){
			// 		this.parameter.sex = '女';
			// 	}else if(index == 1){
			// 		this.parameter.sex = '男';
			// 		if(this.malePage.current == 0){
			// 			this.loadData(true);
			// 		}
			// 	}
			// },
			hideFilter:function(){
				this.showFilter = false;
			},
			viewMember:function(member){
				this.targetMember(member);
				this.enter('/pages/member/member?from=local&id='+member.id);
			},
			enter:function(url){
				this.showLogin = this.$croute.enter(this.loginCheck(url));
			},
			bindFilter:function(){
				let result = this.loginCheck('/pages/member/members');
				if(result.isPass){
					this.showFilter = !this.showFilter;
				}else{
					this.showLogin = this.$croute.enter(result);
				}
			},
			select:function(filed, item, e){
				if(filed.name != 'residence'){
					item.selected = !item.selected;
				}
			},
			onRangeChange: function(e) {
				this.rangeValues =  [ Math.round(e.minValue),  Math.round(e.maxValue)];
			},
			bindPickerChange:function(filed, item, index, e){
				if(filed.name == 'residence'){
					item.index = e.target.value; 
					item.value = item.range[item.index].value;
					item.label = item.range[item.index].label;
					item.selected = true;
					for(let i=index; i<2; i++){
						filed.datas[i+1].selected = false;
						filed.datas[i+1].index = 0;
						filed.datas[i+1].value = ''; 
						filed.datas[i+1].label = this.labels[i+1];
						if(filed.datas[i+2])filed.datas[i+2].active = false;
					}
					if(filed.datas[index+1]){
						filed.datas[index+1].active = true;
						if(index == 0){	//市
							filed.datas[index+1].range = citys[item.index];
						}else if(index == 1){	//区
							filed.datas[index+1].range = areas[filed.datas[0].index][item.index];
						}
					}
				}
			},
			getFilter:function(){
				//获取过滤条件
				let filter = {};
				for(let filed in this.selector){
					filter[filed] = '';
					for(let item of this.selector[filed].datas){
						if(item.selected)filter[filed] += ',' + item.value;
					}
					if(filter[filed].length > 0){
						filter[filed] = filter[filed].substring(1);
					}
				}
				//年龄段
				if(this.ageMin != ''){
					filter.ageMin = this.ageMin;
				}
				if(this.ageMax != ''){
					filter.ageMax = this.ageMax;
				}
				// if(this.rangeValues[0]> this.slideMin && this.rangeValues[0] < this.slideMax){
				// 	filter.ageMin = this.rangeValues[0];
				// }else{
				// 	delete filter.ageMin;
				// }
				// if(this.rangeValues[1] > this.slideMin && this.rangeValues[1] < this.slideMax){
				// 	filter.ageMax = this.rangeValues[1];
				// }else{
				// 	delete filter.ageMax;
				// }
				
				for(let filed in this.selector){
					if(filter[filed] == ''){
						delete filter[filed];
					}
				}
				//性别：都选忽略
				if(filter.sex && filter.sex.indexOf(',') > -1){
					delete filter.sex;
				}
				//单选、多选区分处理
				if(filter.maritalStatus){
					let maritalStatuses = filter.maritalStatus.split(',');
					if(maritalStatuses.length > 1){
						filter.maritalStatuses = maritalStatuses;
						delete filter.maritalStatus;
					}else{
						filter.maritalStatus = maritalStatuses[0];
					}
				}
				//地区
				if(filter.residence){
					// let attrs = ['residenceProvince', 'residenceCity', 'residenceCounty'];
					// filter.residence.split(',').forEach((item,index) =>{
					// 	filter[attrs[index]] = item;
					// });
					let a = filter.residence.split(',');
					filter.residenceCode = a[a.length-1];
					delete filter.residence;
				}
				// console.log(filter);
				return filter;
			},
			submit:function(){
				this.filter = {};
				Object.assign(this.filter, this.getFilter());
				this.loadData(true);		//刷新重载
			},
			reset:function(){
				this.filter = {};
				this.ageMin = '';
				this.ageMax = '';
				for(let filed in this.selector){
					if(!filed.show)continue;
					for(let i=0; i<this.selector[filed].datas.length; i++){
						if(filed.name != 'residence'){
							this.selector[filed].datas[i].selected = false;
							this.selector[filed].datas.splice(i, 1, Object.assign({},this.selector[filed].datas[i]));
						}
					}
				}
				this.rangeValues[0] = this.slideMin;
				this.rangeValues[1] = this.slideMax;
				//区域
				if(this.hasLogin){
					this.setResidenceFiler(2,this.agentMember.residence, this.parameter.residenceCode, this.agentMember.residenceValue);
				}else{
					this.setResidenceFiler(2,'江苏省,南京市','3201','9,0');
				}
				this.loadData(true);
			},
			setResidenceFiler:function(grade, residence, residenceCode, residenceValue){
				let labels = residence.split(',');
				let values = residenceValue.split(',');
				for(let i=0; i<grade; i++){
					this.selector.residence.datas[i].active = true;
					this.selector.residence.datas[i].selected = true;
					this.selector.residence.datas[i].label = labels[i];
					this.selector.residence.datas[i].value = residenceCode.substring(0,2*(i+1));
					this.selector.residence.datas[i].index = values[i];
				}
				let defaultLabels = ['省','市','区'];
				for(let i=grade; i<3; i++){
					this.selector.residence.datas[i].active = false;
					this.selector.residence.datas[i].selected = false;
					this.selector.residence.datas[i].label = defaultLabels[i];
					this.selector.residence.datas[i].value = '';
					this.selector.residence.datas[i].index = 0;
				}
				//重置列表
				if(grade == 1){
					this.selector.residence.datas[1].range = citys[values[0]];
				}else if(grade == 2){
					this.selector.residence.datas[1].range = citys[values[0]];
					this.selector.residence.datas[2].range = areas[values[0]][values[1]];
				}
				//激活下一个选择
				if(grade<3){
					this.selector.residence.datas[grade].active = true;
				}
			},
			inviteApply:function(targetMember, index, kind){
				if(!this.hasLogin){
					this.redirect(null);
					this.showLogin = true;
				}else{
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
						this.appointment(targetMember, index);
					}else if(kind == 'invite'){
						this.invite(targetMember, index);
					}
				}
			},
			appointment:function(targetMember, index){
				this.targetMember(targetMember);
				//跳转申请页面
				uni.navigateTo({
					url:'/pages/form/apply?from=members&targetMemberId='+targetMember.id
				})
				
				//检查会员账户
				// let that = this;
				// uni.request({
				// 	url: this.$http.contextPath + 'base/member-account/getOne',
				// 	method:'POST',
				// 	data:{
				// 		agentAccountId:this.agentMember.id,
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
				// 					url:'/pages/user/vip?from=members'
				// 				})
				// 			}
				// 		}
				// 	}
				// });
			},
			invite:function(targetMember, index){
				let that = this;
				uni.request({
					url: this.$http.contextPath + 'invite/save',
					method:'POST',
					data:{
						agentAccountId:this.agentMember.agentAccountId,
						memberId:this.inviteMember.id,
						accountId:this.inviteMember.accountId,
						targetMemberId:targetMember.id,
						targetAgentAccountId:targetMember.agentAccountId,
						activityId:this.activity.id,
						kind:'invite',
						inviteStatus:'inviting',
						nickname:this.agentMember.nickname
					},
					success(res) {
						if(that.$http.success(res)){
							targetMember.inviteStatus = 'inviting';
							targetMember.inviteLabel = '邀请中';
							that.females.splice(index, 1, Object.assign({}, targetMember));
						}
					}
				});
			},
			loadData(bReload){
				let that = this;
				if(bReload)this.femalePage.current = 0;
				uni.request({
					url: this.$http.contextPath + 'member/query',
					method:'POST',
					data:{
						query:{
							...this.parameter,
							...this.filter
						},
						current:this.femalePage.current+1,
						size:10
					},
					success(res) {
						if(that.$http.success(res)){
							let type = (that.parameter.activityId)?'invite':'appointment';
							that.femalePage = res.data.data.page;
							if(bReload){
								that.females = [];
							}
							that.females = that.females.concat(memberSvc.inviteHandler(type, res.data.data.page.records, res.data.data, that.parameter.activityId));
						}
					}
				});
			}
		},
		onShow() {
			//登陆后刷新
			if(!this.login && this.hasLogin){
				this.login = true;
				this.malePage.current = 0;
				this.femalePage.current = 0;
				this.males = [];
				this.females = [];
				this.parameter.id = this.agentMember.id;
				delete this.parameter.recommend; //推荐标识
				this.loadData(true);
			}
		},
		onLoad(option) {
			this.login = this.hasLogin;

			if(option.invite){		//邀请
				this.activity = this.target.activity;
				this.inviteMember = this.target.member;
				this.parameter.activityId = this.activity.id;
				this.parameter.kind = 'invite';
				if(this.inviteMember.sex == '男'){
					this.parameter.sex = '女';
				}else{
					this.parameter.sex = '男';
				}
				//过滤条件不显示性别条件
				// this.selector.sex.show = false;
				//区域（默认活动所在的城市）
				this.parameter.residenceCode = this.activity.residenceCode.substring(0,4);
				this.setResidenceFiler(2,this.activity.residence, this.parameter.residenceCode, this.activity.residenceValue);
			}else{
				if(this.hasLogin){					//已登陆：
					this.parameter.id = this.agentMember.id;
					if(this.agentMember.purpose != 'everybody'){	//非人人红娘
						if(this.agentMember.sex == '男'){
							this.parameter.sex = '女';
						}else{
							this.parameter.sex = '男';
						}
						//过滤条件不显示性别条件
						// this.selector.sex.show = false;
					}
					//区域（默认用户所在的城市）
					this.parameter.residenceCode = this.agentMember.residenceCode.substring(0,4);
					this.setResidenceFiler(2,this.agentMember.residence, this.parameter.residenceCode, this.agentMember.residenceValue);
				}else{								//未登陆：显示推荐会员
					this.parameter.recommend = '1'; //推荐标识
				}
			}
			
			this.loadData(true);
		}
	}
</script>

<style>
	.content{
		background: linear-gradient(to bottom, #fd6e99, #d498e1); 
	}
	.header text{
		color: white;
	}
	.header .right{
		display: flex;
		align-items: center;
	}
	
	.tab-wrap .tab{
		padding: 15upx 40upx;
		color: white;
		font-size: 16px;
		font-weight: 900;
		margin-right: 20upx;
	}
	.tab-wrap .selected{
		color: #fc6e9a;
		border-radius: 100upx;
		background-color: white;
	}
	
	.margin-top{
		margin-top:40upx;
	}
	
	.filter-wrap{
		widht:100%;
		height: 100%;
		position:fixed;
		top:0upx;
		left:0;
		right:0;
		bottom:0;
		border-top-left-radius: 15upx;
		border-top-right-radius: 15upx;
		background-color: rgba(0,0,0,0.5);
	}
	.content-wrap{
		padding: 40upx;
		border-radius: 15upx;
		background-color: #ffffff;
		opacity: 1;
		margin-top: 250upx;
	}
	.line{
		width:100%;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.filed-wrap{
		display: flex;
		align-items: center;
		margin-bottom: 40upx;
	}
	.filed-wrap .label{
		width:60px;
		display: block;
	}
	.filed-wrap .tags{
		display: flex;
		align-items: center;
	}
	.filed-wrap .tag{
		padding: 15upx 40upx;
		border-radius: 80upx;
		border: 1px solid #C8C7CC;
		/* font-size: 18px;
		font-weight: 800; */
		margin-left: 20upx;
		color: #8F8F94;
	}
	.filed-wrap .tag-selected{
		padding: 15upx 40upx;
		border-radius: 80upx;
		background-color: #ded4ff;
		border: 1px solid #ded4ff;
		/* font-size: 18px;
		font-weight: 800; */
		margin-left: 20upx;
		color: #7667a5;
	}
	.filed-wrap .buttons{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 40upx;
	}
	.filed-wrap button{
		width: 40%;
	}
	.text-center {
		justify-content: center;
		margin-left: 20upx;
	}
	.age-wrap{
		display: flex;
		align-items: center;
	}
	.age-wrap input{
		width: 150upx;
		padding: 5upx 10upx;
		border:1px solid #dcdcdc;
	}
	.age-wrap text{
		padding: 0 20upx;
	}
	
	.member-list{
		flex-grow: 1;
	}
	.member-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 40upx;
		position: relative;
		padding: 40upx;
		background-color: white;
		border-radius: 15upx;
	}
	/* .member-wrap::after {
	    position: absolute;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    height: 1upx;
	    content: '';
	    -webkit-transform: scaleY(.5);
	    transform: scaleY(.5);
	    background-color: #c8c7cc;
	} */
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
	.member-wrap .activity-button{
		margin-top: 40upx;
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
