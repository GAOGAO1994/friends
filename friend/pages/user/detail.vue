<template>
	<view class="content mvpue-picker">
		<view class="padding-l">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="black" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text>编辑资料</text>
				<view class="name-wrap" @click="updateAvatar">
					<text class="label">{{member.nickname}}</text>
					<image mode="scaleToFill" :src="member.avatarUrl"></image>
				</view>
			</view>
			
			<view class="tag-wrap">
				<view class="tag-scroll-wrap">
					<scroll-view class="tag-scroll" scroll-x="true" scroll-left="0">
						<view class="tag" v-for="(tag, index) in tags" :class="(index == selectedTag)?'tag-selected':'lable'" @click="bindTag(index)">
							<text>{{tag.name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<view class="" v-if="selectedTag == 0">
				<view class="item-wrap input-row border">
					<text class="label">姓名</text>
					<view class="input-wrap">
				        <text class="value label">{{member.realName}}</text>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">性别</text>
					<view class="input-wrap">
				        <text class="value label">{{member.sex}}</text>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">出生</text>
					<view class="input-wrap">
						<text class="value label">{{member.birthday}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">婚姻状况</text>
					<view class="input-wrap">
						<picker mode="selector" :range="category.maritalStatus" range-key="name" :value="values.maritalStatus" @change="bindPickerChange('maritalStatus', $event)">
							<text class="value">{{names.maritalStatus}}</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">学历</text>
					<view class="input-wrap">
						<picker mode="selector" :range="category.education" range-key="name" :value="values.education" @change="bindPickerChange('education', $event)">
							<text class="value">{{names.education}}</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">常住地</text>
					<view class="input-wrap" @click="showCityPicker">
						<view class="picker-place" v-if="member.residence == ''">
							<text class="label">选择</text>
						</view>
						<text class="value" v-else>{{member.residence}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">身份证</text>
					<view class="input-wrap">
				        <text class="value label">{{member.idCard}}</text>
				    </view>
				</view>
				
				<view class="item-wrap input-row">
					<text class="label">兴趣爱好</text>
					<view class="input-wrap" @click="showHobbyPicker">  
						<view class="picker-place" v-if="member.hobby == ''">
							<text class="label">选择</text>
						</view>
						<text class="value" v-else>{{member.hobby}}</text>
					</view>
				</view>
				
				<view class="item-wrap input-row">
					<text class="label">我的标签</text>
					<view class="input-wrap" @click="showTagsPicker">  
						<view class="picker-place" v-if="member.tags == ''">
							<text class="label">选择</text>
						</view>
						<view class="picker-place" v-else>
							<view class="tags-item" v-for="(item, index) in receivedTags" :style="{background: originTags[index].color}"  :key="index">{{item}}</view>
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="" v-if="selectedTag == 1">
				<view class="item-wrap input-row border">
					<text class="label">身高（cm）</text>
					<view class="input-wrap">
				        <m-input v-if="!concealParams[0].show" class="m-input" :inputStyle="inputStyle" type="text" v-model="names.height" @blur="onBlurHeihgt" placeholder="输入"></m-input>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">体重（kg）</text>
					<view class="input-wrap">
				        <m-input v-if="!concealParams[0].show" class="m-input" :inputStyle="inputStyle" :focus="false" type="text" v-model="names.weight" @blur="onBlurWeight" placeholder="输入"></m-input>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">财产</text>
					<view class="input-wrap">
						<picker mode="selector" :range="category.assets" range-key="name" :value="values.assets" @change="bindPickerChange('assets', $event)">
							<text v-if="names.assets != ''" class="value">{{names.assets}}</text>
							<text v-else class="value label">选择</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">籍贯</text>
					<view class="input-wrap" @click="pickNativePlace">
				        <view class="picker-place" v-if="member.nativePlace">
				        	<text class="value">{{member.nativePlace}}</text>
				        </view>
						<view class="picker-place" v-else>
							<text class="value label">选择</text>
						</view>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">家庭</text>
					<view class="input-wrap">
						<picker mode="selector" :range="category.family" range-key="name" :value="values.family" @change="bindPickerChange('family', $event)">
							<text v-if="names.family != ''" class="value">{{names.family}}</text>
							<text v-else class="value label">选择</text>
						</picker>
					</view>
				</view>
				<view class="conceal" @click="showConceal(0)">
					<f-icon type="conceal" color="#8F8F94" size="32"></f-icon>
					<text>隐私设置</text>
				</view>
				
				<view v-if="concealParams[0].show" class="conceal-wrap">
					<view class="mask" @click.stop="hideConceal(0)"></view>
					<view class="container">
						<view class="conceal-content">
							<view class="conceal-header">
								<text class="left">隐私设置</text>
								<view class="right">
									<switch color="#7667a5" :checked="concealParams[0].checked" @change="switchChangeAll(0, $event)"/>
									<text class="label">全选</text>
								</view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">身高</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.height" class="margin-right">不公开</text>
							        <switch color="#7667a5" :checked="conceal.height" @change="switchChange('height', $event)"/>
							    </view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">体重</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.weight" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.weight" @change="switchChange('weight', $event)"/>
								</view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">财产</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.assets" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.assets" @change="switchChange('assets', $event)"/>
								</view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">籍贯</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.nativePlace" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.nativePlace" @change="switchChange('nativePlace', $event)"/>
								</view>
							</view>
							<view class="item-wrap input-row">
								<view>
									<text class="label">家庭</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.family" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.family" @change="switchChange('family', $event)"/>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="" v-if="selectedTag == 2">
				<view class="item-wrap input-row border">
					<text class="label">行业</text>
					<view class="input-wrap" @click="pickIndustry">
					    <view class="picker-place" v-if="member.jobIndustryName == ''">
					    	<text class="value label">选择</text>
					    </view>
					    <view class="picker-place" v-else>
					    	<text class="value">{{member.jobIndustryName}}</text>
					    </view>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">职位</text>
					<view class="input-wrap" @click="pickPosition">
					    <view class="picker-place" v-if="member.jobPositionName == ''">
					    	<text class="value label">选择</text>
					    </view>
					    <view class="picker-place" v-else>
					    	<text class="value">{{member.jobPositionName}}</text>
					    </view>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">年薪</text>
					<view class="input-wrap">
						<picker mode="selector" :range="category.income" range-key="name" :value="values.income" @change="bindPickerChange('income', $event)">
							<text v-if="member.income" class="value">{{names.income}}</text>
							<text v-else class="value label">选择</text>
						</picker>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">单位</text>
					<view class="input-wrap">
					    <m-input v-if="!concealParams[1].show" class="m-input" :inputStyle="inputStyle" type="text" v-model="names.companyName" @blur="onBlurCompany" placeholder="输入"></m-input>
					</view>
				</view>
				
				<view class="conceal" @click="showConceal(1)">
					<f-icon type="conceal" color="#8F8F94" size="32"></f-icon>
					<text>隐私设置</text>
				</view>
				
				<view v-if="concealParams[1].show" class="conceal-wrap">
					<view class="mask" @click.stop="hideConceal(1)"></view>
					<view class="container">
						<view class="conceal-content">
							<view class="conceal-header">
								<text class="left">隐私设置</text>
								<view class="right">
									<switch color="#7667a5" :checked="concealParams[1].checked" @change="switchChangeAll(1, $event)"/>
									<text class="label">全选</text>
								</view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">行业</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.jobIndustryCode" class="margin-right">不公开</text>
							        <switch color="#7667a5" :checked="conceal.jobIndustryCode" @change="switchChange('jobIndustryCode', $event)"/>
							    </view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">职位</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.jobPositionCode" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.jobPositionCode" @change="switchChange('jobPositionCode', $event)"/>
								</view>
							</view>
							<view class="item-wrap input-row border">
								<view>
									<text class="label">年薪</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.income" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.income" @change="switchChange('income', $event)"/>
								</view>
							</view>
							<view class="item-wrap input-row">
								<view>
									<text class="label">单位</text>
								</view>
								<view class="input-wrap">
									<text v-if="conceal.companyName" class="margin-right">不公开</text>
									<switch color="#7667a5" :checked="conceal.companyName" @change="switchChange('companyName', $event)"/>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>	
		
		<view class="padding-h">		
			<view class="hobby-wrap" v-if="selectedTag == 3">
				<view class="my-hobby">
					<text class="tag" v-for="(hobby, index) in member.hobbies" :class="index == member.hobbies.length-1?'last':''">{{hobby.name}}</text>
				</view>
				<view class="text">请从以下选择</view>
				<view class="all-hobby">
					<view class="category" v-for="(category, superIndex) in hobbies">
						<text class="title">{{category.name}}</text>
						<view class="tags">
							<text class="tag" v-for="(hobby, index) in category.children" :class="{selected:hobby.selected, last:index == category.children.length-1}" @click="select(hobby,$event)">{{hobby.name}}</text>
						</view>
					</view>
				</view>
			</view>	
			
			<view class="hobby-wrap" v-if="selectedTag == 4">
				<view class="my-hobby">
					<text class="tag" v-for="(requirement, index) in member.requirements" :class="index == member.requirements.length-1?'last':''">{{requirement.name}}</text>
				</view>
				<view class="text">请从以下选择</view>
				<view class="all-hobby">
					<view class="category" v-for="(category, superIndex) in requirements">
						<text class="title">{{category.name}}</text>
						<view class="tags">
							<text class="tag" v-for="(requirement, index) in category.children" :class="{selected:requirement.selected, last:index == category.children.length-1}" @click="select(requirement,$event)">{{requirement.name}}</text>
						</view>
					</view>
				</view>
			</view>	
		</view>
		
		<mpvue-city-picker :themeColor="picker.themeColor" ref="mpvueCityPicker" :pickerValueDefault="picker.cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
		<mpvue-picker ref="mpvuePicker" :mode="picker.mode" :deepLength="picker.deepLength" :themeColor="picker.themeColor" :pickerValueDefault="picker.valueDefault" @onConfirm="doPick" :pickerValueArray="picker.valueArray"></mpvue-picker>
		<mpvue-hobby :themeColor="picker.themeColor" ref="mpvueHobby" :hobbyValueDefault="hobbyPickerValueDefault"
		@hobbyChange="hobbyChange" ></mpvue-hobby>
		<member-tags :themeColor="picker.themeColor" ref="memberTags" :tagsValueDefault="receivedTags" 
		@tagsChange="tagsChange"></member-tags>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import jobIndustryData from '@/static/data/job-industry.js';
	import jobPositionData from '@/static/data/job-position.js';
	import category from '@/static/data/category.js'
	import region from '@/static/data/region.js'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
	import mpvueCityPicker from '@/components/mpvue-picker/mpvueCityPicker.vue'
	import mpvueHobby from '@/components/mpvue-hobby/mpvueHobby.vue'
	import memberTags from '@/components/tags/memberTags.vue'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput, mpvuePicker, mpvueCityPicker, mpvueHobby, memberTags},
		data() {
			return{
				inputStyle:'font-size:18px;font-weight: bold;',
				picker:{
					mode:'multiLinkageSelector',
					deepLength:2,
					valueDefault: [9,1], // 初始化值
					valueArray: region, // picker 数组值
					name: 'region',
					themeColor: '', // 颜色主题
					cityPickerValueDefault:[0,0,0]
				},
				hobbyPickerValueDefault: [0, 0],
				receivedTags:[],
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
				member:{
					id:0,
					nickname:'',
					avatarUrl:'',
					realName:'',
					idCard:'',
					sex:'',
					birthday:'',
					maritalStatus:'',
					maritalStatusName:'',
					education:'',
					residence:'',
					residenceCode:'',
					residenceValue:[0,0,0],
					hobby:'',
					hobbyValue:[0, 0],
					height:'',
					weight:'',
					assets:'',
					family:'',
					nativePlace:'',
					nativePlaceValue:'0,0',
					work:'',
					jobIndustryCode:'',
					jobIndustryName:'',
					jobPositionCode:'',
					jobPositionName:'',
					income:'',
					companyName:'',
					hobbies:[],
					requirements:[]
				},
				hobbies:[],
				requirements:[],
				selectedTag:0,
				tags:[{
					id:1,
					name:'基本信息',
					init:false
				},{
					id:2,
					name:'重要信息',
					init:false
				},{
					id:3,
					name:'工作信息',
					init:false
				}/* ,{
					id:4,
					name:'兴趣爱好',
					init:false
				},{
					id:5,
					name:'择偶标准',
					init:false
				 }*/],
				category:category,
				names:{
					maritalStatus:'',
					education:'',
					income:'',
					assets:'',
					family:'',
					height:0,
					weight:0,
					nativePlace:'',
					companyName:''
				},
				values:{
					maritalStatus:0,
					education:0,
					income:0,
					assets:0,
					family:0,
					nativePlace:''
				},
				range:{
					location:[]
				},
				concealChanged:false,
				concealParams:[{
					show:false,
					checked:false
				},{
					show:false,
					checked:false
				}],
				conceal:{
					height:false,
					weight:false,
					assets:false,
					family:false,
					nativePlace:false,
					jobIndustryCode:false,
					jobPositionCode:false,
					income:false,
					companyName:false,
				}
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			...mapMutations(['saveMemberFiled','saveMemberFileds', 'targetMember']),
			updateAvatar:function(){
				this.targetMember(this.member);
				uni.navigateTo({
					url: '/pages/reg/avatarUpload?operator=modify&purpose='+this.member.purpose+'&memberId='+this.member.id
				});
			},
			bindTag:function(selected){
				this.selectedTag = selected;
				this.initTab(selected);
			},
			pickIndustry: function(){
				this.picker.name = 'job_industry';
				this.picker.valueArray = jobIndustryData;
				if(this.member.jobIndustryValue){
					this.picker.valueDefault = this.member.jobIndustryValue.split(',');
				}else{
					this.picker.valueDefault = [0,0];
				}
				this.$refs.mpvuePicker.show();
			},
			pickPosition: function(){
				this.picker.name = 'job_position';
				this.picker.valueArray = jobPositionData;
				if(this.member.jobPositionValue){
					this.picker.valueDefault = this.member.jobPositionValue.split(',');
				}else{
					this.picker.valueDefault = [0,0];
				}
				this.$refs.mpvuePicker.show();
			},
			pickNativePlace: function(){
				this.picker.name = 'native_place';
				this.picker.valueArray = region;
				if(this.agentMember.nativePlaceValue){
					this.picker.valueDefault = this.agentMember.nativePlaceValue.split(',');
				}else{
					this.picker.valueDefault = [0,0];
				}
				this.$refs.mpvuePicker.show();
			},
			doPick(e) {
				console.log(e);
				let that = this;
				let param = {
					id:this.member.id
				}
				let fileds = [];
				if(this.picker.name == 'native_place'){
					this.member.nativePlaceValue = e.index[0] + ',' + e.index[1];
					this.member.nativePlace = this.picker.valueArray[e.index[0]].children[e.index[1]].label;
					param.nativePlace = this.member.nativePlace;
					param.nativePlaceValue = this.member.nativePlaceValue;
					fileds = [{
						filed:'nativePlace', 
						value:that.member.nativePlace
					},{
						filed:'nativePlaceValue', 
						value:that.member.nativePlaceValue
					}] 
				}else if(this.picker.name == 'job_industry'){
					this.member.jobIndustryCode = e.value[1];
					this.member.jobIndustryValue = e.index[0] + ',' + e.index[1];
					this.member.jobIndustryName = this.picker.valueArray[e.index[0]].children[e.index[1]].label;
					param.jobIndustryCode = this.member.jobIndustryCode;
					param.jobIndustryValue = this.member.jobIndustryValue;
					param.work = this.member.jobIndustryName + ' ' + this.member.jobPositionName;
					fileds = [{
						filed:'jobIndustryCode', 
						value:that.member.jobIndustryCode
					},{
						filed:'jobIndustryValue', 
						value:that.member.jobIndustryValue
					}] 
				}else if(this.picker.name == 'job_position'){
					this.member.jobPositionCode = e.value[1];
					this.member.jobPositionValue = e.index[0] + ',' + e.index[1];
					this.member.jobPositionName = this.picker.valueArray[e.index[0]].children[e.index[1]].label;
					param.jobPositionCode = this.member.jobPositionCode;
					param.jobPositionValue = this.member.jobPositionValue;
					param.work = this.member.jobIndustryName + ' ' + this.member.jobPositionName;
					fileds = [{
						filed:'jobPositionCode', 
						value:that.member.jobPositionCode
					},{
						filed:'jobPositionValue', 
						value:that.member.jobPositionValue
					}] 
				}
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data:param,
					success(res) {
						if(that.$http.success(res)){
							that.saveMemberFileds({
								id:that.agentMember.id, 
								fileds:fileds
							});
						}
					}
				})
			},
// 			bindIncomeChange: function(e) {
// 				this.member.income = category.income[e.target.value];
// 			},
			bindPickerChange:function(filed, e){
				if(category[filed][e.target.value].key){
					this.member[filed] = category[filed][e.target.value].key;
					this.names[filed] = category[filed][e.target.value].name;
				}else{
					this.member[filed] = category[filed][e.target.value];
					this.names[filed] = category[filed][e.target.value];
				}
				
				let that = this;
				let param = {
					id:this.member.id,
				}
				param[filed] = this.member[filed];
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data:param,
					success(res) {
						if(that.$http.success(res)){
							that.saveMemberFiled({
								id:that.agentMember.id, 
								filed:filed, 
								value:that.member[filed]
							});
						}
					}
				})
			},
			// 省市区选择
			showCityPicker() {
				if(this.member.residenceValue){
					this.picker.cityPickerValueDefault = this.member.residenceValue.split(',');
				}
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e) {
				let labels = e.label.split('-');
				this.member.residence = labels.join(',');
				this.member.residenceCode = e.cityCode;
				this.member.residenceValue = e.value.join(',');
				let that = this;
				let param = {
					id:this.member.id,
					residence:this.member.residence,
					residenceCode:this.member.residenceCode,
					residenceValue:this.member.residenceValue
				}
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data:param,
					success(res) {
						if(that.$http.success(res)){
							that.saveMemberFileds({
								id:that.agentMember.id, 
								fileds:[{
									filed:'residence', 
									value:that.member.residence
								},{
									filed:'residenceCode', 
									value:that.member.residenceCode
								},{
									filed:'residenceValue', 
									value:that.member.residenceValue
								}]
							});
						}
					}
				})
			},
			showHobbyPicker(){
				this.$refs.mpvueHobby.show();
			},
			hobbyChange(e){
				console.log(e);
				this.member.hobby = e.label;
				let labels = e.label.split('-');
				this.member.hobby = labels.join(',');
				
				let that = this;
				let param = {
					id:this.member.id,
					hobby: this.member.hobby
				};
				
				uni.request({
					url:this.$http.contextPath + 'base/member/updateById',
					method:'POST',
					data: param,
					success(res) {
						console.log(res);
						if(that.$http.success(res)){
							that.saveMemberFileds({
								id:that.agentMember.id,
								fileds:[{
									filed: 'hobby',
									value: that.member.hobby
								}]
							});
						}
					}
				})
			},
			showTagsPicker(){
				this.$refs.memberTags.show();
			},
			tagsChange(e){
				console.log(e);
				this.receivedTags = e;
				this.member.tags = this.receivedTags.join(',');
				console.log(this.member.tags);
				
				let that = this;
				let param = {
					id:this.member.id,
					tags: this.member.tags
				};
				
				uni.request({
					url: this.$http.contextPath + 'base/member/updateById',
					method: 'POST',
					data:param,
					
					success(res) {
						console.log(res);
						if(that.$http.success(res)){
							that.saveMemberFileds({
								id: that.member.id,
								fileds:[{
									filed: 'tags',
									value: that.member.tags
								}]
							});
						}
					}
				})
			},
			checkNumber:function(num){
				var re = /^[0-9]+$/;
				return re.test(num)
			},
			onBlurHeihgt:function(e){
				this.onBlur('height', '身高', e);
			},
			onBlurWeight:function(e){
				this.onBlur('weight', '体重', e);
			},
			onBlurCompany:function(e){
				this.onBlur('companyName', '单位', e);
			},
			onBlur:function(filed, label, e){
				if(this.member[filed] == this.names[filed])return;
				this.member[filed] = this.names[filed];
				if(filed == 'height' || filed == 'weight'){
					if(!this.checkNumber(this.member[filed])){
						uni.showToast({
						    icon: 'none',
						    title: '请输入有效的'+label
						});
						return;
					}
				}
				let that = this;
				let param = {id:this.member.id};
				param[filed] = this.member[filed];
				uni.request({
					url: this.$http.contextPath + 'base/member/updateById',
					method: 'POST',
					data: param,
					success: res => {
						if(that.$http.success(res)){
							that.saveMemberFiled({
								id:that.agentMember.id,
								filed:filed,
								value:this.member[filed]
							});
						}
					}
				});
			},
			select:function(hobby, event){
				setTimeout(() => { 
					hobby.disabled = false;
				}, 1000)

				if(hobby.disabled){
					return;
				}else{
					hobby.disabled = true;
				}
				
				hobby.selected = !hobby.selected;
				if(hobby.selected){
					if(hobby.category == 'hobby'){
						this.member.hobbies.push(hobby);
					}
					else if(hobby.category == 'requirement'){
						this.member.requirements.push(hobby);
					}
				}else{
					if(hobby.category == 'hobby'){
						this.member.hobbies.forEach((item,index) =>{
							if(item.name == hobby.name){
								this.member.hobbies.splice(index, 1);;
								return;
							}
						})
					}
					else if(hobby.category == 'requirement'){
						this.member.requirements.forEach((item,index) =>{
							if(item.name == hobby.name){
								this.member.requirements.splice(index, 1);;
								return;
							}
						})
					}
				}
				//
				uni.request({
					url:this.$http.contextPath + 'member/tag/'+(hobby.selected?'save':'remove'),
					data:{
						memberId:this.member.id,
						category:hobby.category,
						tagId:hobby.id,
						tagName:hobby.name
					}
				})
			},
			initTab:function(index){
				if(this.tags[index].init)return;
				this.tags[index].init = true;
				if(index == 0){
					category.maritalStatus.forEach((item,index) =>{
						if(item.key == this.member.maritalStatus){
							this.values.maritalStatus = index;
							this.names.maritalStatus = item.name;
						}
					})
					category.education.forEach((item,index) =>{
						if(item.key == this.member.education){
							this.values.education = index;
							this.names.education = item.name;
						}
					})
					this.range.location = this.member.residence.split(',');
				}else if(index == 1){
					this.names.height = this.member.height;
					this.names.weight = this.member.weight;
					this.names.nativePlace = this.member.nativePlace;
					category.assets.forEach((item,index) =>{
						if(item.key == this.member.assets){
							this.values.assets = index;
							this.names.assets = item.name;
						}
					})
					category.family.forEach((item,index) =>{
						if(item.key == this.member.family){
							this.values.family = index;
							this.names.family = item.name;
						}
					})
				}else if(index == 2){
					this.names.companyName = this.member.companyName;
					category.income.forEach((item,index) =>{
						if(item.key === this.member.income){
							this.values.income = index;
							this.names.income = item.name;
						}
					})
					if(this.member.jobIndustryValue){
						let value = this.member.jobIndustryValue.split(',');
						this.member.jobIndustryName = jobIndustryData[value[0]].label + ' ' + jobIndustryData[value[0]].children[value[1]].label;
					}
					if(this.member.jobPositionValue){
						let value = this.member.jobPositionValue.split(',');
						this.member.jobPositionName = jobPositionData[value[0]].label + ' ' + jobPositionData[value[0]].children[value[1]].label;
					}
				}else if(index == 3 || index == 4){
					let that = this;
					uni.request({
						url:this.$http.contextPath + 'member/tag/hobbiesAndRequirements',
						data:{
							status:'1',
							memberId:this.agentMember.id
						},
						success(res) {
							if(that.$http.success(res)){
								let hobbies = [];
								let requirements = [];
								let memberHobbies = [];
								let memberRequirements = [];
								res.data.data.memberTagList.forEach(item =>{
									item.id = item.tagId;
									item.name = item.tagName;
									if(item.category == 'hobby'){
										memberHobbies.push(item);
									}
									else if(item.category == 'requirement'){
										memberRequirements.push(item);
									}
								})
								res.data.data.hobbyResponseList.forEach(item =>{
									if(item.category == 'hobby'){
										hobbies.push(item);
									}
									else if(item.category == 'requirement'){
										requirements.push(item);
									}
								})
								that.member.hobbies = memberHobbies;
								that.hobbies = hobbies;
								that.member.requirements = memberRequirements;
								that.requirements = requirements;
								that.asynHobbies = true;
							}
						}
					})
				}
			},
			showConceal:function(index){
				this.concealParams[index].show = true;
			},
			hideConceal:function(index){
				this.concealParams[index].show = false;
				if(this.concealChanged){
					this.updateConceal();
				}
			},
			updateConceal:function(){
				let that = this;
				let concealStr = JSON.stringify(this.conceal);
				uni.request({
					url: this.$http.contextPath + 'base/member/updateById',
					method: 'POST',
					data: {
						id:this.member.id,
						conceal:concealStr
					},
					success: res => {
						if(that.$http.success(res)){
							that.saveMemberFiled({
								id:that.agentMember.id,
								filed:'conceal',
								value:concealStr
							});
							that.concealChanged = true;
						}
					}
				});
			},
			switchChangeAll:function(index, e){
				this.concealChanged = true;
				this.concealParams[index].checked = e.target.value;
				if(index == 0){
					this.conceal.height = e.target.value;
					this.conceal.weight = e.target.value;
					this.conceal.assets = e.target.value;
					this.conceal.family = e.target.value;
					this.conceal.nativePlace = e.target.value;
				}else if(index == 1){
					this.conceal.jobIndustryCode = e.target.value;
					this.conceal.jobPositionCode = e.target.value;
					this.conceal.income = e.target.value;
					this.conceal.companyName = e.target.value;
				}
			},
			switchChange:function(attr, e){
				this.concealChanged = true;
				this.conceal[attr] = e.target.value;
			}
		},
		onLoad() {
			Object.assign(this.member, this.agentMember);
			Object.assign(this.conceal, JSON.parse(this.agentMember.conceal));
			console.log(this.member);
			this.receivedTags = this.member.tags.split(',');
			console.log(this.receivedTags);
			this.initTab(0);
		}
	}
