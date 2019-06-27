<template>
	<view class="content">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text v-if="member.purpose=='self'">关于我</text>
				<text v-else-if="member.purpose=='children'">关于子女</text>
				<text v-else-if="member.purpose=='friend'">关于朋友</text>
				<text v-else-if="member.purpose=='parent'">关于父母</text>
			</view>
			
			<view class="remind">
				<f-icon type="info" color="#fc597b" size="30"></f-icon>	
				<text>请真实填写，我们将为您牵线搭桥</text>
			</view>
			
			<view class="">
				<view class="item-wrap input-row border">
					<text class="label" style="white-space: nowrap;">姓名（注册后不可修改）</text>
					<view class="input-wrap">
						<view class="picker-place">
						<input class="input" name="name" v-model="member.realName" placeholder="真实姓名"/>
						</view>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">性别（注册后不可修改）</text>
					<view class="input-wrap">
				        <picker :value="sexIndex" :range="sexArray" @change="bindSexChange">
							<view class="picker-place" v-if="member.sex == ''">
								<text class="label">男/女</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.sex}}</text>
							</view>
						</picker>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">出生（注册后不可修改）</text>
					<view class="input-wrap">
						<picker mode="date" :value="currentDate" :start="startDate" :end="endDate" @change="bindBirthdayChange">
							<view class="picker-place" v-if="member.birthday == ''">
								<text class="label">0000-00-00</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.birthday}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">婚姻状况</text>
					<view class="input-wrap">
						<picker mode="selector" range-key="name" :value="maritalStatusIndex" :range="maritalStatusArray" @change="bindMaritalStatusChange">
							<view class="picker-place" v-if="member.maritalStatusName == ''">
								<text class="label">未婚</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.maritalStatusName}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">学历</text>
					<view class="input-wrap">
						<picker mode="selector" :value="educationIndex" :range="educationArray" @change="bindEducationChange">
							<view class="picker-place" v-if="member.education == ''">
								<text class="label">本科</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.education}}</text>
							</view>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">常住地</text>
					<view class="input-wrap" @click="showCityPicker">
						<view class="picker-place" v-if="member.residence == ''">
							<text class="label">南京</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.residence}}</text>
						</view>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">身份证号 </text>
					<view class="input-wrap">
						<view class="picker-place">
						<input class="input" name="id" v-model="member.idCard"/>
						</view>
					</view>
				</view>
				
				<view class="item-wrap input-row">
					<text class="label">兴趣爱好</text>
					<view class="input-wrap" @click="showHobbyPicker">  
						<view class="picker-place" v-if="member.hobby == ''">
							<text class="label">烘焙</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.hobby}}</text>
						</view>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">添加标签</text>
					<view class="input-wrap" @click="showTagsPicker">   <!-- @click="showHobbyPicker"-->
						<view class="picker-place" v-if="member.tags == ''">
							<text class="label">请选择</text>
						</view>
						<view class="picker-place" v-else>
							<view class="tags-item" v-for="(item, index) in receivedTags" :style="{background: originTags[index].color}"  :key="index">{{item}}</view>
						</view>
					</view>
				</view>
				
				<view class="btn-row">
					<!-- <button v-if="member.purpose=='self'" type="primary" class="primary" @tap="bindSubmit">提交</button> -->
					<button type="primary" class="primary" @tap="next">下一步</button>
				</view>
			</view>
		</view>
		
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		 <mpvue-hobby :themeColor="themeColor" ref="mpvueHobby" :hobbyValueDefault="hobbyPickerValueDefault"
		 @hobbyChange="hobbyChange" ></mpvue-hobby>
	
		 <member-tags :themeColor="themeColor" :tagsValueDefault="receivedTags" ref="memberTags" 
		 @tagsChange="tagsChange"></member-tags>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import memberSvc from '@/services/member/member.js';
	import mpvueCityPicker from '@/components/mpvue-picker/mpvueCityPicker.vue'
	import mpvueHobby from '@/components/mpvue-hobby/mpvueHobby.vue'
	import memberTags from '@/components/tags/memberTags.vue'
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput, mpvueCityPicker, mpvueHobby, memberTags},
		data() {
			return{
				cityPickerValueDefault: [9, 0, 0],
				hobbyPickerValueDefault: [2, 0],
				themeColor: '',
				originTags:[{
						value:'阳光',
						color:'#FF9B40'
					},{
						value:'帅气',
						color:'#2F9BFE'
					},{
						value:'正直',
						color:'#F93E58'
					}],
				receivedTags:[],
				member:{
					purpose:'',
					realName:'',
					sex:'',
					birthday:'',
					maritalStatus:'',
					maritalStatusName:'',
					education:'',
					residence:'',
					hobby:'',
					tags:'',
					idCard:'',
					residenceCode:'',
					residenceValue:[0,0,0],
				},
				sexArray: ['男','女'],
				sexIndex: 0,
				currentDate: this.getDate({
					format: true
				}),
				maritalStatusArray: [{
					'key':'single',
					'name':'未婚'
				},{
					'key':'divorced',
					'name':'离婚'
				},{
					'key':'lose',
					'name':'丧偶'
				}],
				maritalStatusIndex: 0,
				educationArray:['高中以下','高中','大专','本科','硕士','博士'],
				educationIndex: 3
			}
		},
		computed: {
			...mapState(['account']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			...mapMutations(['targetMember','saveMember','savePurpose']),
			verify:function(){
				if (this.member.sex == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的性别'
				    });
				    return;
				}
				if (this.member.birthday == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的出生'
				    });
				    return;
				}
				if (this.member.maritalStatus == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的婚姻状况'
				    });
				    return;
				}
				if (this.member.education == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的学历'
				    });
				    return;
				}
				if (this.member.residence == '') {
				    uni.showToast({
				        icon: 'none',
				        title: '请选择您的常住地'
				    });
				    return;
				}
				return true;
			},
			next:function(){
				if(this.verify()){
					this.targetMember(this.member);
					uni.navigateTo({
						url:'important'
					});
				}
			},
			bindSubmit:function(){
				if(this.verify()){
					let that = this;
					uni.request({
						url:this.$http.contextPath + 'blind/save',
						method:'POST',
						data:{
							...this.member,
							agentAccountId:this.account.id,
							nickname:this.account.nickname
						},
						success(res) {
							console.log(res);
							if(that.$http.success(res)){
								//更新本地member
								that.saveMember(res.data.data);
								//更新账号purpose
								that.savePurpose(that.member.purpose);
								//上传头像
								uni.redirectTo({
									url: '/pages/reg/avatarUpload?purpose='+that.member.purpose+'&memberId='+res.data.data.id
								});
							}
						}
					})
				}
			},
			// bindID:function(e){
			// 	// console.log(e.target.value);
			// 	this.member.idCard = e.target.value;
			// 	console.log(this.member.idCard);
			// },
			// bindName:function(e){
			// 	// console.log(e.target.value);
			// 	this.member.realName = e.target.value;
			// 	// console.log(this.member);
			// },
			bindSexChange:function(e){
				 this.member.sex = this.sexArray[e.target.value];
			}, 
			bindBirthdayChange: function(e) {
				this.member.birthday = e.target.value;
				this.member.age = memberSvc.getAge(this.member.birthday);
			},
			bindMaritalStatusChange:function(e){
				this.member.maritalStatus = this.maritalStatusArray[e.target.value].key;
				 this.member.maritalStatusName = this.maritalStatusArray[e.target.value].name;
			},
			bindEducationChange: function(e) {
				this.member.education = this.educationArray[e.target.value];
			},
			// 省市区选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show()
			},
			showHobbyPicker(){
				this.$refs.mpvueHobby.show()
			},
			showTagsPicker(){
				this.$refs.memberTags.show();
			},
			tagsChange(e){
				// console.log(e);
				this.receivedTags = e;
				this.member.tags = this.receivedTags.join(',');
				// console.log(this.member.tags);
			},
			onCancel(e) {
				console.log(e)
			},
			onConfirm(e) {
				console.log(e);
				let labels = e.label.split('-');
				this.member.residence = labels.join(',');
				this.member.residenceCode = e.cityCode;
				this.member.residenceValue = e.value.join(',');
			},
			hobbyChange(e){
				console.log(e);
				let labels = e.label.split('-');
				this.member.hobby = labels.join(',');
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 65;
				} else if (type === 'end') {
					year = year-20;
				} else if (type === 'current') {
					year = year - 20;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			onBackPress() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel();
					return true;
				}
			},
			onUnload() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel()
				}
			}
		},
		onLoad(option) {
			this.member.purpose = option.purpose;
		}
	}
</script>

<style>
	.content{
		width: 100%;
	}
	.header text{
		color: black;
	}
	.remind{
		display: flex;
		align-items: center;
	}
	.remind text{
		margin-left: 10upx;
	}
	.tags-item{
		/* min-width: 100upx; */
		padding: 10upx 20upx;
		height: 20px;
		background: #2F9BFE;
		color: white;
		font-size: 16px;
		font-weight: 400;
		border-radius: 20px;
		text-align: center;
		line-height: 20px;
		/* vertical-align: middle; */
		margin-left: 10upx;
	}
	
	.item-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40upx 0;
		align-items: center;
	}
	.input-wrap{
		display: flex;
		justify-content: flex-end;
		margin-right: 40upx;
		
	}
	.input{
		text-align: right;
		font-size:18px;
		font-weight: bold;
	}
	.input-wrap text{
	    font-size:18px;
	}
	.picker-place{
		min-width:360upx;
		display: flex;
		justify-content: flex-end;
	}
	.input-text {
	    font-size:18px;
		font-weight: bold;
	}
	
</style>
