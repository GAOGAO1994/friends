<template>
	<div class="mpvue-tags">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-tags-content" :class="{'mpvue-tags-view-show':showPicker}">
			<div class="mpvue-tags__hd" catchtouchmove="true">
				<div class="mpvue-tags__action" @click="tagsCancel">取消</div>
				<div class="mpvue-tags__action" :style="{color:themeColor}" @click="tagsConfirm">确定</div>
			</div>
			
			<scroll-view scroll-y="true" class="scroll-Y">
				<div class="select-content">
					<div v-for="(item, index) in selectItems" :key="index">
						<div class="item-title">{{item.title}}</div>
						<div class="pick-items">
							<div class="items" :class="{'picked': pickedObj[index] === index2}" v-for="(item2, index2) in item.items"
							 :key="index2" @click="picked(index, index2)">
								{{item2.name}}
							</div>
						</div>
					</div>
				</div>
			</scroll-view>
		</div>
	
	</div>
</template>

<script>
	import Vue from 'vue'	
	import selectData from '@/components/activity-select/select-data/selectData.js'
	export default {
		data(){
			return{
				showPicker: false, //是否显示选择菜单
				selectItems: selectData.selectItems,
				pickedObj: {},
			}
		},
		
		props:{
			themeColor: String,
			selectInformation: Object
		},
		methods:{
			deepCopy(copyTemplate){
				return JSON.parse(JSON.stringify(copyTemplate));
			},
			show(){
				setTimeout(() => { 
					this.showPicker = true;
				}, 0);
				
				console.log(this.selectInformation);
			},
			
			// 取消操作
			tagsCancel(){
				this.showPicker = false;
				
			},
			
			// 提交操作
			tagsConfirm(){
				this.showPicker = false;
				var pickedItems = JSON.stringify(this.pickedObj);
				uni.navigateTo({
					url:'/pages/form/applySign?pickedItems='+pickedItems+'&activityId='+this.selectInformation.activityId+'&inviteId='+this.selectInformation.inviteId+'&shareOrigin='+this.selectInformation.shareOrigin+'&shareFrom='+this.selectInformation.shareFrom
				});
				
			},
			
			// 点击外侧区域，默认为取消处理
			maskClick(){
				this.tagsCancel();
			},
			
			// 选择标签操作
			picked(index, index2){
				Vue.set(this.pickedObj, index, index2);
				// this.pickedObj[index] = index2;
				console.log(this.pickedObj);
			}
		},
		
	}
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	
	.mpvue-tags-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		/* 没有点击的时候，此时选择框在屏幕之外的地方 */
		transform: translateY(100%);
		z-index: 3000;
	}
	
	.mpvue-tags-view-show {
		/* 点击展现时，从屏幕下方移入屏幕中 */
		transform: translateY(0);
	}
	
	.mpvue-tags__hd {
		display: flex;
		padding: 9px 15px;
		background-color: white;
		position: relative;
		text-align: center;
		font-size: 17px;
	}
	
	.mpvue-tags__hd:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		/* 适配1px物理像素！！！！！ */
		transform-origin: 0, 100%;
		transform: scaleY(0.5);
	}
	
	.mpvue-tags__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}
	
	.mpvue-tags__action:first-child {
		text-align: left;
		color: #888;
	}
	
	.mpvue-tags__action:last-child {
		text-align: right;
	}
	
	.scroll-Y {
		height: 238px;
		background: white;
	}
	.select-content {
		/* display: flex; */
		/* flex-wrap: wrap; */
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height:100%;
		background-color: rgba(255, 255, 255, 1);
		box-sizing: border-box;
		padding: 10px;
	}
	.pick-items {
		display: flex;
	}
	.item-title {
		font-size: 20px;
		font-weight: bold;
		color: #181E30;
	}
	.pick-items {
		margin: 10px;
		display: flex;
		flex-wrap: wrap;
	}
	.items {
		height: 20px;
		line-height: 20px;
		padding: 5px 10px;
		background: #CCCCCC;
		margin: 0 5px 5px 0;
		border-radius: 20px;
		font-size: 16px;
		font-weight: 500;
	}
	.picked {
		background: #b764d4;
		color: white;
	}
</style>