</script>

<style>
	.content{
		width:100%;
	}
	.header text{
		color: black;
	}
	.name-wrap{
		margin-right: 40upx;
		display: flex;
		align-items: center;
	}
	.name-wrap text{
		font-size:14px;
		font-weight: normal;
		margin-right: 10upx;
	}
	.header .name-wrap image{
		width: 80upx;
		height: 80upx;
		border-radius:40upx;
	}
	.tag-wrap{
		margin-right: 40upx;
		margin-top: 20upx;
		margin-bottom: 20upx;
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
	}
	.tag-selected{
		border-radius: 60upx;
		background-color: #ded4ff;
		color: #7667a5;
		font-weight: blod;
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
		align-items: center;
		padding-right: 40upx;
	}
	.input-wrap .value{
		font-size:18px;
		font-weight: bold;
	}
	.conceal{
		display: flex;
		align-items: center;
		margin-top: 20upx;
	}
	.conceal-wrap{
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.conceal-wrap .mask{
		flex-grow: 1;
		background: rgba(0, 0, 0, 0.5);
	}
	.conceal-wrap .container{
		padding-left:40upx;
		background-color: white;
	}
	.conceal-wrap .conceal-content{
		margin-right: 40upx;
		position: relative;
	}
	.conceal-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 40upx;
		padding-bottom: 20upx;
	}
	.conceal-header .left{
		font-size: 16px;
		font-weight: 900;
	}
	.conceal-header .right{
		margin-right: 40upx;
	}
	
	.hobby-wrap{
		margin-top: 40upx;
	}
	.my-hobby{
		border: 1px dashed #999999;
		border-radius: 15upx;
		padding: 40upx;
		padding-top: 10upx;
		display: flex;
		flex-wrap: wrap;
	}
	.hobby-wrap .text{
		color: #999999;
		padding: 30upx 0;
	}
	.hobby-wrap .tag{
		border: 1px solid #666666;
		border-radius: 100upx;
		padding: 15upx 40upx;
		margin-right: 40upx;
		margin-top: 30upx;
		display: flex;
		flex-wrap: wrap;
		font-size: 12px;	
	}
	.hobby-wrap .last{
		margin-right: 0;
	}
	.all-hobby{
		border: 1px dashed #999999;
		border-radius: 15upx;
		padding: 40upx;
		padding-top: 0;
		display: flex;
		flex-direction: column;
	}
	.all-hobby .category{
		display: flex;
		flex-direction: column;
	}
	.all-hobby .category .title{
		font-weight: 900;
		padding-top: 40upx;
		padding-bottom: 10upx;
	}
	.all-hobby .category .tags{
		display: flex;
		flex-wrap: wrap;
	}
	.all-hobby .tag{
		border: 1px dashed #666666;
	}
	.all-hobby .category .selected{
		background-color: #ded4ff;
		color: #7667a5;
		border: 0;
	}
	.margin-right{
		margin-right:30upx;
	}
	.tags-item{
		/* min-width: 100upx; */
		padding: 5upx 20upx;
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
	.picker-place{
		min-width:360upx;
		display: flex;
		justify-content: flex-end;
	}
	
</style>
