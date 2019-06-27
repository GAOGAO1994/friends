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
				<text class="">成为红娘</text>
			</view>
			
			<view class="">
				<view class="item-wrap input-row border">
					<text class="label">性别</text>
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
					<text class="label">出生</text>
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
					<!-- <view class="input-wrap">
						<picker mode="region" :value="residences"  @change="bindResidenceChange">
							<view class="picker-place" v-if="member.residence == ''">
								<text class="label">南京</text>
							</view>
							<view class="picker-place" v-else>
								<text class="input-text">{{member.residence}}</text>
							</view>
						</picker>
					</view> -->
					<view class="input-wrap" @click="showCityPicker">
						<view class="picker-place" v-if="member.residence == ''">
							<text class="label">南京</text>
						</view>
						<view class="picker-place" v-else>
							<text class="input-text">{{member.residence}}</text>
						</view>
					</view>
				</view>
				<view class="btn-row">
					<button type="primary" class="primary" @click="bindSubmit">注册</button>
				</view>
			</view>
		</view>
		
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import mpvueCityPicker from '@/components/mpvue-picker/mpvueCityPicker.vue'
	import memberSvc from '@/services/member/member.js'
	import {mapState,mapMutations} from 'vuex';
	
	export default {
		components: {mIcon, fIcon, mInput, mpvueCityPicker},
		data() {
			return{
				cityPickerValueDefault: [9, 0, 0],
				themeColor: '',
				member:{
					purpose:'everybody',
					sex:'',
					birthday:'',
					maritalStatus:'',
					maritalStatusName:'',
					education:'',
					residence:'',
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
					'key':'married',
					'name':'已婚'
				}],
				maritalStatusIndex: 0,
				educationArray:['高中以下','高中','大专','本科','硕士','博士'],
				educationIndex: 0,
				residences:['江苏省','南京市']
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
			...mapMutations(['targetMember','saveMember','savePurpose','redirect']),
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
						url:'work'
					});
// 					uni.navigateTo({
// 						url:'work?sex='+this.member.sex+'&birthday='+this.member.birthday+'&maritalStatus='+this.member.maritalStatus+'&education='+this.member.education+'&residence='+this.member.residence
// 					});
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
							if(that.$http.success(res)){
								//更新本地member
								that.saveMember(res.data.data);
								//上传头像后返回
								that.redirect('/pages/blind/blind');
								//上传头像
								uni.redirectTo({
									url: '/pages/reg/avatarUpload?purpose='+that.member.purpose+'&memberId='+res.data.data.id
								});
							}
						}
					})
				}
			},
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
			// bindResidenceChange: function(e) {
			// 	this.member.residence = e.target.value.join(',');
			// 	this.member.residenceProvince = e.target.code[0];
			// 	this.member.residenceCity = e.target.code[1];
			// 	this.member.residenceCounty = e.target.code[2];
			// },
			// 省市区选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				let labels = e.label.split('-');
				this.member.residence = labels.join(',');
				this.member.residenceCode = e.cityCode;
				this.member.residenceValue = e.value.join(',');
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
			}
		},
		onLoad(option) {
			// this.member.purpose = 'everybody';
		}
	}
</script>

<style>
	.header text{
		color: black;
	}
	.item-wrap{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 40upx 0;
		align-items: center;
	}
	.input-wrap{
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		margin-right: 40upx;
	}
	.input-wrap text{
	    font-size:18px;
	}
	.picker-place{
		min-width:500upx;
		display: flex;
		justify-content: flex-end;
	}
	.input-text {
	    font-size:18px;
		font-weight: bold;
	}
	
</style>