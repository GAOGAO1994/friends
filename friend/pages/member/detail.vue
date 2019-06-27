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
				<text>个人信息</text>
				<view class="name-wrap">
					<text class="label">{{member.nickname}}</text>
					<image mode="scaleToFill" :src="member.avatarUrl"></image>
				</view>
			</view>
			
			<view class="info-wrap">
				<text class="tag-title">基本信息</text>
				<view class="item-wrap input-row border">
					<text class="label">性别</text>
					<view class="input-wrap">
				        <text class="value">{{member.sex}}</text>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">出生</text>
					<view class="input-wrap">
						<text class="value">{{member.birthday}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">婚姻状况</text>
					<view class="input-wrap">
						<text class="value">{{names.maritalStatus}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">学历</text>
					<view class="input-wrap">
						<text class="value">{{names.education}}</text>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">常住地</text>
					<view class="input-wrap">
						<text class="value">{{member.residence}}</text>
					</view>
				</view>
				
				<text class="tag-title">重要信息</text>
				<view class="item-wrap input-row border">
					<text class="label">身高</text>
					<view class="input-wrap">
				        <f-icon v-if="conceal.height" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.height}} cm</text>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">体重</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.weight" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.weight}} kg</text>
				    </view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">财产</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.assets" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{names.assets}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">籍贯</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.nativePlace" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.nativePlace}}</text>
				    </view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">家庭</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.family" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{names.family}}</text>
					</view>
				</view>
			
				<text class="tag-title">工作信息</text>
				<view class="item-wrap input-row border">
					<text class="label">行业</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.jobIndustryCode" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.jobIndustryName}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">职位</text>
					<view class="input-wrap" @click="pickPosition">
						<f-icon v-if="conceal.jobPositionCode" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.jobPositionName}}</text>
					</view>
				</view>
				<view class="item-wrap input-row border">
					<text class="label">年薪</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.income" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.income}}万</text>
					</view>
				</view>
				<view class="item-wrap input-row">
					<text class="label">单位</text>
					<view class="input-wrap">
						<f-icon v-if="conceal.companyName" type="lock" color="#8F8F94" size="26"></f-icon>
						<text v-else class="value">{{member.companyName}}</text>
					</view>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import mInput from '../../components/m-input-right.vue'
	import jobIndustryData from '@/static/data/job-industry.js';
	import jobPositionData from '@/static/data/job-position.js';
	import category from '@/static/data/category.js'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, mInput},
		data() {
			return{
				member:{
					id:0,
					jobIndustryName:'',
					jobPositionName:'',
					nativePlaceName:''
				},
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
				}],
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
			...mapState(['account', 'target']),
			...mapGetters(['agentMember'])
		},
		methods:{
			...mapMutations(['saveMemberFiled','saveMemberFileds']),
			init:function(){
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
			}
		},
		onLoad() {
			Object.assign(this.member, this.target.member);
			Object.assign(this.conceal, JSON.parse(this.target.member.conceal));
			this.init();
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
	
	.info-wrap{
		
	}
	.tag-title{
		font-size:16px;
		font-weight: 900;
		text-align: center;
		margin: 40upx 0;
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
	.m-input-input {
	    font-size:18px;
		font-weight: bold;
		margin-right: 30upx;
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
	
</style>
