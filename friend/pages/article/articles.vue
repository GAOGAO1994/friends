<template>
	<view class="content">
		<view class="padding-h">			
			<!-- #ifndef H5 -->
			<view class="nav-back-wrap">
				<navigator class="icon-back" open-type="navigateBack">
					<m-icon type="back" color="white" size="30"></m-icon>
				</navigator>
			</view>
			<!-- #endif -->
			<view class="header">
				<text class="text">幸福资讯</text>
				<view class="right"></view>
			</view>
			
			<!-- <view class="tab-wrap margin-top">
				<text class="tab" v-for="(kind, index) in kinds" :class="{selected:tabIndex==index}" @click="selectTab(index)">{{kind.name}}</text>
			</view> -->
			
			<!-- <view class="tab-wrap margin-top">
				<scroll-view class="tab-scroll" scroll-x="true" scroll-left="0">
					<view class="tab-box" v-for="(kind, index) in kinds">
						<text class="tab" :class="{selected:tabIndex==index}" @click="selectTab(index)">{{kind.name}}</text>
					</view>
				</scroll-view>
			</view> -->
			
			<view class="tag-wrap">
				<view class="tag-scroll-wrap">
					<scroll-view class="tag-scroll" scroll-x="true" scroll-left="0">
						<view class="tag" v-for="(kind, index) in kinds" :class="{selected:tabIndex == index}" @click="selectTab(index)">
							<text>{{kind.name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			
			<view class="article-wrap margin-top" v-for="(kind, kindIndex) in kinds" v-if="kindIndex == tabIndex">
				<view class="article-colunm">
					<view class="article-box" v-for="(article, index) in articles" v-if="index%2===0" @click="view(article)">
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
					<view class="article-box" v-for="(article, index) in articles" v-if="index%2===1" @click="view(article)">
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
		
	</view>
</template>

<script>
	import mIcon from '@/components/m-icon/m-icon.vue'
	import fIcon from '@/components/m-icon/f-icon.vue'
	import category from '@/static/data/category.js';
	import {mapMutations} from 'vuex'
	
	export default {
		components: {mIcon,fIcon},
		data() {
			return{
				options:{
					status:'1',
					releaseStatus:'release'
				},
				tabIndex:0,
				kinds:category.articleKind,
				list:{
					all:[],
					history:[],
					original:[]
				},
				selected:[]
			}
		},
		computed: {
			articles:function(){
				return this.list[this.kinds[this.tabIndex].key];
			}
		},
		methods:{
			...mapMutations(['targetArticle']),
			selectTab:function(index){
				this.tabIndex = index;
				if(!this.selected[index]){
					this.selected[index] = true;
					this.getArticles({
						kind:this.kinds[index].key
					});
				}
			},
			view:function(article){
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
			getArticles:function(param){
				let that = this;
				let kind = param.kind;
				if(kind == 'all'){
					delete param.kind;
				}
				uni.request({
					url:this.$http.contextPath + 'base/article/list',
					method:'POST',
					data:{
						...this.options,
						...param
					},
					success(res) {
						if(that.$http.success(res)){
							res.data.data.forEach(item =>{
								item.time = item.createTime.substring(5,10);
							});
							that.list[kind] = res.data.data;
						}
					}
				})
			}
		},
		onLoad(option) {
			this.getArticles({
				kind:this.kinds[this.tabIndex].key
			});
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: linear-gradient(to bottom, #fd6e99, #d498e1); 
	}
	.header .text{
		color: white;
	}
	.header .right{
		display: flex;
		align-items: center;
	}
	.header .right text{
		font-size:18px;
	}
	
	.tag-wrap{
		width: 100%;
		margin-top: 20upx;
		margin-right: 40upx;
	}
	.tag-scroll-wrap{
		width: 100%;
	}
	.tag-scroll{
		width: 100%;
		display: flex;
		white-space: nowrap;
	}
	.tag-scroll .tag{
		margin-right: 20upx;
		padding: 15upx 20upx;
		display: inline-flex;
		width: 150upx;
		justify-content: center;
		color: white;
		font-size: 16px;
		font-weight: 900;
	}
	.tag-wrap .selected{
		color: #fc6e9a;
		border-radius: 100upx;
		background-color: white;
	}
	
	.margin-top{
		margin-top:40upx;
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
		background-color: white;
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
	
</style>
