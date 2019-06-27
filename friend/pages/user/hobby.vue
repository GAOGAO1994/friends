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
				<text>兴趣爱好</text>
				<view class="name-wrap">
					<text class="label">{{member.nickname}}</text>
					<image mode="scaleToFill" :src="member.avatarUrl"></image>
				</view>
			</view>
		</view>	
			
		<view class="padding-h">		
			<view class="hobby-wrap">
				<view class="my-hobby">
					<text class="tag" v-for="(hobby, index) in member.hobbies" :class="index == member.hobbies.length-1?'last':''">{{hobby.tagName}}</text>
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
		</view>
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import {mapState,mapGetters,mapMutations} from 'vuex'
	
	export default {
		components: {mIcon, fIcon},
		data() {
			return{
				member:{
					id:0,
					hobbies:[]
				},
				hobbies:[]
			}
		},
		computed: {
			...mapState(['account']),
			...mapGetters(['agentMember'])
		},
		methods:{
			...mapMutations(['saveMemberTags']),
			select:function(hobby, event){
				setTimeout(() => { 
					hobby.disabled = false;
				}, 1000)

				if(hobby.disabled){
					return;
				}else{
					hobby.disabled = true;
				}
				
				let memberTag = {};
				hobby.selected = !hobby.selected;
				if(hobby.selected){
					memberTag = this.convert(hobby);
					memberTag.operation = 'save';
					this.member.hobbies.push(memberTag);
				}else{
					this.member.hobbies.forEach((item,index) =>{
						if(item.tagId == hobby.id){
							memberTag = item;
							memberTag.operation = 'remove';
							this.member.hobbies.splice(index, 1);;
						}
					})
				}
				//
				let that = this;
				delete memberTag.createTime;
				uni.request({
					url:this.$http.contextPath + 'member/tag/' + memberTag.operation,
					data:memberTag,
					success(res) {
						if(that.$http.success(res)){
							if(memberTag.operation == 'save'){
								memberTag.id = res.data.data.id;
							}
							that.saveMemberTags({
								category:hobby.category,
								datas:that.member.hobbies
							});
						}
					}
				})
			},
			convert:function(hobby){
				return {
					memberId:this.member.id,
					tagId:hobby.id,
					tagName:hobby.name,
					superTagId:hobby.superId,
					category:'hobby'
				}
			},
			init:function(){
				let that = this;
				uni.request({
					url:this.$http.contextPath + 'member/tag/hobbies',
					data:{
						status:'1',
						category:'hobby',
						memberId:this.agentMember.id
					},
					success(res) {
						if(that.$http.success(res)){
							that.member.hobbies = res.data.data.memberTagList;
							that.hobbies = res.data.data.hobbyResponseList;
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
