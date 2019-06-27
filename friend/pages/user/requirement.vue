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
				<text>择偶标准</text>
				<view class="name-wrap">
					<text class="label">{{member.nickname}}</text>
					<image mode="scaleToFill" :src="member.avatarUrl"></image>
				</view>
			</view>
		</view>	
			
		<view class="padding-h">		
			<view class="hobby-wrap">
				<view class="my-hobby">
					<text class="tag" v-for="(tag, index) in member.requirements" :class="index == member.requirements.length-1?'last':''">{{tag.tagName}}</text>
				</view>
				<view class="text">请从以下选择</view>
				<view class="all-hobby">
					<view class="category" v-for="(category, superIndex) in requirements">
						<text class="title">{{category.name}}</text>
						<view class="tags">
							<text class="tag" v-for="(tag, index) in category.children" :class="{selected:tag.selected, last:index == category.children.length-1}" @click="select(category, tag,$event)">{{tag.name}}</text>
						</view>
					</view>
				</view>
			</view>	
		</view>
		
		<age-form :title="fieldTitle" :fieldTag="fieldTag" :fieldSuperTag="fieldSuperTag" :show="fieldOpen" @close="closeField" @confirm="confirmAge"></age-form>
		<text-form :title="fieldTitle" :fieldTag="fieldTag" :fieldSuperTag="fieldSuperTag" :show="textFieldOpen" @close="closeTextField" @confirm="confirmText"></text-form>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import ageForm from '@/components/form/age.vue'
	import textForm from '@/components/form/text.vue'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon, ageForm, textForm},
		data() {
			return{
				member:{
					id:0,
					requirements:[]
				},
				requirements:[],
				fieldOpen:false,
				textFieldOpen:false,
				fieldTitle:'',
				fieldTag:{},
				fieldSuperTag:{}
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			...mapMutations(['saveMemberTags']),
			closeField:function(){
				this.fieldOpen = false;
			},
			closeTextField:function(){
				this.textFieldOpen = false;
			},
			confirmAge:function(data){
				let prefix = '';
				let name = '';
				let label = '';
				let desc = '';
				if(data.superTag.code == 'age'){
					label = '岁';
					desc = '以下';
				}
				else if(data.superTag.code == 'height'){
					label = 'cm';
					desc = '以上';
				}
				else if(data.superTag.code == 'salary'){
					prefix = '年薪';
					label = '万';
					desc = '以上';
				}
				if(data.fromValue == '' && data.toValue == ''){
					return;
				}else if(data.fromValue == '' && data.toValue != ''){
					name = data.toValue + label + desc;
				}else if(data.fromValue != '' && data.toValue == ''){
					name = data.fromValue+ label + desc;
				}else{
					name = data.fromValue+'-'+data.toValue + label;
				}
				this.confirm(data, prefix + name);
			},
			confirmText:function(data){
				let prefix = '', suffix = '';
				let name = '';
				
				if(data.superTag.code == 'important'){
					prefix = '看重';
				}
				name = prefix + data.value + suffix;
				this.confirm(data, name);
			},
			confirm:function(data, name){
				let memberTag = {
					memberId:this.member.id,
					tagId:data.tag.id,
					tagName:name,
					superTagId:data.tag.superId,
					category:'requirement'
				}
				//是否单选
				let selectedMemberTag = this.preSelect(data.superTag, data.tag);
				if(selectedMemberTag.operation == 'update'){
					memberTag.id = selectedMemberTag.id;
					memberTag.operation = 'update';
				}else{
					memberTag.operation = 'save';
				}
				
				this.member.requirements.push(memberTag);
				data.tag.selected = !data.tag.selected;
				this.remoteUpdate(memberTag);
			},
			preSelect:function(category, tag){
				let memberTag = {};
				//是否单选
				let single = true;		
				let kinds = "education,marital,assets,work,nature,family,important,exterior";
				if(kinds.indexOf(category.code) > -1){
					single = false;
				}
				let categorySelected = false;		//同类是否已有选择
				if(single){
					for(let i=0; i<this.member.requirements.length; i++){
						if(this.member.requirements[i].superTagId === tag.superId){
							memberTag.id = this.member.requirements[i].id;
							memberTag.tagId = this.member.requirements[i].tagId;		//用于清除选中状态
							memberTag.operation = 'update';
							this.member.requirements.splice(i, 1);
							categorySelected = true;
							break;
						}
					}
					if(categorySelected){
						for(let i=0; i<category.children.length; i++){
							if(category.children[i].id === memberTag.tagId){
								category.children[i].selected = false;
								break;
							}
						}
					}
				}
				return memberTag;
			},
			select:function(category, tag, event){
				setTimeout(() => { 
					tag.disabled = false;
				}, 1000)

				if(tag.disabled){
					return;
				}else{
					tag.disabled = true;
				}
				// tag.selected = !tag.selected;
				
				let memberTag = {};
				if(!tag.selected){
					if(tag.code == 'custom'){
						//自定义
						console.log(tag)
						this.fieldTitle = category.name;
						this.fieldTag = tag;
						this.fieldSuperTag = category;
						if(tag.remark == 'text'){
							this.textFieldOpen = true;
						}else{
							this.fieldOpen = true;
						}
						return;
					}else{
						//是否单选
						memberTag = this.preSelect(category, tag);
						
						memberTag.memberId = this.member.id;
						memberTag.tagId = tag.id;
						memberTag.tagName = tag.name;
						memberTag.superTagId = tag.superId;
						memberTag.category = 'requirement';
						if(!memberTag.id){
							memberTag.operation = 'save';
						}
						this.member.requirements.push(memberTag);
					}
				}else{
					this.member.requirements.forEach((item,index) =>{
						if(item.tagId == tag.id){
							memberTag = item;
							memberTag.operation = 'remove';
							this.member.requirements.splice(index, 1);
						}
					})
				}
				tag.selected = !tag.selected;
				this.remoteUpdate(memberTag);
			},
			remoteUpdate:function(memberTag){
				//
				delete memberTag.createTime;
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/tag/'+memberTag.operation,
					data:memberTag,
					success(res) {
						if(that.$http.success(res)){
							if(memberTag.operation == 'save'){
								memberTag.id = res.data.data.id;
							}
							that.saveMemberTags({
								category:memberTag.category,
								datas:that.member.requirements
							});
							
						}
					}
				})
			},
			init:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/tag/hobbies',
					data:{
						status:'1',
						category:'requirement',
						memberId:this.agentMember.id
					},
					success(res) {
						if(that.$http.success(res)){
							that.member.requirements = res.data.data.memberTagList;
							that.requirements = res.data.data.hobbyResponseList;
						}
					}
				})
			}
		},
		onLoad() {
			Object.assign(this.member, this.agentMember);
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
	
	.hobby-wrap{
		margin-top: 20upx;
		margin-bottom:  40upx;
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
